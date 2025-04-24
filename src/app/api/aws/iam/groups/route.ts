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

    // Obter grupos IAM
    const groups = await awsService.listGroups();

    // Enriquecer os dados dos grupos com contagem de usuários e políticas
    const groupsWithDetails = await Promise.all(groups.map(async (group) => {
      try {
        if (group.GroupName) {
          const [users, policies] = await Promise.all([
            awsService.listUsersInGroup(group.GroupName),
            awsService.listAttachedGroupPolicies(group.GroupName)
          ]);

          return {
            ...group,
            userCount: users.length,
            policiesCount: policies.length
          };
        }
        return {
          ...group,
          userCount: 0,
          policiesCount: 0
        };
      } catch (error) {
        console.error(`Erro ao obter detalhes do grupo ${group.GroupName}:`, error);
        return {
          ...group,
          userCount: 0,
          policiesCount: 0
        };
      }
    }));

    return NextResponse.json({ groups: groupsWithDetails });
  } catch (error: any) {
    console.error('Erro ao buscar grupos IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao buscar grupos IAM' },
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
    const { credentialId, groupName } = await request.json();

    // Validar parâmetros
    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    if (!groupName) {
      return NextResponse.json(
        { error: 'Nome do grupo é obrigatório' },
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

    // Criar grupo
    const group = await awsService.createGroup(groupName);

    return NextResponse.json({ group });
  } catch (error: any) {
    console.error('Erro ao criar grupo IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao criar grupo IAM' },
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
    const { credentialId, groupName } = await request.json();

    // Validar parâmetros
    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    if (!groupName) {
      return NextResponse.json(
        { error: 'Nome do grupo é obrigatório' },
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

    // Primeiro, remover os usuários do grupo
    const usersInGroup = await awsService.listUsersInGroup(groupName);
    for (const user of usersInGroup) {
      if (user.UserName) {
        await awsService.removeUserFromGroup(user.UserName, groupName);
      }
    }

    // Depois, desanexar as políticas
    const policies = await awsService.listAttachedGroupPolicies(groupName);
    for (const policy of policies) {
      if (policy.PolicyArn) {
        await awsService.detachGroupPolicy(groupName, policy.PolicyArn);
      }
    }

    // Por fim, excluir o grupo
    await awsService.deleteGroup(groupName);

    return NextResponse.json({ message: 'Grupo removido com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover grupo IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao remover grupo IAM' },
      { status: 500 }
    );
  }
} 