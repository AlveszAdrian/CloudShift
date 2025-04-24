import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IAMPolicy {
  id: string;
  name: string;
  arn: string;
  createDate: string;
  updateDate?: string;
  description?: string;
  isAwsManaged: boolean;
  attachmentCount: number;
  defaultVersionId?: string;
}

interface PoliciesTabProps {
  credentialId: string | null;
}

export default function PoliciesTab({ credentialId }: PoliciesTabProps) {
  const [policies, setPolicies] = useState<IAMPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewPolicyModal, setShowViewPolicyModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<IAMPolicy | null>(null);
  const [policyDocument, setPolicyDocument] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [onlyCustomPolicies, setOnlyCustomPolicies] = useState(false);

  useEffect(() => {
    if (credentialId) {
      loadPolicies();
    } else {
      setLoading(false);
      setPolicies([]);
    }
  }, [credentialId, onlyCustomPolicies]);

  const loadPolicies = async () => {
    if (!credentialId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `/api/aws/iam/policies?credentialId=${credentialId}${onlyCustomPolicies ? '&onlyCustom=true' : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao carregar políticas: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.policies && Array.isArray(data.policies)) {
        // Transformar os dados para o formato esperado
        const formattedPolicies = data.policies.map((policy: any) => ({
          id: policy.PolicyId || policy.id || '',
          name: policy.PolicyName || policy.name || '',
          arn: policy.PolicyArn || policy.arn || '',
          createDate: policy.CreateDate || policy.createDate || '',
          updateDate: policy.UpdateDate || policy.updateDate,
          description: policy.Description || policy.description,
          isAwsManaged: policy.IsAwsManaged || policy.isAwsManaged || (policy.PolicyArn && policy.PolicyArn.includes('arn:aws:iam::aws')),
          attachmentCount: policy.AttachmentCount || policy.attachmentCount || 0,
          defaultVersionId: policy.DefaultVersionId || policy.defaultVersionId
        }));
        
        setPolicies(formattedPolicies);
      } else {
        throw new Error("Formato de dados inesperado");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar políticas');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPolicies();
    setRefreshing(false);
  };

  const openAddModal = () => {
    setSelectedPolicy(null);
    setShowAddModal(true);
  };

  const openViewPolicyModal = async (policy: IAMPolicy) => {
    setSelectedPolicy(policy);
    setShowViewPolicyModal(true);
    setPolicyDocument("Carregando documento da política...");
    
    try {
      const response = await fetch(`/api/aws/iam/policies/${encodeURIComponent(policy.arn)}?credentialId=${credentialId}`);
      if (!response.ok) {
        throw new Error(`Erro ao obter documento de política: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.policyDocument) {
        // O documento de política pode vir codificado em URL, então precisamos decodificá-lo
        const decodedDocument = decodeURIComponent(data.policyDocument);
        try {
          // Tentamos analisar o JSON para formatá-lo
          const jsonDoc = JSON.parse(decodedDocument);
          setPolicyDocument(JSON.stringify(jsonDoc, null, 2));
        } catch (e) {
          setPolicyDocument(decodedDocument);
        }
      } else {
        setPolicyDocument("Não foi possível obter o documento da política.");
      }
    } catch (err) {
      setPolicyDocument(`Erro ao carregar documento: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const openDeleteModal = (policy: IAMPolicy) => {
    setSelectedPolicy(policy);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowDeleteModal(false);
    setShowViewPolicyModal(false);
    setSelectedPolicy(null);
    setPolicyDocument("");
  };

  const handleCreatePolicy = async (policyData: any) => {
    if (!credentialId) return;
    
    try {
      const response = await fetch('/api/aws/iam/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId,
          policyName: policyData.policyName,
          description: policyData.description,
          policyDocument: policyData.policyDocument
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar política');
      }

      setActionSuccess(`Política ${policyData.policyName} criada com sucesso!`);
      closeModals();
      loadPolicies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao criar política');
    }
  };

  const handleDeletePolicy = async () => {
    if (!credentialId || !selectedPolicy) return;
    
    try {
      const response = await fetch('/api/aws/iam/policies', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId,
          policyArn: selectedPolicy.arn
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir política');
      }

      setActionSuccess(`Política ${selectedPolicy.name} excluída com sucesso!`);
      closeModals();
      loadPolicies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao excluir política');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Políticas IAM</h2>
        <div className="flex space-x-2">
          <div className="flex items-center mr-4">
            <input
              type="checkbox"
              id="onlyCustom"
              checked={onlyCustomPolicies}
              onChange={(e) => setOnlyCustomPolicies(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2"
            />
            <label htmlFor="onlyCustom" className="text-sm text-gray-700">
              Apenas políticas personalizadas
            </label>
          </div>
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
            Nova Política
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
      ) : policies.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Nenhuma política IAM encontrada.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome da Política
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anexos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <motion.tr 
                  key={policy.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{policy.arn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(policy.createDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {policy.updateDate ? `Atualizada: ${new Date(policy.updateDate).toLocaleDateString('pt-BR')}` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${policy.isAwsManaged ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {policy.isAwsManaged ? 'AWS Gerenciada' : 'Personalizada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.attachmentCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => openViewPolicyModal(policy)}
                    >
                      Visualizar
                    </button>
                    {!policy.isAwsManaged && (
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => openDeleteModal(policy)}
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para adicionar política */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">Adicionar Nova Política</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              
              const policyData = {
                policyName: formData.get('policyName') as string,
                description: formData.get('description') as string,
                policyDocument: formData.get('policyDocument') as string
              };
              
              handleCreatePolicy(policyData);
            }}>
              <div className="mb-4">
                <label htmlFor="policyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Política
                </label>
                <input
                  type="text"
                  id="policyName"
                  name="policyName"
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
                <label htmlFor="policyDocument" className="block text-sm font-medium text-gray-700 mb-1">
                  Documento de Política (JSON)
                </label>
                <textarea
                  id="policyDocument"
                  name="policyDocument"
                  rows={12}
                  required
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm"
                  defaultValue={JSON.stringify({
                    "Version": "2012-10-17",
                    "Statement": [
                      {
                        "Effect": "Allow",
                        "Action": [
                          "s3:Get*",
                          "s3:List*"
                        ],
                        "Resource": "*"
                      }
                    ]
                  }, null, 2)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este documento JSON define as permissões concedidas por esta política.
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

      {/* Modal para visualizar documento de política */}
      {showViewPolicyModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Documento de Política: {selectedPolicy.name}</h3>
              <button 
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[60vh]">
                {policyDocument}
              </pre>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal para confirmar exclusão */}
      {showDeleteModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">Confirmar Exclusão</h3>
            <p className="mb-4">
              Tem certeza que deseja excluir a política <strong>{selectedPolicy.name}</strong>?
              {selectedPolicy.attachmentCount > 0 && (
                <span className="text-red-600 block mt-2">
                  Atenção: Esta política está anexada a {selectedPolicy.attachmentCount} entidade(s). 
                  A exclusão falhará se você não desanexar a política primeiro.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePolicy}
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