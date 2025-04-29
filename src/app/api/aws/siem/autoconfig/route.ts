import { NextRequest, NextResponse } from 'next/server';
import { 
  CloudWatchLogsClient, 
  CreateLogGroupCommand,
  PutMetricFilterCommand,
  DescribeLogGroupsCommand,
  PutRetentionPolicyCommand,
  PutSubscriptionFilterCommand,
  DescribeMetricFiltersCommand,
  StartQueryCommand,
  GetQueryResultsCommand
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
import AWS from 'aws-sdk';
import { getAwsCredentials } from '@/lib/aws/credentials';
import { LogsInsightsQuery } from '@/lib/types';

// Default log groups for SIEM monitoring
const DEFAULT_LOG_GROUPS = [
  '/aws/siem/security-events',
  '/aws/siem/network-activity',
  '/aws/siem/authentication',
  '/aws/siem/api-activity',
  '/aws/cloudtrail/management-events' // Grupo específico para CloudTrail
];

// Consultas CloudWatch Logs Insights predefinidas
const DEFAULT_INSIGHTS_QUERIES: LogsInsightsQuery[] = [
  {
    name: 'Root Account Usage',
    description: 'Detecta uso da conta root da AWS nas últimas 24 horas',
    logGroups: ['/aws/cloudtrail/management-events'],
    queryString: 'filter userIdentity.type = "Root" | fields eventTime, eventName, awsRegion, sourceIPAddress, userAgent',
    timeRange: 24 * 60 * 60 * 1000 // 24 horas em milissegundos
  },
  {
    name: 'Failed Login Attempts',
    description: 'Detecta tentativas de login malsucedidas nas últimas 24 horas',
    logGroups: ['/aws/cloudtrail/management-events'],
    queryString: 'filter eventName = "ConsoleLogin" and errorMessage like "Failed authentication" | fields eventTime, sourceIPAddress, userAgent, errorMessage | sort eventTime desc',
    timeRange: 24 * 60 * 60 * 1000
  },
  {
    name: 'Security Group Changes',
    description: 'Mostra alterações em grupos de segurança',
    logGroups: ['/aws/cloudtrail/management-events'],
    queryString: 'filter eventName like "AuthorizeSecurityGroup" or eventName like "RevokeSecurityGroup" or eventName = "CreateSecurityGroup" or eventName = "DeleteSecurityGroup" | fields eventTime, eventName, userIdentity.arn, requestParameters.groupId || requestParameters.groupName, sourceIPAddress | sort eventTime desc',
    timeRange: 7 * 24 * 60 * 60 * 1000 // 7 dias
  },
  {
    name: 'IAM Changes',
    description: 'Detecta mudanças em políticas e usuários IAM',
    logGroups: ['/aws/cloudtrail/management-events'],
    queryString: 'filter eventName like "Create" or eventName like "Delete" or eventName like "Put" or eventName like "Attach" or eventName like "Detach" | filter userIdentity.type != "AssumedRole" | fields eventTime, eventName, userIdentity.arn, requestParameters | sort eventTime desc',
    timeRange: 7 * 24 * 60 * 60 * 1000
  },
  {
    name: 'S3 Bucket Policy Changes',
    description: 'Monitora alterações nas políticas de buckets S3',
    logGroups: ['/aws/cloudtrail/management-events'],
    queryString: 'filter eventSource = "s3.amazonaws.com" and (eventName = "PutBucketPolicy" or eventName = "DeleteBucketPolicy" or eventName = "PutBucketAcl") | fields eventTime, eventName, requestParameters.bucketName, userIdentity.arn, sourceIPAddress | sort eventTime desc',
    timeRange: 7 * 24 * 60 * 60 * 1000
  },
  {
    name: 'Unauthorized API Calls',
    description: 'Detecta chamadas de API não autorizadas',
    logGroups: ['/aws/cloudtrail/management-events'],
    queryString: 'filter errorCode like "AccessDenied" or errorCode like "Unauthorized" | fields eventTime, eventName, userIdentity.arn, errorCode, errorMessage, sourceIPAddress | sort eventTime desc',
    timeRange: 24 * 60 * 60 * 1000
  },
  {
    name: 'Console Logins Without MFA',
    description: 'Detecta logins no console sem autenticação MFA',
    logGroups: ['/aws/cloudtrail/management-events'],
    queryString: 'filter eventName = "ConsoleLogin" and additionalEventData.MFAUsed = "No" | fields eventTime, userIdentity.arn, sourceIPAddress, userAgent | sort eventTime desc',
    timeRange: 7 * 24 * 60 * 60 * 1000
  },
  {
    name: 'EC2 Instance Changes',
    description: 'Monitora alterações nas instâncias EC2',
    logGroups: ['/aws/cloudtrail/management-events'],
    queryString: 'filter eventSource = "ec2.amazonaws.com" and (eventName = "StartInstances" or eventName = "StopInstances" or eventName = "RebootInstances" or eventName = "TerminateInstances" or eventName = "RunInstances") | fields eventTime, eventName, userIdentity.arn, responseElements.instancesSet.items.0.instanceId, sourceIPAddress | sort eventTime desc',
    timeRange: 7 * 24 * 60 * 60 * 1000
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
      cloudTrail: 'Not configured',
      diagnostics: [],
      insightsQueries: 0,
      insightsQueriesData: [],
      insightsQueriesList: []
    }
  };
  
  // Array para rastrear os grupos de log criados durante esta execução
  const createdLogGroups: string[] = [];
  
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
    
    // Configurar cliente S3 tradicional
    const s3Client = new AWS.S3({
      region: credential.region,
      accessKeyId: credential.accessKeyId,
      secretAccessKey: credential.secretKey
    });
    
    // Configurar cliente CloudWatch Logs tradicional para consultas Insights
    const cwLogsClient = new AWS.CloudWatchLogs({
      region: credential.region,
      accessKeyId: credential.accessKeyId,
      secretAccessKey: credential.secretKey
    });
    
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
        // Primeiro, tentamos criar o grupo de log
        configResults.details.diagnostics.push(`Attempting to create log group: ${logGroupName}`);
        await logsClient.send(
          new CreateLogGroupCommand({
            logGroupName
          })
        );
        
        // Aguardamos um momento para garantir que o grupo foi criado
        await delay(1000);
        
        // Agora verificamos se o grupo realmente foi criado
        const checkLogGroups = await logsClient.send(new DescribeLogGroupsCommand({
          logGroupNamePrefix: logGroupName
        }));
        
        const logGroupExists = checkLogGroups.logGroups?.some(lg => lg.logGroupName === logGroupName);
        
        if (!logGroupExists) {
          configResults.details.diagnostics.push(`Warning: Log group ${logGroupName} was not found after creation attempt.`);
          continue;
        }
        
        // Set retention policy to 30 days
        configResults.details.diagnostics.push(`Setting 30-day retention policy for: ${logGroupName}`);
        await logsClient.send(
          new PutRetentionPolicyCommand({
            logGroupName,
            retentionInDays: 30
          })
        );
        
        configResults.details.logGroups++;
        configResults.details.diagnostics.push(`Created log group ${logGroupName} with 30-day retention`);
        createdLogGroups.push(logGroupName);
      } catch (error) {
        configResults.details.diagnostics.push(`Error creating log group ${logGroupName}: ${error instanceof Error ? error.message : String(error)}`);
        // Tentar obter mais detalhes sobre o erro
        if (error instanceof Error) {
          configResults.details.diagnostics.push(`Error type: ${error.name}, Stack: ${error.stack?.substring(0, 200)}`);
        }
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
    
    // Construir nome único do bucket para CloudTrail
    // Use um nome de bucket mais simples e previsível
    const bucketName = `cloudtrail-logs-${accountId.substring(0, 8)}-${credential.region}`;
    
    if (!siemTrail) {
      configResults.details.diagnostics.push('No CloudSIEM trail found, creating new trail');
      
      // Step 3.1: Verificar e criar bucket S3 para CloudTrail
      try {
        configResults.details.diagnostics.push(`Checking if S3 bucket ${bucketName} exists...`);
        
        // Verificar se o bucket já existe
        try {
          await s3Client.headBucket({ Bucket: bucketName }).promise();
          configResults.details.diagnostics.push(`S3 bucket ${bucketName} already exists`);
        } catch (bucketError: any) {
          // Bucket não existe, criar um novo
          configResults.details.diagnostics.push(`S3 bucket ${bucketName} does not exist, creating it...`);
          
          try {
            const createBucketParams: any = {
              Bucket: bucketName
            };
            
            // Se a região não for us-east-1, especificamos a LocationConstraint
            if (credential.region !== 'us-east-1') {
              createBucketParams.CreateBucketConfiguration = {
                LocationConstraint: credential.region
              };
            }
            
            await s3Client.createBucket(createBucketParams).promise();
            configResults.details.diagnostics.push(`Successfully created S3 bucket: ${bucketName}`);
            
            // Adicionar política de bucket
            const bucketPolicy = {
              Version: '2012-10-17',
              Statement: [
                {
                  Sid: 'AWSCloudTrailAclCheck',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'cloudtrail.amazonaws.com'
                  },
                  Action: 's3:GetBucketAcl',
                  Resource: `arn:aws:s3:::${bucketName}`
                },
                {
                  Sid: 'AWSCloudTrailWrite',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'cloudtrail.amazonaws.com'
                  },
                  Action: 's3:PutObject',
                  Resource: `arn:aws:s3:::${bucketName}/AWSLogs/${accountId}/*`,
                  Condition: {
                    StringEquals: {
                      's3:x-amz-acl': 'bucket-owner-full-control'
                    }
                  }
                }
              ]
            };
            
            await s3Client.putBucketPolicy({
              Bucket: bucketName,
              Policy: JSON.stringify(bucketPolicy)
            }).promise();
            
            configResults.details.diagnostics.push(`Successfully added policy to S3 bucket: ${bucketName}`);
            
            // Aguardar propagação do bucket
            configResults.details.diagnostics.push('Waiting for S3 bucket to propagate (5 seconds)...');
            await delay(5000);
          } catch (createBucketError: any) {
            configResults.details.diagnostics.push(`Error creating S3 bucket: ${createBucketError.message || String(createBucketError)}`);
            
            // Se o erro for BucketAlreadyExists, podemos prosseguir
            if (createBucketError.code === 'BucketAlreadyExists' || createBucketError.code === 'BucketAlreadyOwnedByYou') {
              configResults.details.diagnostics.push('Bucket already exists but is owned by you or another account. Will attempt to use it.');
            } else {
              throw createBucketError; // Propagar o erro para ser capturado no catch externo
            }
          }
        }
        
        // Step 3.2: Criar CloudTrail trail
        configResults.details.diagnostics.push(`Creating CloudTrail trail ${trailName} using bucket ${bucketName}...`);
        
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
        
        // Iniciar o registro de logs
        configResults.details.diagnostics.push(`Starting logging for trail ${trailName}...`);
        await cloudTrailClient.send(
          new StartLoggingCommand({
            Name: trailName
          })
        );
        
        // Verificar o status da trilha
        configResults.details.diagnostics.push(`Checking status of trail ${trailName}...`);
        const trailStatusResponse = await cloudTrailClient.send(
          new GetTrailStatusCommand({
            Name: trailName
          })
        );
        
        trailStatus = trailStatusResponse.IsLogging ? 'Logging' : 'Not Logging';
        configResults.details.diagnostics.push(`Created new CloudTrail trail: ${trailName}, Status: ${trailStatus}`);
        
        // Verificar se há erros de entrega
        if (trailStatusResponse.LatestDeliveryError) {
          configResults.details.diagnostics.push(`Warning: CloudTrail delivery error: ${trailStatusResponse.LatestDeliveryError}`);
        }
        if (trailStatusResponse.LatestCloudWatchLogsDeliveryError) {
          configResults.details.diagnostics.push(`Warning: CloudWatch Logs delivery error: ${trailStatusResponse.LatestCloudWatchLogsDeliveryError}`);
        }
        
        configResults.details.cloudTrail = 'Created new trail';
        
        // Verificar novamente se a trilha foi realmente criada
        const verifyTrailsResponse = await cloudTrailClient.send(new DescribeTrailsCommand({}));
        const verifiedTrail = verifyTrailsResponse.trailList?.find(trail => trail.Name === trailName);
        
        if (verifiedTrail) {
          configResults.details.diagnostics.push(`Verified trail exists: ${trailName}`);
        } else {
          configResults.details.diagnostics.push(`Warning: Could not verify trail ${trailName} after creation. Please check the AWS CloudTrail console.`);
        }
      } catch (trailError) {
        configResults.details.diagnostics.push(`Error setting up CloudTrail: ${trailError instanceof Error ? trailError.message : String(trailError)}`);
        if (trailError instanceof Error && trailError.stack) {
          configResults.details.diagnostics.push(`Error stack: ${trailError.stack.substring(0, 200)}`);
        }
        configResults.details.diagnostics.push('Continuing with configuration despite CloudTrail error');
      }
    } else {
      configResults.details.diagnostics.push(`Found existing CloudSIEM trail: ${siemTrail.Name}`);
      
      // Verificar se o bucket S3 da trilha existente está acessível
      const existingBucketName = siemTrail.S3BucketName || '';
      
      if (existingBucketName) {
        configResults.details.diagnostics.push(`Checking access to existing S3 bucket: ${existingBucketName}`);
        
        try {
          await s3Client.headBucket({ Bucket: existingBucketName }).promise();
          configResults.details.diagnostics.push(`Confirmed access to existing S3 bucket: ${existingBucketName}`);
        } catch (bucketError: any) {
          configResults.details.diagnostics.push(`Warning: Cannot access existing S3 bucket ${existingBucketName}: ${bucketError.message || String(bucketError)}`);
          configResults.details.diagnostics.push(`Will attempt to use the original bucket name in the update anyway.`);
        }
      } else {
        configResults.details.diagnostics.push(`Warning: Existing trail does not have an S3 bucket name. Will use generated bucket name: ${bucketName}`);
      }
      
      // Update existing trail to integrate with CloudWatch Logs
      try {
        configResults.details.diagnostics.push(`Updating existing CloudTrail trail: ${siemTrail.Name}`);
        
        const updateParams: any = {
          Name: siemTrail.Name,
          IsMultiRegionTrail: true,
          IncludeGlobalServiceEvents: true,
          EnableLogFileValidation: true,
          CloudWatchLogsLogGroupArn: cloudTrailLogGroupArn,
          CloudWatchLogsRoleArn: roleArn
        };
        
        // Usar o bucket existente se disponível, caso contrário, usar o novo bucket
        if (existingBucketName) {
          updateParams.S3BucketName = existingBucketName;
        } else {
          // Verificar e criar o bucket se necessário
          try {
            await s3Client.headBucket({ Bucket: bucketName }).promise();
          } catch (bucketError) {
            configResults.details.diagnostics.push(`Creating new S3 bucket for trail update: ${bucketName}`);
            
            try {
              const createBucketParams: any = {
                Bucket: bucketName
              };
              
              if (credential.region !== 'us-east-1') {
                createBucketParams.CreateBucketConfiguration = {
                  LocationConstraint: credential.region
                };
              }
              
              await s3Client.createBucket(createBucketParams).promise();
              
              // Adicionar política ao bucket
              const bucketPolicy = {
                Version: '2012-10-17',
                Statement: [
                  {
                    Sid: 'AWSCloudTrailAclCheck',
                    Effect: 'Allow',
                    Principal: {
                      Service: 'cloudtrail.amazonaws.com'
                    },
                    Action: 's3:GetBucketAcl',
                    Resource: `arn:aws:s3:::${bucketName}`
                  },
                  {
                    Sid: 'AWSCloudTrailWrite',
                    Effect: 'Allow',
                    Principal: {
                      Service: 'cloudtrail.amazonaws.com'
                    },
                    Action: 's3:PutObject',
                    Resource: `arn:aws:s3:::${bucketName}/AWSLogs/${accountId}/*`,
                    Condition: {
                      StringEquals: {
                        's3:x-amz-acl': 'bucket-owner-full-control'
                      }
                    }
                  }
                ]
              };
              
              await s3Client.putBucketPolicy({
                Bucket: bucketName,
                Policy: JSON.stringify(bucketPolicy)
              }).promise();
              
              configResults.details.diagnostics.push(`Created and configured new S3 bucket: ${bucketName}`);
            } catch (createError: any) {
              configResults.details.diagnostics.push(`Error creating S3 bucket: ${createError.message}`);
            }
          }
          
          updateParams.S3BucketName = bucketName;
        }
        
        await cloudTrailClient.send(
          new UpdateTrailCommand(updateParams)
        );
        
        configResults.details.diagnostics.push(`Successfully updated trail: ${siemTrail.Name}`);
        
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
        
        // Verificar erros de entrega
        if (trailStatusResponse.LatestDeliveryError) {
          configResults.details.diagnostics.push(`Warning: CloudTrail delivery error: ${trailStatusResponse.LatestDeliveryError}`);
        }
        if (trailStatusResponse.LatestCloudWatchLogsDeliveryError) {
          configResults.details.diagnostics.push(`Warning: CloudWatch Logs delivery error: ${trailStatusResponse.LatestCloudWatchLogsDeliveryError}`);
        }
        
        configResults.details.cloudTrail = 'Updated existing trail';
      } catch (updateError) {
        configResults.details.diagnostics.push(`Error updating CloudTrail trail: ${updateError instanceof Error ? updateError.message : String(updateError)}`);
        if (updateError instanceof Error && updateError.stack) {
          configResults.details.diagnostics.push(`Error stack: ${updateError.stack.substring(0, 200)}`);
        }
      }
    }
    
    // Wait a bit to ensure CloudTrail configuration has time to propagate
    configResults.details.diagnostics.push('Waiting for CloudTrail configuration to propagate (5 seconds)...');
    await delay(5000);
    
    // Step 4: Set up a subscription filter to forward CloudTrail logs to the SIEM logs group
    configResults.details.diagnostics.push('Setting up log subscription to centralize CloudTrail logs in SIEM group...');
    
    try {
      // Verificar se ambos os grupos de log existem antes de configurar o filtro de assinatura
      configResults.details.diagnostics.push('Checking if required log groups exist for subscription filter...');
      
      // Obter uma lista atualizada dos grupos de log
      const updatedLogGroupsResponse = await logsClient.send(new DescribeLogGroupsCommand({}));
      const updatedLogGroupNames = updatedLogGroupsResponse.logGroups?.map(lg => lg.logGroupName) || [];
      configResults.details.diagnostics.push(`Verificados ${updatedLogGroupNames.length} grupos de log para consultas Insights`);
      
      const cloudTrailLogExists = updatedLogGroupNames.includes('/aws/cloudtrail/management-events') || 
                                 createdLogGroups.includes('/aws/cloudtrail/management-events');
      
      const siemLogExists = updatedLogGroupNames.includes('/aws/siem/security-events') || 
                           createdLogGroups.includes('/aws/siem/security-events');
      
      if (!cloudTrailLogExists) {
        configResults.details.diagnostics.push('CloudTrail log group does not exist, cannot set up subscription filter');
        configResults.details.diagnostics.push('Make sure the CloudTrail log group /aws/cloudtrail/management-events is created successfully');
      } else if (!siemLogExists) {
        configResults.details.diagnostics.push('SIEM security events log group does not exist, cannot set up subscription filter');
        configResults.details.diagnostics.push('Make sure the SIEM log group /aws/siem/security-events is created successfully');
      } else {
        configResults.details.diagnostics.push('Both required log groups exist, proceeding with subscription filter setup...');
        
        // Verificar se já existe um filtro de assinatura com este nome
        try {
          const filters = await logsClient.send(
            new DescribeMetricFiltersCommand({
              logGroupName: '/aws/cloudtrail/management-events'
            })
          );
          
          const existingFilterNames = filters.metricFilters?.map(f => f.filterName) || [];
          
          if (existingFilterNames.includes('ForwardToSIEM')) {
            configResults.details.diagnostics.push('A filter named ForwardToSIEM already exists, will attempt to update it');
          }
          
          // Create a subscription filter to forward CloudTrail logs to the main SIEM group
          configResults.details.diagnostics.push('Creating/updating subscription filter...');
          await logsClient.send(
            new PutSubscriptionFilterCommand({
              logGroupName: '/aws/cloudtrail/management-events',
              filterName: 'ForwardToSIEM',
              filterPattern: '', // Empty pattern to forward all logs
              destinationArn: `arn:aws:logs:${credential.region}:${accountId}:log-group:/aws/siem/security-events:*`
            })
          );
          configResults.details.diagnostics.push('Successfully set up subscription filter to forward CloudTrail logs to SIEM group');
        } catch (filterError) {
          configResults.details.diagnostics.push(`Error checking existing filters: ${filterError instanceof Error ? filterError.message : String(filterError)}`);
          
          // Tentar criar o filtro de qualquer forma
          configResults.details.diagnostics.push('Attempting to create subscription filter directly...');
          await logsClient.send(
            new PutSubscriptionFilterCommand({
              logGroupName: '/aws/cloudtrail/management-events',
              filterName: 'ForwardToSIEM',
              filterPattern: '', // Empty pattern to forward all logs
              destinationArn: `arn:aws:logs:${credential.region}:${accountId}:log-group:/aws/siem/security-events:*`
            })
          );
          configResults.details.diagnostics.push('Successfully set up subscription filter to forward CloudTrail logs to SIEM group');
        }
      }
    } catch (subError) {
      configResults.details.diagnostics.push(`Error setting up subscription filter: ${subError instanceof Error ? subError.message : String(subError)}`);
      if (subError instanceof Error) {
        configResults.details.diagnostics.push(`Error type: ${subError.name}, Stack: ${subError.stack?.substring(0, 200)}`);
      }
      configResults.details.diagnostics.push('This may be due to permissions issues or log destination configuration requirements');
      configResults.details.diagnostics.push('Continuing with other configurations...');
    }
    
    // Step 5: Configure CloudWatch Logs Insights queries
    configResults.details.diagnostics.push('Configurando consultas CloudWatch Logs Insights predefinidas...');
    configResults.details.diagnostics.push('O CloudWatch Logs Insights é a solução recomendada para análise de logs segurança no AWS');
    configResults.details.insightsQueries = 0;
    
    try {
      // Obter uma lista atualizada dos grupos de log
      const updatedLogGroupsResponse = await logsClient.send(new DescribeLogGroupsCommand({}));
      const updatedLogGroupNames = updatedLogGroupsResponse.logGroups?.map(lg => lg.logGroupName) || [];
      configResults.details.diagnostics.push(`Verificados ${updatedLogGroupNames.length} grupos de log para consultas Insights`);
      
      // Verificar primeiro se o grupo de log do CloudTrail existe
      const cloudTrailLogExists = updatedLogGroupNames.includes('/aws/cloudtrail/management-events') || 
                                 createdLogGroups.includes('/aws/cloudtrail/management-events');
      
      if (!cloudTrailLogExists) {
        configResults.details.diagnostics.push('O grupo de log do CloudTrail não existe, não é possível configurar consultas do Logs Insights');
      } else {
        configResults.details.diagnostics.push('O grupo de log do CloudTrail existe, configurando consultas do Logs Insights');
        
        // Armazenar as consultas pré-configuradas em um objeto para referência
        const insightsQueriesData = [];
        
        // Aqui listaremos todas as consultas predefinidas como parte do resultado
        configResults.details.insightsQueriesList = DEFAULT_INSIGHTS_QUERIES.map(q => ({
          name: q.name,
          description: q.description,
          logGroups: q.logGroups
        }));
        
        for (const query of DEFAULT_INSIGHTS_QUERIES) {
          try {
            // Verificar se todos os grupos de log da consulta existem
            const allLogGroupsExist = query.logGroups.every(logGroup => 
              updatedLogGroupNames.includes(logGroup) || createdLogGroups.includes(logGroup)
            );
            
            if (!allLogGroupsExist) {
              configResults.details.diagnostics.push(`Pulando consulta "${query.name}" pois nem todos os grupos de log necessários existem`);
              continue;
            }
            
            // Calcular o intervalo de tempo
            const now = new Date();
            const startTime = new Date(now.getTime() - query.timeRange);
            
            configResults.details.diagnostics.push(`Configurando consulta Insights: ${query.name}`);
            
            // Iniciar uma consulta para testar e obter o ID da consulta
            try {
              const queryResponse = await cwLogsClient.startQuery({
                logGroupNames: query.logGroups,
                startTime: Math.floor(startTime.getTime() / 1000),
                endTime: Math.floor(now.getTime() / 1000),
                queryString: query.queryString,
                limit: 10 // Limite para consulta de teste
              }).promise();
              
              if (queryResponse.queryId) {
                // Salvar os detalhes da consulta para referência futura
                insightsQueriesData.push({
                  id: queryResponse.queryId,
                  name: query.name,
                  description: query.description,
                  logGroups: query.logGroups,
                  queryString: query.queryString,
                  timeRange: query.timeRange
                });
                
                configResults.details.insightsQueries++;
                configResults.details.diagnostics.push(`Consulta CloudWatch Logs Insights configurada: ${query.name}`);
                
                // Verificar o status da consulta
                await delay(2000); // Aguardar um pouco para que a consulta inicie
                
                try {
                  const queryResult = await cwLogsClient.getQueryResults({
                    queryId: queryResponse.queryId
                  }).promise();
                  
                  configResults.details.diagnostics.push(`Status da consulta ${query.name}: ${queryResult.status}`);
                  
                  // Se a consulta estiver em andamento ou terminada, podemos parar
                  if (queryResult.status === 'Running' || queryResult.status === 'Complete') {
                    configResults.details.diagnostics.push(`Consulta ${query.name} está funcionando corretamente`);
                  }
                } catch (resultError: any) {
                  configResults.details.diagnostics.push(`Não foi possível verificar o status da consulta ${query.name}: ${resultError.message}`);
                }
              }
              
              // Aguardar um momento para não atingir limites de taxa da API
              await delay(500);
            } catch (startError: any) {
              configResults.details.diagnostics.push(`Erro ao iniciar consulta "${query.name}": ${startError.message}`);
            }
          } catch (queryError) {
            configResults.details.diagnostics.push(`Erro ao configurar consulta "${query.name}": ${queryError instanceof Error ? queryError.message : String(queryError)}`);
          }
        }
        
        // Salvar as consultas configuradas
        configResults.details.insightsQueriesData = insightsQueriesData;
        configResults.details.diagnostics.push(`Total de consultas CloudWatch Logs Insights configuradas: ${configResults.details.insightsQueries}`);
        configResults.details.diagnostics.push(`As consultas podem ser acessadas através da API /api/aws/cloudwatch/insights?credentialId=${credentialId}`);
        configResults.details.diagnostics.push(`Para executar uma consulta, use o método POST em /api/aws/cloudwatch/insights com o corpo contendo a consulta e o credentialId`);
      }
    } catch (insightsError) {
      configResults.details.diagnostics.push(`Erro ao configurar consultas CloudWatch Logs Insights: ${insightsError instanceof Error ? insightsError.message : String(insightsError)}`);
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
    
    // Atualizar a mensagem final para incluir informações sobre as consultas Logs Insights
    configResults.message = 'SIEM environment successfully configured';
    if (configResults.details.insightsQueries > 0) {
      configResults.message += ` with ${configResults.details.insightsQueries} CloudWatch Logs Insights queries`;
    }
    configResults.details.diagnostics.push('Configuration complete!');
    configResults.details.diagnostics.push('Agora você pode usar o CloudWatch Logs Insights para analisar os logs de segurança');
    
    return NextResponse.json(configResults);
    
  } catch (error) {
    console.error('Error setting up SIEM environment:', error);
    configResults.success = false;
    configResults.message = `Failed to set up SIEM environment: ${error instanceof Error ? error.message : String(error)}`;
    configResults.details.diagnostics.push(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
    
    return NextResponse.json(configResults, { status: 500 });
  }
} 