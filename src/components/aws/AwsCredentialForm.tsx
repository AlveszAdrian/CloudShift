"use client";

import { useState, FormEvent } from "react";
import { useAwsCredentials, AwsCredential } from "@/hooks/useAwsCredentials";
import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/outline";

const AWS_REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-east-2", label: "US East (Ohio)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "af-south-1", label: "Africa (Cape Town)" },
  { value: "ap-east-1", label: "Asia Pacific (Hong Kong)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  { value: "ap-northeast-2", label: "Asia Pacific (Seoul)" },
  { value: "ap-northeast-3", label: "Asia Pacific (Osaka)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
  { value: "ca-central-1", label: "Canada (Central)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "eu-west-1", label: "Europe (Ireland)" },
  { value: "eu-west-2", label: "Europe (London)" },
  { value: "eu-west-3", label: "Europe (Paris)" },
  { value: "eu-north-1", label: "Europe (Stockholm)" },
  { value: "eu-south-1", label: "Europe (Milan)" },
  { value: "me-south-1", label: "Middle East (Bahrain)" },
  { value: "sa-east-1", label: "South America (São Paulo)" },
];

export default function AwsCredentialForm() {
  const { addCredential, deleteCredential, credentials, isLoading, error } = useAwsCredentials();
  const [name, setName] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [success, setSuccess] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [credentialToDelete, setCredentialToDelete] = useState<AwsCredential | null>(null);
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateCredentials = async (creds: { 
    accessKeyId: string, 
    secretKey: string, 
    region: string 
  }): Promise<boolean> => {
    try {
      setValidating(true);
      setValidationError(null);
      
      const response = await fetch('/api/aws/credentials/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creds),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.valid) {
        setValidationError(data.error || 'Erro ao validar credenciais. Verifique se as chaves estão corretas.');
        return false;
      }
      
      return true;
    } catch (error) {
      setValidationError('Erro ao validar credenciais: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      return false;
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setValidationError(null);
    
    // Primeiro validar as credenciais
    const isValid = await validateCredentials({
      accessKeyId,
      secretKey,
      region
    });
    
    if (!isValid) {
      return; // Não prosseguir se as credenciais forem inválidas
    }
    
    try {
      await addCredential({
        name,
        accessKeyId,
        secretAccessKey: secretKey,
        region
      });
      
      setSuccess(true);
      // Limpar o formulário
      setName("");
      setAccessKeyId("");
      setSecretKey("");
      setRegion("us-east-1");
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao adicionar credencial:", error);
      // Não vamos limpar o erro aqui, deixar o hook cuidar disso
      // Se necessário, exibir uma mensagem mais detalhada vinda da API
      setTimeout(() => {
        // Resetar o erro após 5 segundos
        // Note que este é o erro do hook, não um estado local
      }, 5000);
    }
  };

  const handleDeleteClick = (credential: AwsCredential) => {
    setCredentialToDelete(credential);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!credentialToDelete) return;

    try {
      await deleteCredential(credentialToDelete.id);
      setDeleteMessage("Credencial removida com sucesso!");
      setShowDeleteModal(false);
      
      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setDeleteMessage("");
      }, 3000);
    } catch (error) {
      console.error("Erro ao excluir credencial:", error);
      setDeleteMessage("Erro ao excluir credencial. Tente novamente.");
      setShowDeleteModal(false);
      
      // Limpar a mensagem de erro após 3 segundos
      setTimeout(() => {
        setDeleteMessage("");
      }, 3000);
    }
  };

  return (
    <>
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Credenciais Cadastradas
        </h2>
        
        {deleteMessage && (
          <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800">
            {deleteMessage}
          </div>
        )}
        
        {credentials.length === 0 ? (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 text-center">
            Nenhuma credencial cadastrada. Adicione uma nova credencial utilizando o formulário.
          </div>
        ) : (
          <div className="space-y-3">
            {credentials.map((credential) => (
              <div 
                key={credential.id} 
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{credential.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Região: {credential.region}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(credential)}
                  className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  title="Excluir credencial"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Adicionar Credencial AWS
        </h2>
        
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-md">
            {error}
          </div>
        )}
        
        {validationError && (
          <div className="p-3 mb-4 text-sm text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 rounded-md">
            <div className="font-medium">Erro de validação:</div>
            {validationError}
          </div>
        )}
        
        {success && (
          <div className="p-3 mb-4 text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-md">
            Credencial adicionada com sucesso!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
              Nome da Credencial
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
              placeholder="Minha Conta AWS"
            />
          </div>
          
          <div>
            <label htmlFor="accessKeyId" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
              Access Key ID
            </label>
            <input
              id="accessKeyId"
              type="text"
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
              placeholder="AKIAIOSFODNN7EXAMPLE"
            />
          </div>
          
          <div>
            <label htmlFor="secretKey" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
              Secret Access Key
            </label>
            <input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
            />
          </div>
          
          <div>
            <label htmlFor="region" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
              Região
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
            >
              {AWS_REGIONS.map((option) => (
                <option key={option.value} value={option.value} className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || validating}
              className="w-full flex justify-center py-3 px-4 border border-blue-700 dark:border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adicionando..." : validating ? "Validando..." : "Adicionar Credencial"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Dica de segurança</h3>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
            Por segurança, recomendamos criar credenciais IAM específicas para esta aplicação
            com permissões limitadas às funcionalidades necessárias (EC2, S3, CloudWatch, etc).
          </p>
        </div>
      </motion.div>
      
      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && credentialToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-6 max-w-md w-full">
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Tem certeza que deseja excluir a credencial <span className="font-bold">{credentialToDelete.name}</span>?
              Esta ação não pode ser desfeita e todos os recursos associados perderão acesso.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-700 dark:bg-red-700 dark:border-red-600 rounded-md hover:bg-red-700 dark:hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 