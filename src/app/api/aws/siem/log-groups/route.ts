import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CloudWatchLogsClient, DescribeLogGroupsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { getAwsCredentials } from '@/lib/aws/credentials';

// Endpoint para listar grupos de log
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const credentialId = searchParams.get('credentialId');

    if (!credentialId) {
      return NextResponse.json({ error: 'AWS credential ID is required' }, { status: 400 });
    }

    // Obter credenciais AWS
    const credentials = await getAwsCredentials(credentialId);
    if (!credentials) {
      return NextResponse.json({ error: 'AWS credentials not found' }, { status: 404 });
    }

    // Configurar cliente CloudWatch Logs com as credenciais
    const cloudWatchLogs = new CloudWatchLogsClient({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretKey
      }
    });

    console.log('Buscando grupos de log');

    const response = await cloudWatchLogs.send(new DescribeLogGroupsCommand({}));
    const logGroups = response.logGroups?.map(group => group.logGroupName) || [];

    console.log('Grupos de log encontrados:', logGroups.length);

    return NextResponse.json({ logGroups });
  } catch (error) {
    console.error('Error listing log groups:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 