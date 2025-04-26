import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import AWS from 'aws-sdk';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  try {
    // Obter ID da credencial
    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get('credentialId');
    
    if (!credentialId) {
      return NextResponse.json({ error: 'ID da credencial é obrigatório' }, { status: 400 });
    }
    
    // Buscar a credencial no banco de dados
    const credential = await prisma.awsCredential.findUnique({
      where: {
        id: credentialId,
        userId: session.user.id
      }
    });
    
    if (!credential) {
      return NextResponse.json({ error: 'Credencial não encontrada' }, { status: 404 });
    }
    
    // Configurar AWS SDK com estas credenciais
    const awsConfig = {
      accessKeyId: credential.accessKeyId,
      secretAccessKey: credential.secretKey,
      region: credential.region
    };
    
    // Objeto para armazenar resultados
    const serviceResults: Record<string, { connected: boolean, error?: string }> = {};
    let accountId = null;
    
    // 1. Testar STS para validação básica da credencial
    try {
      const sts = new AWS.STS(awsConfig);
      const identity = await sts.getCallerIdentity().promise();
      accountId = identity.Account;
      serviceResults['STS'] = { connected: true };
    } catch (error) {
      serviceResults['STS'] = { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
    
    // 2. Testar EC2
    try {
      const ec2 = new AWS.EC2(awsConfig);
      await ec2.describeInstanceTypes().promise();
      serviceResults['EC2'] = { connected: true };
    } catch (error) {
      serviceResults['EC2'] = { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
    
    // 3. Testar S3
    try {
      const s3 = new AWS.S3(awsConfig);
      await s3.listBuckets().promise();
      serviceResults['S3'] = { connected: true };
    } catch (error) {
      serviceResults['S3'] = { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
    
    // 4. Testar IAM
    try {
      const iam = new AWS.IAM(awsConfig);
      await iam.listUsers().promise();
      serviceResults['IAM'] = { connected: true };
    } catch (error) {
      serviceResults['IAM'] = { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
    
    // 5. Testar CloudWatch
    try {
      const cloudwatch = new AWS.CloudWatch(awsConfig);
      await cloudwatch.listMetrics().promise();
      serviceResults['CloudWatch'] = { connected: true };
    } catch (error) {
      serviceResults['CloudWatch'] = { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
    
    // Verificar se qualquer serviço está conectado
    const anyServiceConnected = Object.values(serviceResults).some(result => result.connected);
    
    // Criar mensagem de erro consolidada se necessário
    let errorMessage = null;
    if (!anyServiceConnected) {
      const errors = Object.entries(serviceResults)
        .filter(([_, result]) => !result.connected)
        .map(([service, result]) => `${service}: ${result.error}`)
        .join('\n');
      
      errorMessage = `Falha em todos os serviços testados:\n${errors}`;
    }
    
    return NextResponse.json({
      connected: anyServiceConnected,
      accountId,
      services: serviceResults,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao testar credencial AWS:', error);
    return NextResponse.json({ 
      connected: false,
      error: error instanceof Error ? error.message : 'Erro interno no servidor',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 