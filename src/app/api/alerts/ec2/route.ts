import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { VulnerabilityService } from '@/lib/aws-services/vulnerability-service';
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
    // Buscar alertas específicos do EC2 no banco de dados
    const alerts = await prisma.alert.findMany({
      where: {
        resourceType: {
          in: ['EC2Instance', 'SecurityGroup', 'Volume', 'VPC', 'NetworkInterface', 'ElasticIP', 'RouteTable', 'Subnet']
        },
        credentialId: credentialId,
        status: searchParams.get('status') || undefined,
        severity: searchParams.get('severity') || undefined
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        credential: {
          select: {
            name: true
          }
        }
      }
    });
    
    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Erro ao buscar alertas do EC2:', error);
    return NextResponse.json({ error: 'Erro ao buscar alertas do EC2' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  const body = await request.json();
  const { credentialId } = body;
  
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
    
    console.log('Iniciando verificação de vulnerabilidades para EC2...');
    
    // Realizar verificação de segurança do EC2
    const vulnerabilityService = new VulnerabilityService(credentialId);
    
    // Escanear todas as vulnerabilidades
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
    
    console.log(`Encontradas ${ec2Vulnerabilities.length} vulnerabilidades de EC2 e rede`);
    
    // Converter vulnerabilidades em alertas
    const createdAlerts = [];
    for (const vulnerability of ec2Vulnerabilities) {
      // Mapear severidade para o formato correto
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
      
      // Log para depuração
      console.log("Alerta criado:", alert.id, alert.title, alert.status);
    }
    
    // Adicionar informações de diagnóstico à resposta
    const vulnerabilitiesByType = ec2Vulnerabilities.reduce((acc, vuln) => {
      acc[vuln.resourceType] = (acc[vuln.resourceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const vulnerabilitiesBySeverity = ec2Vulnerabilities.reduce((acc, vuln) => {
      acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({ 
      message: `Verificação de segurança concluída. Encontradas ${ec2Vulnerabilities.length} vulnerabilidades em recursos de EC2 e rede.`,
      alertsCreated: createdAlerts.length,
      statistics: {
        totalVulnerabilities: ec2Vulnerabilities.length,
        byType: vulnerabilitiesByType,
        bySeverity: vulnerabilitiesBySeverity
      }
    });
  } catch (error) {
    console.error('Erro ao verificar segurança do EC2:', error);
    
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
      error: 'Erro ao verificar segurança do EC2',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 