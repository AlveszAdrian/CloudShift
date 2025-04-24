import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { AwsClientManager } from '@/lib/aws-client';

// Função auxiliar para obter o cliente IAM para uma credencial
async function getIAMClient(credentialId: string) {
  const credential = await prisma.awsCredential.findUnique({
    where: { id: credentialId }
  });
  
  if (!credential) {
    throw new Error('Credencial não encontrada');
  }
  
  const clientManager = AwsClientManager.getInstance(credential);
  
  return { 
    clientManager, 
    credential
  };
}

// Anexar política a uma entidade (usuário, grupo ou função)
export async function POST(request: NextRequest) {
  let body: any;
  
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Obter dados do corpo da requisição
    body = await request.json();
    const { credentialId, policyArn, entityType, entityName } = body;

    if (!credentialId || !policyArn || !entityType || !entityName) {
      return NextResponse.json({ 
        error: 'ID de credencial, ARN da política, tipo de entidade e nome da entidade são obrigatórios' 
      }, { status: 400 });
    }

    if (!['user', 'group', 'role'].includes(entityType.toLowerCase())) {
      return NextResponse.json({ 
        error: 'Tipo de entidade deve ser "user", "group" ou "role"' 
      }, { status: 400 });
    }

    // Obter cliente IAM
    const { clientManager } = await getIAMClient(credentialId);
    const iamClient = clientManager.getIAMClient();

    // Anexar política baseado no tipo de entidade
    let result;
    switch (entityType.toLowerCase()) {
      case 'user':
        result = await iamClient.attachUserPolicy({
          UserName: entityName,
          PolicyArn: policyArn
        }).promise();
        break;
      case 'group':
        result = await iamClient.attachGroupPolicy({
          GroupName: entityName,
          PolicyArn: policyArn
        }).promise();
        break;
      case 'role':
        result = await iamClient.attachRolePolicy({
          RoleName: entityName,
          PolicyArn: policyArn
        }).promise();
        break;
    }

    return NextResponse.json({ 
      success: true,
      message: `Política anexada com sucesso ao ${entityType} ${entityName}`
    });
  } catch (error) {
    console.error(`Erro ao anexar política a ${body?.entityType}:`, error);
    return NextResponse.json({ 
      error: `Erro ao anexar política: ${(error as Error).message}` 
    }, { status: 500 });
  }
}

// Desanexar política de uma entidade
export async function DELETE(request: NextRequest) {
  // Inicializar searchParams com um valor default para evitar erro de "usado antes de atribuir"
  let searchParams = new URLSearchParams();
  let entityType = "desconhecido";
  
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Obter parâmetros da requisição
    searchParams = new URL(request.url).searchParams;
    const credentialId = searchParams.get('credentialId');
    const policyArn = searchParams.get('policyArn');
    entityType = searchParams.get('entityType') || "desconhecido";
    const entityName = searchParams.get('entityName');

    if (!credentialId || !policyArn || !entityType || !entityName) {
      return NextResponse.json({ 
        error: 'ID de credencial, ARN da política, tipo de entidade e nome da entidade são obrigatórios' 
      }, { status: 400 });
    }

    if (!['user', 'group', 'role'].includes(entityType.toLowerCase())) {
      return NextResponse.json({ 
        error: 'Tipo de entidade deve ser "user", "group" ou "role"' 
      }, { status: 400 });
    }

    // Obter cliente IAM
    const { clientManager } = await getIAMClient(credentialId);
    const iamClient = clientManager.getIAMClient();

    // Desanexar política baseado no tipo de entidade
    let result;
    switch (entityType.toLowerCase()) {
      case 'user':
        result = await iamClient.detachUserPolicy({
          UserName: entityName,
          PolicyArn: policyArn
        }).promise();
        break;
      case 'group':
        result = await iamClient.detachGroupPolicy({
          GroupName: entityName,
          PolicyArn: policyArn
        }).promise();
        break;
      case 'role':
        result = await iamClient.detachRolePolicy({
          RoleName: entityName,
          PolicyArn: policyArn
        }).promise();
        break;
    }

    return NextResponse.json({ 
      success: true,
      message: `Política desanexada com sucesso do ${entityType} ${entityName}`
    });
  } catch (error) {
    console.error(`Erro ao desanexar política de ${entityType}:`, error);
    return NextResponse.json({ 
      error: `Erro ao desanexar política: ${(error as Error).message}` 
    }, { status: 500 });
  }
} 