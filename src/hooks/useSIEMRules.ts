import { useState, useCallback, useEffect } from 'react';
import { useAwsCredentials } from './useAwsCredentials';
import { SIEMRule, RuleType, RuleSeverity, RuleStatus } from '@/components/aws/siem/RuleEditor';

interface UseSIEMRulesFilters {
  status?: RuleStatus | 'all';
  type?: RuleType | 'all';
  severity?: RuleSeverity | 'all';
  search?: string;
  credentialId?: string;
}

interface UseSIEMRulesResult {
  rules: SIEMRule[];
  loading: boolean;
  error: string | null;
  filters: UseSIEMRulesFilters;
  setFilters: (filters: UseSIEMRulesFilters) => void;
  createRule: (rule: SIEMRule) => Promise<boolean>;
  updateRule: (rule: SIEMRule) => Promise<boolean>;
  deleteRule: (id: string) => Promise<boolean>;
  toggleRuleStatus: (id: string) => Promise<boolean>;
  refreshRules: () => Promise<void>;
}

export function useSIEMRules(): UseSIEMRulesResult {
  const { selectedCredential } = useAwsCredentials();
  const [rules, setRules] = useState<SIEMRule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UseSIEMRulesFilters>({
    status: 'all',
    type: 'all',
    severity: 'all',
    search: '',
    credentialId: selectedCredential?.id
  });

  // Carregar regras
  const fetchRules = useCallback(async () => {
    if (!selectedCredential?.id) {
      setRules([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Chamada para a API real
      const response = await fetch(`/api/aws/siem/rules?credentialId=${selectedCredential.id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar regras SIEM');
      }
      
      const data = await response.json();
      
      // Filtrar regras com base nos filtros selecionados
      let filteredRules = data;
      
      if (filters.status !== 'all') {
        filteredRules = filteredRules.filter((rule: SIEMRule) => rule.status === filters.status);
      }
      
      if (filters.type !== 'all') {
        filteredRules = filteredRules.filter((rule: SIEMRule) => rule.type === filters.type);
      }
      
      if (filters.severity !== 'all') {
        filteredRules = filteredRules.filter((rule: SIEMRule) => rule.severity === filters.severity);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredRules = filteredRules.filter((rule: SIEMRule) =>
          rule.name.toLowerCase().includes(searchLower) ||
          rule.description.toLowerCase().includes(searchLower) ||
          rule.query.toLowerCase().includes(searchLower)
        );
      }
      
      setRules(filteredRules);
    } catch (err) {
      console.error('Erro ao buscar regras SIEM:', err);
      setError(err instanceof Error ? err.message : "Erro ao buscar regras SIEM");
    } finally {
      setLoading(false);
    }
  }, [selectedCredential?.id, filters]);
  
  // Criar nova regra
  const createRule = useCallback(async (rule: SIEMRule): Promise<boolean> => {
    if (!selectedCredential?.id) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/aws/siem/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id,
          rule,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar regra');
      }
      
      const newRule = await response.json();
      
      // Atualizar lista de regras localmente
      setRules(prevRules => [...prevRules, newRule]);
      
      return true;
    } catch (err) {
      console.error('Erro ao criar regra:', err);
      setError(err instanceof Error ? err.message : "Erro ao criar regra");
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedCredential?.id]);
  
  // Atualizar regra existente
  const updateRule = useCallback(async (rule: SIEMRule): Promise<boolean> => {
    if (!selectedCredential?.id || !rule.id) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/aws/siem/rules/${rule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id,
          rule,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar regra');
      }
      
      const updatedRule = await response.json();
      
      // Atualizar a regra na lista localmente
      setRules(prevRules => 
        prevRules.map(r => 
          r.id === rule.id ? updatedRule : r
        )
      );
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar regra:', err);
      setError(err instanceof Error ? err.message : "Erro ao atualizar regra");
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedCredential?.id]);
  
  // Excluir regra
  const deleteRule = useCallback(async (id: string): Promise<boolean> => {
    if (!selectedCredential?.id) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/aws/siem/rules/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir regra');
      }
      
      // Remover a regra da lista localmente
      setRules(prevRules => prevRules.filter(r => r.id !== id));
      
      return true;
    } catch (err) {
      console.error('Erro ao excluir regra:', err);
      setError(err instanceof Error ? err.message : "Erro ao excluir regra");
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedCredential?.id]);
  
  // Alternar status da regra (ativar/desativar)
  const toggleRuleStatus = useCallback(async (id: string): Promise<boolean> => {
    if (!selectedCredential?.id) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      // Buscar a regra a ser atualizada
      const rule = rules.find(r => r.id === id);
      if (!rule) throw new Error('Regra não encontrada');
      
      const enabled = rule.status !== 'active';
      
      const response = await fetch(`/api/aws/siem/rules/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id,
          enabled,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao ${enabled ? 'ativar' : 'desativar'} regra`);
      }
      
      const updatedRule = await response.json();
      
      // Atualizar a regra na lista localmente
      setRules(prevRules => 
        prevRules.map(r => 
          r.id === id ? updatedRule : r
        )
      );
      
      return true;
    } catch (err) {
      console.error(`Erro ao alternar status da regra:`, err);
      setError(err instanceof Error ? err.message : "Erro ao alternar status da regra");
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedCredential?.id, rules]);

  // Carregar regras inicialmente e quando as dependências mudarem
  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    rules,
    loading,
    error,
    filters,
    setFilters,
    createRule,
    updateRule,
    deleteRule,
    toggleRuleStatus,
    refreshRules: fetchRules
  };
} 