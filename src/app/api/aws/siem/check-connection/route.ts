import { NextRequest, NextResponse } from 'next/server';
import { CloudWatchLogsClient, DescribeLogGroupsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { getAwsCredentials } from '@/lib/aws/credentials';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get('credentialId');
    
    if (!credentialId) {
      return NextResponse.json({ error: 'AWS credential ID is required' }, { status: 400 });
    }

    // Get AWS credentials from database
    const credential = await getAwsCredentials(credentialId);
    
    if (!credential) {
      return NextResponse.json({ error: 'AWS credential not found' }, { status: 404 });
    }

    // Create CloudWatch Logs client
    const cloudWatchLogsClient = new CloudWatchLogsClient({
      region: credential.region,
      credentials: {
        accessKeyId: credential.accessKeyId,
        secretAccessKey: credential.secretKey
      }
    });

    // Tentar executar um comando simples para verificar a conexão
    const command = new DescribeLogGroupsCommand({
      limit: 1 // Apenas um para minimizar uso de recursos
    });

    try {
      await cloudWatchLogsClient.send(command);
      
      // Se chegar aqui, a conexão foi bem-sucedida
      return NextResponse.json({
        connected: true,
        message: 'CloudWatch Logs connection successful'
      });
    } catch (error) {
      console.error('CloudWatch connection test failed:', error);
      
      // Determinar o tipo de erro
      let errorDetails = 'Erro ao conectar ao CloudWatch';
      let statusCode = 500;
      
      if (error instanceof Error) {
        if (error.name === 'AccessDeniedException' || error.name === 'UnauthorizedException') {
          errorDetails = 'Acesso negado ao CloudWatch. Verifique as permissões da credencial AWS.';
          statusCode = 403;
        } else if (error.name === 'InvalidSignatureException') {
          errorDetails = 'Assinatura de autenticação inválida. Verifique as credenciais AWS.';
          statusCode = 401;
        } else {
          errorDetails = `Erro ao conectar ao CloudWatch: ${error.message}`;
        }
      }
      
      return NextResponse.json({
        connected: false,
        error: errorDetails
      }, { status: statusCode });
    }
  } catch (error) {
    console.error('Error checking CloudWatch connection:', error);
    return NextResponse.json({
      connected: false,
      error: `Erro ao verificar conexão: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 });
  }
} 