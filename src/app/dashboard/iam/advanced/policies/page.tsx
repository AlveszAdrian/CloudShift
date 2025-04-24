'use client';

import { useState, useEffect } from 'react';
import { ArrowPathIcon, ExclamationCircleIcon, PlusIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface IAMPolicy {
  PolicyName: string;
  PolicyId: string;
  Arn: string;
  CreateDate: string;
  Description?: string;
  AttachmentCount?: number;
  IsAttachable?: boolean;
}

export default function IAMPoliciesPage() {
  const [policies, setPolicies] = useState<IAMPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credentialId, setCredentialId] = useState<string | null>(null);
  const [selectedScope, setSelectedScope] = useState<'All' | 'AWS' | 'Local'>('All');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewPolicyModalOpen, setIsViewPolicyModalOpen] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState<IAMPolicy | null>(null);
  
  // Form states
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDescription, setNewPolicyDescription] = useState('');
  const [newPolicyDocument, setNewPolicyDocument] = useState(
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["s3:ListBucket"],
          Resource: ["arn:aws:s3:::example-bucket"]
        }
      ]
    }, null, 2)
  );

  const [policyDocument, setPolicyDocument] = useState<string | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  useEffect(() => {
    // Get the credential ID from localStorage
    const storedCredentialId = localStorage.getItem('selectedCredentialId');
    console.log('Credencial obtida do localStorage:', storedCredentialId);
    setCredentialId(storedCredentialId);
    
    if (storedCredentialId) {
      fetchPolicies(storedCredentialId);
    } else {
      console.error('Nenhuma credencial encontrada no localStorage');
      setError('Credenciais AWS não encontradas. Por favor, configure suas credenciais.');
      setIsLoading(false);
    }
  }, [selectedScope]);

  const fetchPolicies = async (credId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Buscando políticas com credentialId: ${credId}, scope: ${selectedScope}`);
      const response = await fetch(`/api/aws/iam/policies?credentialId=${credId}&scope=${selectedScope}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resposta de erro da API:', errorData);
        throw new Error(errorData.error || 'Erro ao buscar políticas IAM');
      }
      
      const data = await response.json();
      console.log(`Políticas recebidas: ${data.policies?.length || 0}`);
      setPolicies(data.policies || []);
    } catch (err) {
      console.error('Erro ao buscar políticas IAM:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar políticas IAM');

      // Tentar buscar uma nova credencial atual como fallback
      try {
        console.log('Tentando buscar credencial atual via API como fallback');
        const credResponse = await fetch('/api/aws/credentials/current');
        if (credResponse.ok) {
          const credData = await credResponse.json();
          if (credData.credentialId) {
            console.log('Nova credencial obtida:', credData.credentialId);
            localStorage.setItem('selectedCredentialId', credData.credentialId);
            setCredentialId(credData.credentialId);
            // Não chamamos fetchPolicies aqui para evitar um loop infinito em caso de erro
          }
        }
      } catch (fallbackError) {
        console.error('Erro ao tentar fallback de credencial:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    if (!credentialId || !newPolicyName || !newPolicyDocument) return;
    
    try {
      let policyDocToSend = newPolicyDocument;
      
      // Verify if policy document is valid JSON
      try {
        JSON.parse(newPolicyDocument);
      } catch (err) {
        setError('O documento da política deve ser um JSON válido');
        return;
      }
      
      const response = await fetch('/api/aws/iam/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentialId,
          policyName: newPolicyName,
          policyDocument: policyDocToSend,
          description: newPolicyDescription
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar política IAM');
      }
      
      // Refresh policies list
      fetchPolicies(credentialId);
      
      // Reset form and close modal
      setNewPolicyName('');
      setNewPolicyDescription('');
      setNewPolicyDocument(JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["s3:ListBucket"],
            Resource: ["arn:aws:s3:::example-bucket"]
          }
        ]
      }, null, 2));
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Erro ao criar política IAM:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao criar política IAM');
    }
  };

  const handleDeletePolicy = async () => {
    if (!credentialId || !currentPolicy) return;
    
    try {
      const response = await fetch(`/api/aws/iam/policies?credentialId=${credentialId}&policyArn=${currentPolicy.Arn}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir política IAM');
      }
      
      // Refresh policies list
      fetchPolicies(credentialId);
      
      // Reset current policy and close modal
      setCurrentPolicy(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Erro ao excluir política IAM:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao excluir política IAM');
    }
  };

  const openDeleteModal = (policy: IAMPolicy) => {
    setCurrentPolicy(policy);
    setIsDeleteModalOpen(true);
  };

  const openViewPolicyModal = async (policy: IAMPolicy) => {
    setCurrentPolicy(policy);
    setIsViewPolicyModalOpen(true);
    setPolicyDocument(null);
    setIsLoadingDocument(true);
    
    try {
      // Buscar o documento da política usando a API getPolicy da AWS
      if (credentialId) {
        const response = await fetch(`/api/aws/iam/policies/document?credentialId=${credentialId}&policyArn=${policy.Arn}`);
        
        if (!response.ok) {
          throw new Error('Falha ao buscar documento da política');
        }
        
        const data = await response.json();
        
        if (data.document) {
          // Formatar o documento JSON para exibição
          const formattedDocument = JSON.stringify(data.document, null, 2);
          setPolicyDocument(formattedDocument);
        } else {
          setPolicyDocument('Documento não disponível');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar documento da política:', error);
      setPolicyDocument('Erro ao carregar documento da política');
    } finally {
      setIsLoadingDocument(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 mx-auto animate-spin text-blue-500" />
          <h2 className="mt-4 text-xl font-semibold">Carregando políticas IAM...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar políticas IAM</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => credentialId && fetchPolicies(credentialId)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Políticas IAM</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value as 'All' | 'AWS' | 'Local')}
              className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="All">Todas as políticas</option>
              <option value="AWS">Políticas AWS</option>
              <option value="Local">Políticas locais</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => credentialId && fetchPolicies(credentialId)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Atualizar
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nova Política
          </button>
        </div>
      </div>

      {policies.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">Nenhuma política IAM encontrada.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome da Política
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID da Política
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anexos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <motion.tr 
                  key={policy.PolicyId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {policy.PolicyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.PolicyId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(policy.CreateDate).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.AttachmentCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.Description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openViewPolicyModal(policy)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(policy)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Policy Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Criar Nova Política IAM</h3>
            </div>
            <div className="p-6">
              <div className="mb-4 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Política *
                  </label>
                  <input
                    type="text"
                    value={newPolicyName}
                    onChange={(e) => setNewPolicyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome da política"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={newPolicyDescription}
                    onChange={(e) => setNewPolicyDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descrição (opcional)"
                  />
                </div>
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documento da Política *
                  </label>
                  <textarea
                    value={newPolicyDocument}
                    onChange={(e) => setNewPolicyDocument(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Documento JSON da política"
                    rows={12}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePolicy}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Policy Modal */}
      {isDeleteModalOpen && currentPolicy && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Confirmar Exclusão</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Tem certeza que deseja excluir a política <span className="font-semibold">{currentPolicy.PolicyName}</span>?
              </p>
              <p className="text-sm text-red-600 mt-2">
                Esta ação não pode ser desfeita. Se esta política estiver anexada a usuários, grupos ou funções, ela não poderá ser excluída.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePolicy}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Policy Modal */}
      {isViewPolicyModalOpen && currentPolicy && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Detalhes da Política: {currentPolicy.PolicyName}</h3>
              <button
                onClick={() => setIsViewPolicyModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Informações da Política</h4>
                <div className="mt-2 grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">ARN:</span>
                    <p className="text-sm text-gray-900">{currentPolicy.Arn}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">ID:</span>
                    <p className="text-sm text-gray-900">{currentPolicy.PolicyId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Data de Criação:</span>
                    <p className="text-sm text-gray-900">{new Date(currentPolicy.CreateDate).toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Descrição:</span>
                    <p className="text-sm text-gray-900">{currentPolicy.Description || 'Sem descrição'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Documento da Política</h4>
                {isLoadingDocument ? (
                  <div className="flex justify-center items-center py-8">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <pre className="bg-gray-50 p-4 rounded-md text-xs text-gray-800 overflow-x-auto">
                    {policyDocument || '{\n  "Version": "2012-10-17",\n  "Statement": []\n}'}
                  </pre>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
              <button
                onClick={() => setIsViewPolicyModalOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 