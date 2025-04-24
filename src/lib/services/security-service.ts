import { AwsClientManager } from '../aws-client';
import { AwsCredentialRepository } from '../repositories/aws-credential-repository';
import { SecurityIssue } from '../aws-service';

export class SecurityService {
  private credentialRepository: AwsCredentialRepository;
  private cache: Map<string, { data: SecurityIssue[], timestamp: number }> = new Map();
  private cacheTTL = 10 * 60 * 1000; // 10 minutos em ms
  
  constructor() {
    this.credentialRepository = new AwsCredentialRepository();
  }
  
  async getSecurityIssues(credentialId: string): Promise<SecurityIssue[]> {
    console.log(`Buscando problemas de segurança para credencial ID: ${credentialId}`);
    
    // Verificar cache
    const cached = this.cache.get(credentialId);
    if (cached && (Date.now() - cached.timestamp < this.cacheTTL)) {
      console.log(`Usando dados em cache para problemas de segurança (credencial: ${credentialId})`);
      return cached.data;
    }
    
    // Se não estiver em cache, buscar da API
    const credential = await this.credentialRepository.findById(credentialId);
    if (!credential) {
      throw new Error('Credencial não encontrada');
    }

    try {
      const awsClient = AwsClientManager.getInstance(credential);
      const securityIssues: SecurityIssue[] = [];
      
      // Buscar e processar problemas de segurança em paralelo
      await Promise.all([
        this.checkGuardDutyIssues(awsClient, securityIssues),
        this.checkS3SecurityIssues(awsClient, securityIssues)
      ]);
      
      // Armazenar no cache
      this.cache.set(credentialId, {
        data: securityIssues,
        timestamp: Date.now()
      });
      
      return securityIssues;
    } catch (error) {
      console.error('Erro ao buscar problemas de segurança:', error);
      throw error;
    }
  }
  
  private async checkGuardDutyIssues(awsClient: AwsClientManager, securityIssues: SecurityIssue[]): Promise<void> {
    try {
      const guardDutyClient = awsClient.getGuardDutyClient();
      
      // Verificar detectores do GuardDuty
      const detectors = await guardDutyClient.listDetectors().promise();
      
      if (detectors.DetectorIds && detectors.DetectorIds.length > 0) {
        // Para cada detector, buscar as descobertas
        for (const detectorId of detectors.DetectorIds) {
          const findings = await guardDutyClient.listFindings({
            DetectorId: detectorId,
            FindingCriteria: {
              Criterion: {
                'severity': {
                  Gte: 4.0 // Severidade média ou maior
                }
              }
            }
          }).promise();
          
          if (findings.FindingIds && findings.FindingIds.length > 0) {
            const findingDetails = await guardDutyClient.getFindings({
              DetectorId: detectorId,
              FindingIds: findings.FindingIds
            }).promise();
            
            if (findingDetails.Findings) {
              for (const finding of findingDetails.Findings) {
                securityIssues.push({
                  resourceId: finding.Resource?.InstanceDetails?.InstanceId || finding.Id || '',
                  resourceType: 'EC2',
                  title: finding.Title || 'Security Issue Detected',
                  description: finding.Description || '',
                  severity: finding.Severity && finding.Severity >= 7 ? 'HIGH' 
                    : finding.Severity && finding.Severity >= 4 ? 'MEDIUM' : 'LOW'
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar problemas no GuardDuty:', error);
      // Continuar com outros checks mesmo se este falhar
    }
  }
  
  private async checkS3SecurityIssues(awsClient: AwsClientManager, securityIssues: SecurityIssue[]): Promise<void> {
    try {
      const s3Client = awsClient.getS3Client();
      
      // Verificar configurações de segurança do S3
      const { Buckets } = await s3Client.listBuckets().promise();
      
      if (Buckets) {
        const checks = Buckets.map(async (bucket) => {
          try {
            const bucketPolicy = await s3Client.getBucketPolicy({ Bucket: bucket.Name || '' }).promise();
            
            // Análise simples para buckets públicos
            if (bucketPolicy.Policy && bucketPolicy.Policy.includes('"Effect":"Allow"') && 
                bucketPolicy.Policy.includes('"Principal":"*"')) {
              securityIssues.push({
                resourceId: bucket.Name || '',
                resourceType: 'S3',
                title: 'S3 Bucket possivelmente público',
                description: `O bucket ${bucket.Name} tem uma política que pode permitir acesso público.`,
                severity: 'HIGH'
              });
            }
          } catch (error) {
            // Se não tiver política, verificar se tem configuração pública
            try {
              const publicAccessBlock = await s3Client.getPublicAccessBlock({ Bucket: bucket.Name || '' }).promise();
              
              if (!publicAccessBlock.PublicAccessBlockConfiguration?.BlockPublicAcls ||
                  !publicAccessBlock.PublicAccessBlockConfiguration?.BlockPublicPolicy) {
                securityIssues.push({
                  resourceId: bucket.Name || '',
                  resourceType: 'S3',
                  title: 'S3 Bucket com bloqueio de acesso público desativado',
                  description: `O bucket ${bucket.Name} não tem todas as configurações de bloqueio de acesso público ativadas.`,
                  severity: 'MEDIUM'
                });
              }
            } catch (blockError) {
              // Provavelmente não tem configuração de bloqueio
              securityIssues.push({
                resourceId: bucket.Name || '',
                resourceType: 'S3',
                title: 'S3 Bucket sem configuração de bloqueio de acesso público',
                description: `O bucket ${bucket.Name} pode não ter configurações de bloqueio de acesso público.`,
                severity: 'MEDIUM'
              });
            }
          }
        });
        
        // Executar todos os checks em paralelo
        await Promise.all(checks);
      }
    } catch (error) {
      console.error('Erro ao verificar problemas de segurança no S3:', error);
      // Continuar com outros checks mesmo se este falhar
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