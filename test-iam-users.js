// Script para testar a obtenção de usuários IAM
const AWS = require('aws-sdk');
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

// Esta função é uma cópia simplificada da função getIamUsers no aws-service.ts
async function getIamUsers(credential) {
  console.log(`Testando obtenção de usuários IAM para ${credential.name} (Região: ${credential.region})`);
  
  // Configurar AWS com esta credencial
  AWS.config.update({
    accessKeyId: credential.accessKeyId,
    secretAccessKey: credential.secretKey,
    region: credential.region
  });
  
  const iamClient = new AWS.IAM();
  
  try {
    console.log("Enviando requisição listUsers para a AWS...");
    const result = await iamClient.listUsers().promise();
    console.log(`Resposta da AWS recebida: ${result.Users?.length || 0} usuários`);
    
    const users = await Promise.all(result.Users?.map(async (user) => {
      try {
        // Obter políticas anexadas ao usuário
        const policiesResult = await iamClient.listAttachedUserPolicies({
          UserName: user.UserName
        }).promise();

        // Verificar se tem acesso ao console
        let hasConsoleAccess = false;
        try {
          const loginProfile = await iamClient.getLoginProfile({
            UserName: user.UserName
          }).promise();
          hasConsoleAccess = !!loginProfile.LoginProfile;
        } catch (error) {
          // Se der erro, provavelmente não tem login profile
          hasConsoleAccess = false;
        }

        // Verificar se tem MFA
        const mfaDevices = await iamClient.listMFADevices({
          UserName: user.UserName
        }).promise();
        const hasMfa = (mfaDevices.MFADevices?.length || 0) > 0;

        // Verificar access keys
        const accessKeys = await iamClient.listAccessKeys({
          UserName: user.UserName
        }).promise();

        return {
          id: user.UserId,
          name: user.UserName,
          arn: user.Arn,
          createDate: user.CreateDate?.toISOString(),
          passwordLastUsed: user.PasswordLastUsed?.toISOString(),
          hasConsoleAccess,
          hasMfa,
          accessKeysCount: accessKeys.AccessKeyMetadata?.length || 0,
          policiesCount: policiesResult.AttachedPolicies?.length || 0,
          riskLevel: !hasMfa && hasConsoleAccess ? 'high' : 
                    accessKeys.AccessKeyMetadata?.length === 2 ? 'medium' : 'low'
        };
      } catch (error) {
        console.error(`Erro ao obter detalhes do usuário ${user.UserName}:`, error);
        return {
          id: user.UserId,
          name: user.UserName,
          arn: user.Arn,
          createDate: user.CreateDate?.toISOString(),
          passwordLastUsed: user.PasswordLastUsed?.toISOString(),
          hasConsoleAccess: false,
          hasMfa: false,
          accessKeysCount: 0,
          policiesCount: 0,
          riskLevel: 'low'
        };
      }
    }) || []);
    
    console.log("Usuários processados:");
    users.forEach((user, index) => {
      console.log(`[${index + 1}] ${user.name} (${user.id})`);
      console.log(`    ARN: ${user.arn}`);
      console.log(`    Criado em: ${user.createDate}`);
      console.log(`    Último acesso: ${user.passwordLastUsed || 'N/A'}`);
      console.log(`    Acesso ao console: ${user.hasConsoleAccess ? 'Sim' : 'Não'}`);
      console.log(`    MFA: ${user.hasMfa ? 'Habilitado' : 'Não habilitado'}`);
      console.log(`    Chaves de acesso: ${user.accessKeysCount}`);
      console.log(`    Políticas: ${user.policiesCount}`);
      console.log(`    Nível de risco: ${user.riskLevel}`);
      console.log("");
    });
    
    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários IAM:', error);
    throw error;
  }
}

async function main() {
  try {
    // Listar todas as credenciais no banco de dados
    const credentials = await prisma.awsCredential.findMany();
    
    if (credentials.length === 0) {
      console.log('Nenhuma credencial AWS encontrada no banco de dados!');
      return;
    }
    
    console.log(`Encontradas ${credentials.length} credenciais cadastradas.`);
    
    // Testar cada credencial
    for (const credential of credentials) {
      await getIamUsers(credential);
    }
  } catch (error) {
    console.error('Erro no teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 