import AWS from 'aws-sdk';
import { AwsClientManager } from '../aws-client';
import { 
  IAMClient, 
  GetUserCommand,
  ListUsersCommand,
  CreateUserCommand,
  DeleteUserCommand,
  ListUserPoliciesCommand,
  GetPolicyCommand,
  ListAttachedUserPoliciesCommand,
  AttachUserPolicyCommand,
  DetachUserPolicyCommand,
  CreateAccessKeyCommand,
  ListAccessKeysCommand,
  DeleteAccessKeyCommand,
  CreateLoginProfileCommand,
  DeleteLoginProfileCommand,
  ListGroupsCommand,
  CreateGroupCommand,
  DeleteGroupCommand,
  GetGroupCommand,
  AddUserToGroupCommand,
  RemoveUserFromGroupCommand,
  ListAttachedGroupPoliciesCommand,
  AttachGroupPolicyCommand,
  DetachGroupPolicyCommand
} from "@aws-sdk/client-iam";
import { AWSError, IAM as AWSIAM } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

interface AwsCredential {
  id: string;
  accessKeyId: string;
  secretKey: string;
  region: string;
}

interface IAMUser {
  UserName: string;
  UserId: string;
  Arn: string;
  CreateDate: Date;
  Path?: string;
  PasswordLastUsed?: Date;
}

interface IAMGroup {
  GroupName: string;
  GroupId: string;
  Arn: string;
  CreateDate: Date;
  Path?: string;
}

interface IAMRole {
  RoleName: string;
  RoleId: string;
  Arn: string;
  CreateDate: Date;
  Path?: string;
  AssumeRolePolicyDocument?: string;
}

interface IAMPolicy {
  PolicyName: string;
  PolicyId: string;
  Arn: string;
  CreateDate: Date;
  UpdateDate?: Date;
  Description?: string;
  AttachmentCount?: number;
  IsAttachable?: boolean;
  DefaultVersionId?: string;
}

interface PolicyAttachment {
  PolicyName: string;
  PolicyArn: string;
}

export class IAMService {
  private iamClient: AWS.IAM;

  constructor(credential: any) {
    const awsClient = AwsClientManager.getInstance(credential);
    this.iamClient = awsClient.getIAMClient();
  }

  // ===== GERENCIAMENTO DE USUÁRIOS =====

  async listUsers() {
    try {
      const result = await this.iamClient.listUsers().promise();
      return result.Users || [];
    } catch (error) {
      console.error('Erro ao listar usuários IAM:', error);
      throw error;
    }
  }

  async getUser(username: string) {
    try {
      const result = await this.iamClient.getUser({ UserName: username }).promise();
      return result.User;
    } catch (error) {
      console.error(`Erro ao obter usuário ${username}:`, error);
      throw error;
    }
  }

  async createUser(username: string, path?: string) {
    try {
      const params: AWS.IAM.CreateUserRequest = {
        UserName: username,
        ...(path && { Path: path })
      };
      const result = await this.iamClient.createUser(params).promise();
      return result.User;
    } catch (error) {
      console.error(`Erro ao criar usuário ${username}:`, error);
      throw error;
    }
  }

  async deleteUser(username: string) {
    try {
      // Primeiro verificamos as dependências e as removemos
      await this.deleteUserDependencies(username);
      
      // Agora podemos excluir o usuário
      await this.iamClient.deleteUser({ UserName: username }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao excluir usuário ${username}:`, error);
      throw error;
    }
  }

  private async deleteUserDependencies(username: string) {
    try {
      // 1. Remover usuário de todos os grupos
      const groups = await this.listGroupsForUser(username);
      for (const group of groups) {
        if (group.GroupName) {
          await this.removeUserFromGroup(username, group.GroupName);
        }
      }

      // 2. Desvincular todas as políticas
      const policies = await this.listAttachedUserPolicies(username);
      for (const policy of policies) {
        if (policy.PolicyArn) {
          await this.detachUserPolicy(username, policy.PolicyArn);
        }
      }

      // 3. Excluir chaves de acesso
      const accessKeys = await this.listAccessKeys(username);
      for (const key of accessKeys) {
        if (key.AccessKeyId) {
          await this.deleteAccessKey(username, key.AccessKeyId);
        }
      }

      // 4. Excluir certificados de assinatura
      const certificates = await this.listSigningCertificates(username);
      for (const cert of certificates) {
        if (cert.CertificateId) {
          await this.deleteSigningCertificate(username, cert.CertificateId);
        }
      }

      // 5. Excluir perfil de login se existir
      try {
        await this.deleteLoginProfile(username);
      } catch (error) {
        // Ignora erro se o perfil de login não existir
      }

      // 6. Remover dispositivos MFA
      const mfaDevices = await this.listMFADevices(username);
      for (const device of mfaDevices) {
        if (device.SerialNumber) {
          await this.deactivateMFADevice(username, device.SerialNumber);
        }
      }

      return true;
    } catch (error) {
      console.error(`Erro ao excluir dependências do usuário ${username}:`, error);
      throw error;
    }
  }

  async createLoginProfile(username: string, password: string, passwordResetRequired = true) {
    try {
      const params: AWS.IAM.CreateLoginProfileRequest = {
        UserName: username,
        Password: password,
        PasswordResetRequired: passwordResetRequired
      };
      const result = await this.iamClient.createLoginProfile(params).promise();
      return result.LoginProfile;
    } catch (error) {
      console.error(`Erro ao criar perfil de login para ${username}:`, error);
      throw error;
    }
  }

  async deleteLoginProfile(username: string) {
    try {
      await this.iamClient.deleteLoginProfile({ UserName: username }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao excluir perfil de login para ${username}:`, error);
      throw error;
    }
  }

  async createAccessKey(username: string) {
    try {
      const result = await this.iamClient.createAccessKey({ UserName: username }).promise();
      return result.AccessKey;
    } catch (error) {
      console.error(`Erro ao criar chave de acesso para ${username}:`, error);
      throw error;
    }
  }

  async deleteAccessKey(username: string, accessKeyId: string) {
    try {
      await this.iamClient.deleteAccessKey({
        UserName: username,
        AccessKeyId: accessKeyId
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao excluir chave de acesso ${accessKeyId}:`, error);
      throw error;
    }
  }

  async listAccessKeys(username: string) {
    try {
      const result = await this.iamClient.listAccessKeys({ UserName: username }).promise();
      return result.AccessKeyMetadata || [];
    } catch (error) {
      console.error(`Erro ao listar chaves de acesso para ${username}:`, error);
      throw error;
    }
  }

  async updateAccessKeyStatus(username: string, accessKeyId: string, status: 'Active' | 'Inactive') {
    try {
      await this.iamClient.updateAccessKey({
        UserName: username,
        AccessKeyId: accessKeyId,
        Status: status
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar status da chave de acesso ${accessKeyId}:`, error);
      throw error;
    }
  }

  async listSigningCertificates(username: string) {
    try {
      const result = await this.iamClient.listSigningCertificates({ UserName: username }).promise();
      return result.Certificates || [];
    } catch (error) {
      console.error(`Erro ao listar certificados para ${username}:`, error);
      throw error;
    }
  }

  async deleteSigningCertificate(username: string, certificateId: string) {
    try {
      await this.iamClient.deleteSigningCertificate({
        UserName: username,
        CertificateId: certificateId
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao excluir certificado ${certificateId}:`, error);
      throw error;
    }
  }

  async enableMFA(username: string, serialNumber: string, authenticationCode1: string, authenticationCode2: string) {
    try {
      await this.iamClient.enableMFADevice({
        UserName: username,
        SerialNumber: serialNumber,
        AuthenticationCode1: authenticationCode1,
        AuthenticationCode2: authenticationCode2
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao ativar MFA para ${username}:`, error);
      throw error;
    }
  }

  async listMFADevices(username: string) {
    try {
      const result = await this.iamClient.listMFADevices({ UserName: username }).promise();
      return result.MFADevices || [];
    } catch (error) {
      console.error(`Erro ao listar dispositivos MFA para ${username}:`, error);
      throw error;
    }
  }

  async deactivateMFADevice(username: string, serialNumber: string) {
    try {
      await this.iamClient.deactivateMFADevice({
        UserName: username,
        SerialNumber: serialNumber
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao desativar MFA para ${username}:`, error);
      throw error;
    }
  }

  // ===== GERENCIAMENTO DE GRUPOS =====

  async listGroups(): Promise<any[]> {
    try {
      const result = await this.iamClient.listGroups().promise();
      return result.Groups?.map(group => ({
        groupName: group.GroupName || '',
        groupId: group.GroupId || '',
        arn: group.Arn || '',
        createDate: group.CreateDate || new Date(),
        path: group.Path || '/',
        userCount: 0,
        managedPolicies: [],
        inlinePolicies: []
      })) || [];
    } catch (error) {
      console.error('Error listing IAM groups:', error);
      return [];
    }
  }

  async createGroup(groupName: string): Promise<any> {
    try {
      const params = {
        GroupName: groupName
      };
      const result = await this.iamClient.createGroup(params).promise();
      return {
        groupName: result.Group?.GroupName || '',
        groupId: result.Group?.GroupId || '',
        arn: result.Group?.Arn || '',
        createDate: result.Group?.CreateDate || new Date(),
        path: result.Group?.Path || '/',
        userCount: 0,
        managedPolicies: [],
        inlinePolicies: []
      };
    } catch (error) {
      console.error(`Error creating IAM group ${groupName}:`, error);
      throw error;
    }
  }

  async deleteGroup(groupName: string): Promise<void> {
    try {
      await this.iamClient.deleteGroup({ GroupName: groupName }).promise();
    } catch (error) {
      console.error(`Error deleting IAM group ${groupName}:`, error);
      throw error;
    }
  }

  async listUsersInGroup(groupName: string): Promise<AWS.IAM.User[]> {
    try {
      const response = await this.iamClient.getGroup({ GroupName: groupName }).promise();
      return response.Users || [];
    } catch (error) {
      console.error(`Erro ao listar usuários no grupo ${groupName}:`, error);
      return [];
    }
  }

  async addUserToGroup(userName: string, groupName: string): Promise<void> {
    try {
      // Verificar se o usuário existe antes de tentar adicioná-lo ao grupo
      try {
        await this.iamClient.getUser({ UserName: userName }).promise();
      } catch (error) {
        console.error(`Usuário ${userName} não encontrado:`, error);
        throw new Error(`The user with name ${userName} cannot be found.`);
      }
      
      const params = {
        UserName: userName,
        GroupName: groupName
      };
      await this.iamClient.addUserToGroup(params).promise();
    } catch (error) {
      console.error(`Error adding user ${userName} to group ${groupName}:`, error);
      throw error;
    }
  }

  async removeUserFromGroup(userName: string, groupName: string): Promise<void> {
    try {
      const params = {
        UserName: userName,
        GroupName: groupName
      };
      await this.iamClient.removeUserFromGroup(params).promise();
    } catch (error) {
      console.error(`Error removing user ${userName} from group ${groupName}:`, error);
      throw error;
    }
  }

  async listGroupsForUser(username: string) {
    try {
      const result = await this.iamClient.listGroupsForUser({ UserName: username }).promise();
      return result.Groups || [];
    } catch (error) {
      console.error(`Erro ao listar grupos para usuário ${username}:`, error);
      throw error;
    }
  }

  async listAttachedGroupPolicies(groupName: string): Promise<any[]> {
    try {
      const result = await this.iamClient.listAttachedGroupPolicies({ GroupName: groupName }).promise();
      return result.AttachedPolicies || [];
    } catch (error) {
      console.error(`Error listing attached policies for group ${groupName}:`, error);
      return [];
    }
  }

  async attachGroupPolicy(groupName: string, policyArn: string): Promise<void> {
    try {
      const params = {
        GroupName: groupName,
        PolicyArn: policyArn
      };
      await this.iamClient.attachGroupPolicy(params).promise();
    } catch (error) {
      console.error(`Error attaching policy ${policyArn} to group ${groupName}:`, error);
      throw error;
    }
  }

  async detachGroupPolicy(groupName: string, policyArn: string): Promise<void> {
    try {
      const params = {
        GroupName: groupName,
        PolicyArn: policyArn
      };
      await this.iamClient.detachGroupPolicy(params).promise();
    } catch (error) {
      console.error(`Error detaching policy ${policyArn} from group ${groupName}:`, error);
      throw error;
    }
  }

  // ===== GERENCIAMENTO DE ROLES =====

  async listRoles() {
    try {
      const result = await this.iamClient.listRoles().promise();
      return result.Roles || [];
    } catch (error) {
      console.error('Erro ao listar roles IAM:', error);
      throw error;
    }
  }

  async getRole(roleName: string) {
    try {
      const result = await this.iamClient.getRole({ RoleName: roleName }).promise();
      return result.Role;
    } catch (error) {
      console.error(`Erro ao obter role ${roleName}:`, error);
      throw error;
    }
  }

  async createRole(roleName: string, assumeRolePolicyDocument: string, description?: string, path?: string) {
    try {
      const params: AWS.IAM.CreateRoleRequest = {
        RoleName: roleName,
        AssumeRolePolicyDocument: assumeRolePolicyDocument,
        ...(description && { Description: description }),
        ...(path && { Path: path })
      };
      const result = await this.iamClient.createRole(params).promise();
      return result.Role;
    } catch (error) {
      console.error(`Erro ao criar role ${roleName}:`, error);
      throw error;
    }
  }

  async deleteRole(roleName: string) {
    try {
      // Desanexar todas as políticas primeiro
      const policies = await this.listAttachedRolePolicies(roleName);
      for (const policy of policies) {
        if (policy.PolicyArn) {
          await this.detachRolePolicy(roleName, policy.PolicyArn);
        }
      }

      // Excluir a role
      await this.iamClient.deleteRole({ RoleName: roleName }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao excluir role ${roleName}:`, error);
      throw error;
    }
  }

  async updateAssumeRolePolicy(roleName: string, policyDocument: string) {
    try {
      await this.iamClient.updateAssumeRolePolicy({
        RoleName: roleName,
        PolicyDocument: policyDocument
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar política de confiança para ${roleName}:`, error);
      throw error;
    }
  }

  // ===== GERENCIAMENTO DE POLÍTICAS =====

  async listPolicies(onlyAttached = false, scope = 'All', pathPrefix?: string) {
    try {
      const params: AWS.IAM.ListPoliciesRequest = {
        OnlyAttached: onlyAttached,
        Scope: scope as 'All' | 'AWS' | 'Local',
        ...(pathPrefix && { PathPrefix: pathPrefix })
      };
      const result = await this.iamClient.listPolicies(params).promise();
      return result.Policies || [];
    } catch (error) {
      console.error('Erro ao listar políticas IAM:', error);
      throw error;
    }
  }

  async getPolicy(policyArn: string) {
    try {
      const result = await this.iamClient.getPolicy({ PolicyArn: policyArn }).promise();
      return result.Policy;
    } catch (error) {
      console.error(`Erro ao obter política ${policyArn}:`, error);
      throw error;
    }
  }

  async getPolicyVersion(policyArn: string, versionId: string) {
    try {
      const result = await this.iamClient.getPolicyVersion({
        PolicyArn: policyArn,
        VersionId: versionId
      }).promise();
      return result.PolicyVersion;
    } catch (error) {
      console.error(`Erro ao obter versão ${versionId} da política ${policyArn}:`, error);
      throw error;
    }
  }

  async createPolicy(policyName: string, policyDocument: string, description?: string, path?: string) {
    try {
      const params: AWS.IAM.CreatePolicyRequest = {
        PolicyName: policyName,
        PolicyDocument: policyDocument,
        ...(description && { Description: description }),
        ...(path && { Path: path })
      };
      const result = await this.iamClient.createPolicy(params).promise();
      return result.Policy;
    } catch (error) {
      console.error(`Erro ao criar política ${policyName}:`, error);
      throw error;
    }
  }

  async createPolicyVersion(policyArn: string, policyDocument: string, setAsDefault = true) {
    try {
      const params: AWS.IAM.CreatePolicyVersionRequest = {
        PolicyArn: policyArn,
        PolicyDocument: policyDocument,
        SetAsDefault: setAsDefault
      };
      const result = await this.iamClient.createPolicyVersion(params).promise();
      return result.PolicyVersion;
    } catch (error) {
      console.error(`Erro ao criar versão da política ${policyArn}:`, error);
      throw error;
    }
  }

  async deletePolicy(policyArn: string) {
    try {
      await this.iamClient.deletePolicy({ PolicyArn: policyArn }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao excluir política ${policyArn}:`, error);
      throw error;
    }
  }

  async deletePolicyVersion(policyArn: string, versionId: string) {
    try {
      await this.iamClient.deletePolicyVersion({
        PolicyArn: policyArn,
        VersionId: versionId
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao excluir versão ${versionId} da política ${policyArn}:`, error);
      throw error;
    }
  }

  async listPolicyVersions(policyArn: string) {
    try {
      const result = await this.iamClient.listPolicyVersions({ PolicyArn: policyArn }).promise();
      return result.Versions || [];
    } catch (error) {
      console.error(`Erro ao listar versões da política ${policyArn}:`, error);
      throw error;
    }
  }

  // ===== ANEXAR/SEPARAR POLÍTICAS =====

  async attachUserPolicy(username: string, policyArn: string) {
    try {
      await this.iamClient.attachUserPolicy({
        UserName: username,
        PolicyArn: policyArn
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao anexar política ${policyArn} ao usuário ${username}:`, error);
      throw error;
    }
  }

  async detachUserPolicy(username: string, policyArn: string) {
    try {
      await this.iamClient.detachUserPolicy({
        UserName: username,
        PolicyArn: policyArn
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao separar política ${policyArn} do usuário ${username}:`, error);
      throw error;
    }
  }

  async attachRolePolicy(roleName: string, policyArn: string) {
    try {
      await this.iamClient.attachRolePolicy({
        RoleName: roleName,
        PolicyArn: policyArn
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao anexar política ${policyArn} à role ${roleName}:`, error);
      throw error;
    }
  }

  async detachRolePolicy(roleName: string, policyArn: string) {
    try {
      await this.iamClient.detachRolePolicy({
        RoleName: roleName,
        PolicyArn: policyArn
      }).promise();
      return true;
    } catch (error) {
      console.error(`Erro ao separar política ${policyArn} da role ${roleName}:`, error);
      throw error;
    }
  }

  // ===== LISTAR POLÍTICAS ANEXADAS =====

  async listAttachedUserPolicies(username: string) {
    try {
      const result = await this.iamClient.listAttachedUserPolicies({ UserName: username }).promise();
      return result.AttachedPolicies || [];
    } catch (error) {
      console.error(`Erro ao listar políticas anexadas ao usuário ${username}:`, error);
      throw error;
    }
  }

  async listAttachedRolePolicies(roleName: string) {
    try {
      const result = await this.iamClient.listAttachedRolePolicies({ RoleName: roleName }).promise();
      return result.AttachedPolicies || [];
    } catch (error) {
      console.error(`Erro ao listar políticas anexadas à role ${roleName}:`, error);
      throw error;
    }
  }

  // ===== FUNÇÕES DE AUDITORIA =====

  async simulatePrincipalPolicy(policySourceArn: string, actionNames: string[], resourceArns?: string[]) {
    try {
      const params: AWS.IAM.SimulatePrincipalPolicyRequest = {
        PolicySourceArn: policySourceArn,
        ActionNames: actionNames,
        ...(resourceArns && { ResourceArns: resourceArns })
      };
      const result = await this.iamClient.simulatePrincipalPolicy(params).promise();
      return result.EvaluationResults || [];
    } catch (error) {
      console.error(`Erro ao simular política para ${policySourceArn}:`, error);
      throw error;
    }
  }

  async getCredentialReport(): Promise<any> {
    try {
      const response = await this.iamClient.generateCredentialReport().promise();
      if (response.State === 'COMPLETE') {
        const report = await this.iamClient.getCredentialReport().promise();
        return report.Content;
      }
      return null;
    } catch (error) {
      console.error('Erro ao gerar relatório de credenciais:', error);
      throw error;
    }
  }

  async getAccountAuthorizationDetails(): Promise<any> {
    try {
      const params: AWS.IAM.GetAccountAuthorizationDetailsRequest = {
        Filter: ['User', 'Group', 'Role', 'LocalManagedPolicy', 'AWSManagedPolicy']
      };
      const response = await this.iamClient.getAccountAuthorizationDetails(params).promise();
      const userDetailList = response.UserDetailList || [];
      const groupDetailList = response.GroupDetailList || [];
      const roleDetailList = response.RoleDetailList || [];
      const policies = response.Policies || [];
      return {
        userDetailList,
        groupDetailList,
        roleDetailList,
        policies
      };
    } catch (error) {
      console.error('Erro ao obter detalhes de autorização da conta:', error);
      return {
        userDetailList: [],
        groupDetailList: [],
        roleDetailList: [],
        policies: []
      };
    }
  }

  async listAccessKeysForAllUsers() {
    try {
      const users = await this.listUsers();
      const result = await Promise.all(
        users.map(async (user) => {
          if (!user.UserName) return { user, accessKeys: [] };
          const accessKeys = await this.listAccessKeys(user.UserName);
          return { user, accessKeys };
        })
      );
      return result;
    } catch (error) {
      console.error('Erro ao listar chaves de acesso para todos os usuários:', error);
      throw error;
    }
  }

  async getPolicyDetails(policyArn: string) {
    try {
      const policy = await this.getPolicy(policyArn);
      if (!policy || !policy.DefaultVersionId) {
        throw new Error(`Não foi possível obter detalhes da política ${policyArn}`);
      }
      
      const versionDetails = await this.getPolicyVersion(policyArn, policy.DefaultVersionId);
      if (!versionDetails || !versionDetails.Document) {
        throw new Error(`Não foi possível obter detalhes da versão da política ${policyArn}`);
      }
      
      // O documento vem codificado em URL
      const decodedDocument = decodeURIComponent(versionDetails.Document);
      
      return {
        ...policy,
        Document: JSON.parse(decodedDocument)
      };
    } catch (error) {
      console.error(`Erro ao obter detalhes completos da política ${policyArn}:`, error);
      throw error;
    }
  }

  async isUserInGroup(userName: string, groupName: string): Promise<boolean> {
    try {
      const users = await this.listUsersInGroup(groupName);
      return users.some(user => user.UserName === userName);
    } catch (error) {
      console.error(`Erro ao verificar se usuário ${userName} está no grupo ${groupName}:`, error);
      return false;
    }
  }
} 