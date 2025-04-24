import AWS from 'aws-sdk';

// Definição do tipo AwsCredential
interface AwsCredential {
  id: string;
  accessKeyId: string;
  secretKey: string;
  region: string;
}

// Interface para centralizar configurações de cache
interface CacheConfig {
  ttl: number; // tempo de vida em ms
  maxSize: number; // número máximo de entradas
}

export class AwsClientManager {
  private static instances: Map<string, { instance: AwsClientManager, lastAccessed: number }> = new Map();
  private static cleanupInterval: NodeJS.Timeout | null = null;
  private static readonly DEFAULT_CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutos
  private static readonly DEFAULT_INSTANCE_TTL = 60 * 60 * 1000; // 1 hora

  private credentials: AwsCredential;
  private cloudWatchClient: AWS.CloudWatch;
  private ec2Client: AWS.EC2;
  private s3Client: AWS.S3;
  private cloudFrontClient: AWS.CloudFront;
  private rdsClient: AWS.RDS;
  private iamClient: AWS.IAM;
  private guardDutyClient: AWS.GuardDuty;

  private constructor(credentials: AwsCredential) {
    console.log(`Inicializando AwsClientManager para credencial ${credentials.id}`);
    
    try {
      this.credentials = credentials;
      
      // Verificar dados da credencial
      if (!credentials.accessKeyId || !credentials.secretKey || !credentials.region) {
        console.error('Credenciais AWS inválidas:', {
          hasAccessKey: !!credentials.accessKeyId,
          hasSecretKey: !!credentials.secretKey,
          hasRegion: !!credentials.region
        });
        throw new Error('Credenciais AWS inválidas ou incompletas');
      }
      
      // Configuração para lidar com problemas comuns de rede e tempo limite
      AWS.config.update({
        maxRetries: 3,
        httpOptions: {
          timeout: 30000, // Aumentado para 30s
          connectTimeout: 15000
        }
      });
      
      const awsConfig = {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretKey,
        region: credentials.region
      };
      
      console.log(`Configurando clientes AWS para região ${credentials.region}`);

      // Inicialização dos clientes com configuração padrão
      this.cloudWatchClient = new AWS.CloudWatch(awsConfig);
      this.ec2Client = new AWS.EC2(awsConfig);
      this.s3Client = new AWS.S3({
        ...awsConfig,
        sslEnabled: true,
      });
      this.cloudFrontClient = new AWS.CloudFront(awsConfig);
      this.rdsClient = new AWS.RDS(awsConfig);
      this.iamClient = new AWS.IAM(awsConfig);
      this.guardDutyClient = new AWS.GuardDuty(awsConfig);
      
      console.log('AwsClientManager inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar AwsClientManager:', error);
      throw error;
    }
  }

  static getInstance(credentials: AwsCredential): AwsClientManager {
    try {
      if (!credentials || !credentials.id) {
        console.error('Credenciais inválidas fornecidas para getInstance:', credentials);
        throw new Error('Credenciais inválidas');
      }
      
      // Iniciar o mecanismo de limpeza automática se ainda não estiver rodando
      this.startCleanupTimer();
      
      // Verificar se a instância existe e atualizar o timestamp de último acesso
      const existingEntry = this.instances.get(credentials.id);
      if (existingEntry) {
        existingEntry.lastAccessed = Date.now();
        return existingEntry.instance;
      }
      
      // Criar nova instância
      console.log(`Criando nova instância de AwsClientManager para credencial ${credentials.id}`);
      const instance = new AwsClientManager(credentials);
      this.instances.set(credentials.id, { 
        instance, 
        lastAccessed: Date.now() 
      });
      
      return instance;
    } catch (error) {
      console.error(`Erro ao obter instância de AwsClientManager:`, error);
      throw error;
    }
  }

  // Mecanismo para evitar vazamento de memória: limpar instâncias não utilizadas
  private static startCleanupTimer() {
    if (this.cleanupInterval === null) {
      console.log('Iniciando timer de limpeza de instâncias AwsClientManager');
      this.cleanupInterval = setInterval(() => {
        this.cleanupUnusedInstances();
      }, this.DEFAULT_CLEANUP_INTERVAL);
      
      // Garantir que o timer não impede o processo de encerrar
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  private static cleanupUnusedInstances() {
    console.log(`Verificando instâncias não utilizadas. Total atual: ${this.instances.size}`);
    const now = Date.now();
    const keysToRemove: string[] = [];
    
    this.instances.forEach((entry, key) => {
      if (now - entry.lastAccessed > this.DEFAULT_INSTANCE_TTL) {
        keysToRemove.push(key);
      }
    });
    
    keysToRemove.forEach(key => {
      console.log(`Removendo instância não utilizada: ${key}`);
      this.instances.delete(key);
    });
    
    console.log(`Limpeza concluída. Instâncias removidas: ${keysToRemove.length}, restantes: ${this.instances.size}`);
  }

  // Método público para forçar remoção de uma instância
  static removeInstance(credentialId: string): void {
    if (this.instances.has(credentialId)) {
      console.log(`Removendo instância manualmente: ${credentialId}`);
      this.instances.delete(credentialId);
    }
  }

  // Método para encerrar o timer de limpeza (útil em testes ou ao encerrar a aplicação)
  static stopCleanupTimer() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('Timer de limpeza de instâncias AWS parado');
    }
  }

  // Métodos getters para os clientes
  getCloudWatchClient(): AWS.CloudWatch {
    return this.cloudWatchClient;
  }

  getEC2Client(): AWS.EC2 {
    return this.ec2Client;
  }

  getS3Client(): AWS.S3 {
    return this.s3Client;
  }

  getCloudFrontClient(): AWS.CloudFront {
    return this.cloudFrontClient;
  }

  getRDSClient(): AWS.RDS {
    return this.rdsClient;
  }

  getIAMClient(): AWS.IAM {
    return this.iamClient;
  }

  getGuardDutyClient(): AWS.GuardDuty {
    return this.guardDutyClient;
  }
} 