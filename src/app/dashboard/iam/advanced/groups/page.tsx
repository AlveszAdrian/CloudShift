"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  AlertTriangle, RefreshCw, UsersRound, User, 
  FileText, FolderPlus, Edit, Trash2, Users, PlusCircle
} from "lucide-react";

interface IAMGroup {
  groupName: string;
  groupId: string;
  arn: string;
  createDate: string;
  userCount: number;
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

export default function IamGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<IAMGroup[]>([]);
  const [credentials, setCredentials] = useState<AwsCredential[]>([]);
  const [selectedCredentialId, setSelectedCredentialId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<IAMGroup | null>(null);
  
  // Fetch credentials when component mounts
  useEffect(() => {
    fetchCredentials();
  }, []);
  
  // Fetch groups when credential changes
  useEffect(() => {
    if (selectedCredentialId) {
      fetchGroups();
    }
  }, [selectedCredentialId]);
  
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
  
  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/aws/iam/groups?credentialId=${selectedCredentialId}`);
      if (!response.ok) throw new Error('Failed to fetch IAM groups');
      
      const data = await response.json();
      setGroups(data.groups || []);
      
      setIsLoading(false);
    } catch (err) {
      setError('Error fetching IAM groups: ' + (err instanceof Error ? err.message : String(err)));
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
    fetchGroups();
  };
  
  const handleCreateGroup = () => {
    setShowCreateModal(true);
  };
  
  const handleEditGroup = (group: IAMGroup) => {
    setCurrentGroup(group);
    // Edit modal would be shown here
  };
  
  const handleDeleteGroup = (group: IAMGroup) => {
    setCurrentGroup(group);
    setShowDeleteModal(true);
  };
  
  const createGroup = async (groupName: string, policies: string[]) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/aws/iam/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credentialId: selectedCredentialId,
          groupName
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create group');
      }
      
      // Attach policies if any were selected
      if (policies.length > 0) {
        // Implementation would go here
      }
      
      setShowCreateModal(false);
      fetchGroups();
    } catch (err) {
      setError('Error creating group: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewGroupDetails = (groupName: string) => {
    router.push(`/dashboard/iam/advanced/groups/${encodeURIComponent(groupName)}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Grupos IAM</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedCredentialId}
            onChange={(e) => setSelectedCredentialId(e.target.value)}
            className="border border-gray-300 rounded-md text-sm p-2"
          >
            {credentials.map((cred) => (
              <option key={cred.id} value={cred.id}>
                {cred.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleCreateGroup}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Novo Grupo</span>
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
      
      {/* Groups table */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Nome do Grupo</th>
                <th className="px-6 py-4">ARN</th>
                <th className="px-6 py-4">Data de Criação</th>
                <th className="px-6 py-4">Usuários</th>
                <th className="px-6 py-4">Políticas</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Carregando grupos...</span>
                    </div>
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Nenhum grupo IAM encontrado
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr key={group.groupId} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                          <Users className="h-4 w-4" />
                        </div>
                        <button 
                          onClick={() => handleViewGroupDetails(group.groupName)}
                          className="hover:text-blue-600 hover:underline text-left"
                        >
                          {group.groupName}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {group.arn}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(group.createDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-500" />
                        <span>{group.userCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-gray-500" />
                        <span>{(group.managedPolicies?.length || 0) + (group.inlinePolicies?.length || 0)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Best practices section */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h3 className="text-blue-800 font-medium flex items-center gap-1 mb-2">
          <UsersRound className="h-4 w-4" />
          Boas Práticas de Segurança para Grupos IAM
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 ml-5 list-disc">
          <li>Crie grupos baseados em funções de trabalho que agrupam permissões necessárias</li>
          <li>Atribua permissões aos grupos e não diretamente aos usuários</li>
          <li>Use o princípio do privilégio mínimo ao definir permissões de grupo</li>
          <li>Revise periodicamente as permissões de grupos para remover direitos não utilizados</li>
          <li>Documente o propósito de cada grupo para facilitar auditorias</li>
        </ul>
      </div>
      
      {/* Modals implementation would go here */}
    </div>
  );
} 