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

// Dados mockados para exemplo - Em produção, isso seria substituído por chamadas de API
const mockRules: SIEMRule[] = [
  {
    id: "rule-001",
    name: "Acesso root não autorizado",
    description: "Detecta tentativas de uso do usuário root da AWS",
    type: "log-pattern",
    query: 'userIdentity.type = "Root" AND userIdentity.invokedBy NOT EXISTS',
    severity: "CRITICAL",
    status: "active",
    createdAt: new Date('2025-04-20'),
    triggers: 3,
    lastTriggered: new Date('2025-04-24'),
    credentialId: "cred-001"
  },
  {
    id: "rule-002",
    name: "Criação de security group com portas abertas",
    description: "Detecta a criação de security groups com portas publicamente expostas",
    type: "event-based",
    query: 'eventName = "CreateSecurityGroup" OR eventName = "AuthorizeSecurityGroupIngress" AND requestParameters.ipPermissions.ipRanges.cidrIp = "0.0.0.0/0"',
    severity: "HIGH",
    status: "active",
    createdAt: new Date('2025-04-18'),
    triggers: 5,
    lastTriggered: new Date('2025-04-23'),
    credentialId: "cred-001"
  },
  {
    id: "rule-003",
    name: "Uso excessivo de EC2",
    description: "Alerta quando o uso de instâncias EC2 ultrapassa um limite definido",
    type: "threshold",
    query: 'metric.ec2.instances > 10',
    severity: "MEDIUM",
    status: "active",
    createdAt: new Date('2025-04-15'),
    triggers: 1,
    lastTriggered: new Date('2025-04-21'),
    credentialId: "cred-001"
  },
  {
    id: "rule-004",
    name: "Detecção de anomalias em padrões de tráfego",
    description: "Detecta desvios no tráfego normal de rede",
    type: "anomaly-detection",
    query: 'metric.network.bytes_out deviation > 3 sigma',
    severity: "HIGH",
    status: "testing",
    createdAt: new Date('2025-04-10'),
    triggers: 0,
    lastTriggered: null,
    credentialId: "cred-001"
  }
];

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
    try {
      setLoading(true);
      setError(null);
      
      // Em produção, isso seria substituído por uma chamada de API real
      // const response = await fetch('/api/siem/rules?credentialId=' + selectedCredential?.id);
      // const data = await response.json();
      // setRules(data.rules || []);
      
      // Simulação de API com dados mockados
      setTimeout(() => {
        // Filtrar por credencial selecionada (em produção)
        const filteredRules = mockRules.filter(rule => 
          !filters.credentialId || rule.credentialId === filters.credentialId
        );
        setRules(filteredRules);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error('Erro ao buscar regras SIEM:', err);
      setError(err instanceof Error ? err.message : "Erro ao buscar regras SIEM");
      setLoading(false);
    }
  }, [filters.credentialId, selectedCredential?.id]);
  
  // Criar nova regra
  const createRule = useCallback(async (rule: SIEMRule): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Em produção, isso seria substituído por uma chamada de API real
      // const response = await fetch('/api/siem/rules', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(rule),
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.error || 'Erro ao criar regra');
      // }
      
      // Simulação de API com dados mockados
      setTimeout(() => {
        const newRule = {
          ...rule,
          id: `rule-${Date.now()}`,
          createdAt: new Date(),
          triggers: 0,
          lastTriggered: null,
          status: rule.status || 'testing'
        };
        
        setRules(prevRules => [...prevRules, newRule]);
        setLoading(false);
      }, 500);
      
      return true;
    } catch (err) {
      console.error('Erro ao criar regra:', err);
      setError(err instanceof Error ? err.message : "Erro ao criar regra");
      setLoading(false);
      return false;
    }
  }, []);
  
  // Atualizar regra existente
  const updateRule = useCallback(async (rule: SIEMRule): Promise<boolean> => {
    if (!rule.id) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      // Em produção, isso seria substituído por uma chamada de API real
      // const response = await fetch(`/api/siem/rules/${rule.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(rule),
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.error || 'Erro ao atualizar regra');
      // }
      
      // Simulação de API com dados mockados
      setTimeout(() => {
        setRules(prevRules => 
          prevRules.map(r => 
            r.id === rule.id ? { ...rule } : r
          )
        );
        setLoading(false);
      }, 500);
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar regra:', err);
      setError(err instanceof Error ? err.message : "Erro ao atualizar regra");
      setLoading(false);
      return false;
    }
  }, []);
  
  // Excluir regra
  const deleteRule = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Em produção, isso seria substituído por uma chamada de API real
      // const response = await fetch(`/api/siem/rules/${id}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.error || 'Erro ao excluir regra');
      // }
      
      // Simulação de API com dados mockados
      setTimeout(() => {
        setRules(prevRules => prevRules.filter(r => r.id !== id));
        setLoading(false);
      }, 500);
      
      return true;
    } catch (err) {
      console.error('Erro ao excluir regra:', err);
      setError(err instanceof Error ? err.message : "Erro ao excluir regra");
      setLoading(false);
      return false;
    }
  }, []);
  
  // Alternar status da regra (ativar/desativar)
  const toggleRuleStatus = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar a regra a ser atualizada
      const rule = rules.find(r => r.id === id);
      if (!rule) throw new Error('Regra não encontrada');
      
      const newStatus: RuleStatus = rule.status === 'active' ? 'inactive' : 'active';
      
      // Em produção, isso seria substituído por uma chamada de API real
      // const response = await fetch(`/api/siem/rules/${id}/status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.error || 'Erro ao atualizar status da regra');
      // }
      
      // Simulação de API com dados mockados
      setTimeout(() => {
        setRules(prevRules => 
          prevRules.map(r => 
            r.id === id ? { ...r, status: newStatus } : r
          )
        );
        setLoading(false);
      }, 500);
      
      return true;
    } catch (err) {
      console.error('Erro ao alternar status da regra:', err);
      setError(err instanceof Error ? err.message : "Erro ao alternar status da regra");
      setLoading(false);
      return false;
    }
  }, [rules]);
  
  // Carregar regras quando o componente é montado ou quando a credencial selecionada muda
  useEffect(() => {
    if (selectedCredential?.id) {
      setFilters(prev => ({ ...prev, credentialId: selectedCredential.id }));
      fetchRules();
    }
  }, [selectedCredential, fetchRules]);

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