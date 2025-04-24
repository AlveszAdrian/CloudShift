"use client";

import { useState, useCallback, useEffect } from "react";
import { useAwsCredentials } from "./useAwsCredentials";

interface Alert {
  id: string;
  title: string;
  description: string;
  resourceId: string;
  resourceType: string;
  severity: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  credentialId?: string;
  credential?: {
    name: string;
  };
}

interface AlertFilters {
  status?: string;
  severity?: string;
  resourceType?: string;
  credentialId?: string;
}

interface UseAlertsResult {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  filters: AlertFilters;
  setFilters: (filters: AlertFilters) => void;
  fetchAlerts: () => Promise<void>;
  dismissAlert: (id: string) => Promise<boolean>;
  resolveAlert: (id: string) => Promise<boolean>;
}

export function useAlerts(): UseAlertsResult {
  const { selectedCredential } = useAwsCredentials();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AlertFilters>({});

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = "/api/alerts";
      const params = new URLSearchParams();
      
      if (filters.status) {
        params.append("status", filters.status);
      }
      if (filters.severity) {
        params.append("severity", filters.severity);
      }
      if (filters.resourceType) {
        params.append("resourceType", filters.resourceType);
      }
      // Use the selected credential or a specific credentialId from filters
      const credentialId = filters.credentialId || selectedCredential?.id;
      if (credentialId) {
        params.append("credentialId", credentialId);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('Buscando alertas em:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Erro ao buscar alertas");
      }
      
      const data = await response.json();
      console.log('Alertas recebidos:', data.alerts?.length || 0);
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error('Erro ao buscar alertas:', err);
      setError(err instanceof Error ? err.message : "Erro ao buscar alertas");
    } finally {
      setLoading(false);
    }
  }, [filters, selectedCredential]);

  const updateAlertStatus = useCallback(async (id: string, action: "dismiss" | "resolve") => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/alerts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          action,
        }),
      });
      
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || `Erro ao ${action === "dismiss" ? "arquivar" : "resolver"} alerta`);
      }
      
      // Atualizar lista de alertas
      await fetchAlerts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Erro ao ${action === "dismiss" ? "arquivar" : "resolver"} alerta`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAlerts]);

  const dismissAlert = useCallback((id: string) => {
    return updateAlertStatus(id, "dismiss");
  }, [updateAlertStatus]);

  const resolveAlert = useCallback((id: string) => {
    return updateAlertStatus(id, "resolve");
  }, [updateAlertStatus]);

  // Buscar alertas ao montar o componente ou quando os filtros ou a credencial selecionada mudarem
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts, selectedCredential]);

  return {
    alerts,
    loading,
    error,
    filters,
    setFilters,
    fetchAlerts,
    dismissAlert,
    resolveAlert,
  };
} 