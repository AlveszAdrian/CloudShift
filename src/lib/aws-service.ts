import { prisma } from './prisma';
import { AwsClientManager } from './aws-client';
import { AwsCredentialRepository } from './repositories/aws-credential-repository';
import { EC2Service } from './services/ec2-service';
import { IAMService } from './services/iam-service';
import { S3Service } from './services/s3-service';
import { SecurityService } from './services/security-service';

export type AwsResourceType = 'EC2' | 'S3' | 'RDS' | 'CloudFront' | 'IAM';

export type SecurityIssue = {
  resourceId: string;
  resourceType: AwsResourceType;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
};

export interface ResourceMetrics {
  resourceId: string;
  resourceType: AwsResourceType;
  metrics: {
    name: string;
    value: number;
    unit: string;
  }[];
}

const awsCredentialRepository = new AwsCredentialRepository();

const ec2Service = new EC2Service();
const iamService = new IAMService();
const s3Service = new S3Service();
const securityService = new SecurityService();

export async function getAwsCredentials(userId: string) {
  return awsCredentialRepository.findByUserId(userId);
}

export async function getEc2Instances(credentialId: string) {
  return ec2Service.getInstances(credentialId);
}

export async function getS3Buckets(credentialId: string) {
  return s3Service.getBuckets(credentialId);
}

export async function getSecurityIssues(credentialId: string): Promise<SecurityIssue[]> {
  return securityService.getSecurityIssues(credentialId);
}

export async function getIamUsers(credentialId: string) {
  return iamService.getUsers(credentialId);
}

export async function getDashboardData(credentialId: string) {
  if (!credentialId) {
    throw new Error('ID de credencial é obrigatório');
  }

  console.log(`Buscando dados do dashboard para credencial: ${credentialId}`);
  const credential = await prisma.awsCredential.findUnique({
    where: { id: credentialId }
  });

  if (!credential) {
    throw new Error('Credencial não encontrada');
  }

  try {
    // Buscar dados de recursos em paralelo
    const [ec2Data, s3Data, iamUsers, securityIssues] = await Promise.all([
      getEc2Instances(credentialId).catch(err => {
        console.error('Erro ao buscar instâncias EC2:', err);
        return [];
      }),
      getS3Buckets(credentialId).catch(err => {
        console.error('Erro ao buscar buckets S3:', err);
        return [];
      }),
      getIamUsers(credentialId).catch(err => {
        console.error('Erro ao buscar usuários IAM:', err);
        return [];
      }),
      getSecurityIssues(credentialId).catch(err => {
        console.error('Erro ao buscar problemas de segurança:', err);
        return [];
      })
    ]);

    // Contagem de usuários IAM de alto risco
    const highRiskUsers = iamUsers.filter(user => user.riskLevel === 'high').length;
    const mediumRiskUsers = iamUsers.filter(user => user.riskLevel === 'medium').length;
    const lowRiskUsers = iamUsers.filter(user => user.riskLevel === 'low').length;
    
    // Classificação de problemas de segurança
    const criticalIssues = securityIssues.filter(issue => issue.severity === 'CRITICAL').length;
    const highIssues = securityIssues.filter(issue => issue.severity === 'HIGH').length;
    const mediumIssues = securityIssues.filter(issue => issue.severity === 'MEDIUM').length;
    const lowIssues = securityIssues.filter(issue => issue.severity === 'LOW').length;
    
    // Cálculo de score de segurança
    // Uma fórmula simples baseada em problemas e usuários de risco
    const totalIssues = criticalIssues * 10 + highIssues * 5 + mediumIssues * 2 + lowIssues;
    const userRiskFactor = highRiskUsers * 5 + mediumRiskUsers * 2 + lowRiskUsers * 0.5;
    
    // Score começa em 100 e reduz com base nos problemas
    const baseScore = 100;
    const maxPenalty = 80; // Permitir que o score vá até 20 no mínimo
    const issuePenalty = Math.min(maxPenalty, totalIssues + userRiskFactor);
    const securityScore = Math.round(baseScore - issuePenalty);
    
    // Criar instância do cliente AWS para acessar outros serviços
    const awsClient = AwsClientManager.getInstance(credential);
    
    // Tentar obter dados de recursos adicionais
    let rdsInstances = [];
    try {
      const rdsClient = awsClient.getRDSClient();
      const rdsResult = await rdsClient.describeDBInstances().promise();
      rdsInstances = rdsResult.DBInstances || [];
    } catch (err) {
      console.error('Erro ao buscar instâncias RDS:', err);
    }
    
    // Lambda não está disponível no AwsClientManager, então vamos pular
    let lambdaFunctions = [];
    /* Desabilitado por enquanto
    try {
      const lambdaClient = awsClient.getLambdaClient();
      const lambdaResult = await lambdaClient.listFunctions().promise();
      lambdaFunctions = lambdaResult.Functions || [];
    } catch (err) {
      console.error('Erro ao buscar funções Lambda:', err);
    }
    */
    
    let cloudFrontDistributions = [];
    try {
      const cloudFrontClient = awsClient.getCloudFrontClient();
      const cfResult = await cloudFrontClient.listDistributions().promise();
      cloudFrontDistributions = cfResult.DistributionList?.Items || [];
    } catch (err) {
      console.error('Erro ao buscar distribuições CloudFront:', err);
    }
    
    return {
      resources: {
        ec2: ec2Data.length,
        s3: s3Data.length,
        rds: rdsInstances.length,
        lambda: lambdaFunctions.length,
        cloudfront: cloudFrontDistributions.length
      },
      security: {
        score: securityScore,
        issues: {
          critical: criticalIssues,
          high: highIssues,
          medium: mediumIssues,
          low: lowIssues
        },
        highRiskUsers,
        mediumRiskUsers,
        lowRiskUsers
      },
      compliance: {
        // Cálculo simplificado para compliance (exemplo)
        pci: Math.round(securityScore * 0.9), // 90% do security score
        hipaa: Math.round(securityScore * 0.85),
        gdpr: Math.round(securityScore * 0.95),
        nist: Math.round(securityScore * 0.8)
      }
    };
  } catch (error: unknown) {
    console.error('Erro ao buscar dados do dashboard:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Falha ao buscar dados: ${errorMessage}`);
  }
}

// Função para obter instância do serviço IAM
export async function getIAMService(credentialId: string) {
  const credential = await prisma.awsCredential.findUnique({
    where: { id: credentialId }
  });

  if (!credential) {
    throw new Error('Credencial não encontrada');
  }

  return new IAMService(credential);
}

// Funções de gerenciamento avançado de IAM

// Usuários
export async function listIAMUsers(credentialId: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.listUsers();
}

export async function createIAMUser(credentialId: string, username: string, createConsoleAccess: boolean = false, password?: string) {
  const iamService = await getIAMService(credentialId);
  const user = await iamService.createUser(username);
  
  if (createConsoleAccess && password) {
    await iamService.createLoginProfile(username, password);
  }
  
  return user;
}

export async function deleteIAMUser(credentialId: string, username: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.deleteUser(username);
}

// Grupos
export async function listIAMGroups(credentialId: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.listGroups();
}

export async function createIAMGroup(credentialId: string, groupName: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.createGroup(groupName);
}

export async function deleteIAMGroup(credentialId: string, groupName: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.deleteGroup(groupName);
}

export async function addUserToGroup(credentialId: string, username: string, groupName: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.addUserToGroup(username, groupName);
}

export async function removeUserFromGroup(credentialId: string, username: string, groupName: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.removeUserFromGroup(username, groupName);
}

export async function listGroupsForUser(credentialId: string, username: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.listGroupsForUser(username);
}

export async function listUsersInGroup(credentialId: string, groupName: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.listUsersInGroup(groupName);
}

// Roles
export async function listIAMRoles(credentialId: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.listRoles();
}

export async function createIAMRole(credentialId: string, roleName: string, assumeRolePolicyDocument: string, description?: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.createRole(roleName, assumeRolePolicyDocument, description);
}

export async function deleteIAMRole(credentialId: string, roleName: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.deleteRole(roleName);
}

// Políticas
export async function listIAMPolicies(credentialId: string, onlyAttached: boolean = false) {
  const iamService = await getIAMService(credentialId);
  return iamService.listPolicies(onlyAttached);
}

export async function createIAMPolicy(credentialId: string, policyName: string, policyDocument: string, description?: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.createPolicy(policyName, policyDocument, description);
}

export async function deleteIAMPolicy(credentialId: string, policyArn: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.deletePolicy(policyArn);
}

export async function getPolicyDetails(credentialId: string, policyArn: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.getPolicyDetails(policyArn);
}

// Gerenciar políticas anexadas
export async function attachPolicyToUser(credentialId: string, username: string, policyArn: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.attachUserPolicy(username, policyArn);
}

export async function detachPolicyFromUser(credentialId: string, username: string, policyArn: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.detachUserPolicy(username, policyArn);
}

export async function attachPolicyToGroup(credentialId: string, groupName: string, policyArn: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.attachGroupPolicy(groupName, policyArn);
}

export async function detachPolicyFromGroup(credentialId: string, groupName: string, policyArn: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.detachGroupPolicy(groupName, policyArn);
}

export async function attachPolicyToRole(credentialId: string, roleName: string, policyArn: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.attachRolePolicy(roleName, policyArn);
}

export async function detachPolicyFromRole(credentialId: string, roleName: string, policyArn: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.detachRolePolicy(roleName, policyArn);
}

// Listar políticas anexadas
export async function listAttachedUserPolicies(credentialId: string, username: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.listAttachedUserPolicies(username);
}

export async function listAttachedGroupPolicies(credentialId: string, groupName: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.listAttachedGroupPolicies(groupName);
}

export async function listAttachedRolePolicies(credentialId: string, roleName: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.listAttachedRolePolicies(roleName);
}

// Simulação de políticas e auditoria
export async function simulatePrincipalPolicy(credentialId: string, principalArn: string, actionNames: string[], resourceArns?: string[]) {
  const iamService = await getIAMService(credentialId);
  return iamService.simulatePrincipalPolicy(principalArn, actionNames, resourceArns);
}

export async function getAccountAuthorizationDetails(credentialId: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.getAccountAuthorizationDetails();
}

export async function generateCredentialReport(credentialId: string) {
  const iamService = await getIAMService(credentialId);
  return iamService.generateCredentialReport();
} 