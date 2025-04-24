import { AwsClientManager } from '../aws-client';
import { AwsCredentialRepository } from '../repositories/aws-credential-repository';

// Interfaces para definir contratos claros
export interface IAMUser {
  id: string;
  name: string;
  arn: string;
  createDate: string | undefined;
  passwordLastUsed: string | undefined;
  hasConsoleAccess: boolean;
  hasMfa: boolean;
  accessKeysCount: number;
  policiesCount: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export class IAMService {
  private credentialRepository: AwsCredentialRepository;
  private cache: Map<string, { data: IAMUser[], timestamp: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutos em ms
  
  constructor() {
    this.credentialRepository = new AwsCredentialRepository();
  }
  
  async getUsers(credentialId: string): Promise<IAMUser[]> {
    console.log(`Buscando usuários IAM para credencial ID: ${credentialId}`);
    
    // Verificar cache
    const cached = this.cache.get(credentialId);
    if (cached && (Date.now() - cached.timestamp < this.cacheTTL)) {
      console.log(`Usando dados em cache para usuários IAM (credencial: ${credentialId})`);
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
      const iamClient = awsClient.getIAMClient();
      
      // Buscar usuários
      const listUsersResult = await iamClient.listUsers().promise();
      
      if (!listUsersResult.Users || listUsersResult.Users.length === 0) {
        return [];
      }
      
      // Processar cada usuário para obter detalhes adicionais
      const userPromises = listUsersResult.Users.map(async (user) => {
        try {
          // Executar chamadas em paralelo para melhor desempenho
          const [
            policiesResult,
            loginProfileResult,
            mfaDevicesResult,
            accessKeysResult
          ] = await Promise.all([
            // Obter políticas anexadas ao usuário
            iamClient.listAttachedUserPolicies({
              UserName: user.UserName!
            }).promise().catch(() => ({ AttachedPolicies: [] })),
            
            // Verificar se tem acesso ao console
            iamClient.getLoginProfile({
              UserName: user.UserName!
            }).promise().catch(() => ({ LoginProfile: null })),
            
            // Verificar se tem MFA
            iamClient.listMFADevices({
              UserName: user.UserName!
            }).promise().catch(() => ({ MFADevices: [] })),
            
            // Verificar access keys
            iamClient.listAccessKeys({
              UserName: user.UserName!
            }).promise().catch(() => ({ AccessKeyMetadata: [] }))
          ]);
          
          const hasConsoleAccess = !!loginProfileResult.LoginProfile;
          const hasMfa = (mfaDevicesResult.MFADevices?.length || 0) > 0;
          const accessKeysCount = accessKeysResult.AccessKeyMetadata?.length || 0;
          
          return {
            id: user.UserId!,
            name: user.UserName!,
            arn: user.Arn!,
            createDate: user.CreateDate?.toISOString(),
            passwordLastUsed: user.PasswordLastUsed?.toISOString(),
            hasConsoleAccess,
            hasMfa,
            accessKeysCount,
            policiesCount: policiesResult.AttachedPolicies?.length || 0,
            riskLevel: this.calculateRiskLevel(hasConsoleAccess, hasMfa, accessKeysCount)
          };
        } catch (error) {
          console.error(`Erro ao obter detalhes do usuário ${user.UserName}:`, error);
          
          // Retornar informações básicas em caso de erro
          return {
            id: user.UserId!,
            name: user.UserName!,
            arn: user.Arn!,
            createDate: user.CreateDate?.toISOString(),
            passwordLastUsed: user.PasswordLastUsed?.toISOString(),
            hasConsoleAccess: false,
            hasMfa: false,
            accessKeysCount: 0,
            policiesCount: 0,
            riskLevel: 'low'
          };
        }
      });
      
      // Esperar por todos os detalhes de usuários
      const users = await Promise.all(userPromises);
      
      // Armazenar no cache
      this.cache.set(credentialId, {
        data: users,
        timestamp: Date.now()
      });
      
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários IAM:', error);
      throw error;
    }
  }
  
  // Cálculo de nível de risco
  private calculateRiskLevel(
    hasConsoleAccess: boolean, 
    hasMfa: boolean, 
    accessKeysCount: number
  ): 'low' | 'medium' | 'high' {
    if (!hasMfa && hasConsoleAccess) {
      return 'high';
    } else if (accessKeysCount === 2) {
      return 'medium';
    } else {
      return 'low';
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