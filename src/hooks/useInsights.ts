import { useState, useCallback } from 'react';
import { InsightsRule } from '@/types/siem';
import { InsightsQueryResult } from '@/types/siem';

interface UseInsightsResult {
  results: InsightsQueryResult[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  executeRule: (rule: InsightsRule) => Promise<InsightsQueryResult[]>;
  getLogGroups: () => Promise<string[]>;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  isMonitoring: boolean;
}

export function useInsights(): UseInsightsResult {
  const [results, setResults] = useState<InsightsQueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/aws/siem/insights');
      if (!response.ok) throw new Error('Falha ao buscar insights');
      const data = await response.json();
      
      console.log('Regras carregadas:', data);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar regras:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const executeRule = useCallback(async (rule: InsightsRule): Promise<InsightsQueryResult[]> => {
    console.log('Executando regra:', rule);
    setLoading(true);
    setError(null);
    setResults([]);
    
    let resultData: InsightsQueryResult[] = [];

    try {
      const response = await fetch('/api/aws/siem/insights/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: rule.query,
          logGroup: rule.logGroup,
          ruleId: rule.id || crypto.randomUUID(),
          name: rule.name,
          description: rule.description,
          severity: rule.severity,
          region: rule.region,
          credentialId: rule.credentialId
        }),
      });

      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro ao executar regra:', errorText);
        throw new Error(`Erro ao executar regra: ${errorText}`);
      }

      const data = await response.json();
      console.log('Resultados recebidos:', data);
      
      if (data.results && Array.isArray(data.results)) {
        console.log(`Definindo ${data.results.length} resultados no estado`);
        console.log('Estrutura do primeiro resultado:', data.results.length > 0 ? Object.keys(data.results[0]) : []);
        resultData = data.results;
        setResults(data.results);
        if (data.results.length === 0) {
          console.log('Nenhum resultado encontrado para a regra');
        } else {
          console.log(`${data.results.length} resultados encontrados`);
        }
      } else {
        console.warn('Formato de resposta inválido:', data);
        // Garantir que sempre definimos um array, mesmo vazio
        setResults([]);
      }
    } catch (error) {
      console.error('Erro ao executar regra:', error);
      setError(`Erro ao executar regra: ${error instanceof Error ? error.message : String(error)}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
    
    return resultData;
  }, []);

  const getLogGroups = useCallback(async () => {
    try {
      const response = await fetch('/api/aws/siem/log-groups');
      if (!response.ok) throw new Error('Falha ao buscar grupos de log');
      const data = await response.json();
      return Array.isArray(data.logGroups) ? data.logGroups : [];
    } catch (err) {
      console.error('Erro ao buscar grupos de log:', err);
      return [];
    }
  }, []);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    // Implementar lógica de monitoramento contínuo aqui
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    // Implementar lógica para parar monitoramento aqui
  }, []);

  return {
    results,
    loading,
    error,
    refresh,
    executeRule,
    getLogGroups,
    startMonitoring,
    stopMonitoring,
    isMonitoring
  };
} 