'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Componente Spinner simples para usar enquanto carrega
const Spinner = ({ className = "" }) => (
  <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${className}`}></div>
);

interface IAMRole {
  RoleName: string;
  RoleId: string;
  Arn: string;
  CreateDate: Date;
  Description?: string;
  PolicyCount?: number;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<IAMRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IAMRole | null>(null);
  const [currentCredentialId, setCurrentCredentialId] = useState<string | null>(null);
  
  // Estados para o formulário de criação de role
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRoleTrustPolicy, setNewRoleTrustPolicy] = useState(JSON.stringify({
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
  }, null, 2));
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [createRoleError, setCreateRoleError] = useState<string | null>(null);

  // Get roles function
  const getRoles = async () => {
    setLoading(true);
    try {
      // First get current credential ID
      const credResponse = await fetch('/api/aws/credentials/current');
      const credData = await credResponse.json();
      
      if (!credData.credentialId) {
        throw new Error('Nenhuma credencial encontrada');
      }
      
      setCurrentCredentialId(credData.credentialId);
      
      // Then get roles with that credential
      const response = await fetch(`/api/aws/iam/roles?credentialId=${credData.credentialId}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar roles');
      }
      
      const data = await response.json();
      setRoles(data.roles || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete role function
  const deleteRole = async (roleName: string) => {
    if (!currentCredentialId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/aws/iam/roles?credentialId=${currentCredentialId}&roleName=${roleName}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir role');
      }
      
      await getRoles();
      setShowDeleteModal(false);
      setSelectedRole(null);
    } catch (err) {
      console.error('Error deleting role:', err);
      setError(err instanceof Error ? err.message : 'Erro ao excluir role');
    } finally {
      setLoading(false);
    }
  };

  // Create role function
  const createRole = async () => {
    if (!currentCredentialId || !newRoleName || !newRoleTrustPolicy) {
      setCreateRoleError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    setIsCreatingRole(true);
    setCreateRoleError(null);
    
    try {
      // Validar se o documento de política é um JSON válido
      let trustPolicyDoc: any;
      try {
        trustPolicyDoc = JSON.parse(newRoleTrustPolicy);
      } catch (err) {
        setCreateRoleError('O documento de política de confiança deve ser um JSON válido.');
        setIsCreatingRole(false);
        return;
      }
      
      const response = await fetch('/api/aws/iam/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: currentCredentialId,
          roleName: newRoleName,
          description: newRoleDescription,
          assumeRolePolicyDocument: newRoleTrustPolicy
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar role');
      }
      
      // Resetar os campos do formulário
      setNewRoleName('');
      setNewRoleDescription('');
      setNewRoleTrustPolicy(JSON.stringify({
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
      }, null, 2));
      
      // Fechar o modal e atualizar a lista de roles
      setShowAddModal(false);
      await getRoles();
      
    } catch (err) {
      console.error('Error creating role:', err);
      setCreateRoleError(err instanceof Error ? err.message : 'Erro ao criar role');
    } finally {
      setIsCreatingRole(false);
    }
  };

  // Effect to load roles on component mount
  useEffect(() => {
    getRoles();
  }, []);

  // Function to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Roles IAM</h1>
        <div className="flex space-x-2">
          <button
            onClick={getRoles}
            className="inline-flex items-center px-3 py-2 border border-gray-400 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-800 bg-gray-100 hover:bg-gray-200"
            disabled={loading}
          >
            {loading ? (
              <Spinner className="h-4 w-4 mr-2" />
            ) : (
              <ArrowPathIcon className="h-4 w-4 mr-2" />
            )}
            Atualizar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-3 py-2 border border-blue-600 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nova Role
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start gap-2 mb-6">
          <div>
            <p className="font-medium">Erro</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {loading && !error ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-10 w-10 text-blue-500" />
          <span className="ml-3 text-gray-700">Carregando roles...</span>
        </div>
      ) : roles.length === 0 && !error ? (
        <div className="bg-gray-50 rounded-lg shadow p-6 text-center">
          <p className="text-gray-700">Nenhuma role encontrada. Clique em "Nova Role" para criar.</p>
        </div>
      ) : (
        <div className="bg-gray-50 shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Políticas
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.RoleId} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {role.RoleName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {role.RoleId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(role.CreateDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {role.Description || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {role.PolicyCount !== undefined ? role.PolicyCount : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedRole(role);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-md transition-colors mr-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded-md transition-colors"
                      onClick={() => {
                        // Implement edit functionality
                      }}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Role Modal */}
      {showDeleteModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-50 rounded-lg shadow-lg border border-gray-300 p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Tem certeza que deseja excluir a role <span className="font-bold">{selectedRole.RoleName}</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-400 rounded-md hover:bg-gray-100"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRole(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-700 rounded-md hover:bg-red-700"
                onClick={() => selectedRole && deleteRole(selectedRole.RoleName)}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Role modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-50 rounded-lg shadow-lg border border-gray-300 p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Criar Nova Role
            </h3>
            {createRoleError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                <p className="font-medium">Erro</p>
                <p className="text-sm">{createRoleError}</p>
              </div>
            )}
            <div className="mb-5 border border-gray-300 rounded-md p-4 bg-gray-100">
              <label htmlFor="roleName" className="block text-sm font-bold text-gray-800 mb-1">
                Nome da Role *
              </label>
              <input
                type="text"
                id="roleName"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Digite o nome da role"
                className="w-full p-2 border border-gray-400 rounded-md bg-white text-gray-800"
              />
              
              <label htmlFor="roleDescription" className="block text-sm font-bold text-gray-800 mt-4 mb-1">
                Descrição
              </label>
              <textarea
                id="roleDescription"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Digite a descrição da role (opcional)"
                className="w-full p-2 border border-gray-400 rounded-md bg-white text-gray-800"
                rows={3}
              />
              
              <label htmlFor="trustPolicy" className="block text-sm font-bold text-gray-800 mt-4 mb-1">
                Política de Confiança *
              </label>
              <textarea
                id="trustPolicy"
                value={newRoleTrustPolicy}
                onChange={(e) => setNewRoleTrustPolicy(e.target.value)}
                className="w-full p-2 border border-gray-400 font-mono rounded-md bg-white text-gray-800"
                rows={10}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-400 rounded-md hover:bg-gray-100"
                onClick={() => setShowAddModal(false)}
                disabled={isCreatingRole}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-700 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                onClick={createRole}
                disabled={isCreatingRole || !newRoleName || !newRoleTrustPolicy}
              >
                {isCreatingRole ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Criando...
                  </>
                ) : (
                  'Criar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 