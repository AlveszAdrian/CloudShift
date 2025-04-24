import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getIAMService } from '@/lib/aws-services';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Obter parâmetros da requisição
    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get('credentialId');

    // Validar parâmetros
    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    // Obter serviço IAM
    const awsService = await getIAMService(credentialId);
    if (!awsService) {
      return NextResponse.json(
        { error: 'Não foi possível criar cliente IAM' },
        { status: 500 }
      );
    }

    // Obter usuários IAM
    const iamUsers = await awsService.listUsers();
    
    // Enriquecer os dados dos usuários com informações adicionais
    const usersWithDetails = await Promise.all(
      iamUsers.map(async (user) => {
        try {
          // Obter grupos do usuário
          const userGroups = await awsService.listGroupsForUser(user.UserName);
          const groupNames = userGroups.map(group => group.GroupName || '');
          
          // Obter políticas do usuário
          const userPolicies = await awsService.listAttachedUserPolicies(user.UserName);
          
          // Obter chaves de acesso
          const accessKeys = await awsService.listAccessKeys(user.UserName);
          
          // Verificar dispositivos MFA
          const mfaDevices = await awsService.listMFADevices(user.UserName);
          
          // Determinar nível de risco
          let riskLevel: 'high' | 'medium' | 'low' = 'low';
          
          // Sem MFA é alto risco
          if (mfaDevices.length === 0) {
            riskLevel = 'high';
          }
          // Muitas chaves de acesso é risco médio
          else if (accessKeys.length > 1) {
            riskLevel = 'medium';
          }
          
          return {
            userName: user.UserName,
            userId: user.UserId,
            arn: user.Arn,
            createDate: user.CreateDate,
            passwordLastUsed: user.PasswordLastUsed,
            hasMFA: mfaDevices.length > 0,
            accessKeysCount: accessKeys.length,
            policiesCount: userPolicies.length,
            riskLevel,
            groups: groupNames
          };
        } catch (error) {
          console.error(`Erro ao obter detalhes para usuário ${user.UserName}:`, error);
          
          // Retornar dados mínimos para não quebrar a UI
          return {
            userName: user.UserName,
            userId: user.UserId,
            arn: user.Arn,
            createDate: user.CreateDate,
            passwordLastUsed: user.PasswordLastUsed,
            hasMFA: false,
            accessKeysCount: 0,
            policiesCount: 0,
            riskLevel: 'high' as 'high',
            groups: []
          };
        }
      })
    );

    return NextResponse.json({ users: usersWithDetails });
  } catch (error: any) {
    console.error('Erro ao buscar usuários IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao buscar usuários IAM' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Obter parâmetros da requisição
    const { credentialId, userName, createConsoleAccess, consolePassword, policyArns } = await request.json();

    // Validar parâmetros
    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    if (!userName) {
      return NextResponse.json(
        { error: 'Nome do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Obter serviço IAM
    const awsService = await getIAMService(credentialId);
    if (!awsService) {
      return NextResponse.json(
        { error: 'Não foi possível criar cliente IAM' },
        { status: 500 }
      );
    }

    // Criar usuário
    const user = await awsService.createUser(userName);

    // Configurar acesso ao console (opcional)
    if (createConsoleAccess && consolePassword) {
      await awsService.createLoginProfile(userName, consolePassword);
    }

    // Anexar políticas (opcional)
    if (policyArns && Array.isArray(policyArns) && policyArns.length > 0) {
      for (const policyArn of policyArns) {
        await awsService.attachUserPolicy(userName, policyArn);
      }
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Erro ao criar usuário IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao criar usuário IAM' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Obter parâmetros da requisição
    const { credentialId, userName, action, policyArn } = await request.json();

    // Validar parâmetros
    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    if (!userName) {
      return NextResponse.json(
        { error: 'Nome do usuário é obrigatório' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Ação é obrigatória' },
        { status: 400 }
      );
    }

    // Obter serviço IAM
    const awsService = await getIAMService(credentialId);
    if (!awsService) {
      return NextResponse.json(
        { error: 'Não foi possível criar cliente IAM' },
        { status: 500 }
      );
    }

    // Realizar ação conforme solicitado
    if (action === 'attachPolicy') {
      if (!policyArn) {
        return NextResponse.json(
          { error: 'ARN da política é obrigatório para anexar política' },
          { status: 400 }
        );
      }
      await awsService.attachUserPolicy(userName, policyArn);
      return NextResponse.json({ message: 'Política anexada com sucesso' });
    } else if (action === 'detachPolicy') {
      if (!policyArn) {
        return NextResponse.json(
          { error: 'ARN da política é obrigatório para desanexar política' },
          { status: 400 }
        );
      }
      await awsService.detachUserPolicy(userName, policyArn);
      return NextResponse.json({ message: 'Política desanexada com sucesso' });
    } else {
      return NextResponse.json(
        { error: 'Ação não reconhecida' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Erro ao atualizar usuário IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao atualizar usuário IAM' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Obter parâmetros da requisição
    const { credentialId, userName } = await request.json();

    // Validar parâmetros
    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    if (!userName) {
      return NextResponse.json(
        { error: 'Nome do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Obter serviço IAM
    const awsService = await getIAMService(credentialId);
    if (!awsService) {
      return NextResponse.json(
        { error: 'Não foi possível criar cliente IAM' },
        { status: 500 }
      );
    }

    // Remover políticas anexadas ao usuário
    const attachedPolicies = await awsService.listAttachedUserPolicies(userName);
    for (const policy of attachedPolicies) {
      if (policy.PolicyArn) {
        await awsService.detachUserPolicy(userName, policy.PolicyArn);
      }
    }

    // Remover chaves de acesso
    const accessKeys = await awsService.listAccessKeys(userName);
    for (const key of accessKeys) {
      if (key.AccessKeyId) {
        await awsService.deleteAccessKey(userName, key.AccessKeyId);
      }
    }

    // Remover perfil de login se existir
    try {
      await awsService.deleteLoginProfile(userName);
    } catch (error) {
      // Ignorar erro se o perfil de login não existir
      console.log('Perfil de login não encontrado ou já removido');
    }

    // Deletar usuário
    await awsService.deleteUser(userName);

    return NextResponse.json({ message: 'Usuário removido com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover usuário IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao remover usuário IAM' },
      { status: 500 }
    );
  }
} 