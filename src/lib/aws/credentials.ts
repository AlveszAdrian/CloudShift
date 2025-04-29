import { prisma } from '@/lib/prisma';

export interface AwsCredential {
  id: string;
  name: string;
  accessKeyId: string;
  secretKey: string;
  region: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get a specific AWS credential by ID
 */
export async function getAwsCredentials(credentialId: string) {
  try {
    console.log('Buscando credenciais para ID:', credentialId);
    
    if (!credentialId) {
      console.log('CredentialId não fornecido');
      throw new Error('CredentialId não fornecido');
    }

    const credential = await prisma.awsCredential.findUnique({
      where: { id: credentialId }
    });

    if (!credential) {
      console.log('Credenciais não encontradas para ID:', credentialId);
      throw new Error('Credenciais não encontradas');
    }

    // Validar campos obrigatórios
    if (!credential.accessKeyId || !credential.secretKey || !credential.region) {
      console.log('Credenciais inválidas:', credential);
      throw new Error('Credenciais inválidas');
    }

    console.log('Credenciais encontradas:', {
      id: credential.id,
      region: credential.region,
      accessKeyId: credential.accessKeyId ? '***' : undefined
    });

    return {
      accessKeyId: credential.accessKeyId,
      secretKey: credential.secretKey,
      region: credential.region
    };
  } catch (error) {
    console.error('Erro ao obter credenciais:', error);
    throw error;
  }
}

/**
 * Get all AWS credentials
 */
export async function getAllAwsCredentials(): Promise<AwsCredential[]> {
  try {
    const credentials = await prisma.awsCredential.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return credentials;
  } catch (error) {
    console.error('Error fetching AWS credentials:', error);
    return [];
  }
}

/**
 * Create a new AWS credential
 */
export async function createAwsCredential(data: { 
  name: string;
  accessKeyId: string;
  secretKey: string;
  region: string;
  userId: string;
}): Promise<AwsCredential | null> {
  try {
    const credential = await prisma.awsCredential.create({
      data
    });
    
    return credential;
  } catch (error) {
    console.error('Error creating AWS credential:', error);
    return null;
  }
}

/**
 * Update an existing AWS credential
 */
export async function updateAwsCredential(
  id: string, 
  data: Partial<{
    name: string;
    accessKeyId: string;
    secretKey: string;
    region: string;
  }>
): Promise<AwsCredential | null> {
  try {
    const credential = await prisma.awsCredential.update({
      where: { id },
      data
    });
    
    return credential;
  } catch (error) {
    console.error('Error updating AWS credential:', error);
    return null;
  }
}

/**
 * Delete an AWS credential
 */
export async function deleteAwsCredential(id: string): Promise<boolean> {
  try {
    await prisma.awsCredential.delete({
      where: { id }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting AWS credential:', error);
    return false;
  }
} 