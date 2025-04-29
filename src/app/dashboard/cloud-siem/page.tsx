"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Plus, 
  Filter, 
  Search,
  RefreshCw,
  AlertTriangle,
  CloudOff,
  ExternalLink,
  Clock,
  Download,
  Edit2,
  Trash2,
  Play
} from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import { useInsights } from "@/hooks/useInsights";
import { InsightsRuleEditor } from "@/components/aws/siem/InsightsRuleEditor";
import { InsightsRule } from "@/types/siem";
import { AutoConfigButton } from "@/components/siem/AutoConfigButton";
import { Toaster, toast } from "sonner";
import { PRESET_RULES } from "@/lib/aws/siem/preset-rules";
import { useRules } from "@/hooks/useRules";
import { RuleDetailsPopup } from "@/components/aws/siem/RuleDetailsPopup";

interface LogResult {
  timestamp: string;
  message: string;
  fields: Record<string, any>;
}

export default function CloudSIEMPage() {
  const { selectedCredential } = useAwsCredentials();
  const { 
    results, 
    loading: insightsLoading, 
    error: insightsError, 
    refresh, 
    executeRule,
    getLogGroups,
    startMonitoring,
    stopMonitoring,
    isMonitoring
  } = useInsights();
  
  const { 
    rules, 
    loading: rulesLoading, 
    error: rulesError, 
    addRule, 
    updateRule, 
    deleteRule 
  } = useRules();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<InsightsRule | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [cloudWatchConnected, setCloudWatchConnected] = useState<boolean | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [logGroups, setLogGroups] = useState<string[]>([]);
  const [testingRule, setTestingRule] = useState<InsightsRule | null>(null);
  const [testResults, setTestResults] = useState<LogResult[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [selectedRule, setSelectedRule] = useState<InsightsRule | null>(null);
  
  // Carregar grupos de log
  useEffect(() => {
    async function loadLogGroups() {
      try {
        const groups = await getLogGroups();
        setLogGroups(groups);
      } catch (err) {
        console.error('Erro ao carregar grupos de log:', err);
      }
    }
    
    loadLogGroups();
  }, [getLogGroups]);
  
  // Verificar conexão com CloudWatch quando a credencial mudar
  useEffect(() => {
    async function checkCloudWatchConnection() {
      if (!selectedCredential?.id) {
        setCloudWatchConnected(false);
        return;
      }
      
      try {
        setCheckingConnection(true);
        const response = await fetch(`/api/aws/siem/check-connection?credentialId=${selectedCredential.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setCloudWatchConnected(data.connected);
        } else {
          setCloudWatchConnected(false);
        }
      } catch (err) {
        console.error("Erro ao verificar conexão com CloudWatch:", err);
        setCloudWatchConnected(false);
      } finally {
        setCheckingConnection(false);
      }
    }
    
    checkCloudWatchConnection();
  }, [selectedCredential, getLogGroups]);
  
  // Iniciar monitoramento quando o componente montar
  useEffect(() => {
    if (selectedCredential?.id) {
      startMonitoring();
    }
    return () => stopMonitoring();
  }, [selectedCredential?.id, startMonitoring, stopMonitoring]);
  
  const handleSubmitRule = async (rule: InsightsRule) => {
    try {
      if (rule.id) {
        updateRule(rule.id, rule);
        toast.success('Regra atualizada com sucesso!');
      } else {
        addRule(rule);
        toast.success('Regra criada com sucesso!');
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error('Erro ao salvar regra:', err);
      toast.error('Erro ao salvar regra');
    }
  };
  
  const handleDeleteRule = async (id: string) => {
    try {
      deleteRule(id);
      toast.success('Regra excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir regra:', err);
      toast.error('Erro ao excluir regra');
    }
  };
  
  const handleImportPresets = async () => {
    try {
      // Importa cada regra pré-configurada
      for (const rule of PRESET_RULES) {
        const newRule = await addRule({
          name: rule.name,
          query: rule.query,
          logGroup: rule.logGroup,
          severity: rule.severity,
          description: rule.description,
          isActive: rule.isActive
        });
        
        toast.success(`Regra "${rule.name}" importada com sucesso!`);
      }
      
      // Atualiza a lista de regras
      refresh();
    } catch (err) {
      console.error('Erro ao importar regras:', err);
      toast.error('Erro ao importar regras pré-configuradas');
    }
  };
  
  const handleTestRule = async (rule: InsightsRule) => {
    try {
      setTestingRule(rule);
      setTestLoading(true);
      setTestError(null);
      setTestResults([]);
      
      // Execute a regra e aguarde os resultados
      await executeRule(rule);
      
      // Obter os resultados mais recentes do hook useInsights
      const latestResults = results.slice(0, 10); // Pegar os 10 resultados mais recentes
      setTestResults(latestResults);
    } catch (err) {
      console.error('Erro ao testar regra:', err);
      setTestError(err instanceof Error ? err.message : 'Erro ao testar regra');
    } finally {
      setTestLoading(false);
    }
  };
  
  const filteredRules = rules.filter(rule => 
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Cloud SIEM', href: '/dashboard/cloud-siem' }
        ]}
      />
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cloud SIEM</h1>
          <div className="flex gap-2">
            <AutoConfigButton />
            <button
              onClick={handleImportPresets}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Importar Regras Pré-configuradas
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra
            </button>
          </div>
        </div>
        
        {/* Status da conexão */}
        {checkingConnection && (
          <div className="mb-4 p-4 bg-blue-50 rounded-md">
            <div className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin text-blue-500" />
              <span className="text-blue-700">Verificando conexão com CloudWatch...</span>
            </div>
          </div>
        )}

        {cloudWatchConnected === false && !checkingConnection && (
          <div className="mb-4 p-4 bg-yellow-50 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              <span className="text-yellow-700">
                Não foi possível conectar ao CloudWatch. As regras serão salvas, mas não poderão ser executadas até que a conexão seja estabelecida.
              </span>
            </div>
          </div>
        )}
        
        {/* Barra de pesquisa e filtros */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar eventos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={refresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={insightsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${insightsLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
        
        {/* Lista de regras */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Regras Configuradas</h2>
          
          {rulesLoading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Carregando regras...</p>
            </div>
          )}
          
          {rulesError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700">{rulesError}</p>
              </div>
            </div>
          )}
          
          {!rulesLoading && filteredRules.length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <Bell className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma regra configurada</h3>
              <p className="mt-1 text-gray-500">
                Crie uma nova regra ou importe regras pré-configuradas para começar
              </p>
            </div>
          )}
          
          {!rulesLoading && filteredRules.length > 0 && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredRules.map((rule) => (
                <div 
                  key={rule.id} 
                  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedRule(rule)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{rule.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestRule(rule);
                        }}
                        className="text-gray-400 hover:text-blue-600"
                        title="Testar regra"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rule.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      rule.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      rule.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                    </span>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Bell className="h-3 w-3 mr-1" />
                      <span>{rule.triggers || 0} acionamentos</span>
                    </div>
                    {rule.lastTriggered && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{new Date(rule.lastTriggered).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Lista de eventos */}
        <div className="space-y-4">
          {insightsLoading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Buscando eventos...</p>
            </div>
          )}
          
          {insightsError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700">{insightsError}</p>
              </div>
            </div>
          )}
          
          {!insightsLoading && results.length === 0 && (
            <div className="text-center py-8">
              <CloudOff className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum evento encontrado</h3>
              <p className="mt-1 text-gray-500">
                Configure regras para começar a monitorar eventos
              </p>
            </div>
          )}
          
          {results.map((result, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {result.eventName || result.fields?.eventName || 'Evento Desconhecido'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {result.message || result.fields?.message || 'Sem mensagem'}
                </p>
              </div>
              <div className="mt-2">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  {Object.entries(result.fields || {}).map(([key, value]) => (
                    <div key={key} className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">{key}</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal de criação/edição de regra */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <InsightsRuleEditor
              rule={editingRule}
              onSubmit={handleSubmitRule}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingRule(undefined);
              }}
              onImportPresets={handleImportPresets}
            />
          </div>
        </div>
      )}
      
      {selectedRule && (
        <RuleDetailsPopup
          rule={selectedRule}
          onClose={() => setSelectedRule(null)}
        />
      )}
      
      <Toaster />
    </div>
  );
} 