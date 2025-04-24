import { EC2, IAM } from 'aws-sdk';
import { AwsClientManager } from '../aws-client';
import { prisma } from '../prisma';

// Tipos para os itens de verificação
export interface EC2SecurityGroup {
  id: string;
  name: string;
  description: string;
  vpcId: string;
  inboundRules: SecurityGroupRule[];
  outboundRules: SecurityGroupRule[];
  issues: SecurityGroupIssue[];
}

export interface SecurityGroupRule {
  protocol: string;
  fromPort: number;
  toPort: number;
  ipRanges: IPRange[];
  ipv6Ranges: IPRange[];
}

export interface IPRange {
  cidr: string;
  description?: string;
}

export interface SecurityGroupIssue {
  type: 'OPEN_SSH' | 'OPEN_RDP' | 'OPEN_ALL_PORTS' | 'WIDE_IP_RANGE' | 'OPEN_IPV6';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedRule: SecurityGroupRule;
}

export interface NetworkACL {
  id: string;
  vpcId: string;
  default: boolean;
  inboundRules: ACLRule[];
  outboundRules: ACLRule[];
  issues: ACLIssue[];
}

export interface ACLRule {
  ruleNumber: number;
  protocol: string;
  action: string;
  cidrBlock: string;
  fromPort: number;
  toPort: number;
}

export interface ACLIssue {
  type: 'PERMISSIVE_ACL' | 'SUSPICIOUS_IP';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  affectedRule: ACLRule;
}

export interface EC2Instance {
  id: string;
  type: string;
  state: string;
  publicIp?: string;
  privateIp?: string;
  subnetId?: string;
  vpcId?: string;
  launchTime?: Date;
  imageId?: string;
  keyName?: string;
  iamInstanceProfile?: string;
  issues: EC2InstanceIssue[];
}

export interface EC2InstanceIssue {
  type: 'PUBLIC_IP' | 'PUBLIC_SUBNET' | 'OLD_AMI' | 'LONG_RUNNING' | 'EXCESSIVE_IAM_PERMISSIONS' | 'MISSING_TAGS';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface EC2KeyPair {
  name: string;
  fingerprint: string;
  issues: KeyPairIssue[];
}

export interface KeyPairIssue {
  type: 'UNUSED_KEY' | 'OLD_KEY';
  description: string;
  severity: 'LOW' | 'MEDIUM';
}

export interface EC2Volume {
  id: string;
  instanceId?: string;
  size: number;
  type: string;
  encrypted: boolean;
  state: string;
  issues: VolumeIssue[];
}

export interface VolumeIssue {
  type: 'UNENCRYPTED' | 'PUBLIC_SNAPSHOT';
  description: string;
  severity: 'MEDIUM' | 'HIGH';
}

export interface EC2SecuritySummary {
  securityGroups: EC2SecurityGroup[];
  networkAcls: NetworkACL[];
  instances: EC2Instance[];
  keyPairs: EC2KeyPair[];
  volumes: EC2Volume[];
  iamRoles: IAMRole[];
}

export interface IAMRole {
  name: string;
  arn: string;
  instanceProfiles: string[];
  permissions: string[];
  issues: IAMRoleIssue[];
}

export interface IAMRoleIssue {
  type: 'WIDE_PERMISSIONS' | 'UNUSED_ROLE';
  description: string;
  severity: 'MEDIUM' | 'HIGH';
}

export class EC2SecurityService {
  private ec2Client!: EC2;
  private iamClient!: IAM;
  private credentialId: string;

  constructor(credentialId: string) {
    this.credentialId = credentialId;
  }

  private async initialize() {
    const credential = await prisma.awsCredential.findUnique({
      where: { id: this.credentialId }
    });

    if (!credential) {
      throw new Error('Credencial não encontrada');
    }

    const awsClient = AwsClientManager.getInstance(credential);
    this.ec2Client = awsClient.getEC2Client();
    this.iamClient = awsClient.getIAMClient();
  }

  /**
   * Verifica problemas de segurança em todos os recursos EC2
   */
  async checkEC2Security(): Promise<EC2SecuritySummary> {
    await this.initialize();

    const [
      securityGroups,
      networkAcls,
      instances,
      keyPairs,
      volumes,
      iamRoles
    ] = await Promise.all([
      this.checkSecurityGroups(),
      this.checkNetworkACLs(),
      this.checkEC2Instances(),
      this.checkKeyPairs(),
      this.checkVolumes(),
      this.checkIAMRoles()
    ]);

    return {
      securityGroups,
      networkAcls,
      instances,
      keyPairs,
      volumes,
      iamRoles
    };
  }

  /**
   * Verifica problemas de segurança em Security Groups
   */
  async checkSecurityGroups(): Promise<EC2SecurityGroup[]> {
    const result = await this.ec2Client.describeSecurityGroups().promise();
    
    if (!result.SecurityGroups) {
      return [];
    }

    const securityGroups: EC2SecurityGroup[] = [];

    for (const group of result.SecurityGroups) {
      const sgId = group.GroupId || '';
      const sgName = group.GroupName || '';
      const sgDesc = group.Description || '';
      const vpcId = group.VpcId || '';

      // Processar regras de entrada
      const inboundRules: SecurityGroupRule[] = (group.IpPermissions || []).map(perm => ({
        protocol: perm.IpProtocol || '-1',
        fromPort: perm.FromPort || 0,
        toPort: perm.ToPort || 65535,
        ipRanges: (perm.IpRanges || []).map(range => ({
          cidr: range.CidrIp || '',
          description: range.Description
        })),
        ipv6Ranges: (perm.Ipv6Ranges || []).map(range => ({
          cidr: range.CidrIpv6 || '',
          description: range.Description
        }))
      }));

      // Processar regras de saída
      const outboundRules: SecurityGroupRule[] = (group.IpPermissionsEgress || []).map(perm => ({
        protocol: perm.IpProtocol || '-1',
        fromPort: perm.FromPort || 0,
        toPort: perm.ToPort || 65535,
        ipRanges: (perm.IpRanges || []).map(range => ({
          cidr: range.CidrIp || '',
          description: range.Description
        })),
        ipv6Ranges: (perm.Ipv6Ranges || []).map(range => ({
          cidr: range.CidrIpv6 || '',
          description: range.Description
        }))
      }));

      // Verificar problemas de segurança
      const issues: SecurityGroupIssue[] = [];

      // Verificar regras de entrada para problemas comuns
      for (const rule of inboundRules) {
        // Verificar SSH aberto para todos (porta 22)
        if ((rule.fromPort <= 22 && rule.toPort >= 22) || rule.protocol === '-1') {
          for (const ipRange of rule.ipRanges) {
            if (ipRange.cidr === '0.0.0.0/0') {
              issues.push({
                type: 'OPEN_SSH',
                description: 'SSH (porta 22) está aberto para qualquer IP (0.0.0.0/0)',
                severity: 'HIGH',
                affectedRule: rule
              });
            }
          }
        }

        // Verificar RDP aberto para todos (porta 3389)
        if ((rule.fromPort <= 3389 && rule.toPort >= 3389) || rule.protocol === '-1') {
          for (const ipRange of rule.ipRanges) {
            if (ipRange.cidr === '0.0.0.0/0') {
              issues.push({
                type: 'OPEN_RDP',
                description: 'RDP (porta 3389) está aberto para qualquer IP (0.0.0.0/0)',
                severity: 'HIGH',
                affectedRule: rule
              });
            }
          }
        }

        // Verificar todas as portas abertas
        if (rule.protocol === '-1' || (rule.fromPort === 0 && rule.toPort === 65535)) {
          for (const ipRange of rule.ipRanges) {
            if (ipRange.cidr === '0.0.0.0/0') {
              issues.push({
                type: 'OPEN_ALL_PORTS',
                description: 'Todas as portas estão abertas para qualquer IP (0.0.0.0/0)',
                severity: 'CRITICAL',
                affectedRule: rule
              });
            } else if (ipRange.cidr.endsWith('/0') || ipRange.cidr.endsWith('/1') || 
                    ipRange.cidr.endsWith('/2') || ipRange.cidr.endsWith('/3') || 
                    ipRange.cidr.endsWith('/4') || ipRange.cidr.endsWith('/5') || 
                    ipRange.cidr.endsWith('/6') || ipRange.cidr.endsWith('/7') || 
                    ipRange.cidr.endsWith('/8')) {
              issues.push({
                type: 'WIDE_IP_RANGE',
                description: `Amplo intervalo de IPs (${ipRange.cidr}) tem acesso a todas as portas`,
                severity: 'HIGH',
                affectedRule: rule
              });
            }
          }
        }

        // Verificar IPv6 aberto
        for (const ipv6Range of rule.ipv6Ranges) {
          if (ipv6Range.cidr === '::/0') {
            issues.push({
              type: 'OPEN_IPV6',
              description: `IPv6 está completamente aberto (::/0) para portas ${rule.fromPort}-${rule.toPort}`,
              severity: 'HIGH',
              affectedRule: rule
            });
          }
        }
      }

      securityGroups.push({
        id: sgId,
        name: sgName,
        description: sgDesc,
        vpcId,
        inboundRules,
        outboundRules,
        issues
      });
    }

    return securityGroups;
  }

  /**
   * Verifica problemas de segurança em Network ACLs
   */
  async checkNetworkACLs(): Promise<NetworkACL[]> {
    const result = await this.ec2Client.describeNetworkAcls().promise();
    
    if (!result.NetworkAcls) {
      return [];
    }

    const networkAcls: NetworkACL[] = [];

    for (const acl of result.NetworkAcls) {
      const aclId = acl.NetworkAclId || '';
      const vpcId = acl.VpcId || '';
      const isDefault = acl.IsDefault || false;

      // Processar regras de entrada
      const inboundRules: ACLRule[] = (acl.Entries || [])
        .filter(entry => !entry.Egress)
        .map(entry => ({
          ruleNumber: entry.RuleNumber || 0,
          protocol: entry.Protocol || '-1',
          action: entry.RuleAction || 'deny',
          cidrBlock: entry.CidrBlock || '',
          fromPort: entry.PortRange?.From || 0,
          toPort: entry.PortRange?.To || 65535
        }));

      // Processar regras de saída
      const outboundRules: ACLRule[] = (acl.Entries || [])
        .filter(entry => entry.Egress)
        .map(entry => ({
          ruleNumber: entry.RuleNumber || 0,
          protocol: entry.Protocol || '-1',
          action: entry.RuleAction || 'deny',
          cidrBlock: entry.CidrBlock || '',
          fromPort: entry.PortRange?.From || 0,
          toPort: entry.PortRange?.To || 65535
        }));

      // Verificar problemas de segurança
      const issues: ACLIssue[] = [];

      // Verificar ACLs muito permissivas
      for (const rule of inboundRules) {
        if (rule.action === 'allow' && rule.cidrBlock === '0.0.0.0/0' &&
            (rule.protocol === '-1' || (rule.fromPort === 0 && rule.toPort === 65535))) {
          issues.push({
            type: 'PERMISSIVE_ACL',
            description: 'Network ACL permite todo tráfego de entrada de qualquer origem',
            severity: 'HIGH',
            affectedRule: rule
          });
        }
      }

      networkAcls.push({
        id: aclId,
        vpcId,
        default: isDefault,
        inboundRules,
        outboundRules,
        issues
      });
    }

    return networkAcls;
  }

  /**
   * Verifica problemas de segurança em instâncias EC2
   */
  async checkEC2Instances(): Promise<EC2Instance[]> {
    const result = await this.ec2Client.describeInstances().promise();
    
    if (!result.Reservations) {
      return [];
    }

    const instances: EC2Instance[] = [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Obter mapeamento de subnets públicas
    const subnetsResult = await this.ec2Client.describeSubnets().promise();
    const publicSubnets = new Set<string>();
    
    if (subnetsResult.Subnets) {
      for (const subnet of subnetsResult.Subnets) {
        if (subnet.MapPublicIpOnLaunch && subnet.SubnetId) {
          publicSubnets.add(subnet.SubnetId);
        }
      }
    }

    for (const reservation of result.Reservations || []) {
      for (const instance of reservation.Instances || []) {
        const instanceId = instance.InstanceId || '';
        const issues: EC2InstanceIssue[] = [];

        // Verificar IP público
        if (instance.PublicIpAddress) {
          issues.push({
            type: 'PUBLIC_IP',
            description: 'Instância possui um IP público diretamente exposto à internet',
            severity: 'MEDIUM'
          });
        }

        // Verificar subnet pública
        if (instance.SubnetId && publicSubnets.has(instance.SubnetId)) {
          issues.push({
            type: 'PUBLIC_SUBNET',
            description: 'Instância está em uma subnet pública que atribui IPs públicos automaticamente',
            severity: 'MEDIUM'
          });
        }

        // Verificar AMI antiga
        // Implementação simplificada - idealmente checaríamos a data de criação da AMI
        if (instance.ImageId && !instance.ImageId.startsWith('ami-0')) {
          issues.push({
            type: 'OLD_AMI',
            description: 'Instância pode estar usando uma AMI desatualizada',
            severity: 'MEDIUM'
          });
        }

        // Verificar instância em execução por muito tempo
        if (instance.LaunchTime) {
          const launchTime = new Date(instance.LaunchTime);
          if (launchTime < ninetyDaysAgo && instance.State?.Name === 'running') {
            issues.push({
              type: 'LONG_RUNNING',
              description: 'Instância está em execução por mais de 90 dias sem interrupção',
              severity: 'LOW'
            });
          }
        }

        // Verificar tags
        if (!instance.Tags || instance.Tags.length === 0) {
          issues.push({
            type: 'MISSING_TAGS',
            description: 'Instância não possui tags, dificultando auditoria e gestão',
            severity: 'LOW'
          });
        }

        instances.push({
          id: instanceId,
          type: instance.InstanceType || '',
          state: instance.State?.Name || '',
          publicIp: instance.PublicIpAddress,
          privateIp: instance.PrivateIpAddress,
          subnetId: instance.SubnetId,
          vpcId: instance.VpcId,
          launchTime: instance.LaunchTime,
          imageId: instance.ImageId,
          keyName: instance.KeyName,
          iamInstanceProfile: instance.IamInstanceProfile?.Arn,
          issues
        });
      }
    }

    // Verificar papéis IAM excessivamente permissivos
    const iamRoles = await this.checkIAMRoles();
    const roleIssues = new Map<string, IAMRoleIssue[]>();
    
    for (const role of iamRoles) {
      if (role.issues.length > 0) {
        roleIssues.set(role.name, role.issues);
      }
    }

    // Adicionar problemas de papéis IAM às instâncias
    for (const instance of instances) {
      if (instance.iamInstanceProfile) {
        const roleName = instance.iamInstanceProfile.split('/').pop();
        if (roleName && roleIssues.has(roleName)) {
          const foundIssues = roleIssues.get(roleName) || [];
          for (const issue of foundIssues) {
            instance.issues.push({
              type: 'EXCESSIVE_IAM_PERMISSIONS',
              description: `Instância usa role IAM (${roleName}) com permissões excessivas: ${issue.description}`,
              severity: 'HIGH'
            });
          }
        }
      }
    }

    return instances;
  }

  /**
   * Verifica problemas de segurança em pares de chaves EC2
   */
  async checkKeyPairs(): Promise<EC2KeyPair[]> {
    const result = await this.ec2Client.describeKeyPairs().promise();
    
    if (!result.KeyPairs) {
      return [];
    }

    const keyPairs: EC2KeyPair[] = [];
    
    // Obter todas as instâncias para verificar chaves em uso
    const instancesResult = await this.ec2Client.describeInstances().promise();
    const usedKeyNames = new Set<string>();
    
    for (const reservation of instancesResult.Reservations || []) {
      for (const instance of reservation.Instances || []) {
        if (instance.KeyName) {
          usedKeyNames.add(instance.KeyName);
        }
      }
    }

    for (const keyPair of result.KeyPairs) {
      const keyName = keyPair.KeyName || '';
      const issues: KeyPairIssue[] = [];

      // Verificar chaves não utilizadas
      if (!usedKeyNames.has(keyName)) {
        issues.push({
          type: 'UNUSED_KEY',
          description: 'Par de chaves não está sendo usado por nenhuma instância',
          severity: 'LOW'
        });
      }

      keyPairs.push({
        name: keyName,
        fingerprint: keyPair.KeyFingerprint || '',
        issues
      });
    }

    return keyPairs;
  }

  /**
   * Verifica problemas de segurança em volumes EBS
   */
  async checkVolumes(): Promise<EC2Volume[]> {
    const result = await this.ec2Client.describeVolumes().promise();
    
    if (!result.Volumes) {
      return [];
    }

    const volumes: EC2Volume[] = [];

    for (const volume of result.Volumes) {
      const volumeId = volume.VolumeId || '';
      const issues: VolumeIssue[] = [];

      // Verificar criptografia
      if (!volume.Encrypted) {
        issues.push({
          type: 'UNENCRYPTED',
          description: 'Volume EBS não está criptografado',
          severity: 'MEDIUM'
        });
      }

      // Verificar snapshots públicos
      // Isso exigiria verificar os snapshots do volume, o que é um processo mais complexo
      // Esta é uma implementação simplificada

      volumes.push({
        id: volumeId,
        instanceId: volume.Attachments && volume.Attachments[0] ? volume.Attachments[0].InstanceId : undefined,
        size: volume.Size || 0,
        type: volume.VolumeType || '',
        encrypted: volume.Encrypted || false,
        state: volume.State || '',
        issues
      });
    }

    return volumes;
  }

  /**
   * Verifica problemas de segurança em papéis IAM associados a instâncias EC2
   */
  async checkIAMRoles(): Promise<IAMRole[]> {
    const result = await this.iamClient.listRoles().promise();
    
    if (!result.Roles) {
      return [];
    }

    const roles: IAMRole[] = [];
    
    // Obter perfis de instância para verificar papéis em uso
    const instanceProfilesResult = await this.iamClient.listInstanceProfiles().promise();
    const roleToProfiles = new Map<string, string[]>();
    
    for (const profile of instanceProfilesResult.InstanceProfiles || []) {
      if (profile.Roles && profile.Roles.length > 0 && profile.InstanceProfileName) {
        for (const role of profile.Roles) {
          if (role.RoleName) {
            const profiles = roleToProfiles.get(role.RoleName) || [];
            profiles.push(profile.InstanceProfileName);
            roleToProfiles.set(role.RoleName, profiles);
          }
        }
      }
    }

    for (const role of result.Roles) {
      const roleName = role.RoleName || '';
      const issues: IAMRoleIssue[] = [];
      let permissions: string[] = [];

      // Obter políticas anexadas ao papel
      const attachedPoliciesResult = await this.iamClient.listAttachedRolePolicies({
        RoleName: roleName
      }).promise();

      // Verificar políticas para permissões excessivas
      for (const policy of attachedPoliciesResult.AttachedPolicies || []) {
        if (policy.PolicyArn && policy.PolicyName) {
          try {
            // Obter detalhes da política
            const policyVersionsResult = await this.iamClient.listPolicyVersions({
              PolicyArn: policy.PolicyArn
            }).promise();
            
            const defaultVersionId = policyVersionsResult.Versions?.find(v => v.IsDefaultVersion)?.VersionId;
            
            if (defaultVersionId) {
              const policyDetailsResult = await this.iamClient.getPolicyVersion({
                PolicyArn: policy.PolicyArn,
                VersionId: defaultVersionId
              }).promise();
              
              if (policyDetailsResult.PolicyVersion?.Document) {
                const policyDocument = JSON.parse(decodeURIComponent(policyDetailsResult.PolicyVersion.Document));
                
                // Verificar permissões "*:*"
                const hasWildcardPermissions = this.checkForWildcardPermissions(policyDocument);
                
                if (hasWildcardPermissions) {
                  issues.push({
                    type: 'WIDE_PERMISSIONS',
                    description: `Política ${policy.PolicyName} contém permissões excessivamente amplas (tipo "*:*")`,
                    severity: 'HIGH'
                  });
                }
                
                // Adicionar as permissões à lista
                permissions = permissions.concat(this.extractPermissions(policyDocument));
              }
            }
          } catch (error) {
            console.error(`Erro ao verificar política ${policy.PolicyName}:`, error);
          }
        }
      }

      // Verificar papéis não utilizados
      const instanceProfiles = roleToProfiles.get(roleName) || [];
      if (instanceProfiles.length === 0 && roleName.toLowerCase().includes('ec2')) {
        issues.push({
          type: 'UNUSED_ROLE',
          description: 'Papel IAM não está sendo usado por nenhuma instância EC2',
          severity: 'MEDIUM'
        });
      }

      roles.push({
        name: roleName,
        arn: role.Arn || '',
        instanceProfiles,
        permissions,
        issues
      });
    }

    return roles;
  }

  /**
   * Verifica se uma política contém permissões do tipo "*:*"
   */
  private checkForWildcardPermissions(policyDocument: any): boolean {
    if (policyDocument.Statement) {
      for (const statement of Array.isArray(policyDocument.Statement) 
           ? policyDocument.Statement : [policyDocument.Statement]) {
        if (statement.Effect === 'Allow') {
          if (statement.Action === '*') {
            return true;
          }
          
          if (Array.isArray(statement.Action) && statement.Action.includes('*')) {
            return true;
          }
          
          if (statement.Resource === '*') {
            if (typeof statement.Action === 'string' && statement.Action.includes('*')) {
              return true;
            }
            
            if (Array.isArray(statement.Action)) {
              for (const action of statement.Action) {
                if (typeof action === 'string' && action.includes('*')) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    
    return false;
  }

  /**
   * Extrai permissões de uma política
   */
  private extractPermissions(policyDocument: any): string[] {
    const permissions: string[] = [];
    
    if (policyDocument.Statement) {
      for (const statement of Array.isArray(policyDocument.Statement) 
           ? policyDocument.Statement : [policyDocument.Statement]) {
        if (statement.Effect === 'Allow') {
          if (typeof statement.Action === 'string') {
            permissions.push(statement.Action);
          } else if (Array.isArray(statement.Action)) {
            permissions.push(...statement.Action);
          }
        }
      }
    }
    
    return permissions;
  }
} 