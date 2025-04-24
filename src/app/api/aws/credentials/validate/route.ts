import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AWS from 'aws-sdk';

// Função auxiliar para validar credenciais AWS
async function validateAwsCredentials(accessKeyId: string, secretKey: string, region: string): Promise<{valid: boolean, errorMessage?: string, accountId?: string}> {
  try {
    // Configurar credenciais temporárias para teste
    const sts = new AWS.STS({
      accessKeyId,
      secretAccessKey: secretKey,
      region,
    });
    
    // Tenta obter informações da conta como teste
    const identity = await sts.getCallerIdentity().promise();
    
    return { 
      valid: true,
      accountId: identity.Account
    };
  } catch (error) {
    console.error('Erro ao validar credenciais AWS:', error);
    return { 
      valid: false, 
      errorMessage: error instanceof Error ? error.message : 'Erro desconhecido ao validar credenciais'
    };
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { accessKeyId, secretKey, region } = body;
    
    if (!accessKeyId || !secretKey || !region) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }
    
    // Validar as credenciais AWS
    const result = await validateAwsCredentials(accessKeyId, secretKey, region);
    
    if (!result.valid) {
      return NextResponse.json({ 
        valid: false,
        error: `Credenciais AWS inválidas: ${result.errorMessage}` 
      }, { status: 400 });
    }
    
    return NextResponse.json({
      valid: true,
      accountId: result.accountId
    });
  } catch (error) {
    console.error('Erro ao validar credencial:', error);
    return NextResponse.json({ 
      valid: false,
      error: 'Erro ao validar credencial: ' + (error instanceof Error ? error.message : 'Erro desconhecido')
    }, { status: 500 });
  }
} 