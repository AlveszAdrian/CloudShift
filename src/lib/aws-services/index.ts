import { IAMService } from './iam-service';
import { prisma } from '../prisma';

export async function getIAMService(credentialId: string) {
  console.log(`Iniciando getIAMService para credentialId: ${credentialId}`);
  
  try {
    if (!credentialId) {
      console.error('ID de credencial inválido ou vazio');
      return null;
    }
    
    console.log(`Buscando credencial no banco de dados: ${credentialId}`);
    const credential = await prisma.awsCredential.findUnique({
      where: { id: credentialId }
    });

    if (!credential) {
      console.error(`Credencial não encontrada para ID: ${credentialId}`);
      throw new Error('Credencial não encontrada');
    }
    
    // Validar se os campos necessários estão presentes
    if (!credential.accessKeyId || !credential.secretKey || !credential.region) {
      console.error('Credencial incompleta:', {
        id: credential.id,
        hasAccessKey: !!credential.accessKeyId,
        hasSecretKey: !!credential.secretKey,
        hasRegion: !!credential.region
      });
      throw new Error('Credencial incompleta - campos obrigatórios faltando');
    }
    
    console.log(`Criando serviço IAM para credencial ${credentialId} (região: ${credential.region})`);
    return new IAMService(credential);
  } catch (error) {
    console.error('Erro ao criar serviço IAM:', error);
    return null;
  }
}

export { IAMService };
export * from './ec2-security-service';
export * from './vulnerability-service'; 