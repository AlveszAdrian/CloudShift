import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { VulnerabilityService } from '@/lib/aws-services/vulnerability-service';
import { IAMSecurityService } from '@/lib/aws-services/iam-security-service';
import * as alertService from '@/lib/alert-service';
import { prisma } from '@/lib/prisma';
import { SecurityIssue } from '@/lib/aws-service';
import AWS from 'aws-sdk';

// Função para escaneamento unificado em background
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  const body = await request.json();
  const { credentialId, skipExisting = false } = body;
  
  if (!credentialId) {
    return NextResponse.json({ error: 'credentialId é obrigatório' }, { status: 400 });
  }
  
  try {
    // Buscar credencial
    const credential = await prisma.awsCredential.findUnique({
      where: { id: credentialId }
    });
    
    if (!credential) {
      return NextResponse.json({ error: 'Credencial não encontrada' }, { status: 404 });
    }
    
    // Validar se a credencial é válida testando uma operação simples na AWS
    try {
      const sts = new AWS.STS({
        region: credential.region,
        credentials: {
          accessKeyId: credential.accessKeyId,
          secretAccessKey: credential.secretKey
        }
      });
      
      // Tentar fazer uma operação GetCallerIdentity para validar as credenciais
      await sts.getCallerIdentity().promise();
    } catch (awsError) {
      console.error('Erro ao validar credenciais AWS:', awsError);
      return NextResponse.json({ 
        error: 'Credenciais AWS inválidas ou com permissões insuficientes',
        details: awsError instanceof Error ? awsError.message : String(awsError)
      }, { status: 401 });
    }
    
    console.log('Iniciando verificação unificada de segurança em background...');
    
    // Iniciar processo de scan em background (não esperamos a conclusão)
    // Usamos Promise.allSettled para garantir que o processamento continue mesmo que uma parte falhe
    const scanPromise = Promise.allSettled([
      // Scan de IAM
      (async () => {
        try {
          // Realizar verificação de segurança do IAM
          console.log('Iniciando verificação de IAM em background...');
          
          const iamSecurityService = new IAMSecurityService({
            id: credential.id,
            name: credential.name,
            region: credential.region,
            accessKeyId: credential.accessKeyId,
            secretAccessKey: credential.secretKey
          });
          
          const securityIssues = await iamSecurityService.scanSecurityIssues();
          console.log(`Encontrados ${securityIssues.length} problemas de IAM em background`);
          
          // Se skipExisting for true, buscar alertas existentes para evitar duplicações
          let existingAlerts: Record<string, boolean> = {};
          if (skipExisting) {
            const alerts = await prisma.alert.findMany({
              where: {
                resourceType: {
                  in: ['IAMUser', 'IAMAccessKey', 'SecretManagerSecret', 'IAMPolicy', 'IAMGroup', 'IAMPasswordPolicy']
                },
                credentialId: credentialId
              },
              select: {
                resourceId: true,
                title: true
              }
            });
            
            existingAlerts = alerts.reduce((acc, alert) => {
              const key = `${alert.resourceId}:${alert.title}`;
              acc[key] = true;
              return acc;
            }, {} as Record<string, boolean>);
          }
          
          // Criar alertas para cada problema encontrado
          const createdAlerts = [];
          const skippedAlerts = [];
          
          for (const issue of securityIssues) {
            // Verificar duplicação
            const alertKey = `${issue.resourceId}:${issue.title}`;
            if (skipExisting && existingAlerts[alertKey]) {
              skippedAlerts.push(alertKey);
              continue;
            }
            
            // Mapear severidade
            let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = issue.severity as any;
            
            const securityIssue: SecurityIssue = {
              title: issue.title,
              description: issue.description,
              severity: severity,
              resourceId: issue.resourceId,
              resourceType: issue.resourceType as any
            };
            
            const alert = await alertService.createAlertFromSecurityIssue(securityIssue, credentialId);
            createdAlerts.push(alert);
          }
          
          return {
            service: 'IAM',
            totalIssues: securityIssues.length,
            alertsCreated: createdAlerts.length,
            alertsSkipped: skippedAlerts.length
          };
        } catch (error) {
          console.error('Erro no scan de IAM em background:', error);
          return { 
            service: 'IAM',
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            status: 'failed' 
          };
        }
      })(),
      
      // Scan de EC2
      (async () => {
        try {
          // Realizar verificação de segurança do EC2
          console.log('Iniciando verificação de EC2 em background...');
          
          const vulnerabilityService = new VulnerabilityService(credentialId);
          const vulnerabilities = await vulnerabilityService.scanVulnerabilities();
          
          // Filtrar apenas vulnerabilidades relacionadas ao EC2
          const ec2Vulnerabilities = vulnerabilities.filter(v => 
            v.resourceType === 'EC2Instance' || 
            v.resourceType === 'SecurityGroup' ||
            v.resourceType === 'Volume' ||
            v.resourceType.includes('VPC') ||
            v.resourceType.includes('Network') ||
            v.resourceType === 'NetworkACL' ||
            v.resourceType.includes('ACL') ||
            v.resourceType === 'ElasticIP' ||
            v.resourceType === 'RouteTable' ||
            v.resourceType === 'Subnet'
          );
          
          console.log(`Encontradas ${ec2Vulnerabilities.length} vulnerabilidades de EC2 em background`);
          
          // Se skipExisting for true, buscar alertas existentes para evitar duplicações
          let existingAlerts: Record<string, boolean> = {};
          if (skipExisting) {
            const alerts = await prisma.alert.findMany({
              where: {
                resourceType: {
                  in: [
                    'EC2Instance', 'SecurityGroup', 'Volume', 'VPC', 
                    'NetworkInterface', 'ElasticIP', 'RouteTable', 'Subnet',
                    'NetworkACL'
                  ]
                },
                credentialId: credentialId
              },
              select: {
                resourceId: true,
                title: true
              }
            });
            
            existingAlerts = alerts.reduce((acc, alert) => {
              const key = `${alert.resourceId}:${alert.title}`;
              acc[key] = true;
              return acc;
            }, {} as Record<string, boolean>);
          }
          
          // Criar alertas para cada vulnerabilidade encontrada
          const createdAlerts = [];
          const skippedAlerts = [];
          
          for (const vulnerability of ec2Vulnerabilities) {
            // Verificar duplicação
            const alertKey = `${vulnerability.resourceId}:${vulnerability.title}`;
            if (skipExisting && existingAlerts[alertKey]) {
              skippedAlerts.push(alertKey);
              continue;
            }
            
            // Mapear severidade
            let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
            switch (vulnerability.severity) {
              case 'critical':
                severity = 'CRITICAL';
                break;
              case 'high':
                severity = 'HIGH';
                break;
              case 'medium':
                severity = 'MEDIUM';
                break;
              case 'low':
                severity = 'LOW';
                break;
              default:
                severity = 'LOW';
            }
            
            const securityIssue: SecurityIssue = {
              title: vulnerability.title,
              description: vulnerability.description,
              severity: severity,
              resourceId: vulnerability.resourceId,
              resourceType: vulnerability.resourceType as any
            };
            
            const alert = await alertService.createAlertFromSecurityIssue(securityIssue, credentialId);
            createdAlerts.push(alert);
          }
          
          return {
            service: 'EC2',
            totalVulnerabilities: ec2Vulnerabilities.length,
            alertsCreated: createdAlerts.length,
            alertsSkipped: skippedAlerts.length
          };
        } catch (error) {
          console.error('Erro no scan de EC2 em background:', error);
          return { 
            service: 'EC2',
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            status: 'failed' 
          };
        }
      })()
    ]);
    
    // Não aguardamos a conclusão antes de responder
    // Apenas retornamos que o processo foi iniciado
    
    // Registrar webhook para notificar sobre a conclusão (opcional para futura implementação)
    // webhookService.registerScanCompletion(scanId, userId);
    
    return NextResponse.json({
      message: 'Verificação de segurança unificada iniciada em segundo plano',
      status: 'processing',
      scanId: Date.now().toString(), // ID único para o scan (pode ser substituído por um ID mais robusto)
      credentialId
    });
    
  } catch (error) {
    console.error('Erro ao iniciar verificação de segurança unificada:', error);
    
    // Tratar erros comuns da AWS
    if (error instanceof Error) {
      if (error.name === 'CredentialsProviderError') {
        return NextResponse.json({ error: 'Credenciais AWS inválidas' }, { status: 401 });
      }
      if (error.name === 'AccessDeniedException') {
        return NextResponse.json({ error: 'Acesso negado. Verifique as permissões da credencial AWS' }, { status: 403 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Erro ao iniciar verificação de segurança unificada',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 