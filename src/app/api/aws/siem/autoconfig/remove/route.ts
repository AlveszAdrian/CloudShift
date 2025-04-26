import { NextRequest, NextResponse } from 'next/server';
import { 
  CloudWatchLogsClient, 
  DeleteLogGroupCommand,
  DeleteMetricFilterCommand,
  DescribeLogGroupsCommand,
  DescribeMetricFiltersCommand,
  DeleteSubscriptionFilterCommand
} from '@aws-sdk/client-cloudwatch-logs';
import { 
  CloudWatchClient, 
  DeleteAlarmsCommand,
  DescribeAlarmsCommand
} from '@aws-sdk/client-cloudwatch';
import {
  CloudTrailClient,
  DeleteTrailCommand,
  DescribeTrailsCommand,
  Trail
} from '@aws-sdk/client-cloudtrail';
import { 
  IAMClient,
  DeleteRoleCommand,
  DeleteRolePolicyCommand,
  GetRoleCommand
} from '@aws-sdk/client-iam';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { getAwsCredentials } from '@/lib/aws/credentials';

// CloudTrail role name
const CLOUDTRAIL_ROLE_NAME = 'CloudTrailToCloudWatchLogsRole';

// Default log groups created by auto-config
const DEFAULT_LOG_GROUPS = [
  '/aws/siem/security-events',
  '/aws/siem/network-activity',
  '/aws/siem/authentication',
  '/aws/siem/api-activity',
  '/aws/cloudtrail/management-events'
];

// Default metric filter names
const DEFAULT_METRIC_FILTER_NAMES = [
  'SecurityFailedActions',
  'FailedAuthentication',
  'SuspiciousAPIActivity',
  'S3BucketCreation',
  'S3BucketCreationExtended',
  'ForwardToSIEM'
];

// Default alarm names 
const DEFAULT_ALARM_NAMES = [
  'HighRateOfFailedAuthentication',
  'CriticalSecurityFailures',
  'S3BucketCreationAlert'
];

// Helper function to delay execution for a bit 
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  const removalResults: any = {
    success: true,
    message: 'SIEM environment removal in progress',
    details: {
      logGroups: 0,
      metricFilters: 0,
      alarms: 0,
      cloudTrail: false,
      iamRole: false,
      subscriptionFilters: 0,
      diagnostics: []
    }
  };
  
  try {
    const body = await request.json();
    const { credentialId } = body;

    if (!credentialId) {
      return NextResponse.json(
        { error: 'Credential ID is required' },
        { status: 400 }
      );
    }

    // Get the AWS credentials
    const credential = await getAwsCredentials(credentialId);
    if (!credential) {
      return NextResponse.json(
        { error: 'Credential not found' },
        { status: 404 }
      );
    }

    // Set up AWS clients with the credentials
    const config = {
      region: credential.region,
      credentials: {
        accessKeyId: credential.accessKeyId,
        secretAccessKey: credential.secretKey
      }
    };
    
    // Create AWS clients
    const logsClient = new CloudWatchLogsClient(config);
    const cloudWatchClient = new CloudWatchClient(config);
    const cloudTrailClient = new CloudTrailClient(config);
    const iamClient = new IAMClient(config);
    const stsClient = new STSClient(config);
    
    // Get AWS account ID using STS
    let accountId = '';
    try {
      const identity = await stsClient.send(new GetCallerIdentityCommand({}));
      accountId = identity.Account || '';
      removalResults.details.diagnostics.push(`Detected AWS Account ID: ${accountId}`);
    } catch (stsError) {
      removalResults.details.diagnostics.push(`Error getting AWS Account ID: ${stsError instanceof Error ? stsError.message : String(stsError)}`);
      return NextResponse.json(
        { 
          error: 'Failed to get AWS Account ID. Check credentials permissions.',
          details: removalResults.details 
        },
        { status: 403 }
      );
    }
    
    // Step 1: Remove CloudTrail trail
    removalResults.details.diagnostics.push('Looking for CloudSIEM trail to remove...');
    const describeTrailsResponse = await cloudTrailClient.send(new DescribeTrailsCommand({}));
    const trails = describeTrailsResponse.trailList || [];
    
    // Try to find the CloudSIEM trail
    const siemTrail = trails.find((trail: Trail) => trail.Name?.includes('CloudSIEM'));
    
    if (siemTrail && siemTrail.Name) {
      try {
        await cloudTrailClient.send(
          new DeleteTrailCommand({
            Name: siemTrail.Name
          })
        );
        removalResults.details.cloudTrail = true;
        removalResults.details.diagnostics.push(`Successfully removed CloudTrail trail: ${siemTrail.Name}`);
      } catch (trailError) {
        removalResults.details.diagnostics.push(`Error removing CloudTrail trail: ${trailError instanceof Error ? trailError.message : String(trailError)}`);
      }
    } else {
      removalResults.details.diagnostics.push('No CloudSIEM trail found to remove');
    }
    
    // Step 2: Remove CloudTrail IAM role
    removalResults.details.diagnostics.push(`Looking for CloudTrail role (${CLOUDTRAIL_ROLE_NAME}) to remove...`);
    
    try {
      // Check if role exists
      await iamClient.send(
        new GetRoleCommand({
          RoleName: CLOUDTRAIL_ROLE_NAME
        })
      );
      
      // Delete role policy first
      try {
        await iamClient.send(
          new DeleteRolePolicyCommand({
            RoleName: CLOUDTRAIL_ROLE_NAME,
            PolicyName: 'CloudTrailToCloudWatchLogs'
          })
        );
        removalResults.details.diagnostics.push(`Removed role policy from ${CLOUDTRAIL_ROLE_NAME}`);
      } catch (policyError) {
        removalResults.details.diagnostics.push(`Error removing role policy: ${policyError instanceof Error ? policyError.message : String(policyError)}`);
      }
      
      // Now delete the role
      try {
        await iamClient.send(
          new DeleteRoleCommand({
            RoleName: CLOUDTRAIL_ROLE_NAME
          })
        );
        removalResults.details.iamRole = true;
        removalResults.details.diagnostics.push(`Successfully removed IAM role: ${CLOUDTRAIL_ROLE_NAME}`);
      } catch (roleError) {
        removalResults.details.diagnostics.push(`Error removing IAM role: ${roleError instanceof Error ? roleError.message : String(roleError)}`);
      }
    } catch (getRoleError) {
      removalResults.details.diagnostics.push(`CloudTrail role not found: ${CLOUDTRAIL_ROLE_NAME}`);
    }
    
    // Step 3: Remove CloudWatch Alarms
    removalResults.details.diagnostics.push('Removing CloudWatch alarms...');
    
    // Get existing alarms
    const existingAlarms = await cloudWatchClient.send(
      new DescribeAlarmsCommand({
        AlarmNames: DEFAULT_ALARM_NAMES
      })
    );
    
    const alarmsToDelete = existingAlarms.MetricAlarms?.map(alarm => alarm.AlarmName).filter(name => name) as string[];
    
    if (alarmsToDelete && alarmsToDelete.length > 0) {
      try {
        await cloudWatchClient.send(
          new DeleteAlarmsCommand({
            AlarmNames: alarmsToDelete
          })
        );
        removalResults.details.alarms = alarmsToDelete.length;
        removalResults.details.diagnostics.push(`Successfully removed ${alarmsToDelete.length} CloudWatch alarms`);
      } catch (alarmError) {
        removalResults.details.diagnostics.push(`Error removing CloudWatch alarms: ${alarmError instanceof Error ? alarmError.message : String(alarmError)}`);
      }
    } else {
      removalResults.details.diagnostics.push('No CloudSIEM alarms found to remove');
    }
    
    // Step 4: Remove subscription filters and metric filters
    removalResults.details.diagnostics.push('Removing subscription filters and metric filters...');
    
    // Get existing log groups
    const existingLogGroups = await logsClient.send(new DescribeLogGroupsCommand({}));
    const existingLogGroupNames = existingLogGroups.logGroups?.map(lg => lg.logGroupName) || [];
    
    // For each log group, remove subscription filters and metric filters
    for (const logGroupName of DEFAULT_LOG_GROUPS) {
      if (!existingLogGroupNames.includes(logGroupName)) {
        continue; // Skip if log group doesn't exist
      }
      
      // Remove subscription filters
      try {
        await logsClient.send(
          new DeleteSubscriptionFilterCommand({
            logGroupName: logGroupName,
            filterName: 'ForwardToSIEM'
          })
        );
        removalResults.details.subscriptionFilters++;
        removalResults.details.diagnostics.push(`Removed subscription filter from log group: ${logGroupName}`);
      } catch (subError) {
        // It's okay if the subscription filter doesn't exist
        removalResults.details.diagnostics.push(`No subscription filter found for log group: ${logGroupName}`);
      }
      
      // Get existing metric filters
      const metricFiltersResponse = await logsClient.send(
        new DescribeMetricFiltersCommand({
          logGroupName: logGroupName
        })
      );
      
      // Remove each metric filter
      for (const filter of metricFiltersResponse.metricFilters || []) {
        if (filter.filterName && DEFAULT_METRIC_FILTER_NAMES.includes(filter.filterName)) {
          try {
            await logsClient.send(
              new DeleteMetricFilterCommand({
                logGroupName: logGroupName,
                filterName: filter.filterName
              })
            );
            removalResults.details.metricFilters++;
            removalResults.details.diagnostics.push(`Removed metric filter: ${filter.filterName} from log group: ${logGroupName}`);
          } catch (filterError) {
            removalResults.details.diagnostics.push(`Error removing metric filter ${filter.filterName}: ${filterError instanceof Error ? filterError.message : String(filterError)}`);
          }
        }
      }
    }
    
    // Step 5: Remove log groups
    removalResults.details.diagnostics.push('Removing CloudWatch log groups...');
    
    for (const logGroupName of DEFAULT_LOG_GROUPS) {
      if (!existingLogGroupNames.includes(logGroupName)) {
        removalResults.details.diagnostics.push(`Log group ${logGroupName} does not exist, skipping removal`);
        continue;
      }
      
      try {
        await logsClient.send(
          new DeleteLogGroupCommand({
            logGroupName
          })
        );
        removalResults.details.logGroups++;
        removalResults.details.diagnostics.push(`Successfully removed log group: ${logGroupName}`);
      } catch (logError) {
        removalResults.details.diagnostics.push(`Error removing log group ${logGroupName}: ${logError instanceof Error ? logError.message : String(logError)}`);
      }
    }
    
    // Step 6: Remove SIEM rules
    // This would be handled by another API endpoint if needed
    removalResults.details.diagnostics.push('Removal of SIEM rules would be handled separately');
    
    removalResults.message = 'CloudSIEM configuration successfully removed';
    removalResults.details.diagnostics.push('Removal complete!');
    
    return NextResponse.json(removalResults);
    
  } catch (error) {
    console.error('Error removing SIEM environment:', error);
    removalResults.success = false;
    removalResults.message = `Failed to remove SIEM environment: ${error instanceof Error ? error.message : String(error)}`;
    removalResults.details.diagnostics.push(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
    
    return NextResponse.json(removalResults, { status: 500 });
  }
} 