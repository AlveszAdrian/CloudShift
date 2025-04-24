"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  UserCog, 
  PlusCircle, 
  RefreshCw, 
  Trash2, 
  Edit, 
  Shield, 
  KeyRound,
  AlertTriangle,
  User,
  FileText,
  Key,
  Lock,
  UserPlus,
  X,
  CheckCircle,
  XCircle,
  Users,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion } from "framer-motion";
import AccessKeyManager from "@/components/aws/iam/AccessKeyManager";
import { useAwsCredentials } from '@/hooks/useAwsCredentials';
import Modal from '@/components/ui/Modal';
import CredentialSelector from '@/components/aws/CredentialSelector';

interface IAMUser {
  userName: string;
  userId: string;
  arn: string;
  createDate: string;
  passwordLastUsed?: string;
  hasMFA: boolean;
  accessKeysCount: number;
  policiesCount: number;
  riskLevel: "high" | "medium" | "low";
  groups: string[];
}

export default function IamUsersPage() {
  const router = useRouter();
  const { credentials, selectedCredential, selectCredential } = useAwsCredentials();
  const [users, setUsers] = useState<IAMUser[]>([]);
  const [selectedCredentialId, setSelectedCredentialId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<IAMUser | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<IAMUser | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview'|'security'|'groups'|'details'>('overview');
  
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!selectedCredential) {
      setIsLoading(false);
      return;
    }
    
    // Verificar se já temos dados no localStorage
    try {
      const usersCache = localStorage.getItem('iamUsersCache');
      const cachedCredentialId = localStorage.getItem('iamUsersLastCredentialId');
      const cachedTimestamp = localStorage.getItem('iamUsersLastUpdateTime');
      
      if (usersCache && cachedCredentialId === selectedCredential.id) {
        // Usar dados do cache
        const parsedData = JSON.parse(usersCache);
        setUsers(parsedData);
        setIsLoading(false);
        
        if (cachedTimestamp) {
          setLastUpdated(new Date(parseInt(cachedTimestamp)));
        }
        
        // Verificar se é hora de atualizar em background
        if (cachedTimestamp) {
          const timeSinceLastUpdate = Date.now() - parseInt(cachedTimestamp);
          const fiveMinutesInMs = 5 * 60 * 1000;
          
          if (timeSinceLastUpdate > fiveMinutesInMs) {
            // Atualiza em background se passou mais de 5 minutos
            fetchUsersInBackground();
          }
        }
      } else {
        // Se não tem cache ou a credencial mudou, buscar novos dados
        fetchUsers();
      }
      
      setSelectedCredentialId(selectedCredential.id);
    } catch (error) {
      console.error("Erro ao restaurar cache:", error);
      fetchUsers();
    }
  }, [selectedCredential]);

  const fetchUsers = async () => {
    if (!selectedCredentialId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/aws/iam/users?credentialId=${selectedCredentialId}`);
      if (!response.ok) throw new Error('Falha ao carregar usuários');
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError('Erro ao buscar usuários IAM: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  async function fetchUsersInBackground() {
    if (!selectedCredential) return;
    
    try {
      setBackgroundLoading(true);
      
      const response = await fetch(`/api/aws/iam/users?credentialId=${selectedCredential.id}`);
      
      if (!response.ok) {
        throw new Error("Erro na atualização em background");
      }
      
      const data = await response.json();
      setUsers(data.users);
      const currentTime = new Date();
      setLastUpdated(currentTime);
      
      // Salvar no cache
      localStorage.setItem('iamUsersCache', JSON.stringify(data.users));
      localStorage.setItem('iamUsersLastCredentialId', selectedCredential.id);
      localStorage.setItem('iamUsersLastUpdateTime', currentTime.getTime().toString());
      
      console.log("Atualização em background dos usuários IAM concluída");
    } catch (err) {
      console.error("Erro na atualização em background:", err);
      // Não exibimos erros de background para o usuário
    } finally {
      setBackgroundLoading(false);
    }
  }

  const handleRefresh = () => {
    fetchUsers();
  };

  // Handle user creation
  const handleCreateUser = () => {
    setShowCreateModal(true);
  };
  
  // Handle user edit
  const handleEditUser = (user: IAMUser) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };
  
  // Handle user deletion
  const handleDeleteUser = (user: IAMUser) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };
  
  const handleGoToGroups = () => {
    router.push("/dashboard/iam/advanced/groups");
  };
  
  const handleViewGroupDetails = (groupName: string) => {
    router.push(`/dashboard/iam/advanced/groups/${encodeURIComponent(groupName)}`);
  };
  
  // Handle user management 
  const handleManageUser = (user: IAMUser) => {
    setCurrentUser(user);
    setShowManageModal(true);
  };
  
  const viewUserDetails = (user: IAMUser) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
    setActiveTab('overview');
  };
  
  // Add gradient and visual indicators for risk level
  const getRiskBadge = (riskLevel: "high" | "medium" | "low") => {
    if (riskLevel === "high") {
      return (
        <div className="flex items-center gap-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="font-medium text-red-700">Alto</span>
        </div>
      );
    } else if (riskLevel === "medium") {
      return (
        <div className="flex items-center gap-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
          <span className="font-medium text-yellow-700">Médio</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <span className="inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          <span className="font-medium text-green-700">Baixo</span>
        </div>
      );
    }
  };
  
  // Format date nicely
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nunca";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Hoje";
    } else if (diffDays === 1) {
      return "Ontem";
    } else if (diffDays < 30) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Usuários IAM</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoToGroups}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Ver grupos IAM
          </button>
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
            onClick={handleCreateUser}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Novo Usuário</span>
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start gap-2"
        >
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro</p>
            <p className="text-sm">{error}</p>
          </div>
        </motion.div>
      )}
      
      {/* Users table */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Grupos</th>
                <th className="px-6 py-4">Último Acesso</th>
                <th className="px-6 py-4">MFA</th>
                <th className="px-6 py-4">Chaves</th>
                <th className="px-6 py-4">Políticas</th>
                <th className="px-6 py-4">Risco</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Carregando usuários...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    Nenhum usuário IAM encontrado
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.userName} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {user.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <button 
                            onClick={() => viewUserDetails(user)}
                            className="hover:text-blue-600 hover:underline transition-colors text-left"
                          >
                            {user.userName}
                          </button>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {user.arn}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.groups.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.groups.map((group) => (
                            <button
                              key={group}
                              onClick={() => handleViewGroupDetails(group)}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full cursor-pointer transition-colors"
                            >
                              {group}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Nenhum grupo</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(user.passwordLastUsed)}
                    </td>
                    <td className="px-6 py-4">
                      {user.hasMFA ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Ativado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Desativado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <KeyRound className="h-3 w-3 text-gray-500" />
                        <span>{user.accessKeysCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.policiesCount}
                    </td>
                    <td className="px-6 py-4">
                      {getRiskBadge(user.riskLevel)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => viewUserDetails(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900"
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
      
      {/* Best practices section */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h3 className="text-blue-800 font-medium flex items-center gap-1 mb-2">
          <Shield className="h-4 w-4" />
          Boas Práticas de Segurança
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 ml-5 list-disc">
          <li>Ative a autenticação multifator (MFA) para todos os usuários com acesso ao console</li>
          <li>Atribua permissões mínimas necessárias seguindo o princípio de privilégio mínimo</li>
          <li>Use grupos IAM para gerenciar permissões em vez de atribuir diretamente aos usuários</li>
          <li>Revise e rotacione regularmente as chaves de acesso</li>
          <li>Remova usuários inativos e credenciais não utilizadas</li>
        </ul>
      </div>
      
      {/* User Management Modal */}
      {showManageModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Gerenciar Usuário: {currentUser.userName}
              </h2>
              <button
                onClick={() => setShowManageModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* User Info Section */}
              <div>
                <h3 className="text-base font-semibold mb-4 text-gray-900 flex items-center gap-1">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Informações do Usuário
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium block text-gray-700">Nome:</span>
                      <span className="text-gray-900">{currentUser.userName}</span>
                    </div>
                    <div>
                      <span className="font-medium block text-gray-700">ID:</span>
                      <span className="text-gray-900">{currentUser.userId}</span>
                    </div>
                    <div>
                      <span className="font-medium block text-gray-700">Data de Criação:</span>
                      <span className="text-gray-900">{new Date(currentUser.createDate).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium block text-gray-700">Último Acesso:</span>
                      <span className="text-gray-900">
                        {currentUser.passwordLastUsed
                          ? new Date(currentUser.passwordLastUsed).toLocaleString('pt-BR')
                          : "Nunca"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium block text-gray-700">ARN:</span>
                      <span className="text-gray-500 text-xs break-all">{currentUser.arn}</span>
                    </div>
                    <div>
                      <span className="font-medium block text-gray-700">Nível de Risco:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentUser.riskLevel === 'high'
                          ? 'bg-red-100 text-red-800'
                          : currentUser.riskLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {currentUser.riskLevel === 'high'
                          ? 'Alto'
                          : currentUser.riskLevel === 'medium'
                          ? 'Médio'
                          : 'Baixo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Security Section */}
              <div>
                <h3 className="text-base font-semibold mb-4 text-gray-900 flex items-center gap-1">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Segurança
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-700" />
                      <div>
                        <span className="font-medium text-gray-900">Autenticação Multi-fator (MFA)</span>
                        <p className="text-xs text-gray-600">Proteção adicional para o login no console</p>
                      </div>
                    </div>
                    <div>
                      {currentUser.hasMFA ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Ativado
                        </span>
                      ) : (
                        <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-full transition-colors">
                          Ativar MFA
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Access Keys Section */}
              <div>
                <h3 className="text-base font-semibold mb-4 text-gray-900 flex items-center gap-1">
                  <Key className="h-4 w-4 text-blue-600" />
                  Chaves de Acesso
                </h3>
                <div className="space-y-4">
                  <AccessKeyManager
                    userName={currentUser.userName}
                    credentialId={selectedCredentialId}
                    onUpdate={fetchUsers}
                  />
                </div>
              </div>
              
              {/* Groups Section */}
              <div>
                <h3 className="text-base font-semibold mb-4 text-gray-900 flex items-center gap-1">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                  Grupos
                </h3>
                <div className="space-y-4">
                  {currentUser.groups.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {currentUser.groups.map(group => (
                        <div key={group} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{group}</span>
                          <button 
                            onClick={() => handleViewGroupDetails(group)}
                            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded transition-colors"
                          >
                            Ver Grupo
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-500">
                      Usuário não pertence a nenhum grupo
                    </div>
                  )}
                  <div className="text-right">
                    <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors">
                      Adicionar a Grupos
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Policies Section */}
              <div>
                <h3 className="text-base font-semibold mb-4 text-gray-900 flex items-center gap-1">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Políticas ({currentUser.policiesCount})
                </h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-500">
                    <p>Clique no botão abaixo para gerenciar as políticas atribuídas a este usuário</p>
                  </div>
                  <div className="text-right">
                    <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors">
                      Gerenciar Políticas
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer with action buttons */}
            <div className="px-6 py-4 border-t flex justify-between items-center">
              <div>
                <button
                  onClick={() => {
                    setShowManageModal(false);
                    setShowDeleteModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-md text-sm transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir Usuário
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowManageModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setShowManageModal(false);
                    handleEditUser(currentUser);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Editar Usuário
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* User Detail Modal */}
      {isUserDetailOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header with gradient and user info */}
            <div className={`bg-gradient-to-r ${
              selectedUser.riskLevel === 'high' 
                ? 'from-red-500 to-red-700' 
                : selectedUser.riskLevel === 'medium'
                ? 'from-yellow-500 to-amber-600'
                : 'from-green-500 to-green-700'
            } px-6 py-4 text-white relative`}>
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-200"
                onClick={() => setIsUserDetailOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-white text-gray-800 flex items-center justify-center font-bold text-xl mr-4">
                  {selectedUser.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedUser.userName}</h2>
                  <div className="flex items-center mt-1">
                    <div className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium">
                      {getRiskBadge(selectedUser.riskLevel)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'security'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Segurança
                </button>
                <button
                  onClick={() => setActiveTab('groups')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'groups'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Grupos
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Detalhes
                </button>
              </nav>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-gray-500">Grupos</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">{selectedUser.groups.length}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-gray-500">Chaves de Acesso</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">{selectedUser.accessKeysCount}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-gray-500">Políticas</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">{selectedUser.policiesCount}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="text-base font-medium text-gray-900 mb-4">Status de Segurança</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">MFA Ativado</span>
                        <span>
                          {selectedUser.hasMFA ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-5 w-5 mr-1" />
                              <span>Sim</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-5 w-5 mr-1" />
                              <span>Não</span>
                            </div>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Chaves de Acesso</span>
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            selectedUser.accessKeysCount > 0 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {selectedUser.accessKeysCount} ativa{selectedUser.accessKeysCount !== 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => setActiveTab('security')}
                            className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Gerenciar
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Último Acesso</span>
                        <span className="text-sm font-medium">
                          {formatDate(selectedUser.passwordLastUsed)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="text-base font-medium text-gray-900 mb-4">Ações Rápidas</h3>
                    <div className="flex space-x-2">
                      <button 
                        className="flex items-center px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => {
                          setActiveTab('security');
                        }}
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Verificar Segurança
                      </button>
                      <button 
                        className="flex items-center px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => {
                          setActiveTab('groups');
                        }}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Gerenciar Grupos
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Segurança</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Autenticação de múltiplos fatores (MFA)</h4>
                            <p className="text-sm text-gray-500">Adiciona uma camada extra de segurança à conta</p>
                          </div>
                          <span>
                            {selectedUser.hasMFA ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-5 w-5 mr-1" />
                                <span>Ativado</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600">
                                <XCircle className="h-5 w-5 mr-1" />
                                <span>Desativado</span>
                              </div>
                            )}
                          </span>
                        </div>
                        {!selectedUser.hasMFA && (
                          <div className="mt-2">
                            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              Ativar MFA
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Chaves de Acesso</h4>
                        <AccessKeyManager
                          userName={selectedUser.userName}
                          credentialId={selectedCredentialId}
                          onUpdate={fetchUsers}
                        />
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Último acesso ao console</h4>
                            <p className="text-sm text-gray-500">Data do último login no console da AWS</p>
                          </div>
                          <span className="text-sm font-medium">
                            {formatDate(selectedUser.passwordLastUsed)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'groups' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Grupos ({selectedUser.groups.length})</h3>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Adicionar ao Grupo
                    </button>
                  </div>
                  
                  {selectedUser.groups.length > 0 ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {selectedUser.groups.map((group, index) => (
                          <li key={index}>
                            <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <Users className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-blue-600">{group}</div>
                                </div>
                              </div>
                              <div>
                                <button className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                                  <X className="h-4 w-4 mr-1" />
                                  Remover
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Sem Grupos</h3>
                      <p className="mt-1 text-sm text-gray-500">Este usuário não pertence a nenhum grupo.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'details' && (
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes do Usuário</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Informações Básicas</h4>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Nome do Usuário</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedUser.userName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">ARN</dt>
                          <dd className="mt-1 text-sm text-gray-900 break-all">{selectedUser.arn}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">ID do Usuário</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedUser.userId}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Data de Criação</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(selectedUser.createDate).toLocaleDateString('pt-BR')}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Acesso e Permissões</h4>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Último Acesso ao Console</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.passwordLastUsed)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">MFA Ativo</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedUser.hasMFA ? 'Sim' : 'Não'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Número de Grupos</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedUser.groups.length}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Nível de Risco</dt>
                          <dd className="mt-1">{getRiskBadge(selectedUser.riskLevel)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end bg-gray-50">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsUserDetailOpen(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modals will be implemented in a future update */}
    </div>
  );
} 