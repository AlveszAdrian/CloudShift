"use client";

import { useState, useEffect, useCallback } from 'react';

export interface AwsCredential {
  id: string;
  name: string;
  accountId: string;
  region: string;
  createdAt: string;
  updatedAt: string;
}

interface UseAwsCredentialsReturn {
  credentials: AwsCredential[];
  selectedCredential: AwsCredential | null;
  isLoading: boolean;
  error: string | null;
  loading: boolean; // Alias para isLoading para compatibilidade
  loadCredentials: () => Promise<void>;
  selectCredential: (id: string) => void;
  addCredential: (credential: { name: string; accessKeyId: string; secretAccessKey: string; region: string }) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
}

export const useAwsCredentials = (): UseAwsCredentialsReturn => {
  const [credentials, setCredentials] = useState<AwsCredential[]>([]);
  const [selectedCredential, setSelectedCredential] = useState<AwsCredential | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCredentials = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/aws/credentials');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch AWS credentials: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCredentials(data);
      
      // Select first credential or previously selected one
      const storedCredentialId = localStorage.getItem('selectedCredentialId');
      
      if (data.length > 0) {
        // Se há apenas uma credencial, sempre selecionar ela independentemente do localStorage
        if (data.length === 1) {
          setSelectedCredential(data[0]);
          localStorage.setItem('selectedCredentialId', data[0].id);
          console.log('Selecionada única credencial disponível:', data[0].id);
        } else {
          // Se há múltiplas credenciais, tentar usar o ID armazenado ou selecionar a primeira
          const credentialToSelect = storedCredentialId 
            ? data.find((c: AwsCredential) => c.id === storedCredentialId) 
            : data[0];
            
          if (credentialToSelect) {
            setSelectedCredential(credentialToSelect);
            localStorage.setItem('selectedCredentialId', credentialToSelect.id);
            console.log('Selecionada credencial:', credentialToSelect.id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching AWS credentials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch AWS credentials');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectCredential = useCallback((id: string) => {
    const credential = credentials.find(c => c.id === id);
    if (credential) {
      setSelectedCredential(credential);
      localStorage.setItem('selectedCredentialId', id);
      console.log('Credencial selecionada manualmente:', id);
    }
  }, [credentials]);

  const addCredential = useCallback(async (credential: { 
    name: string; 
    accessKeyId: string; 
    secretAccessKey: string; 
    region: string 
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/aws/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: credential.name,
          accessKeyId: credential.accessKeyId,
          secretKey: credential.secretAccessKey,
          region: credential.region,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao adicionar credencial');
      }
      
      // Recarregar as credenciais para incluir a nova
      await loadCredentials();
      
      // Se esta for a primeira credencial, forçar a seleção
      const credentialsResponse = await fetch('/api/aws/credentials');
      if (credentialsResponse.ok) {
        const updatedCredentials = await credentialsResponse.json();
        if (updatedCredentials.length === 1) {
          setSelectedCredential(updatedCredentials[0]);
          localStorage.setItem('selectedCredentialId', updatedCredentials[0].id);
          console.log('Nova credencial adicionada e selecionada automaticamente:', updatedCredentials[0].id);
        }
      }
    } catch (err) {
      console.error('Erro ao adicionar credencial:', err);
      setError(err instanceof Error ? err.message : 'Erro ao adicionar credencial');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadCredentials]);

  const deleteCredential = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/aws/credentials/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir credencial');
      }
      
      // Recarregar as credenciais após exclusão
      await loadCredentials();
    } catch (err) {
      console.error('Erro ao excluir credencial:', err);
      setError(err instanceof Error ? err.message : 'Erro ao excluir credencial');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadCredentials]);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  return {
    credentials,
    selectedCredential,
    isLoading,
    loading: isLoading, // Alias para compatibilidade
    error,
    loadCredentials,
    selectCredential,
    addCredential,
    deleteCredential,
  };
}; 