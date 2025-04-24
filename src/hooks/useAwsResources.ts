"use client";

import { useState, useEffect, useCallback } from 'react';

interface EC2Instance {
  id: string;
  type: string;
  state: string;
  publicIp: string;
  privateIp: string;
  launchTime: string;
}

interface S3Bucket {
  name: string;
  creationDate: string;
}

interface SecurityIssue {
  resourceId: string;
  resourceType: string;
  title: string;
  description: string;
  severity: string;
}

// Definição do cache para recursos AWS
interface ResourceCache<T> {
  data: T[];
  timestamp: number;
  credentialId: string | null;
}

// Tempo de validade do cache em milissegundos (5 minutos)
const CACHE_VALIDITY_TIME = 5 * 60 * 1000;

interface UseAwsResourcesResult {
  ec2Instances: EC2Instance[];
  s3Buckets: S3Bucket[];
  securityIssues: SecurityIssue[];
  loading: boolean;
  backgroundLoading: boolean;
  error: string | null;
  fetchEc2Instances: (credentialId: string, forceRefresh?: boolean) => Promise<void>;
  fetchS3Buckets: (credentialId: string, forceRefresh?: boolean) => Promise<void>;
  fetchSecurityIssues: (credentialId: string, forceRefresh?: boolean) => Promise<void>;
  clearCache: () => void;
}

export function useAwsResources(): UseAwsResourcesResult {
  // Estados para dados
  const [ec2Cache, setEc2Cache] = useState<ResourceCache<EC2Instance>>({
    data: [],
    timestamp: 0,
    credentialId: null
  });
  const [s3Cache, setS3Cache] = useState<ResourceCache<S3Bucket>>({
    data: [],
    timestamp: 0,
    credentialId: null
  });
  const [securityCache, setSecurityCache] = useState<ResourceCache<SecurityIssue>>({
    data: [],
    timestamp: 0,
    credentialId: null
  });
  
  // Estados para carregamento e erros
  const [loading, setLoading] = useState<boolean>(false);
  const [backgroundLoading, setBackgroundLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Verifica se o cache está válido
  const isCacheValid = (cache: ResourceCache<any>, credentialId: string): boolean => {
    const now = Date.now();
    return (
      cache.credentialId === credentialId &&
      cache.timestamp > 0 &&
      now - cache.timestamp < CACHE_VALIDITY_TIME
    );
  };

  // Função para buscar instâncias EC2
  const fetchEc2Instances = useCallback(async (credentialId: string, forceRefresh = false) => {
    // Se o cache for válido e não forçar atualização, retorna os dados em cache
    if (!forceRefresh && isCacheValid(ec2Cache, credentialId)) {
      console.log("Usando cache de instâncias EC2");
      
      // Atualiza em background se estiver próximo de expirar
      const cacheAge = Date.now() - ec2Cache.timestamp;
      if (cacheAge > CACHE_VALIDITY_TIME * 0.8) {
        console.log("Atualizando cache de instâncias EC2 em background");
        fetchEc2InstancesFromApi(credentialId, true);
      }
      
      return;
    }
    
    // Caso contrário, busca novos dados
    await fetchEc2InstancesFromApi(credentialId, false);
  }, [ec2Cache]);
  
  // Função interna para buscar instâncias EC2 da API
  const fetchEc2InstancesFromApi = async (credentialId: string, isBackground = false) => {
    try {
      if (isBackground) {
        setBackgroundLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await fetch(`/api/aws/resources?credentialId=${credentialId}&type=EC2`);
      
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Erro ao buscar instâncias EC2");
      }
      
      const data = await response.json();
      
      setEc2Cache({
        data: data.resources || [],
        timestamp: Date.now(),
        credentialId
      });
      
      console.log("Cache de instâncias EC2 atualizado");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar instâncias EC2");
    } finally {
      if (isBackground) {
        setBackgroundLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Função para buscar buckets S3
  const fetchS3Buckets = useCallback(async (credentialId: string, forceRefresh = false) => {
    // Se o cache for válido e não forçar atualização, retorna os dados em cache
    if (!forceRefresh && isCacheValid(s3Cache, credentialId)) {
      console.log("Usando cache de buckets S3");
      
      // Atualiza em background se estiver próximo de expirar
      const cacheAge = Date.now() - s3Cache.timestamp;
      if (cacheAge > CACHE_VALIDITY_TIME * 0.8) {
        console.log("Atualizando cache de buckets S3 em background");
        fetchS3BucketsFromApi(credentialId, true);
      }
      
      return;
    }
    
    // Caso contrário, busca novos dados
    await fetchS3BucketsFromApi(credentialId, false);
  }, [s3Cache]);
  
  // Função interna para buscar buckets S3 da API
  const fetchS3BucketsFromApi = async (credentialId: string, isBackground = false) => {
    try {
      if (isBackground) {
        setBackgroundLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await fetch(`/api/aws/resources?credentialId=${credentialId}&type=S3`);
      
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Erro ao buscar buckets S3");
      }
      
      const data = await response.json();
      
      setS3Cache({
        data: data.resources || [],
        timestamp: Date.now(),
        credentialId
      });
      
      console.log("Cache de buckets S3 atualizado");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar buckets S3");
    } finally {
      if (isBackground) {
        setBackgroundLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Função para buscar problemas de segurança
  const fetchSecurityIssues = useCallback(async (credentialId: string, forceRefresh = false) => {
    // Se o cache for válido e não forçar atualização, retorna os dados em cache
    if (!forceRefresh && isCacheValid(securityCache, credentialId)) {
      console.log("Usando cache de problemas de segurança");
      
      // Atualiza em background se estiver próximo de expirar
      const cacheAge = Date.now() - securityCache.timestamp;
      if (cacheAge > CACHE_VALIDITY_TIME * 0.8) {
        console.log("Atualizando cache de problemas de segurança em background");
        fetchSecurityIssuesFromApi(credentialId, true);
      }
      
      return;
    }
    
    // Caso contrário, busca novos dados
    await fetchSecurityIssuesFromApi(credentialId, false);
  }, [securityCache]);
  
  // Função interna para buscar problemas de segurança da API
  const fetchSecurityIssuesFromApi = async (credentialId: string, isBackground = false) => {
    try {
      if (isBackground) {
        setBackgroundLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await fetch(`/api/aws/security?credentialId=${credentialId}`);
      
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Erro ao buscar problemas de segurança");
      }
      
      const data = await response.json();
      
      setSecurityCache({
        data: data.issues || [],
        timestamp: Date.now(),
        credentialId
      });
      
      console.log("Cache de problemas de segurança atualizado");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar problemas de segurança");
    } finally {
      if (isBackground) {
        setBackgroundLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Função para limpar o cache (útil para logout ou troca de usuário)
  const clearCache = useCallback(() => {
    setEc2Cache({ data: [], timestamp: 0, credentialId: null });
    setS3Cache({ data: [], timestamp: 0, credentialId: null });
    setSecurityCache({ data: [], timestamp: 0, credentialId: null });
  }, []);

  // Tenta restaurar os dados do cache da sessionStorage ao montar o componente
  useEffect(() => {
    try {
      const ec2CacheString = localStorage.getItem('ec2Cache');
      const s3CacheString = localStorage.getItem('s3Cache');
      const securityCacheString = localStorage.getItem('securityCache');
      
      if (ec2CacheString) {
        const parsedCache = JSON.parse(ec2CacheString);
        setEc2Cache(parsedCache);
      }
      
      if (s3CacheString) {
        const parsedCache = JSON.parse(s3CacheString);
        setS3Cache(parsedCache);
      }
      
      if (securityCacheString) {
        const parsedCache = JSON.parse(securityCacheString);
        setSecurityCache(parsedCache);
      }
    } catch (error) {
      console.error("Erro ao recuperar cache:", error);
    }
  }, []);

  // Persiste os dados no sessionStorage quando mudam
  useEffect(() => {
    if (ec2Cache.timestamp > 0) {
      localStorage.setItem('ec2Cache', JSON.stringify(ec2Cache));
    }
  }, [ec2Cache]);

  useEffect(() => {
    if (s3Cache.timestamp > 0) {
      localStorage.setItem('s3Cache', JSON.stringify(s3Cache));
    }
  }, [s3Cache]);

  useEffect(() => {
    if (securityCache.timestamp > 0) {
      localStorage.setItem('securityCache', JSON.stringify(securityCache));
    }
  }, [securityCache]);

  return {
    ec2Instances: ec2Cache.data,
    s3Buckets: s3Cache.data,
    securityIssues: securityCache.data,
    loading,
    backgroundLoading,
    error,
    fetchEc2Instances,
    fetchS3Buckets,
    fetchSecurityIssues,
    clearCache
  };
} 