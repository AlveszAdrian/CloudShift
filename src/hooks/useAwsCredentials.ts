"use client";

import { useState, useEffect } from 'react';

export interface AwsCredential {
  id: string;
  name: string;
  accountId?: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  createdAt?: string;
}

export interface UseAwsCredentialsResult {
  credentials: AwsCredential[];
  selectedCredential: AwsCredential | null;
  selectCredential: (id: string) => void;
  addCredential: (credential: Omit<AwsCredential, 'id'>) => Promise<void>;
  updateCredential: (id: string, data: Partial<Omit<AwsCredential, 'id'>>) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
  loading: boolean;
  isLoading: boolean; // Alias for loading - needed for compatibility
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAwsCredentials(): UseAwsCredentialsResult {
  const [credentials, setCredentials] = useState<AwsCredential[]>([]);
  const [selectedCredentialId, setSelectedCredentialId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch credentials from the API
  const fetchCredentials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/aws/credentials');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Falha ao buscar credenciais: Código ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setCredentials(data);
      
      // If we have credentials but none selected, select the first one
      if (data.length > 0 && !selectedCredentialId) {
        setSelectedCredentialId(data[0].id);
        // Save to localStorage
        localStorage.setItem('selectedAwsCredentialId', data[0].id);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Erro ao buscar credenciais: ${errorMessage}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to select a credential
  const selectCredential = (id: string) => {
    setSelectedCredentialId(id);
    localStorage.setItem('selectedAwsCredentialId', id);
  };

  // Function to add a new credential
  const addCredential = async (credential: Omit<AwsCredential, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Criar um objeto com o formato esperado pela API
      const apiCredential = {
        name: credential.name,
        accessKeyId: credential.accessKeyId,
        secretKey: credential.secretAccessKey, // Renomear o campo para secretKey
        region: credential.region
      };
      
      const response = await fetch('/api/aws/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiCredential),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Falha ao adicionar credencial: Código ${response.status}`;
        throw new Error(errorMessage);
      }
      
      await fetchCredentials();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Erro ao adicionar credencial: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to update an existing credential
  const updateCredential = async (id: string, data: Partial<Omit<AwsCredential, 'id'>>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/aws/credentials/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Falha ao atualizar credencial: Código ${response.status}`;
        throw new Error(errorMessage);
      }
      
      await fetchCredentials();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Erro ao atualizar credencial: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a credential
  const deleteCredential = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/aws/credentials/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Falha ao excluir credencial: Código ${response.status}`;
        throw new Error(errorMessage);
      }
      
      // If we delete the selected credential, select another one
      if (id === selectedCredentialId) {
        const remainingCredentials = credentials.filter(c => c.id !== id);
        if (remainingCredentials.length > 0) {
          selectCredential(remainingCredentials[0].id);
        } else {
          setSelectedCredentialId(null);
          localStorage.removeItem('selectedAwsCredentialId');
        }
      }
      
      await fetchCredentials();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Erro ao excluir credencial: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load credentials on mount
  useEffect(() => {
    // Try to restore selected credential from localStorage
    const savedCredentialId = localStorage.getItem('selectedAwsCredentialId');
    if (savedCredentialId) {
      setSelectedCredentialId(savedCredentialId);
    }
    
    fetchCredentials();
  }, []);

  // Find the selected credential object
  const selectedCredential = credentials.find(c => c.id === selectedCredentialId) || null;

  return {
    credentials,
    selectedCredential,
    selectCredential,
    addCredential,
    updateCredential,
    deleteCredential,
    loading,
    isLoading: loading, // Alias for loading
    error,
    refresh: fetchCredentials,
  };
} 