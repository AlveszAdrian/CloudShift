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
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import RuleCard from "@/components/aws/siem/RuleCard";
import RuleEditor from "@/components/aws/siem/RuleEditor";
import { SIEMRule, RuleType, RuleSeverity, RuleStatus } from "@/components/aws/siem/RuleEditor";
import { useSIEMRules } from "@/hooks/useSIEMRules";

export default function CloudSIEMPage() {
  const { selectedCredential } = useAwsCredentials();
  const { 
    rules, 
    loading, 
    error, 
    filters, 
    setFilters, 
    createRule, 
    updateRule, 
    deleteRule, 
    toggleRuleStatus,
    refreshRules
  } = useSIEMRules();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SIEMRule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cloudWatchConnected, setCloudWatchConnected] = useState<boolean | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(false);
  
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
  }, [selectedCredential]);
  
  // Filtrar regras com base na pesquisa
  const filteredRules = rules.filter(rule => {
    return (
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.query.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Ordenar regras por data de criação (mais recentes primeiro)
  const sortedRules = [...filteredRules].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  
  // Gerenciar filtros
  const handleStatusFilterChange = (status: RuleStatus | 'all') => {
    setFilters({ ...filters, status });
  };
  
  const handleTypeFilterChange = (type: RuleType | 'all') => {
    setFilters({ ...filters, type });
  };
  
  const handleSeverityFilterChange = (severity: RuleSeverity | 'all') => {
    setFilters({ ...filters, severity });
  };
  
  // Gerenciar regras
  const handleEditRule = (rule: SIEMRule) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };
  
  const handleNewRule = () => {
    setEditingRule(null);
    setIsFormOpen(true);
  };
  
  const handleSaveRule = async (rule: SIEMRule) => {
    if (rule.id) {
      await updateRule(rule);
    } else {
      await createRule(rule);
    }
    setIsFormOpen(false);
  };
  
  const handleDeleteRule = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta regra?')) {
      await deleteRule(id);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb 
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Cloud SIEM", href: "/dashboard/cloud-siem" }
        ]} 
      />
      
      <div className="mb-6 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Cloud SIEM
            </h1>
            <p className="mt-1 text-gray-500">
              Crie e gerencie regras personalizadas de detecção e alertas
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button
              onClick={refreshRules}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            
            <button
              onClick={handleNewRule}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading || cloudWatchConnected === false}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra
            </button>
          </div>
        </div>
      </div>
      
      {/* Aviso de CloudWatch desconectado */}
      {cloudWatchConnected === false && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-start gap-2"
        >
          <CloudOff className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Alerta: CloudWatch não está conectado</p>
            <p className="text-sm">Para utilizar o Cloud SIEM é necessário ter o CloudWatch ativo e configurado corretamente na sua conta AWS. As regras de SIEM dependem dos logs do CloudWatch para funcionarem.</p>
            <div className="mt-2">
              <a 
                href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-amber-800 hover:text-amber-900 font-medium"
              >
                <span>Saiba como configurar o CloudWatch Logs</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Erro */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start gap-2"
        >
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro</p>
            <p className="text-sm">{error}</p>
          </div>
        </motion.div>
      )}
      
      {/* Filtros */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar regras..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleStatusFilterChange(e.target.value as RuleStatus | 'all')}
              className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="testing">Em teste</option>
            </select>
            
            <select
              value={filters.type || 'all'}
              onChange={(e) => handleTypeFilterChange(e.target.value as RuleType | 'all')}
              className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="all">Todos os tipos</option>
              <option value="log-pattern">Padrão de Log</option>
              <option value="threshold">Limite</option>
              <option value="event-based">Evento</option>
              <option value="anomaly-detection">Anomalia</option>
            </select>
            
            <select
              value={filters.severity || 'all'}
              onChange={(e) => handleSeverityFilterChange(e.target.value as RuleSeverity | 'all')}
              className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="all">Todas as severidades</option>
              <option value="CRITICAL">Crítico</option>
              <option value="HIGH">Alto</option>
              <option value="MEDIUM">Médio</option>
              <option value="LOW">Baixo</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Lista de regras */}
      <div>
        {loading && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-blue-500">Carregando regras...</span>
          </div>
        )}
        
        {!loading && cloudWatchConnected === false && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <CloudOff className="mx-auto h-12 w-12 text-amber-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">CloudWatch não está conectado</h3>
            <p className="mt-1 text-gray-500">
              O Cloud SIEM requer conexão com o CloudWatch para buscar logs e aplicar regras. Verifique suas credenciais AWS e as configurações do CloudWatch.
            </p>
            <div className="mt-6">
              <a
                href="https://console.aws.amazon.com/cloudwatch/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Verificar CloudWatch Console
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        )}
        
        {!loading && cloudWatchConnected !== false && sortedRules.length > 0 && (
          <div className="space-y-4">
            {sortedRules.map(rule => (
              <RuleCard
                key={rule.id}
                rule={rule}
                onEdit={handleEditRule}
                onDelete={handleDeleteRule}
                onToggleStatus={toggleRuleStatus}
              />
            ))}
          </div>
        )}
        
        {!loading && cloudWatchConnected !== false && sortedRules.length === 0 && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma regra encontrada</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery || filters.status !== 'all' || filters.type !== 'all' || filters.severity !== 'all'
                ? "Tente ajustar os filtros para encontrar regras"
                : "Crie sua primeira regra de detecção personalizada"}
            </p>
            {searchQuery || filters.status !== 'all' || filters.type !== 'all' || filters.severity !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    status: 'all',
                    type: 'all',
                    severity: 'all',
                    search: '',
                    credentialId: selectedCredential?.id
                  });
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar filtros
              </button>
            ) : (
              <button
                onClick={handleNewRule}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar regra
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Modal para criação/edição de regras */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => !loading && setIsFormOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingRule ? "Editar Regra" : "Nova Regra de Detecção"}
              </h2>
              <button
                onClick={() => !loading && setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                &times;
              </button>
            </div>
            
            <RuleEditor
              rule={editingRule || undefined}
              onSave={handleSaveRule}
              onCancel={() => setIsFormOpen(false)}
              credentialId={selectedCredential?.id}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 