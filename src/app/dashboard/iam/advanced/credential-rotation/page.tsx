"use client";

import { useState, useEffect } from "react";
import { RotateCw, RefreshCw, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import CredentialRotationManager from "@/components/aws/iam/CredentialRotationManager";
import Breadcrumb from "@/components/dashboard/Breadcrumb";

interface AwsCredential {
  id: string;
  name: string;
}

export default function CredentialRotationPage() {
  const [credentials, setCredentials] = useState<AwsCredential[]>([]);
  const [selectedCredentialId, setSelectedCredentialId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetching credentials for selection
  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        setIsLoading(true);
        // Verificar primeiro se já existe um credentialId no localStorage
        const storedCredentialId = localStorage.getItem('selectedCredentialId');
        
        const response = await fetch('/api/aws/credentials');
        if (!response.ok) throw new Error('Falha ao carregar credenciais');
        
        const data = await response.json();
        setCredentials(data);
        
        if (data.length > 0) {
          if (storedCredentialId && data.some((cred: AwsCredential) => cred.id === storedCredentialId)) {
            setSelectedCredentialId(storedCredentialId);
          } else {
            setSelectedCredentialId(data[0].id);
            localStorage.setItem('selectedCredentialId', data[0].id);
          }
        }
      } catch (err) {
        setError('Erro ao buscar credenciais AWS: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCredentials();
  }, []);
  
  const handleCredentialChange = (id: string) => {
    setSelectedCredentialId(id);
    localStorage.setItem('selectedCredentialId', id);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb 
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "IAM", href: "/dashboard/iam" },
          { label: "Rotação de Chaves", href: "/dashboard/iam/advanced/credential-rotation" }
        ]} 
      />
      
      <div className="mb-6 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Rotação de Chaves de Acesso
            </h1>
            <p className="mt-1 text-gray-500">
              Gerencie e rotacione chaves de acesso para múltiplos usuários IAM
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-sm text-gray-700 mr-2">Credencial:</span>
            <select
              value={selectedCredentialId}
              onChange={(e) => handleCredentialChange(e.target.value)}
              className="border border-gray-300 rounded-md text-sm p-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <option>Carregando...</option>
              ) : (
                credentials.map((cred) => (
                  <option key={cred.id} value={cred.id}>
                    {cred.name}
                  </option>
                ))
              )}
            </select>
            
            {isLoading && (
              <RefreshCw className="ml-2 h-5 w-5 text-gray-400 animate-spin" />
            )}
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start gap-2 mb-6"
        >
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro</p>
            <p className="text-sm">{error}</p>
          </div>
        </motion.div>
      )}
      
      {selectedCredentialId ? (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <CredentialRotationManager 
            credentialId={selectedCredentialId}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p>Carregando credenciais AWS...</p>
            </div>
          ) : (
            <>
              <RotateCw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma credencial disponível</h3>
              <p>Adicione uma credencial AWS para gerenciar rotação de chaves de acesso.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
} 