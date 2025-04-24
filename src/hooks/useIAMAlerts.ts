"use client";

import { useState, useCallback, useEffect } from "react";
import { useAwsCredentials } from "./useAwsCredentials";

interface IAMAlert {
  id: string;
  title: string;
  description: string;
  resourceId: string;
  resourceType: string;
  severity: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AlertFilters {
  status?: string;
  severity?: string;
}

interface UseIAMAlertsResult {
  alerts: IAMAlert[];
  loading: boolean;
  error: string | null;
  filters: AlertFilters;
  setFilters: (filters: AlertFilters) => void;
  fetchAlerts: () => Promise<void>;
  dismissAlert: (id: string) => Promise<boolean>;
  resolveAlert: (id: string) => Promise<boolean>;
  scanForIssues: () => Promise<void>;
  scanning: boolean;
  scanMessage: string | null;
}

export function useIAMAlerts(): UseIAMAlertsResult {
  const { selectedCredential } = useAwsCredentials();
  const [alerts, setAlerts] = useState<IAMAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AlertFilters>({});
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    if (!selectedCredential) {
      setAlerts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/alerts/iam?credentialId=${selectedCredential.id}`;
      const params = new URLSearchParams();
      
      if (filters.status) {
        params.append("status", filters.status);
      }
      if (filters.severity) {
        params.append("severity", filters.severity);
      }
      
      if (params.toString()) {
        url += `&${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Erro ao buscar alertas do IAM");
      }
      
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar alertas do IAM");
    } finally {
      setLoading(false);
    }
  }, [selectedCredential, filters]);

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

  const scanForIssues = useCallback(async () => {
    if (!selectedCredential) {
      setScanMessage("Selecione uma credencial AWS para realizar a verificação");
      return;
    }

    try {
      setScanning(true);
      setScanMessage(null);
      
      const response = await fetch('/api/alerts/iam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao verificar problemas de compliance do IAM');
      }
      
      const result = await response.json();
      setScanMessage(result.message);
      
      // Recarregar alertas
      await fetchAlerts();
    } catch (error) {
      setScanMessage(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setScanning(false);
    }
  }, [selectedCredential, fetchAlerts]);

  // Buscar alertas ao montar o componente, quando os filtros mudarem, ou quando mudar a credencial selecionada
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
    scanForIssues,
    scanning,
    scanMessage
  };
} 