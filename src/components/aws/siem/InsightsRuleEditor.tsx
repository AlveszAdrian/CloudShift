"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { InsightsRule } from "@/types/siem";
import { useAwsCredentials } from "@/hooks/useAwsCredentials";

interface InsightsRuleEditorProps {
  rule?: InsightsRule;
  onSubmit: (rule: InsightsRule) => void;
  onCancel: () => void;
  onImportPresets?: () => void;
}

export function InsightsRuleEditor({ rule, onSubmit, onCancel, onImportPresets }: InsightsRuleEditorProps) {
  const { selectedCredential } = useAwsCredentials();
  const [formData, setFormData] = useState<InsightsRule>({
    name: "",
    query: "",
    logGroup: "",
    severity: "medium",
    description: "",
    isActive: true,
    ...rule
  });
  
  const [logGroups, setLogGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewResults, setPreviewResults] = useState<any[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  // Carregar grupos de log
  useEffect(() => {
    async function fetchLogGroups() {
      if (!selectedCredential?.id) {
        setError('Credenciais AWS não configuradas');
        return;
      }

      try {
        const response = await fetch(`/api/aws/siem/insights/log-groups?credentialId=${selectedCredential.id}`);
        if (response.ok) {
          const data = await response.json();
          setLogGroups(data.groups);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar grupos de log');
        }
      } catch (err) {
        console.error('Erro ao carregar grupos de log:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar grupos de log');
      }
    }
    
    fetchLogGroups();
  }, [selectedCredential?.id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handlePreview = async () => {
    if (!formData.query || !formData.logGroup) {
      setError('Preencha a consulta e selecione um grupo de log');
      return;
    }
    
    try {
      setIsPreviewing(true);
      setError(null);
      
      const response = await fetch('/api/aws/siem/insights/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: formData.query,
          logGroup: formData.logGroup,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao executar preview');
      }
      
      const data = await response.json();
      setPreviewResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao executar preview');
    } finally {
      setIsPreviewing(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.query || !formData.logGroup) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar regra');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {rule?.id ? 'Editar Regra' : 'Nova Regra de Logs Insights'}
        </h2>
        <div className="flex gap-2">
          {onImportPresets && (
            <button
              onClick={onImportPresets}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Importar Regras Pré-configuradas
            </button>
          )}
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome da Regra *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="logGroup" className="block text-sm font-medium text-gray-700">
              Grupo de Log *
            </label>
            <select
              id="logGroup"
              name="logGroup"
              value={formData.logGroup}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Selecione um grupo de log</option>
              {logGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
              Severidade *
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Regra Ativa
            </label>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700">
            Consulta Logs Insights *
          </label>
          <div className="mt-1">
            <textarea
              id="query"
              name="query"
              value={formData.query}
              onChange={handleChange}
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
              placeholder="Exemplo: fields @timestamp, @message | filter @message like /error/i"
              required
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handlePreview}
                disabled={isPreviewing || !formData.query || !formData.logGroup}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isPreviewing ? 'Executando...' : 'Preview'}
              </button>
            </div>
          </div>
        </div>
        
        {previewResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview dos Resultados</h3>
            <div className="bg-gray-50 rounded-md p-4 max-h-60 overflow-y-auto">
              {previewResults.map((result, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="text-sm font-mono">
                    {Object.entries(result).map(([key, value]) => (
                      <div key={key} className="mb-1">
                        <span className="font-semibold">{key}:</span>{' '}
                        <span className="text-gray-600">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Regra'}
          </button>
        </div>
      </form>
    </div>
  );
} 