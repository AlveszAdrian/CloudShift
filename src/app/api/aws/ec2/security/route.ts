import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { EC2SecurityService } from '@/lib/aws-services/ec2-security-service';
import { SecurityIssue } from '@/lib/aws-service';
import { createAlertFromSecurityIssue } from '@/lib/alert-service';

export async function GET(request: NextRequest) {
  console.log("Iniciando requisição na API de segurança do EC2");
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    console.log("Usuário não autenticado");
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  const searchParams = request.nextUrl.searchParams;
  const credentialId = searchParams.get('credentialId');
  const sendToSecurityAnalysis = searchParams.get('sendToSecurityAnalysis') === 'true';
  
  console.log(`Parâmetros da requisição: credentialId=${credentialId}, sendToSecurityAnalysis=${sendToSecurityAnalysis}`);
  
  if (!credentialId) {
    console.log("Credencial não fornecida");
    return NextResponse.json({ error: 'ID da credencial é obrigatório' }, { status: 400 });
  }
  
  try {
    console.log("Iniciando verificação de segurança do EC2");
    const ec2SecurityService = new EC2SecurityService(credentialId);
    const securityResults = await ec2SecurityService.checkEC2Security();
    
    // Contar problemas por categoria
    const securityGroupIssues = securityResults.securityGroups.reduce((total, sg) => total + sg.issues.length, 0);
    const networkAclIssues = securityResults.networkAcls.reduce((total, acl) => total + acl.issues.length, 0);
    const instanceIssues = securityResults.instances.reduce((total, instance) => total + instance.issues.length, 0);
    const keyPairIssues = securityResults.keyPairs.reduce((total, key) => total + key.issues.length, 0);
    const volumeIssues = securityResults.volumes.reduce((total, volume) => total + volume.issues.length, 0);
    const iamRoleIssues = securityResults.iamRoles.reduce((total, role) => total + role.issues.length, 0);
    
    const totalIssues = securityGroupIssues + networkAclIssues + instanceIssues + 
                        keyPairIssues + volumeIssues + iamRoleIssues;
    
    console.log(`Verificação concluída. Encontrados ${totalIssues} problemas de segurança.`);
    
    // Se solicitado, enviar os problemas para a análise de segurança
    if (sendToSecurityAnalysis) {
      console.log("Enviando problemas de segurança para a análise de segurança");
      
      // Coletar todos os problemas em arrays
      const securityIssues: SecurityIssue[] = [];
      
      // Processar Security Groups
      securityResults.securityGroups.forEach(sg => {
        sg.issues.forEach(issue => {
          securityIssues.push({
            resourceId: sg.id,
            resourceType: 'EC2',
            title: `Security Group ${sg.name}: ${issue.type}`,
            description: issue.description,
            severity: issue.severity
          });
        });
      });
      
      // Processar Network ACLs
      securityResults.networkAcls.forEach(acl => {
        acl.issues.forEach(issue => {
          securityIssues.push({
            resourceId: acl.id,
            resourceType: 'EC2',
            title: `Network ACL: ${issue.type}`,
            description: issue.description,
            severity: issue.severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          });
        });
      });
      
      // Processar Instâncias EC2
      securityResults.instances.forEach(instance => {
        instance.issues.forEach(issue => {
          securityIssues.push({
            resourceId: instance.id,
            resourceType: 'EC2',
            title: `Instância EC2: ${issue.type}`,
            description: issue.description,
            severity: issue.severity
          });
        });
      });
      
      // Processar Key Pairs
      securityResults.keyPairs.forEach(keyPair => {
        keyPair.issues.forEach(issue => {
          securityIssues.push({
            resourceId: keyPair.name,
            resourceType: 'EC2',
            title: `Chave EC2: ${issue.type}`,
            description: issue.description,
            severity: issue.severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          });
        });
      });
      
      // Processar Volumes
      securityResults.volumes.forEach(volume => {
        volume.issues.forEach(issue => {
          securityIssues.push({
            resourceId: volume.id,
            resourceType: 'EC2',
            title: `Volume EBS: ${issue.type}`,
            description: issue.description,
            severity: issue.severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          });
        });
      });
      
      // Processar IAM Roles
      securityResults.iamRoles.forEach(role => {
        role.issues.forEach(issue => {
          securityIssues.push({
            resourceId: role.name,
            resourceType: 'IAM',
            title: `IAM Role: ${issue.type}`,
            description: issue.description,
            severity: issue.severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          });
        });
      });
      
      // Criar alertas para cada problema de segurança
      console.log(`Criando ${securityIssues.length} alertas para problemas de segurança do EC2`);
      
      for (const issue of securityIssues) {
        await createAlertFromSecurityIssue(issue);
      }
      
      console.log("Alertas criados com sucesso");
    }
    
    return NextResponse.json({ 
      results: securityResults,
      summary: {
        totalIssues,
        securityGroupIssues,
        networkAclIssues,
        instanceIssues,
        keyPairIssues,
        volumeIssues,
        iamRoleIssues
      },
      securityIssuesSent: sendToSecurityAnalysis
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const stack = error instanceof Error ? error.stack : '';
    
    console.error(`Erro ao verificar segurança do EC2:`, error);
    console.error("Stack de erro:", stack);
    
    // Mensagem de erro mais amigável para o usuário
    let userMessage = `Erro ao verificar segurança do EC2: ${errorMessage}`;
    
    // Checar por erros comuns da AWS e fornecer dicas
    if (errorMessage.includes('CredentialsError') || errorMessage.includes('InvalidClientTokenId')) {
      userMessage = 'Credenciais AWS inválidas. Verifique se o Access Key ID e Secret Key estão corretos.';
    } else if (errorMessage.includes('ExpiredToken')) {
      userMessage = 'Token AWS expirado. Atualize suas credenciais.';
    } else if (errorMessage.includes('AccessDenied') || errorMessage.includes('UnauthorizedOperation')) {
      userMessage = 'Permissão negada pela AWS. Verifique se o usuário IAM tem permissões para acessar EC2 e recursos relacionados.';
    } else if (errorMessage.includes('NetworkingError') || errorMessage.includes('TimeoutError')) {
      userMessage = 'Erro de rede ao acessar a AWS. Verifique sua conexão com a internet.';
    }
    
    return NextResponse.json({ 
      error: userMessage,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
} 