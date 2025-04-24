import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AWS from 'aws-sdk';

// Função auxiliar para validar credenciais AWS
async function validateAwsCredentials(accessKeyId: string, secretKey: string, region: string): Promise<boolean> {
  try {
    // Configurar credenciais temporárias para teste
    const sts = new AWS.STS({
      accessKeyId,
      secretAccessKey: secretKey,
      region,
    });
    
    // Tenta obter informações da conta como teste
    await sts.getCallerIdentity().promise();
    return true;
  } catch (error) {
    console.error('Erro ao validar credenciais AWS:', error);
    return false;
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  try {
    const credentials = await prisma.awsCredential.findMany({
      where: {
        userId: session.user.id
      }
    });
    
    return NextResponse.json(credentials.map(credential => ({
      id: credential.id,
      name: credential.name,
      region: credential.region,
      createdAt: credential.createdAt
    })));
  } catch (error) {
    console.error('Erro ao buscar credenciais:', error);
    return NextResponse.json({ error: 'Erro ao buscar credenciais' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { name, accessKeyId, secretKey, region } = body;
    
    if (!name || !accessKeyId || !secretKey || !region) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }
    
    // Validar as credenciais AWS antes de salvar
    const isValid = await validateAwsCredentials(accessKeyId, secretKey, region);
    
    if (!isValid) {
      return NextResponse.json({ 
        error: 'Credenciais AWS inválidas. Verifique o Access Key ID e Secret Key.' 
      }, { status: 400 });
    }
    
    const credential = await prisma.awsCredential.create({
      data: {
        name,
        accessKeyId,
        secretKey,
        region,
        userId: session.user.id
      }
    });
    
    return NextResponse.json({
      id: credential.id,
      name: credential.name,
      region: credential.region,
      createdAt: credential.createdAt
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar credencial:', error);
    return NextResponse.json({ error: 'Erro ao criar credencial' }, { status: 500 });
  }
} 