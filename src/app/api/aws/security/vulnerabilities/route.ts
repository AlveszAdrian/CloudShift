import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { VulnerabilityService } from '@/lib/aws-services/vulnerability-service';

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Obter ID da credencial da query string
    const searchParams = req.nextUrl.searchParams;
    const credentialId = searchParams.get('credentialId');

    if (!credentialId) {
      return NextResponse.json(
        { error: 'ID da credencial é necessário' },
        { status: 400 }
      );
    }

    // Criar serviço de vulnerabilidades
    console.log(`Iniciando escaneamento completo de vulnerabilidades para credencial: ${credentialId}`);
    const vulnerabilityService = new VulnerabilityService(credentialId);
    
    // Escanear vulnerabilidades
    console.log(`Chamando scanVulnerabilities() para credencial: ${credentialId}`);
    const vulnerabilities = await vulnerabilityService.scanVulnerabilities();
    console.log(`Escaneamento completo. Encontradas ${vulnerabilities.length} vulnerabilidades.`);
    
    // Verificar se temos todas as vulnerabilidades esperadas
    const countByType = vulnerabilities.reduce((acc, vuln) => {
      acc[vuln.resourceType] = (acc[vuln.resourceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Distribuição de vulnerabilidades por tipo:', countByType);

    return NextResponse.json({ vulnerabilities });
  } catch (error: any) {
    console.error('Erro ao escanear vulnerabilidades:', error);
    
    // Mapear erros AWS comuns para mensagens amigáveis
    let statusCode = 500;
    let errorMessage = 'Erro ao escanear vulnerabilidades';
    
    if (error.code === 'InvalidClientTokenId') {
      statusCode = 401;
      errorMessage = 'Credenciais AWS inválidas';
    } else if (error.code === 'AccessDenied') {
      statusCode = 403;
      errorMessage = 'Permissão negada ao acessar recursos AWS. Verifique as políticas IAM';
    } else if (error.code === 'RegionDisabledException') {
      statusCode = 400;
      errorMessage = 'A região AWS especificada está desabilitada';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 