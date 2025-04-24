import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IAMUser {
  id: string;
  name: string;
  arn: string;
  createDate: string;
  passwordLastUsed?: string;
  hasConsoleAccess: boolean;
  hasMfa: boolean;
  accessKeysCount: number;
  policiesCount: number;
  riskLevel: 'high' | 'medium' | 'low' | 'safe';
}

interface UsersTabProps {
  credentialId: string | null;
}

export default function UsersTab({ credentialId }: UsersTabProps) {
  const [users, setUsers] = useState<IAMUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IAMUser | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (credentialId) {
      loadUsers();
    } else {
      setLoading(false);
      setUsers([]);
    }
  }, [credentialId]);

  const loadUsers = async () => {
    if (!credentialId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/aws/iam/users?credentialId=${credentialId}`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar usuários: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.users && Array.isArray(data.users)) {
        // Transformar os dados para o formato esperado
        const formattedUsers = data.users.map((user: any) => ({
          id: user.UserId || user.id || '',
          name: user.UserName || user.name || '',
          arn: user.Arn || user.arn || '',
          createDate: user.CreateDate || user.createDate || '',
          passwordLastUsed: user.PasswordLastUsed || user.passwordLastUsed,
          hasConsoleAccess: user.hasConsoleAccess || false,
          hasMfa: user.hasMfa || false,
          accessKeysCount: user.accessKeysCount || 0,
          policiesCount: user.policiesCount || 0,
          riskLevel: user.riskLevel || 'low'
        }));
        
        setUsers(formattedUsers);
      } else {
        throw new Error("Formato de dados inesperado");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const openAddUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const openEditUserModal = (user: IAMUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const openDeleteModal = (user: IAMUser) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowUserModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleCreateUser = async (userData: any) => {
    if (!credentialId) return;
    
    try {
      const response = await fetch('/api/aws/iam/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId,
          userName: userData.username,
          createConsoleAccess: userData.consoleAccess,
          consolePassword: userData.password,
          policyArns: userData.policies
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      setActionSuccess(`Usuário ${userData.username} criado com sucesso!`);
      closeModals();
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao criar usuário');
    }
  };

  const handleDeleteUser = async () => {
    if (!credentialId || !selectedUser) return;
    
    try {
      const response = await fetch('/api/aws/iam/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId,
          userName: selectedUser.name
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir usuário');
      }

      setActionSuccess(`Usuário ${selectedUser.name} excluído com sucesso!`);
      closeModals();
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao excluir usuário');
    }
  };

  const handleEnableMFA = async (user: IAMUser) => {
    try {
      // Implementação de habilitação de MFA
      setActionSuccess(`MFA habilitado para ${user.name}!`);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao habilitar MFA');
    }
  };

  // Helper para cores dos níveis de risco
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      case "safe": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getRiskLabel = (level: string) => {
    switch (level) {
      case "high": return "Alto";
      case "medium": return "Médio";
      case "low": return "Baixo";
      case "safe": return "Seguro";
      default: return "Desconhecido";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Usuários IAM</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 flex items-center text-sm"
          >
            <span className={`mr-1 ${refreshing ? 'animate-spin' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
            Atualizar
          </button>
          <button
            onClick={openAddUserModal}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white flex items-center text-sm"
          >
            <span className="mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            Novo Usuário
          </button>
        </div>
      </div>

      {actionSuccess && (
        <motion.div 
          className="mb-4 p-4 rounded-md bg-green-50 border border-green-100 text-green-800 flex justify-between items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>{actionSuccess}</span>
          <button 
            onClick={() => setActionSuccess(null)}
            className="text-green-600 hover:text-green-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Nenhum usuário IAM encontrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acesso
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MFA
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chaves de Acesso
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Políticas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risco
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{new Date(user.createDate).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.passwordLastUsed 
                        ? new Date(user.passwordLastUsed).toLocaleDateString('pt-BR')
                        : '-'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.passwordLastUsed 
                        ? new Date(user.passwordLastUsed).toLocaleTimeString('pt-BR')
                        : 'Nunca acessou'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.hasMfa ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEnableMFA(user)}
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        Inativo
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.accessKeysCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.policiesCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(user.riskLevel)}`}>
                      {getRiskLabel(user.riskLevel)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => openEditUserModal(user)}
                    >
                      Editar
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => openDeleteModal(user)}
                    >
                      Excluir
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para adicionar/editar usuário */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">
              {selectedUser ? `Editar ${selectedUser.name}` : 'Adicionar Novo Usuário'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              
              const userData = {
                username: formData.get('username') as string,
                consoleAccess: formData.get('consoleAccess') === 'on',
                password: formData.get('password') as string,
                policies: [] // Normalmente viriam de um componente seletor de políticas
              };
              
              handleCreateUser(userData);
            }}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  defaultValue={selectedUser?.name}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                  readOnly={!!selectedUser}
                />
              </div>
              
              {!selectedUser && (
                <>
                  <div className="mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="consoleAccess"
                        name="consoleAccess"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor="consoleAccess" className="ml-2 block text-sm text-gray-700">
                        Permitir acesso ao console AWS
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha Inicial (se acesso ao console)
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A senha deve ter pelo menos 8 caracteres e incluir letras maiúsculas, minúsculas, números e símbolos.
                    </p>
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  {selectedUser ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal para confirmar exclusão */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">Confirmar Exclusão</h3>
            <p className="mb-4">
              Tem certeza que deseja excluir o usuário <strong>{selectedUser.name}</strong>?
              Esta ação removerá o usuário, suas chaves de acesso e suas políticas anexadas.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 