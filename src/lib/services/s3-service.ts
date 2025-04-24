import { AwsClientManager } from '../aws-client';
import { AwsCredentialRepository } from '../repositories/aws-credential-repository';

// Interface para definir tipos de retorno
export interface S3Bucket {
  name: string;
  creationDate: Date | undefined;
}

export class S3Service {
  private credentialRepository: AwsCredentialRepository;
  private cache: Map<string, { data: S3Bucket[], timestamp: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutos em ms
  
  constructor() {
    this.credentialRepository = new AwsCredentialRepository();
  }
  
  async getBuckets(credentialId: string): Promise<S3Bucket[]> {
    console.log(`Buscando buckets S3 para credencial ID: ${credentialId}`);
    
    // Verificar cache
    const cached = this.cache.get(credentialId);
    if (cached && (Date.now() - cached.timestamp < this.cacheTTL)) {
      console.log(`Usando dados em cache para buckets S3 (credencial: ${credentialId})`);
      return cached.data;
    }
    
    // Se não estiver em cache, buscar da API
    const credential = await this.credentialRepository.findById(credentialId);
    if (!credential) {
      throw new Error('Credencial não encontrada');
    }

    try {
      console.log("Criando cliente AWS...");
      const awsClient = AwsClientManager.getInstance(credential);
      const s3Client = awsClient.getS3Client();

      console.log("Enviando requisição listBuckets para a AWS...");
      const result = await s3Client.listBuckets().promise();
      
      const buckets = result.Buckets?.map(bucket => ({
        name: bucket.Name || '',
        creationDate: bucket.CreationDate
      })) || [];
      
      // Armazenar no cache
      this.cache.set(credentialId, {
        data: buckets,
        timestamp: Date.now()
      });
      
      return buckets;
    } catch (error) {
      console.error('Erro ao buscar buckets S3:', error);
      throw error;
    }
  }
  
  // Método para limpar o cache
  clearCache(credentialId?: string): void {
    if (credentialId) {
      this.cache.delete(credentialId);
    } else {
      this.cache.clear();
    }
  }
} 