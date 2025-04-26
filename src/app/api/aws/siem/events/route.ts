import { NextRequest, NextResponse } from 'next/server';
import { CloudWatchLogsClient, FilterLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { EventBridgeClient, ListRulesCommand } from '@aws-sdk/client-eventbridge';
import { getAwsCredentials } from '@/lib/aws/credentials';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get('credentialId');
    
    if (!credentialId) {
      return NextResponse.json({ error: 'AWS credential ID is required' }, { status: 400 });
    }

    const logGroupName = searchParams.get('logGroupName') || '/aws/lambda/all';
    const startTime = searchParams.get('startTime') 
      ? parseInt(searchParams.get('startTime')!) 
      : Date.now() - 24 * 60 * 60 * 1000; // Last 24 hours by default
    const endTime = searchParams.get('endTime') 
      ? parseInt(searchParams.get('endTime')!) 
      : Date.now();
    const filterPattern = searchParams.get('filterPattern') || '';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

    // Get AWS credentials from database
    const credential = await getAwsCredentials(credentialId);
    
    if (!credential) {
      return NextResponse.json({ error: 'AWS credential not found' }, { status: 404 });
    }

    // Create CloudWatch Logs client
    const cloudWatchLogsClient = new CloudWatchLogsClient({
      region: credential.region,
      credentials: {
        accessKeyId: credential.accessKeyId,
        secretAccessKey: credential.secretAccessKey
      }
    });

    // Create and execute the command to filter log events
    const command = new FilterLogEventsCommand({
      logGroupName,
      startTime,
      endTime,
      filterPattern,
      limit
    });

    const response = await cloudWatchLogsClient.send(command);

    // Transform the events into a more user-friendly format
    const events = response.events?.map(event => ({
      id: event.eventId,
      timestamp: event.timestamp,
      message: event.message,
      logStream: event.logStreamName,
      severity: determineSeverity(event.message || ''),
      acknowledged: false,
      resolved: false,
    })) || [];

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching SIEM events:', error);
    return NextResponse.json(
      { error: `Failed to fetch SIEM events: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// Helper function to determine severity based on log message content
function determineSeverity(message: string): 'low' | 'medium' | 'high' | 'critical' {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('error') || lowerMessage.includes('exception') || lowerMessage.includes('fail')) {
    if (lowerMessage.includes('critical') || lowerMessage.includes('fatal')) {
      return 'critical';
    }
    return 'high';
  }
  
  if (lowerMessage.includes('warn') || lowerMessage.includes('warning')) {
    return 'medium';
  }
  
  return 'low';
} 