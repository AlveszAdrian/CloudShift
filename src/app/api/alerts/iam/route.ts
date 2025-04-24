import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { IAMSecurityService } from '@/lib/aws-services/iam-security-service';
import * as alertService from '@/lib/alert-service';
import { prisma } from '@/lib/prisma';
import { SecurityIssue } from '@/lib/aws-service';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  const searchParams = request.nextUrl.searchParams;
  const credentialId = searchParams.get('credentialId');
  
  if (!credentialId) {
    return NextResponse.json({ error: 'credentialId é obrigatório' }, { status: 400 });
  }
  
  try {
    // Buscar alertas específicos do IAM no banco de dados
    const alerts = await prisma.alert.findMany({
      where: {
        resourceType: {
          in: ['IAMUser', 'IAMAccessKey', 'SecretManagerSecret', 'IAMPolicy', 'IAMGroup', 'IAMPasswordPolicy']
        },
        status: searchParams.get('status') || undefined,
        severity: searchParams.get('severity') || undefined
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Erro ao buscar alertas do IAM:', error);
    return NextResponse.json({ error: 'Erro ao buscar alertas do IAM' }, { status: 500 });
  }
}

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
    
    console.log('Iniciando verificação de compliance para IAM...');
    
    // Realizar verificação de segurança do IAM
    const iamSecurityService = new IAMSecurityService({
      id: credential.id,
      name: credential.name,
      region: credential.region,
      accessKeyId: credential.accessKeyId,
      secretAccessKey: credential.secretKey // Mapeando secretKey para secretAccessKey
    });
    const securityIssues = await iamSecurityService.scanSecurityIssues();
    
    console.log(`Encontrados ${securityIssues.length} problemas de compliance do IAM`);
    
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
      
      // Criar um mapa para verificação rápida
      existingAlerts = alerts.reduce((acc, alert) => {
        const key = `${alert.resourceId}:${alert.title}`;
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      console.log(`Encontrados ${Object.keys(existingAlerts).length} alertas existentes que serão ignorados`);
    }
    
    // Converter problemas de segurança em alertas
    const createdAlerts = [];
    const skippedAlerts = [];
    
    for (const issue of securityIssues) {
      // Criar uma chave única para verificar se o alerta já existe
      const alertKey = `${issue.resourceId}:${issue.title}`;
      
      // Pular se for para ignorar existentes e o alerta já existir
      if (skipExisting && existingAlerts[alertKey]) {
        skippedAlerts.push(alertKey);
        continue;
      }
      
      // Mapear o tipo de recurso para os tipos reconhecidos pelo sistema de alertas
      let resourceType = issue.resourceType as any;
      
      // Garantir que o tipo de severidade seja compatível
      let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = issue.severity as any;
      
      const securityIssue: SecurityIssue = {
        title: issue.title,
        description: issue.description,
        severity: severity,
        resourceId: issue.resourceId,
        resourceType: resourceType
      };
      
      const alert = await alertService.createAlertFromSecurityIssue(securityIssue, credentialId);
      createdAlerts.push(alert);
    }
    
    // Adicionar informações de diagnóstico à resposta
    const issuesByType = securityIssues.reduce((acc, issue) => {
      acc[issue.resourceType] = (acc[issue.resourceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const issuesBySeverity = securityIssues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({ 
      message: `Verificação de compliance concluída. Encontrados ${securityIssues.length} problemas de segurança.`,
      alertsCreated: createdAlerts.length,
      alertsSkipped: skippedAlerts.length,
      statistics: {
        totalIssues: securityIssues.length,
        byType: issuesByType,
        bySeverity: issuesBySeverity
      }
    });
  } catch (error) {
    console.error('Erro ao verificar segurança do IAM:', error);
    
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
      error: 'Erro ao verificar segurança do IAM',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 