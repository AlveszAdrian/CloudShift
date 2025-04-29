import { InsightsRule } from "@/types/siem";

export const PRESET_RULES: InsightsRule[] = [
  {
    name: "Alta Taxa de Erros em Lambda",
    query: `filter @type = "REPORT" | filter @message like /Task timed out/ or @message like /Error/ | stats count(*) as errorCount by @logStream, @message | sort errorCount desc`,
    logGroup: "/aws/lambda/all",
    severity: "high",
    description: "Detecta funções Lambda com alta taxa de erros ou timeouts",
    isActive: true
  },
  {
    name: "Acesso Root AWS",
    query: `filter eventName like "AssumeRole" and userIdentity.type = "Root" | stats count(*) as rootAccessCount by eventName, sourceIPAddress, userAgent | sort rootAccessCount desc`,
    logGroup: "CloudTrail/Management",
    severity: "critical",
    description: "Monitora acessos usando a conta root da AWS",
    isActive: true
  },
  {
    name: "Alterações em Security Groups",
    query: `filter eventName like "AuthorizeSecurityGroup" or eventName like "RevokeSecurityGroup" | stats count(*) as changes by eventName, requestParameters.groupId, sourceIPAddress | sort changes desc`,
    logGroup: "CloudTrail/Management",
    severity: "high",
    description: "Detecta alterações em regras de Security Groups",
    isActive: true
  },
  {
    name: "Instâncias EC2 Paradas",
    query: `filter eventName = "StopInstances" | stats count(*) as stopCount by requestParameters.instancesSet.items.0.instanceId, sourceIPAddress | sort stopCount desc`,
    logGroup: "CloudTrail/Management",
    severity: "medium",
    description: "Monitora instâncias EC2 que foram paradas",
    isActive: true
  },
  {
    name: "Alta Utilização de CPU",
    query: `filter @type = "REPORT" | filter @message like /CPU: / | parse @message "CPU: *%" as cpuUsage | filter cpuUsage > 80 | stats count(*) as highCpuCount by @logStream | sort highCpuCount desc`,
    logGroup: "/aws/lambda/all",
    severity: "medium",
    description: "Detecta funções com alta utilização de CPU",
    isActive: true
  },
  {
    name: "Falhas de Autenticação",
    query: `filter eventName = "ConsoleLogin" and errorMessage like "Failed authentication" | stats count(*) as failedLogins by userIdentity.userName, sourceIPAddress | sort failedLogins desc`,
    logGroup: "CloudTrail/Management",
    severity: "high",
    description: "Monitora tentativas falhas de login no console",
    isActive: true
  },
  {
    name: "Alterações em IAM",
    query: `filter eventName like "Create" or eventName like "Delete" or eventName like "Update" or eventName like "Put" | filter eventSource = "iam.amazonaws.com" | stats count(*) as iamChanges by eventName, userIdentity.userName, sourceIPAddress | sort iamChanges desc`,
    logGroup: "CloudTrail/Management",
    severity: "critical",
    description: "Detecta alterações em políticas e usuários IAM",
    isActive: true
  },
  {
    name: "Alta Latência em API Gateway",
    query: `filter @type = "REPORT" | filter @message like /Duration: / | parse @message "Duration: * ms" as duration | filter duration > 1000 | stats count(*) as highLatencyCount by @logStream | sort highLatencyCount desc`,
    logGroup: "/aws/apigateway/all",
    severity: "medium",
    description: "Monitora endpoints com alta latência",
    isActive: true
  },
  {
    name: "Alterações em Buckets S3",
    query: `filter eventName like "CreateBucket" or eventName like "DeleteBucket" or eventName like "PutBucketPolicy" | stats count(*) as bucketChanges by eventName, requestParameters.bucketName, sourceIPAddress | sort bucketChanges desc`,
    logGroup: "CloudTrail/Management",
    severity: "high",
    description: "Detecta alterações em configurações de buckets S3",
    isActive: true
  },
  {
    name: "Timeouts em Lambda",
    query: `filter @type = "REPORT" | filter @message like /Task timed out/ | stats count(*) as timeoutCount by @logStream | sort timeoutCount desc`,
    logGroup: "/aws/lambda/all",
    severity: "high",
    description: "Monitora funções Lambda que estão sofrendo timeouts",
    isActive: true
  },
  {
    id: "failed-console-logins",
    name: "Tentativas de Login Falhas no Console AWS",
    query: 'filter eventName = "ConsoleLogin" and errorMessage like "Failed authentication" | stats count(*) as failedLogins by userIdentity.userName, sourceIPAddress | sort failedLogins desc',
    logGroup: "/aws/cloudtrail/management-events",
    severity: "high",
    description: "Monitora tentativas de login falhas no console AWS, agrupando por usuário e IP de origem",
    isActive: true
  }
]; 