import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IAMRole {
  id: string;
  name: string;
  arn: string;
  createDate: string;
  description?: string;
  path?: string;
  policiesCount: number;
}

interface RolesTabProps {
  credentialId: string | null;
}

export default function RolesTab({ credentialId }: RolesTabProps) {
  const [roles, setRoles] = useState<IAMRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IAMRole | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (credentialId) {
      loadRoles();
    } else {
      setLoading(false);
      setRoles([]);
    }
  }, [credentialId]);

  const loadRoles = async () => {
    if (!credentialId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/aws/iam/roles?credentialId=${credentialId}`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar funções: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.roles && Array.isArray(data.roles)) {
        // Transformar os dados para o formato esperado
        const formattedRoles = data.roles.map((role: any) => ({
          id: role.RoleId || role.id || '',
          name: role.RoleName || role.name || '',
          arn: role.Arn || role.arn || '',
          createDate: role.CreateDate || role.createDate || '',
          description: role.Description || role.description,
          path: role.Path || role.path,
          policiesCount: role.policiesCount || 0
        }));
        
        setRoles(formattedRoles);
      } else {
        throw new Error("Formato de dados inesperado");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar funções');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRoles();
    setRefreshing(false);
  };

  const openAddModal = () => {
    setSelectedRole(null);
    setShowAddModal(true);
  };

  const openDeleteModal = (role: IAMRole) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowDeleteModal(false);
    setSelectedRole(null);
  };

  const handleCreateRole = async (roleData: any) => {
    if (!credentialId) return;
    
    try {
      const response = await fetch('/api/aws/iam/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId,
          roleName: roleData.roleName,
          description: roleData.description,
          assumeRolePolicyDocument: roleData.assumeRolePolicyDocument
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar função');
      }

      setActionSuccess(`Função ${roleData.roleName} criada com sucesso!`);
      closeModals();
      loadRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao criar função');
    }
  };

  const handleDeleteRole = async () => {
    if (!credentialId || !selectedRole) return;
    
    try {
      const response = await fetch('/api/aws/iam/roles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId,
          roleName: selectedRole.name
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir função');
      }

      setActionSuccess(`Função ${selectedRole.name} excluída com sucesso!`);
      closeModals();
      loadRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao excluir função');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Funções IAM</h2>
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
            onClick={openAddModal}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white flex items-center text-sm"
          >
            <span className="mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            Nova Função
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
      ) : roles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Nenhuma função IAM encontrada.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome da Função
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Políticas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role) => (
                <motion.tr 
                  key={role.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{role.arn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(role.createDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(role.createDate).toLocaleTimeString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{role.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{role.policiesCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => window.alert('Visualizar detalhes: ' + role.name)}
                    >
                      Detalhes
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => openDeleteModal(role)}
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

      {/* Modal para adicionar função */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">Adicionar Nova Função</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              
              const roleData = {
                roleName: formData.get('roleName') as string,
                description: formData.get('description') as string,
                assumeRolePolicyDocument: formData.get('assumeRolePolicyDocument') as string
              };
              
              handleCreateRole(roleData);
            }}>
              <div className="mb-4">
                <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Função
                </label>
                <input
                  type="text"
                  id="roleName"
                  name="roleName"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="assumeRolePolicyDocument" className="block text-sm font-medium text-gray-700 mb-1">
                  Documento de Política de Confiança (JSON)
                </label>
                <textarea
                  id="assumeRolePolicyDocument"
                  name="assumeRolePolicyDocument"
                  rows={5}
                  required
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm"
                  defaultValue={JSON.stringify({
                    "Version": "2012-10-17",
                    "Statement": [
                      {
                        "Effect": "Allow",
                        "Principal": {
                          "Service": "ec2.amazonaws.com"
                        },
                        "Action": "sts:AssumeRole"
                      }
                    ]
                  }, null, 2)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este documento JSON define quem pode assumir esta função.
                </p>
              </div>
              
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
                  Adicionar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal para confirmar exclusão */}
      {showDeleteModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">Confirmar Exclusão</h3>
            <p className="mb-4">
              Tem certeza que deseja excluir a função <strong>{selectedRole.name}</strong>?
              Esta ação removerá a função e todas as políticas anexadas a ela.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteRole}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 