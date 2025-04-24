import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getIAMService } from '@/lib/aws-services';

export async function GET(
  request: NextRequest,
  { params }: { params: { policyArn: string } }
) {
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

    // Decodificar o ARN da política que vem da URL
    const policyArn = decodeURIComponent(params.policyArn);
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

    // Obter detalhes da política
    const policyDetails = await awsService.getPolicyDetails(policyArn);

    return NextResponse.json(policyDetails);
  } catch (error: any) {
    console.error('Erro ao obter detalhes da política IAM:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao obter detalhes da política IAM' },
      { status: 500 }
    );
  }
} 