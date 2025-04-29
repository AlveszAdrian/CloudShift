import { useState, useEffect } from 'react';
import { InsightsRule } from '@/types/siem';

const STORAGE_KEY = 'siem-insights-rules';

export function useRules() {
  const [rules, setRules] = useState<InsightsRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar regras do localStorage
  useEffect(() => {
    try {
      const storedRules = localStorage.getItem(STORAGE_KEY);
      if (storedRules) {
        setRules(JSON.parse(storedRules));
      }
    } catch (err) {
      console.error('Erro ao carregar regras:', err);
      setError('Erro ao carregar regras do armazenamento local');
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar regras no localStorage quando mudarem
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
      } catch (err) {
        console.error('Erro ao salvar regras:', err);
        setError('Erro ao salvar regras no armazenamento local');
      }
    }
  }, [rules, loading]);

  const addRule = (rule: Omit<InsightsRule, 'id'>) => {
    const newRule: InsightsRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRules(prev => [...prev, newRule]);
    return newRule;
  };

  const updateRule = (id: string, updates: Partial<InsightsRule>) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === id 
          ? { ...rule, ...updates, updatedAt: new Date().toISOString() }
          : rule
      )
    );
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  };

  const getRule = (id: string) => {
    return rules.find(rule => rule.id === id);
  };

  return {
    rules,
    loading,
    error,
    addRule,
    updateRule,
    deleteRule,
    getRule
  };
} 