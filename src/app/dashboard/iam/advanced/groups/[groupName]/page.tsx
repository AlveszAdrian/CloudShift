"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  AlertTriangle, RefreshCw, UsersRound, User, 
  FileText, ArrowLeft, PlusCircle, Trash2, UserPlus, Shield, KeyRound
} from "lucide-react";
import { motion } from "framer-motion";

interface IAMUser {
  userName: string;
  userId: string;
  arn: string;
  createDate: string;
  passwordLastUsed?: string;
  hasMFA: boolean;
  accessKeysCount: number;
  policiesCount: number;
  riskLevel?: "high" | "medium" | "low";
}

interface IAMGroup {
  groupName: string;
  groupId: string;
  arn: string;
  createDate: string;
  managedPolicies: {
    policyName: string;
    policyArn: string;
  }[];
  inlinePolicies: string[];
}

interface AwsCredential {
  id: string;
  name: string;
  accountId?: string;
}

export default function GroupDetailsPage({ params }: { params: any }) {
  // Usando React.use() para acessar parâmetros de forma compatível com o Next.js
  const resolvedParams = React.use(params) as { groupName: string };
  const groupName = resolvedParams.groupName;
  const router = useRouter();
  const [group, setGroup] = useState<IAMGroup | null>(null);
  const [groupUsers, setGroupUsers] = useState<IAMUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<IAMUser[]>([]);
  const [credentials, setCredentials] = useState<AwsCredential[]>([]);
  const [selectedCredentialId, setSelectedCredentialId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState<string>("");
  
  // Fetch credentials when component mounts
  useEffect(() => {
    fetchCredentials();
  }, []);
  
  // Fetch group details and users when credential changes or groupName changes
  useEffect(() => {
    if (selectedCredentialId && groupName) {
      fetchGroupDetails();
      fetchGroupUsers();
    }
  }, [selectedCredentialId, groupName]);
  
  const fetchCredentials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/aws/credentials');
      if (!response.ok) throw new Error('Failed to fetch credentials');
      
      const data = await response.json();
      setCredentials(data);
      
      if (data.length > 0) {
        setSelectedCredentialId(data[0].id);
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('Error fetching credentials: ' + (err instanceof Error ? err.message : String(err)));
      setIsLoading(false);
    }
  };
  
  const fetchGroupDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/aws/iam/groups?credentialId=${selectedCredentialId}`);
      if (!response.ok) throw new Error('Failed to fetch IAM groups');
      
      const data = await response.json();
      const foundGroup = data.groups.find((g: IAMGroup) => g.groupName === groupName);
      
      if (foundGroup) {
        setGroup(foundGroup);
      } else {
        setError('Group not found');
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('Error fetching group details: ' + (err instanceof Error ? err.message : String(err)));
      setIsLoading(false);
    }
  };
  
  const fetchGroupUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Buscando usuários do grupo ${groupName} para a credencial ${selectedCredentialId}`);
      
      const url = `/api/aws/iam/groups/members?credentialId=${selectedCredentialId}&groupName=${encodeURIComponent(groupName)}`;
      console.log(`URL da requisição: ${url}`);
      
      const response = await fetch(url);
      console.log(`Status da resposta: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resposta de erro:', errorText);
        throw new Error(`Failed to fetch group users: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      setGroupUsers(data.users || []);
      
      setIsLoading(false);
    } catch (err) {
      console.error(`Erro detalhado ao buscar usuários do grupo:`, err);
      setError('Error fetching group users: ' + (err instanceof Error ? err.message : String(err)));
      setIsLoading(false);
    }
  };
  
  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Buscando todos os usuários disponíveis para a credencial ${selectedCredentialId}`);
      
      const response = await fetch(`/api/aws/iam/users?credentialId=${selectedCredentialId}`);
      console.log(`Status da resposta: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resposta de erro:', errorText);
        throw new Error('Failed to fetch IAM users');
      }
      
      const data = await response.json();
      console.log(`Total de usuários obtidos: ${data.users?.length || 0}`);
      
      // Filter out users that are already in the group
      const groupUserNames = groupUsers.map(user => user.userName);
      console.log(`Usuários já no grupo: ${JSON.stringify(groupUserNames)}`);
      
      const filteredUsers = data.users.filter((user: IAMUser) => {
        const isInGroup = groupUserNames.includes(user.userName);
        console.log(`Usuário ${user.userName} ${isInGroup ? 'já está' : 'não está'} no grupo`);
        return !isInGroup;
      });
      
      console.log(`Usuários disponíveis para adicionar: ${filteredUsers.length}`);
      setAvailableUsers(filteredUsers);
      setIsLoading(false);
    } catch (err) {
      console.error('Erro detalhado ao buscar usuários:', err);
      setError('Error fetching users: ' + (err instanceof Error ? err.message : String(err)));
      setIsLoading(false);
    }
  };
  
  const handleShowAddUserModal = () => {
    fetchAllUsers();
    setShowAddUserModal(true);
  };
  
  const handleAddUserToGroup = async () => {
    if (!selectedUserToAdd) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Adicionando usuário ${selectedUserToAdd} ao grupo ${groupName}`);
      
      const response = await fetch('/api/aws/iam/groups/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credentialId: selectedCredentialId,
          groupName: groupName,
          userName: selectedUserToAdd
        })
      });
      
      console.log(`Status da resposta: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resposta de erro:', errorText);
        throw new Error(`Failed to add user to group: ${response.status} ${errorText}`);
      }
      
      // Reset and refresh
      setSelectedUserToAdd("");
      setShowAddUserModal(false);
      fetchGroupUsers();
    } catch (err) {
      console.error(`Erro detalhado ao adicionar usuário ao grupo:`, err);
      setError('Error adding user to group: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveUserFromGroup = async (userName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Removendo usuário ${userName} do grupo ${groupName}`);
      
      // Construindo URL com parâmetros de consulta para o método DELETE
      const url = `/api/aws/iam/groups/members?credentialId=${selectedCredentialId}&groupName=${encodeURIComponent(groupName)}&userName=${encodeURIComponent(userName)}`;
      console.log(`URL da requisição: ${url}`);
      
      const response = await fetch(url, {
        method: 'DELETE'
      });
      
      console.log(`Status da resposta: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resposta de erro:', errorText);
        throw new Error(`Failed to remove user from group: ${response.status} ${errorText}`);
      }
      
      fetchGroupUsers();
    } catch (err) {
      console.error(`Erro detalhado ao remover usuário do grupo:`, err);
      setError('Error removing user from group: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const handleRefresh = () => {
    fetchGroupDetails();
    fetchGroupUsers();
  };
  
  const handleBackToGroups = () => {
    router.push("/dashboard/iam/advanced/groups");
  };
  
  const handleGoToUsers = () => {
    router.push("/dashboard/iam/advanced/users");
  };
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackToGroups}
            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <UsersRound className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Detalhes do Grupo: {groupName}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoToUsers}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Ver todos os usuários
          </button>
          <select
            value={selectedCredentialId}
            onChange={(e) => setSelectedCredentialId(e.target.value)}
            className="border border-gray-300 rounded-md text-sm p-2 bg-gray-50 text-gray-800"
          >
            {credentials.map((cred) => (
              <option key={cred.id} value={cred.id}>
                {cred.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {/* Group details card */}
      {group && (
        <div className="bg-gray-50 shadow-sm rounded-lg border p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-700 text-sm font-medium">ARN</h3>
              <p className="mt-1 text-sm text-gray-900 break-all">{group.arn}</p>
            </div>
            <div>
              <h3 className="text-gray-700 text-sm font-medium">ID</h3>
              <p className="mt-1 text-sm text-gray-900">{group.groupId}</p>
            </div>
            <div>
              <h3 className="text-gray-700 text-sm font-medium">Data de Criação</h3>
              <p className="mt-1 text-sm text-gray-900">{formatDate(group.createDate)}</p>
            </div>
            <div>
              <h3 className="text-gray-700 text-sm font-medium">Políticas Gerenciadas</h3>
              <p className="mt-1 text-sm text-gray-900">{group.managedPolicies?.length || 0}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Group Users Section */}
      <div className="bg-gray-50 shadow-sm rounded-lg border">
        <div className="p-4 border-b flex justify-between items-center bg-gray-100">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Usuários no Grupo
          </h3>
          <button
            onClick={handleShowAddUserModal}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Adicionar Usuário</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th className="px-6 py-4">Nome do Usuário</th>
                <th className="px-6 py-4">Data de Criação</th>
                <th className="px-6 py-4">MFA</th>
                <th className="px-6 py-4">Chaves de Acesso</th>
                <th className="px-6 py-4">Políticas</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-700">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Carregando usuários...</span>
                    </div>
                  </td>
                </tr>
              ) : groupUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-700">
                    Nenhum usuário encontrado neste grupo
                  </td>
                </tr>
              ) : (
                groupUsers.map((user) => (
                  <tr key={user.userId} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                          <User className="h-4 w-4" />
                        </div>
                        <span>{user.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(user.createDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.hasMFA 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.hasMFA ? 'Ativado' : 'Desativado'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <KeyRound className="h-3 w-3 text-gray-700" />
                        <span>{user.accessKeysCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-gray-700" />
                        <span>{user.policiesCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemoveUserFromGroup(user.userName)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-50 rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adicionar Usuário ao Grupo</h3>
            
            {availableUsers.length === 0 ? (
              <p className="text-gray-700 text-center py-4">
                Não há usuários disponíveis para adicionar a este grupo
              </p>
            ) : (
              <div className="mb-4">
                <label htmlFor="user-select" className="block text-sm font-medium text-gray-800 mb-1">
                  Selecione um usuário
                </label>
                <select
                  id="user-select"
                  value={selectedUserToAdd}
                  onChange={(e) => setSelectedUserToAdd(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                >
                  <option value="" key="select-placeholder">Selecione um usuário</option>
                  {availableUsers.map((user) => (
                    <option key={user.userId} value={user.userName}>
                      {user.userName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddUserToGroup}
                disabled={!selectedUserToAdd || isLoading}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  !selectedUserToAdd || isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Adicionando...' : 'Adicionar ao Grupo'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Best practices section */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h3 className="text-blue-800 font-medium flex items-center gap-1 mb-2">
          <UsersRound className="h-4 w-4" />
          Gerenciamento de Usuários em Grupos
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-5 list-disc">
          <li key="best-practice-1">Adicione usuários a grupos para gerenciar permissões de forma centralizada</li>
          <li key="best-practice-2">Remova usuários de grupos quando não precisarem mais do acesso</li>
          <li key="best-practice-3">Usuários podem pertencer a múltiplos grupos para combinar permissões</li>
          <li key="best-practice-4">Revise periodicamente quais usuários estão em cada grupo</li>
        </ul>
      </div>
    </div>
  );
} 