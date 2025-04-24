"use client";

import { useState, useEffect } from "react";
import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import { motion } from "framer-motion";
import CredentialSelector from "@/components/aws/CredentialSelector";

interface S3Bucket {
  name: string;
  creationDate: string;
}

export default function S3Page() {
  const { selectedCredential } = useAwsCredentials();
  const [buckets, setBuckets] = useState<S3Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCredentialId, setLastCredentialId] = useState<string | null>(null);

  useEffect(() => {
    // Tenta restaurar dados do cache ao iniciar
    if (!selectedCredential) {
      setLoading(false);
      return;
    }
    
    // Verificar se já temos dados no localStorage
    try {
      const bucketsCache = localStorage.getItem('s3Buckets');
      const cachedCredentialId = localStorage.getItem('s3LastCredentialId');
      
      if (bucketsCache && cachedCredentialId === selectedCredential.id) {
        const parsedBuckets = JSON.parse(bucketsCache);
        setBuckets(parsedBuckets);
        setLoading(false);
        
        // Atualiza em background
        fetchBucketsInBackground();
      } else {
        // Se não tem cache ou a credencial mudou, busca novos dados
        fetchBuckets();
      }
      
      setLastCredentialId(selectedCredential.id);
    } catch (error) {
      console.error("Erro ao restaurar cache:", error);
      fetchBuckets();
    }
  }, [selectedCredential]);

  async function fetchBuckets() {
    if (!selectedCredential) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`Buscando buckets S3 para credencial: ${selectedCredential.id}`);
      
      const response = await fetch(`/api/aws/resources?credentialId=${selectedCredential.id}&type=S3`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar buckets S3");
      }
      
      const data = await response.json();
      setBuckets(data.resources || []);
      
      // Armazenar no cache
      localStorage.setItem('s3Buckets', JSON.stringify(data.resources || []));
      localStorage.setItem('s3LastCredentialId', selectedCredential.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar buckets S3");
      console.error("Erro ao buscar buckets:", err);
    } finally {
      setLoading(false);
    }
  }

  // Função para atualizar em background sem interferir na experiência do usuário
  async function fetchBucketsInBackground() {
    if (!selectedCredential) return;

    try {
      setBackgroundLoading(true);
      
      console.log(`Atualizando buckets S3 em background para credencial: ${selectedCredential.id}`);
      const response = await fetch(`/api/aws/resources?credentialId=${selectedCredential.id}&type=S3`);
      
      if (!response.ok) {
        throw new Error("Erro na atualização em background");
      }
      
      const data = await response.json();
      setBuckets(data.resources || []);
      
      // Atualizar cache
      localStorage.setItem('s3Buckets', JSON.stringify(data.resources || []));
      localStorage.setItem('s3LastCredentialId', selectedCredential.id);
      
      console.log("Atualização em background de buckets S3 concluída");
    } catch (err) {
      console.error("Erro na atualização em background:", err);
      // Não exibimos erros de background para o usuário
    } finally {
      setBackgroundLoading(false);
    }
  }

  return (
    <div>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Buckets S3</h1>
        <p className="mt-2 text-gray-600">
          Visualize e gerencie seus buckets do Amazon S3.
        </p>
      </motion.div>

      <CredentialSelector />

      {!selectedCredential ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-500">Selecione uma credencial AWS para visualizar seus buckets S3.</p>
        </motion.div>
      ) : loading ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </motion.div>
      ) : error ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
        </motion.div>
      ) : buckets.length === 0 ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-500">Nenhum bucket S3 encontrado para esta credencial.</p>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {buckets.length} {buckets.length === 1 ? "Bucket" : "Buckets"} Encontrados
            </h2>
            {backgroundLoading && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
                Atualizando...
              </div>
            )}
          </div>
          <ul className="divide-y divide-gray-200">
            {buckets.map((bucket) => (
              <li key={bucket.name} className="hover:bg-gray-50">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{bucket.name}</p>
                      <p className="text-sm text-gray-500">
                        Criado em: {new Date(bucket.creationDate).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <button
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                        onClick={() => window.open(`https://s3.console.aws.amazon.com/s3/buckets/${bucket.name}`, "_blank")}
                      >
                        Ver no Console AWS
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
} 