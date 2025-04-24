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

    try {
      // Obter detalhes da política
      const policyDetails = await awsService.getPolicyDetails(policyArn);
      
      // Retornar o documento
      return NextResponse.json({ 
        document: policyDetails.Document 
      });
    } catch (error: any) {
      console.error(`Erro ao obter documento da política ${policyArn}:`, error);
      return NextResponse.json(
        { error: error.message || 'Falha ao obter documento da política' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erro ao buscar documento da política:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao buscar documento da política' },
      { status: 500 }
    );
  }
} 