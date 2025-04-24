import { AwsClientManager } from '../aws-client';
import { AwsCredentialRepository } from '../repositories/aws-credential-repository';

// Interfaces para definir contratos claros
export interface EC2Instance {
  id: string;
  type: string | undefined;
  state: string | undefined;
  publicIp: string | undefined;
  privateIp: string | undefined;
  launchTime: Date | undefined;
}

export class EC2Service {
  private credentialRepository: AwsCredentialRepository;
  private cache: Map<string, { data: EC2Instance[], timestamp: number }> = new Map();
  private cacheTTL = 3 * 60 * 1000; // 3 minutos em ms
  
  constructor() {
    this.credentialRepository = new AwsCredentialRepository();
  }
  
  async getInstances(credentialId: string): Promise<EC2Instance[]> {
    console.log(`Buscando instâncias EC2 para credencial ID: ${credentialId}`);
    
    // Verificar cache
    const cached = this.cache.get(credentialId);
    if (cached && (Date.now() - cached.timestamp < this.cacheTTL)) {
      console.log(`Usando dados em cache para instâncias EC2 (credencial: ${credentialId})`);
      return cached.data;
    }
    
    // Obter credencial do repositório
    const credential = await this.credentialRepository.findById(credentialId);
    if (!credential) {
      throw new Error('Credencial não encontrada');
    }
    
    try {
      // Obter cliente AWS
      const awsClient = AwsClientManager.getInstance(credential);
      const ec2Client = awsClient.getEC2Client();
      
      // Fazer chamada à API
      console.log("Enviando requisição describeInstances para a AWS...");
      const result = await ec2Client.describeInstances().promise();
      
      // Processar e retornar resultado
      const instances = result.Reservations?.flatMap(reservation => 
        reservation.Instances?.map(instance => ({
          id: instance.InstanceId!,
          type: instance.InstanceType,
          state: instance.State?.Name,
          publicIp: instance.PublicIpAddress,
          privateIp: instance.PrivateIpAddress,
          launchTime: instance.LaunchTime
        })) || []
      ) || [];
      
      // Armazenar no cache
      this.cache.set(credentialId, {
        data: instances,
        timestamp: Date.now()
      });
      
      return instances;
    } catch (error) {
      console.error('Erro ao buscar instâncias EC2:', error);
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