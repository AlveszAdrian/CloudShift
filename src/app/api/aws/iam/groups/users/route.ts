import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getIAMService } from '@/lib/aws-services';

// List users in a group
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
    const groupName = searchParams.get('groupName');

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
    
    const users = await awsService.listUsersInGroup(groupName);

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Erro ao buscar usuários no grupo IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao buscar usuários no grupo IAM' },
      { status: 500 }
    );
  }
}

// Add user to a group
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
    const { credentialId, groupName, userName } = await request.json();

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
    
    await awsService.addUserToGroup(userName, groupName);
    
    return NextResponse.json({ message: 'Usuário adicionado ao grupo com sucesso' });
  } catch (error: any) {
    console.error('Erro ao adicionar usuário ao grupo IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao adicionar usuário ao grupo IAM' },
      { status: 500 }
    );
  }
}

// Remove user from a group
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
    const { credentialId, groupName, userName } = await request.json();

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
    
    await awsService.removeUserFromGroup(userName, groupName);
    
    return NextResponse.json({ message: 'Usuário removido do grupo com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover usuário do grupo IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao remover usuário do grupo IAM' },
      { status: 500 }
    );
  }
} 