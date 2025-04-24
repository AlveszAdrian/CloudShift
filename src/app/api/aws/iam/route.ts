import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import * as awsService from '@/lib/aws-service';
import { AwsClientManager } from '@/lib/aws-client';
import AWS from 'aws-sdk';

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

// Listar usuários IAM
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Obter credentialId da query
    const searchParams = new URL(request.url).searchParams;
    const credentialId = searchParams.get('credentialId');
    
    if (!credentialId) {
      return NextResponse.json({ error: 'ID de credencial não fornecido' }, { status: 400 });
    }

    // Obter usuários IAM
    const users = await awsService.getIamUsers(credentialId);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários IAM:', error);
    return NextResponse.json({ error: 'Erro ao listar usuários IAM' }, { status: 500 });
  }
}

// Criar usuário IAM
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Obter dados do corpo da requisição
    const body = await request.json();
    const { credentialId, userName, consoleAccess, password, policies } = body;

    if (!credentialId || !userName) {
      return NextResponse.json({ error: 'ID de credencial e nome de usuário são obrigatórios' }, { status: 400 });
    }

    // Obter cliente IAM
    const { clientManager } = await getIAMClient(credentialId);
    const iamClient = clientManager.getIAMClient();

    // Criar usuário usando os serviços disponíveis
    // Para isso, vamos utilizar os métodos do IAM client diretamente
    const newUser = await iamClient.createUser({
      UserName: userName
    }).promise();

    // Configurar acesso ao console se solicitado
    if (consoleAccess && password) {
      await iamClient.createLoginProfile({
        UserName: userName,
        Password: password,
        PasswordResetRequired: true
      }).promise();
    }
    
    // Anexar políticas se fornecidas
    if (policies && Array.isArray(policies) && policies.length > 0) {
      for (const policyArn of policies) {
        await iamClient.attachUserPolicy({
          UserName: userName,
          PolicyArn: policyArn
        }).promise();
      }
    }

    return NextResponse.json({ user: newUser.User });
  } catch (error) {
    console.error('Erro ao criar usuário IAM:', error);
    return NextResponse.json({ error: 'Erro ao criar usuário IAM' }, { status: 500 });
  }
}

// Atualizar usuário
export async function PATCH(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Obter dados do corpo da requisição
    const body = await request.json();
    const { credentialId, userName, addPolicies, removePolicies } = body;

    if (!credentialId || !userName) {
      return NextResponse.json({ error: 'ID de credencial e nome de usuário são obrigatórios' }, { status: 400 });
    }

    // Obter cliente IAM
    const { clientManager } = await getIAMClient(credentialId);
    const iamClient = clientManager.getIAMClient();

    // Adicionar políticas
    if (addPolicies && Array.isArray(addPolicies) && addPolicies.length > 0) {
      for (const policyArn of addPolicies) {
        await iamClient.attachUserPolicy({
          UserName: userName,
          PolicyArn: policyArn
        }).promise();
      }
    }

    // Remover políticas
    if (removePolicies && Array.isArray(removePolicies) && removePolicies.length > 0) {
      for (const policyArn of removePolicies) {
        await iamClient.detachUserPolicy({
          UserName: userName,
          PolicyArn: policyArn
        }).promise();
      }
    }

    // Obter usuário atualizado
    const updatedUser = await iamClient.getUser({
      UserName: userName
    }).promise();

    return NextResponse.json({ user: updatedUser.User });
  } catch (error) {
    console.error('Erro ao atualizar usuário IAM:', error);
    return NextResponse.json({ error: 'Erro ao atualizar usuário IAM' }, { status: 500 });
  }
}

// Excluir usuário
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Obter parâmetros da requisição
    const searchParams = new URL(request.url).searchParams;
    const credentialId = searchParams.get('credentialId');
    const userName = searchParams.get('userName');

    if (!credentialId || !userName) {
      return NextResponse.json({ error: 'ID de credencial e nome de usuário são obrigatórios' }, { status: 400 });
    }

    // Obter cliente IAM
    const { clientManager } = await getIAMClient(credentialId);
    const iamClient = clientManager.getIAMClient();

    // Vamos remover as políticas anexadas ao usuário primeiro
    try {
      const attachedPolicies = await iamClient.listAttachedUserPolicies({
        UserName: userName
      }).promise();
      
      if (attachedPolicies.AttachedPolicies) {
        for (const policy of attachedPolicies.AttachedPolicies) {
          if (policy.PolicyArn) {
            await iamClient.detachUserPolicy({
              UserName: userName,
              PolicyArn: policy.PolicyArn
            }).promise();
          }
        }
      }
      
      // Remover chaves de acesso
      const accessKeys = await iamClient.listAccessKeys({
        UserName: userName
      }).promise();
      
      if (accessKeys.AccessKeyMetadata) {
        for (const key of accessKeys.AccessKeyMetadata) {
          if (key.AccessKeyId) {
            await iamClient.deleteAccessKey({
              UserName: userName,
              AccessKeyId: key.AccessKeyId
            }).promise();
          }
        }
      }
      
      // Remover o usuário
      await iamClient.deleteUser({
        UserName: userName
      }).promise();
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Erro ao remover dependências do usuário:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao excluir usuário IAM:', error);
    return NextResponse.json({ error: 'Erro ao excluir usuário IAM' }, { status: 500 });
  }
} 