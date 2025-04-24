import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IAMGroup {
  id: string;
  name: string;
  arn: string;
  createDate: string;
  userCount: number;
  policiesCount: number;
}

interface GroupsTabProps {
  credentialId: string | null;
}

export default function GroupsTab({ credentialId }: GroupsTabProps) {
  const [groups, setGroups] = useState<IAMGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<IAMGroup | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (credentialId) {
      loadGroups();
    } else {
      setLoading(false);
      setGroups([]);
    }
  }, [credentialId]);

  const loadGroups = async () => {
    if (!credentialId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/aws/iam?credentialId=${credentialId}&type=groups`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar grupos: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.groups && Array.isArray(data.groups)) {
        // Transformar os dados para o formato esperado
        const formattedGroups = data.groups.map((group: any) => ({
          id: group.GroupId || group.id || '',
          name: group.GroupName || group.name || '',
          arn: group.Arn || group.arn || '',
          createDate: group.CreateDate || group.createDate || '',
          userCount: group.userCount || 0,
          policiesCount: group.policiesCount || 0
        }));
        
        setGroups(formattedGroups);
      } else {
        throw new Error("Formato de dados inesperado");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar grupos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGroups();
    setRefreshing(false);
  };

  const openAddModal = () => {
    setSelectedGroup(null);
    setShowAddModal(true);
  };

  const openDeleteModal = (group: IAMGroup) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowDeleteModal(false);
    setSelectedGroup(null);
  };

  const handleCreateGroup = async (groupData: { groupName: string }) => {
    if (!credentialId) return;
    
    try {
      const response = await fetch('/api/aws/iam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId,
          resourceType: 'group',
          groupName: groupData.groupName
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar grupo');
      }

      closeModals();
      loadGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao criar grupo');
    }
  };

  const handleDeleteGroup = async () => {
    if (!credentialId || !selectedGroup) return;
    
    try {
      const url = `/api/aws/iam?resourceType=group&credentialId=${credentialId}&groupName=${selectedGroup.name}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir grupo');
      }

      closeModals();
      loadGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao excluir grupo');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Grupos IAM</h2>
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
            Novo Grupo
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Nenhum grupo IAM encontrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Grupo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuários
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
              {groups.map((group) => (
                <motion.tr 
                  key={group.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{group.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{group.arn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(group.createDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(group.createDate).toLocaleTimeString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{group.userCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{group.policiesCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => window.alert('Visualizar detalhes: ' + group.name)}
                    >
                      Detalhes
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => openDeleteModal(group)}
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

      {/* Modal para adicionar grupo */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">Adicionar Novo Grupo</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              handleCreateGroup({ groupName: formData.get('groupName') as string });
            }}>
              <div className="mb-4">
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  id="groupName"
                  name="groupName"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
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
      {showDeleteModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">Confirmar Exclusão</h3>
            <p className="mb-4">
              Tem certeza que deseja excluir o grupo <strong>{selectedGroup.name}</strong>?
              Esta ação removerá todos os usuários do grupo e desvinculará todas as políticas.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteGroup}
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