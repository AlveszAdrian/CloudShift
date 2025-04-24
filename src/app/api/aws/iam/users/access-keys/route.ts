import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getIAMService } from '@/lib/aws-services';

// GET /api/aws/iam/users/access-keys
// Lista chaves de acesso para um usuário
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
    const userName = searchParams.get('userName');

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

    // Listar chaves de acesso do usuário
    const accessKeys = await awsService.listAccessKeys(userName);

    return NextResponse.json({ accessKeys });
  } catch (error: any) {
    console.error('Erro ao listar chaves de acesso:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao listar chaves de acesso' },
      { status: 500 }
    );
  }
}

// POST /api/aws/iam/users/access-keys
// Cria uma nova chave de acesso para um usuário
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

    // Listar chaves atuais para verificar o limite (máximo 2 por usuário)
    const currentKeys = await awsService.listAccessKeys(userName);
    if (currentKeys.length >= 2) {
      return NextResponse.json(
        { error: 'O usuário já possui o número máximo de chaves de acesso (2). Exclua uma chave existente antes de criar uma nova.' },
        { status: 400 }
      );
    }

    // Criar nova chave de acesso
    const accessKey = await awsService.createAccessKey(userName);

    return NextResponse.json({ 
      message: 'Chave de acesso criada com sucesso',
      accessKey 
    });
  } catch (error: any) {
    console.error('Erro ao criar chave de acesso:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao criar chave de acesso' },
      { status: 500 }
    );
  }
}

// DELETE /api/aws/iam/users/access-keys
// Exclui uma chave de acesso de um usuário
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
    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get('credentialId');
    const userName = searchParams.get('userName');
    const accessKeyId = searchParams.get('accessKeyId');

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

    if (!accessKeyId) {
      return NextResponse.json(
        { error: 'ID da chave de acesso é obrigatório' },
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

    // Excluir chave de acesso
    await awsService.deleteAccessKey(userName, accessKeyId);

    return NextResponse.json({ message: 'Chave de acesso excluída com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir chave de acesso:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao excluir chave de acesso' },
      { status: 500 }
    );
  }
}

// PATCH /api/aws/iam/users/access-keys
// Atualiza o status de uma chave de acesso (ativa/inativa)
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
    const { credentialId, userName, accessKeyId, status } = await request.json();

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

    if (!accessKeyId) {
      return NextResponse.json(
        { error: 'ID da chave de acesso é obrigatório' },
        { status: 400 }
      );
    }

    if (!status || (status !== 'Active' && status !== 'Inactive')) {
      return NextResponse.json(
        { error: 'Status deve ser "Active" ou "Inactive"' },
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

    // Atualizar o status da chave de acesso
    await awsService.updateAccessKeyStatus(userName, accessKeyId, status);

    return NextResponse.json({ message: `Status da chave de acesso alterado para ${status}` });
  } catch (error: any) {
    console.error('Erro ao atualizar status da chave de acesso:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao atualizar status da chave de acesso' },
      { status: 500 }
    );
  }
} 