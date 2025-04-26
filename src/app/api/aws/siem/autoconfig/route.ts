import { NextRequest, NextResponse } from 'next/server';
import { 
  CloudWatchLogsClient, 
  CreateLogGroupCommand,
  PutMetricFilterCommand,
  DescribeLogGroupsCommand,
  PutRetentionPolicyCommand,
  PutSubscriptionFilterCommand
} from '@aws-sdk/client-cloudwatch-logs';
import { 
  CloudWatchClient, 
  PutMetricAlarmCommand,
  ComparisonOperator,
  Statistic
} from '@aws-sdk/client-cloudwatch';
import {
  CloudTrailClient,
  CreateTrailCommand,
  UpdateTrailCommand,
  DescribeTrailsCommand,
  StartLoggingCommand,
  Trail,
  GetTrailStatusCommand,
  GetTrailCommand
} from '@aws-sdk/client-cloudtrail';
import { 
  IAMClient, 
  CreateRoleCommand,
  AttachRolePolicyCommand,
  GetRoleCommand,
  PutRolePolicyCommand,
  ListAccountAliasesCommand
} from '@aws-sdk/client-iam';
import {
  STSClient,
  GetCallerIdentityCommand
} from '@aws-sdk/client-sts';
import { getAwsCredentials } from '@/lib/aws/credentials';

// Default log groups for SIEM monitoring
const DEFAULT_LOG_GROUPS = [
  '/aws/siem/security-events',
  '/aws/siem/network-activity',
  '/aws/siem/authentication',
  '/aws/siem/api-activity',
  '/aws/cloudtrail/management-events' // Grupo específico para CloudTrail
];

// Default metric filters for security monitoring
const DEFAULT_METRIC_FILTERS = [
  {
    logGroupName: '/aws/siem/security-events',
    filterName: 'SecurityFailedActions',
    filterPattern: '{ $.eventType = "SecurityAlert" && $.status = "Failed" }',
    metricName: 'FailedSecurityActions',
    metricNamespace: 'SIEM/Security',
    metricValue: '1'
  },
  {
    logGroupName: '/aws/siem/authentication',
    filterName: 'FailedAuthentication',
    filterPattern: '{ $.eventType = "Authentication" && $.status = "Failed" }',
    metricName: 'FailedAuthentication',
    metricNamespace: 'SIEM/Auth',
    metricValue: '1'
  },
  {
    logGroupName: '/aws/siem/api-activity',
    filterName: 'SuspiciousAPIActivity',
    filterPattern: '{ $.eventType = "APICall" && $.severity = "High" }',
    metricName: 'SuspiciousAPIActivity',
    metricNamespace: 'SIEM/API',
    metricValue: '1'
  },
  {
    logGroupName: '/aws/cloudtrail/management-events',
    filterName: 'S3BucketCreation',
    filterPattern: '{ $.eventName = "CreateBucket" }',
    metricName: 'S3BucketCreation',
    metricNamespace: 'SIEM/S3',
    metricValue: '1'
  },
  {
    logGroupName: '/aws/cloudtrail/management-events',
    filterName: 'S3BucketCreationExtended',
    filterPattern: '{ ($.eventSource = "s3.amazonaws.com") && ($.eventName = "CreateBucket") }',
    metricName: 'S3BucketCreationExtended',
    metricNamespace: 'SIEM/S3',
    metricValue: '1'
  }
];

// Default alarm configurations
const DEFAULT_ALARMS = [
  {
    alarmName: 'HighRateOfFailedAuthentication',
    metricName: 'FailedAuthentication',
    namespace: 'SIEM/Auth',
    comparisonOperator: ComparisonOperator.GreaterThanThreshold,
    evaluationPeriods: 1,
    period: 300,
    statistic: Statistic.Sum,
    threshold: 5,
    alarmDescription: 'Alert when there are more than 5 failed authentication attempts in 5 minutes',
    alarmActions: []  // SNS topic ARNs would be added here in a real implementation
  },
  {
    alarmName: 'CriticalSecurityFailures',
    metricName: 'FailedSecurityActions',
    namespace: 'SIEM/Security',
    comparisonOperator: ComparisonOperator.GreaterThanThreshold,
    evaluationPeriods: 1,
    period: 60,
    statistic: Statistic.Sum,
    threshold: 1,
    alarmDescription: 'Alert on any critical security action failure',
    alarmActions: []
  },
  {
    alarmName: 'S3BucketCreationAlert',
    metricName: 'S3BucketCreation',
    namespace: 'SIEM/S3',
    comparisonOperator: ComparisonOperator.GreaterThanThreshold,
    evaluationPeriods: 1,
    period: 60,
    statistic: Statistic.Sum,
    threshold: 0,
    alarmDescription: 'Alert when an S3 bucket is created',
    alarmActions: []
  }
];

// Default SIEM rules to create
const DEFAULT_SIEM_RULES = [
  {
    name: 'Failed Login Attempts',
    description: 'Detects multiple failed login attempts',
    severity: 'Medium',
    enabled: true,
    source: 'CloudTrail',
    pattern: '{ $.eventName = "ConsoleLogin" && $.errorMessage = "Failed authentication" }'
  },
  {
    name: 'Root Account Usage',
    description: 'Detects when the AWS root account is used',
    severity: 'High',
    enabled: true,
    source: 'CloudTrail',
    pattern: '{ $.userIdentity.type = "Root" }'
  },
  {
    name: 'IAM Policy Changes',
    description: 'Detects changes to IAM policies',
    severity: 'High',
    enabled: true,
    source: 'CloudTrail',
    pattern: '{ $.eventName = "PutUserPolicy" || $.eventName = "PutGroupPolicy" || $.eventName = "PutRolePolicy" || $.eventName = "CreatePolicy" || $.eventName = "DeletePolicy" || $.eventName = "CreatePolicyVersion" || $.eventName = "DeletePolicyVersion" || $.eventName = "AttachRolePolicy" || $.eventName = "DetachRolePolicy" || $.eventName = "AttachUserPolicy" || $.eventName = "DetachUserPolicy" || $.eventName = "AttachGroupPolicy" || $.eventName = "DetachGroupPolicy" }'
  },
  {
    name: 'Security Group Changes',
    description: 'Detects changes to security groups',
    severity: 'Medium',
    enabled: true,
    source: 'CloudTrail',
    pattern: '{ $.eventName = "AuthorizeSecurityGroupIngress" || $.eventName = "AuthorizeSecurityGroupEgress" || $.eventName = "RevokeSecurityGroupIngress" || $.eventName = "RevokeSecurityGroupEgress" || $.eventName = "CreateSecurityGroup" || $.eventName = "DeleteSecurityGroup" }'
  },
  {
    name: 'Administrator Group Membership Changes',
    description: 'Detecta quando um usuário é adicionado a um grupo de administradores',
    severity: 'High',
    enabled: true,
    source: 'CloudTrail',
    pattern: '{ $.eventName = "AddUserToGroup" && ($.requestParameters.groupName = "*Admin*" || $.requestParameters.groupName = "*Administrator*") }'
  },
  {
    name: 'S3 Bucket Creation',
    description: 'Detecta quando um novo bucket S3 é criado',
    severity: 'Medium',
    enabled: true,
    source: 'CloudTrail',
    pattern: '{ $.eventName = "CreateBucket" || ($.eventSource = "s3.amazonaws.com" && $.eventName = "CreateBucket") }'
  }
];

// CloudTrail to CloudWatch trust policy
const CLOUDTRAIL_TRUST_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: {
        Service: 'cloudtrail.amazonaws.com'
      },
      Action: 'sts:AssumeRole'
    }
  ]
};

// CloudTrail IAM role policy
const CLOUDTRAIL_ROLE_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'logs:DescribeLogStreams'
      ],
      Resource: '*'
    }
  ]
};

// Helper function to delay execution for a bit 
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  const configResults: any = {
    success: true,
    message: 'SIEM environment configuration in progress',
    details: {
      logGroups: 0,
      metricFilters: 0,
      alarms: 0,
      rules: 0,
      cloudTrail: 'Not configured',
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
      configResults.details.diagnostics.push(`Detected AWS Account ID: ${accountId}`);
    } catch (stsError) {
      configResults.details.diagnostics.push(`Error getting AWS Account ID: ${stsError instanceof Error ? stsError.message : String(stsError)}`);
      return NextResponse.json(
        { 
          error: 'Failed to get AWS Account ID. Check credentials permissions.',
          details: configResults.details 
        },
        { status: 403 }
      );
    }
    
    if (!accountId) {
      configResults.details.diagnostics.push('Could not determine AWS Account ID. Aborting configuration.');
      return NextResponse.json(
        { 
          error: 'Failed to get AWS Account ID',
          details: configResults.details 
        },
        { status: 500 }
      );
    }

    // Step 1: Create log groups
    configResults.details.diagnostics.push('Starting log group creation...');
    const existingLogGroups = await logsClient.send(new DescribeLogGroupsCommand({}));
    const existingLogGroupNames = existingLogGroups.logGroups?.map(lg => lg.logGroupName) || [];
    configResults.details.diagnostics.push(`Found ${existingLogGroupNames.length} existing log groups`);
    
    for (const logGroupName of DEFAULT_LOG_GROUPS) {
      // Skip if log group already exists
      if (existingLogGroupNames.includes(logGroupName)) {
        configResults.details.diagnostics.push(`Log group ${logGroupName} already exists, skipping creation`);
        continue;
      }
      
      try {
        await logsClient.send(
          new CreateLogGroupCommand({
            logGroupName
          })
        );
        
        // Set retention policy to 30 days
        await logsClient.send(
          new PutRetentionPolicyCommand({
            logGroupName,
            retentionInDays: 30
          })
        );
        
        configResults.details.logGroups++;
        configResults.details.diagnostics.push(`Created log group ${logGroupName} with 30-day retention`);
      } catch (error) {
        configResults.details.diagnostics.push(`Error creating log group ${logGroupName}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Step 2: Create/ensure CloudTrail role exists
    const cloudTrailRoleName = 'CloudTrailToCloudWatchLogsRole';
    let roleArn = '';
    
    try {
      // Check if role already exists
      const getRoleResponse = await iamClient.send(
        new GetRoleCommand({
          RoleName: cloudTrailRoleName
        })
      );
      
      roleArn = getRoleResponse.Role?.Arn || '';
      configResults.details.diagnostics.push(`CloudTrail role ${cloudTrailRoleName} already exists with ARN: ${roleArn}`);
    } catch (roleError) {
      // Role doesn't exist, create it
      try {
        const createRoleResponse = await iamClient.send(
          new CreateRoleCommand({
            RoleName: cloudTrailRoleName,
            AssumeRolePolicyDocument: JSON.stringify(CLOUDTRAIL_TRUST_POLICY),
            Description: 'Role for CloudTrail to publish to CloudWatch Logs'
          })
        );
        
        roleArn = createRoleResponse.Role?.Arn || '';
        configResults.details.diagnostics.push(`Created CloudTrail role ${cloudTrailRoleName} with ARN: ${roleArn}`);
        
        // Attach policy to the role
        await iamClient.send(
          new PutRolePolicyCommand({
            RoleName: cloudTrailRoleName,
            PolicyName: 'CloudTrailToCloudWatchLogs',
            PolicyDocument: JSON.stringify(CLOUDTRAIL_ROLE_POLICY)
          })
        );
        
        configResults.details.diagnostics.push(`Attached policy to CloudTrail role`);
        
        // Wait for role propagation
        configResults.details.diagnostics.push('Waiting for IAM role to propagate (5 seconds)...');
        await delay(5000);
      } catch (createRoleError) {
        configResults.details.diagnostics.push(`Error creating CloudTrail role: ${createRoleError instanceof Error ? createRoleError.message : String(createRoleError)}`);
      }
    }
    
    if (!roleArn) {
      configResults.details.diagnostics.push('Could not create or find CloudTrail role. Some features may not work correctly.');
      // Continuamos com a configuração mesmo sem a role, pois alguns recursos ainda podem funcionar
    }
    
    // Step 3: Set up CloudTrail
    // Check if CloudTrail is already configured
    const describeTrailsResponse = await cloudTrailClient.send(new DescribeTrailsCommand({}));
    const trails = describeTrailsResponse.trailList || [];
    configResults.details.diagnostics.push(`Found ${trails.length} existing trails`);
    
    // Try to find an existing CloudSIEM trail
    let siemTrail = trails.find((trail: Trail) => trail.Name?.includes('CloudSIEM'));
    const trailName = 'CloudSIEM-Trail';
    let trailStatus = 'Unknown';
    
    // Construir o ARN correto do grupo de log, IMPORTANTE adicionar :* ao final
    const cloudTrailLogGroupName = '/aws/cloudtrail/management-events';
    const cloudTrailLogGroupArn = `arn:aws:logs:${credential.region}:${accountId}:log-group:${cloudTrailLogGroupName}:*`;
    configResults.details.diagnostics.push(`Using CloudWatch Log Group ARN: ${cloudTrailLogGroupArn}`);
    
    // Construir nome único do bucket para CloudTrail (se necessário)
    const bucketName = `cloudtrail-logs-${accountId}-${credential.region}-${Date.now().toString().substring(0, 6)}`;
    
    if (!siemTrail) {
      configResults.details.diagnostics.push('No CloudSIEM trail found, creating new trail');
      // Create a new CloudTrail trail for SIEM
      try {
        // Create CloudTrail trail
        const createTrailResponse = await cloudTrailClient.send(
          new CreateTrailCommand({
            Name: trailName,
            S3BucketName: bucketName,
            IsMultiRegionTrail: true,
            EnableLogFileValidation: true,
            IncludeGlobalServiceEvents: true,
            CloudWatchLogsLogGroupArn: cloudTrailLogGroupArn,
            CloudWatchLogsRoleArn: roleArn
          })
        );
        
        configResults.details.diagnostics.push(`Trail created successfully: ${JSON.stringify(createTrailResponse)}`);
        
        // Start logging for the trail
        await cloudTrailClient.send(
          new StartLoggingCommand({
            Name: trailName
          })
        );
        
        // Get trail status
        const trailStatusResponse = await cloudTrailClient.send(
          new GetTrailStatusCommand({
            Name: trailName
          })
        );
        
        trailStatus = trailStatusResponse.IsLogging ? 'Logging' : 'Not Logging';
        configResults.details.diagnostics.push(`Created new CloudTrail trail: ${trailName}, Status: ${trailStatus}`);
        configResults.details.cloudTrail = 'Created new trail';
      } catch (trailError) {
        configResults.details.diagnostics.push(`Error creating CloudTrail trail: ${trailError instanceof Error ? trailError.message : String(trailError)}`);
        configResults.details.diagnostics.push('Continuing with configuration despite CloudTrail error');
        // Continue with the setup even if CloudTrail setup fails
      }
    } else {
      configResults.details.diagnostics.push(`Found existing CloudSIEM trail: ${siemTrail.Name}`);
      // Update existing trail to integrate with CloudWatch Logs
      try {
        await cloudTrailClient.send(
          new UpdateTrailCommand({
            Name: siemTrail.Name,
            IsMultiRegionTrail: true,
            IncludeGlobalServiceEvents: true,
            EnableLogFileValidation: true,
            CloudWatchLogsLogGroupArn: cloudTrailLogGroupArn,
            CloudWatchLogsRoleArn: roleArn
          })
        );
        
        // Check if logging is enabled
        const trailStatusResponse = await cloudTrailClient.send(
          new GetTrailStatusCommand({
            Name: siemTrail.Name || ''
          })
        );
        
        // If not logging, start it
        if (!trailStatusResponse.IsLogging) {
          await cloudTrailClient.send(
            new StartLoggingCommand({
              Name: siemTrail.Name || ''
            })
          );
          configResults.details.diagnostics.push(`Started logging for trail: ${siemTrail.Name}`);
        }
        
        trailStatus = trailStatusResponse.IsLogging ? 'Logging' : 'Not Logging';
        configResults.details.diagnostics.push(`Updated existing CloudTrail trail: ${siemTrail.Name}, Status: ${trailStatus}`);
        configResults.details.cloudTrail = 'Updated existing trail';
      } catch (updateError) {
        configResults.details.diagnostics.push(`Error updating CloudTrail trail: ${updateError instanceof Error ? updateError.message : String(updateError)}`);
        // Continue with the setup even if CloudTrail update fails
      }
    }
    
    // Wait a bit to ensure CloudTrail configuration has time to propagate
    configResults.details.diagnostics.push('Waiting for CloudTrail configuration to propagate (5 seconds)...');
    await delay(5000);
    
    // Step 4: Set up a subscription filter to forward CloudTrail logs to the SIEM logs group
    configResults.details.diagnostics.push('Setting up log subscription to centralize CloudTrail logs in SIEM group...');
    
    try {
      // Create a subscription filter to forward CloudTrail logs to the main SIEM group
      await logsClient.send(
        new PutSubscriptionFilterCommand({
          logGroupName: '/aws/cloudtrail/management-events',
          filterName: 'ForwardToSIEM',
          filterPattern: '', // Empty pattern to forward all logs
          destinationArn: `arn:aws:logs:${credential.region}:${accountId}:log-group:/aws/siem/security-events:*`
        })
      );
      configResults.details.diagnostics.push('Successfully set up subscription filter to forward CloudTrail logs to SIEM group');
    } catch (subError) {
      configResults.details.diagnostics.push(`Error setting up subscription filter: ${subError instanceof Error ? subError.message : String(subError)}`);
      configResults.details.diagnostics.push('This may be due to permissions issues or log destination configuration requirements');
      configResults.details.diagnostics.push('Continuing with other configurations...');
    }
    
    // Step 5: Create metric filters
    configResults.details.diagnostics.push('Creating metric filters...');
    for (const filter of DEFAULT_METRIC_FILTERS) {
      try {
        // Ensure the log group exists before creating the filter
        if (!existingLogGroupNames.includes(filter.logGroupName) && 
            !DEFAULT_LOG_GROUPS.includes(filter.logGroupName)) {
          configResults.details.diagnostics.push(`Log group ${filter.logGroupName} does not exist, skipping filter ${filter.filterName}`);
          continue;
        }
        
        await logsClient.send(
          new PutMetricFilterCommand({
            logGroupName: filter.logGroupName,
            filterName: filter.filterName,
            filterPattern: filter.filterPattern,
            metricTransformations: [
              {
                metricName: filter.metricName,
                metricNamespace: filter.metricNamespace,
                metricValue: filter.metricValue
              }
            ]
          })
        );
        
        configResults.details.metricFilters++;
        configResults.details.diagnostics.push(`Created metric filter: ${filter.filterName} on log group ${filter.logGroupName}`);
      } catch (filterError) {
        configResults.details.diagnostics.push(`Error creating metric filter ${filter.filterName}: ${filterError instanceof Error ? filterError.message : String(filterError)}`);
      }
    }
    
    // Step 6: Create CloudWatch alarms
    configResults.details.diagnostics.push('Creating CloudWatch alarms...');
    for (const alarm of DEFAULT_ALARMS) {
      try {
        await cloudWatchClient.send(
          new PutMetricAlarmCommand({
            AlarmName: alarm.alarmName,
            MetricName: alarm.metricName,
            Namespace: alarm.namespace,
            ComparisonOperator: alarm.comparisonOperator,
            EvaluationPeriods: alarm.evaluationPeriods,
            Period: alarm.period,
            Statistic: alarm.statistic,
            Threshold: alarm.threshold,
            AlarmDescription: alarm.alarmDescription,
            AlarmActions: alarm.alarmActions
          })
        );
        
        configResults.details.alarms++;
        configResults.details.diagnostics.push(`Created alarm: ${alarm.alarmName}`);
      } catch (alarmError) {
        configResults.details.diagnostics.push(`Error creating alarm ${alarm.alarmName}: ${alarmError instanceof Error ? alarmError.message : String(alarmError)}`);
      }
    }
    
    // Step 7: Create SIEM rules
    configResults.details.diagnostics.push('Creating SIEM rules...');
    // For this step, we'll use the existing API endpoint
    for (const rule of DEFAULT_SIEM_RULES) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/aws/siem/rules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rule: {
              name: rule.name,
              description: rule.description,
              severity: rule.severity,
              status: rule.enabled ? 'active' : 'inactive',
              type: 'log-pattern',
              query: rule.pattern,
              credentialId: credentialId
            },
            credentialId
          }),
        });
        
        if (response.ok) {
          configResults.details.rules++;
          configResults.details.diagnostics.push(`Created rule: ${rule.name}`);
        } else {
          const errorData = await response.json();
          configResults.details.diagnostics.push(`Error creating rule ${rule.name}: ${errorData.error || response.statusText}`);
        }
      } catch (ruleError) {
        configResults.details.diagnostics.push(`Error creating rule ${rule.name}: ${ruleError instanceof Error ? ruleError.message : String(ruleError)}`);
      }
    }
    
    // Final verification step - attempt to get trail status to confirm everything is working
    try {
      const trailToCheck = siemTrail ? siemTrail.Name : trailName;
      const finalTrailStatus = await cloudTrailClient.send(
        new GetTrailStatusCommand({
          Name: trailToCheck
        })
      );
      
      configResults.details.diagnostics.push(`Final CloudTrail status: ${finalTrailStatus.IsLogging ? 'Logging Enabled' : 'Not Logging'}`);
      if (finalTrailStatus.LatestDeliveryError) {
        configResults.details.diagnostics.push(`CloudTrail delivery error: ${finalTrailStatus.LatestDeliveryError}`);
      }
      if (finalTrailStatus.LatestCloudWatchLogsDeliveryError) {
        configResults.details.diagnostics.push(`CloudWatch Logs delivery error: ${finalTrailStatus.LatestCloudWatchLogsDeliveryError}`);
      }
    } catch (finalCheckError) {
      configResults.details.diagnostics.push(`Error in final CloudTrail verification: ${finalCheckError instanceof Error ? finalCheckError.message : String(finalCheckError)}`);
    }
    
    configResults.message = 'SIEM environment successfully configured';
    configResults.details.diagnostics.push('Configuration complete!');
    
    return NextResponse.json(configResults);
    
  } catch (error) {
    console.error('Error setting up SIEM environment:', error);
    configResults.success = false;
    configResults.message = `Failed to set up SIEM environment: ${error instanceof Error ? error.message : String(error)}`;
    configResults.details.diagnostics.push(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
    
    return NextResponse.json(configResults, { status: 500 });
  }
} 