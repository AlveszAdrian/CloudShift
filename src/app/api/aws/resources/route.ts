import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as awsService from '@/lib/aws-service';
import * as alertService from '@/lib/alert-service';

export async function GET(request: NextRequest) {
  console.log("Iniciando requisição na API de recursos AWS");
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    console.log("Usuário não autenticado");
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  const searchParams = request.nextUrl.searchParams;
  const credentialId = searchParams.get('credentialId');
  const resourceType = searchParams.get('type');
  
  console.log(`Parâmetros da requisição: credentialId=${credentialId}, type=${resourceType}`);
  
  if (!credentialId) {
    console.log("Credencial não fornecida");
    return NextResponse.json({ error: 'ID da credencial é obrigatório' }, { status: 400 });
  }
  
  try {
    if (resourceType === 'EC2') {
      console.log("Buscando instâncias EC2");
      const instances = await awsService.getEc2Instances(credentialId);
      console.log(`Encontradas ${instances.length} instâncias EC2`);
      return NextResponse.json({ resources: instances });
    } 
    
    if (resourceType === 'S3') {
      console.log("Buscando buckets S3");
      const buckets = await awsService.getS3Buckets(credentialId);
      console.log(`Encontrados ${buckets.length} buckets S3`);
      return NextResponse.json({ resources: buckets });
    }
    
    if (resourceType === 'IAM') {
      console.log("Buscando usuários IAM");
      const users = await awsService.getIamUsers(credentialId);
      console.log(`Encontrados ${users.length} usuários IAM`);
      console.log("Primeiro usuário (formato):", users.length > 0 ? JSON.stringify(users[0]) : "Nenhum usuário encontrado");
      return NextResponse.json({ resources: users });
    }
    
    // Se não especificar tipo, retorna problemas de segurança
    console.log("Buscando problemas de segurança");
    const securityIssues = await awsService.getSecurityIssues(credentialId);
    console.log(`Encontrados ${securityIssues.length} problemas de segurança`);
    
    // Criar alertas para cada problema de segurança
    console.log("Criando alertas para os problemas de segurança");
    for (const issue of securityIssues) {
      await alertService.createAlertFromSecurityIssue(issue);
    }
    
    return NextResponse.json({ securityIssues });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const stack = error instanceof Error ? error.stack : '';
    
    console.error(`Erro ao buscar recursos ${resourceType || ''}:`, error);
    console.error("Stack de erro:", stack);
    
    // Mensagem de erro mais amigável para o usuário
    let userMessage = `Erro ao buscar recursos: ${errorMessage}`;
    
    // Checar por erros comuns da AWS e fornecer dicas
    if (errorMessage.includes('CredentialsError') || errorMessage.includes('InvalidClientTokenId')) {
      userMessage = 'Credenciais AWS inválidas. Verifique se o Access Key ID e Secret Key estão corretos.';
    } else if (errorMessage.includes('ExpiredToken')) {
      userMessage = 'Token AWS expirado. Atualize suas credenciais.';
    } else if (errorMessage.includes('AccessDenied') || errorMessage.includes('UnauthorizedOperation')) {
      userMessage = 'Permissão negada pela AWS. Verifique se o usuário IAM tem permissões para acessar EC2, S3 e outros serviços necessários.';
    } else if (errorMessage.includes('NetworkingError') || errorMessage.includes('TimeoutError')) {
      userMessage = 'Erro de rede ao acessar a AWS. Verifique sua conexão com a internet.';
    }
    
    return NextResponse.json({ 
      error: userMessage,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
} 