import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getIAMService } from '@/lib/aws-services';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Iniciando solicitação GET para /api/aws/iam/policies');
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Sessão não encontrada - Usuário não autenticado');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Obter parâmetros da requisição
    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get('credentialId');
    const scope = searchParams.get('scope') || 'All'; // All, AWS, Local
    
    console.log(`Parâmetros recebidos: credentialId=${credentialId}, scope=${scope}`);

    // Validar parâmetros
    if (!credentialId) {
      console.log('Erro: ID da credencial não fornecido');
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a credencial existe e pertence ao usuário
    try {
      const credential = await prisma.awsCredential.findUnique({
        where: { id: credentialId },
        select: { id: true, userId: true, accessKeyId: true, secretKey: true, region: true }
      });

      if (!credential) {
        console.error(`Credencial ${credentialId} não encontrada no banco de dados`);
        return NextResponse.json(
          { error: 'Credencial não encontrada' },
          { status: 404 }
        );
      }

      if (credential.userId !== session.user.id) {
        console.error(`Credencial ${credentialId} não pertence ao usuário ${session.user.id}`);
        return NextResponse.json(
          { error: 'Acesso negado a esta credencial' },
          { status: 403 }
        );
      }
      
      console.log(`Credencial ${credentialId} verificada e autorizada`);
    } catch (dbError) {
      console.error('Erro ao verificar credencial no banco de dados:', dbError);
      return NextResponse.json(
        { error: 'Erro ao verificar credencial' },
        { status: 500 }
      );
    }

    // Obter serviço IAM
    console.log(`Obtendo serviço IAM para credencial ${credentialId}`);
    const awsService = await getIAMService(credentialId);
    if (!awsService) {
      console.error(`Falha ao criar cliente IAM para credencial ${credentialId}`);
      return NextResponse.json(
        { error: 'Não foi possível criar cliente IAM' },
        { status: 500 }
      );
    }

    // Obter políticas
    console.log(`Buscando políticas IAM com scope=${scope}`);
    const policies = await awsService.listPolicies(false, scope as 'All' | 'AWS' | 'Local');
    console.log(`${policies.length} políticas encontradas`);

    return NextResponse.json({ policies });
  } catch (error: any) {
    console.error('Erro ao buscar políticas IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao buscar políticas IAM' },
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
    const { credentialId, policyName, policyDocument, description } = await request.json();

    // Validar parâmetros
    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    if (!policyName) {
      return NextResponse.json(
        { error: 'Nome da política é obrigatório' },
        { status: 400 }
      );
    }

    if (!policyDocument) {
      return NextResponse.json(
        { error: 'Documento da política é obrigatório' },
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

    // Criar política
    const policyArn = await awsService.createPolicy(policyName, policyDocument, description);

    return NextResponse.json({ 
      message: 'Política criada com sucesso',
      policyArn 
    });
  } catch (error: any) {
    console.error('Erro ao criar política IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao criar política IAM' },
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
    const policyArn = searchParams.get('policyArn');

    // Validar parâmetros
    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é obrigatório' },
        { status: 400 }
      );
    }

    if (!policyArn) {
      return NextResponse.json(
        { error: 'ARN da política é obrigatório' },
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

    // Remover política
    await awsService.deletePolicy(policyArn);

    return NextResponse.json({ message: 'Política removida com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover política IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao remover política IAM' },
      { status: 500 }
    );
  }
} 