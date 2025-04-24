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
    const searchParams = new URLSearchParams(request.url.split('?')[1] || '');
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
    
    // Obter funções IAM
    const roles = await awsService.listRoles();
    
    // Adicionar contagem de políticas para cada role
    const rolesWithPolicyCount = await Promise.all(
      roles.map(async (role) => {
        try {
          const policies = await awsService.listAttachedRolePolicies(role.RoleName);
          return {
            ...role,
            PolicyCount: policies.length
          };
        } catch (error) {
          console.error(`Erro ao obter políticas para role ${role.RoleName}:`, error);
          return {
            ...role,
            PolicyCount: 0
          };
        }
      })
    );
    
    return NextResponse.json({ roles: rolesWithPolicyCount });
  } catch (error: any) {
    console.error('Erro ao buscar funções IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao buscar funções IAM' },
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
    const { credentialId, roleName, description, assumeRolePolicyDocument } = await request.json();

    // Validar parâmetros
    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    if (!roleName) {
      return NextResponse.json(
        { error: 'Nome da função é obrigatório' },
        { status: 400 }
      );
    }

    if (!assumeRolePolicyDocument) {
      return NextResponse.json(
        { error: 'Documento de política de confiança é obrigatório' },
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
    
    // Criar função
    const role = await awsService.createRole(roleName, assumeRolePolicyDocument, description);
    
    return NextResponse.json({ role });
  } catch (error: any) {
    console.error('Erro ao criar função IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao criar função IAM' },
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
    const searchParams = new URLSearchParams(request.url.split('?')[1] || '');
    const credentialId = searchParams.get('credentialId');
    const roleName = searchParams.get('roleName');

    // Validar parâmetros
    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    if (!roleName) {
      return NextResponse.json(
        { error: 'Nome da função é obrigatório' },
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
    
    // Remover políticas anexadas à função
    const attachedPolicies = await awsService.listAttachedRolePolicies(roleName);
    for (const policy of attachedPolicies) {
      if (policy.PolicyArn) {
        await awsService.detachRolePolicy(roleName, policy.PolicyArn);
      }
    }
    
    // Deletar função
    await awsService.deleteRole(roleName);
    
    return NextResponse.json({ message: 'Função removida com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover função IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao remover função IAM' },
      { status: 500 }
    );
  }
} 