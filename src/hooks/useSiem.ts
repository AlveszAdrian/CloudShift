import { useState, useEffect, useCallback } from 'react';
import { useAwsCredentials } from './useAwsCredentials';

export interface SiemEvent {
  id: string;
  timestamp: string;
  source: string;
  eventType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  status: 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED';
  message: string;
  rawData: any;
  accountId?: string;
  region?: string;
  resource?: string;
}

export interface SiemRule {
  id: string;
  name: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  enabled: boolean;
  source: string;
  pattern: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiemFilter {
  timeRange: string;
  sources: string[];
  severities: string[];
  status: string[];
  searchTerm: string;
}

interface UseSiemReturn {
  events: SiemEvent[];
  totalEvents: number;
  rules: SiemRule[];
  isLoading: boolean;
  error: string | null;
  filters: SiemFilter;
  setFilters: (filters: Partial<SiemFilter>) => void;
  refreshEvents: () => Promise<void>;
  acknowledgeEvent: (eventId: string) => Promise<void>;
  resolveEvent: (eventId: string) => Promise<void>;
  createRule: (rule: Omit<SiemRule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRule: (rule: SiemRule) => Promise<void>;
  deleteRule: (ruleId: string) => Promise<void>;
  enableRule: (ruleId: string, enabled: boolean) => Promise<void>;
}

export const useSiem = (): UseSiemReturn => {
  const { selectedCredential } = useAwsCredentials();
  const [events, setEvents] = useState<SiemEvent[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [rules, setRules] = useState<SiemRule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SiemFilter>({
    timeRange: '24h',
    sources: [],
    severities: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'],
    status: ['NEW', 'ACKNOWLEDGED'],
    searchTerm: '',
  });

  const updateFilters = (newFilters: Partial<SiemFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const fetchEvents = useCallback(async () => {
    if (!selectedCredential?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      queryParams.append('credentialId', selectedCredential.id);
      queryParams.append('timeRange', filters.timeRange);
      
      if (filters.sources.length > 0) {
        queryParams.append('sources', filters.sources.join(','));
      }
      
      if (filters.severities.length > 0) {
        queryParams.append('severities', filters.severities.join(','));
      }
      
      if (filters.status.length > 0) {
        queryParams.append('status', filters.status.join(','));
      }
      
      if (filters.searchTerm) {
        queryParams.append('searchTerm', filters.searchTerm);
      }

      const response = await fetch(`/api/aws/siem/events?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch SIEM events: ${response.statusText}`);
      }

      const data = await response.json();
      setEvents(data.events);
      setTotalEvents(data.total);
    } catch (err) {
      console.error('Error fetching SIEM events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch SIEM events');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCredential?.id, filters]);

  const fetchRules = useCallback(async () => {
    if (!selectedCredential?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/aws/siem/rules?credentialId=${selectedCredential.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch SIEM rules: ${response.statusText}`);
      }

      const data = await response.json();
      setRules(data);
    } catch (err) {
      console.error('Error fetching SIEM rules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch SIEM rules');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCredential?.id]);

  useEffect(() => {
    fetchEvents();
    fetchRules();
  }, [fetchEvents, fetchRules]);

  const acknowledgeEvent = async (eventId: string) => {
    if (!selectedCredential?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/aws/siem/events/acknowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id,
          eventId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to acknowledge event: ${response.statusText}`);
      }

      // Update local state
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? { ...event, status: 'ACKNOWLEDGED' } : event
        )
      );
    } catch (err) {
      console.error('Error acknowledging event:', err);
      setError(err instanceof Error ? err.message : 'Failed to acknowledge event');
    } finally {
      setIsLoading(false);
    }
  };

  const resolveEvent = async (eventId: string) => {
    if (!selectedCredential?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/aws/siem/events/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id,
          eventId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to resolve event: ${response.statusText}`);
      }

      // Update local state
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? { ...event, status: 'RESOLVED' } : event
        )
      );
    } catch (err) {
      console.error('Error resolving event:', err);
      setError(err instanceof Error ? err.message : 'Failed to resolve event');
    } finally {
      setIsLoading(false);
    }
  };

  const createRule = async (rule: Omit<SiemRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedCredential?.id) return;

    try {
      setIsLoading(true);
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
        throw new Error(`Failed to create rule: ${response.statusText}`);
      }

      const newRule = await response.json();
      setRules(prevRules => [...prevRules, newRule]);
    } catch (err) {
      console.error('Error creating rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to create rule');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRule = async (rule: SiemRule) => {
    if (!selectedCredential?.id) return;

    try {
      setIsLoading(true);
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
        throw new Error(`Failed to update rule: ${response.statusText}`);
      }

      const updatedRule = await response.json();
      setRules(prevRules =>
        prevRules.map(r => (r.id === rule.id ? updatedRule : r))
      );
    } catch (err) {
      console.error('Error updating rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to update rule');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRule = async (ruleId: string) => {
    if (!selectedCredential?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/aws/siem/rules/${ruleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete rule: ${response.statusText}`);
      }

      setRules(prevRules => prevRules.filter(r => r.id !== ruleId));
    } catch (err) {
      console.error('Error deleting rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete rule');
    } finally {
      setIsLoading(false);
    }
  };

  const enableRule = async (ruleId: string, enabled: boolean) => {
    if (!selectedCredential?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/aws/siem/rules/${ruleId}/toggle`, {
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
        throw new Error(`Failed to ${enabled ? 'enable' : 'disable'} rule: ${response.statusText}`);
      }

      setRules(prevRules =>
        prevRules.map(r => (r.id === ruleId ? { ...r, enabled } : r))
      );
    } catch (err) {
      console.error(`Error ${enabled ? 'enabling' : 'disabling'} rule:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${enabled ? 'enable' : 'disable'} rule`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    events,
    totalEvents,
    rules,
    isLoading,
    error,
    filters,
    setFilters: updateFilters,
    refreshEvents: fetchEvents,
    acknowledgeEvent,
    resolveEvent,
    createRule,
    updateRule,
    deleteRule,
    enableRule,
  };
}; 