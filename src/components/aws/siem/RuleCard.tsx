import { Bell, AlertTriangle, Clock, Search, Info, Play, Pause, Edit2, Trash2 } from "lucide-react";
import { SIEMRule, RuleType, RuleSeverity, RuleStatus } from "./RuleEditor";

interface RuleCardProps {
  rule: SIEMRule;
  onEdit: (rule: SIEMRule) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function RuleCard({ rule, onEdit, onDelete, onToggleStatus }: RuleCardProps) {
  const getSeverityBadgeClass = (severity: RuleSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-blue-100 text-blue-800";
    }
  };
  
  const getTypeLabel = (type: RuleType) => {
    switch (type) {
      case "log-pattern":
        return "Padrão de Log";
      case "threshold":
        return "Limite";
      case "event-based":
        return "Evento";
      case "anomaly-detection":
        return "Anomalia";
    }
  };
  
  const getTypeIcon = (type: RuleType) => {
    switch (type) {
      case "log-pattern":
        return <Search className="h-4 w-4" />;
      case "threshold":
        return <AlertTriangle className="h-4 w-4" />;
      case "event-based":
        return <Bell className="h-4 w-4" />;
      case "anomaly-detection":
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getStatusClass = (status: RuleStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "testing":
        return "bg-purple-100 text-purple-800";
    }
  };
  
  const getStatusLabel = (status: RuleStatus) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "testing":
        return "Em teste";
    }
  };
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-medium text-gray-900">{rule.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityBadgeClass(rule.severity)}`}>
              {rule.severity}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 flex items-center">
              {getTypeIcon(rule.type)}
              <span className="ml-1">{getTypeLabel(rule.type)}</span>
            </span>
            {rule.status && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(rule.status)}`}>
                {getStatusLabel(rule.status)}
              </span>
            )}
          </div>
          
          <p className="mt-2 text-sm text-gray-500">{rule.description}</p>
          
          <div className="mt-2 text-xs text-gray-500">
            <code className="bg-gray-100 p-1 rounded">
              {rule.query}
            </code>
          </div>
          
          <div className="mt-2 flex text-xs text-gray-500 gap-4 flex-wrap">
            {rule.createdAt && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Criado em {rule.createdAt.toLocaleDateString()}
              </span>
            )}
            {rule.triggers !== undefined && (
              <span className="flex items-center">
                <Bell className="h-3 w-3 mr-1" />
                {rule.triggers} {rule.triggers === 1 ? 'disparo' : 'disparos'}
              </span>
            )}
            {rule.lastTriggered && (
              <span className="flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Último: {rule.lastTriggered.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          {rule.id && rule.status && (
            <button
              onClick={() => onToggleStatus(rule.id as string)}
              className="p-1 rounded-full hover:bg-gray-200"
              title={rule.status === 'active' ? 'Desativar' : 'Ativar'}
            >
              {rule.status === 'active' ? (
                <Pause className="h-5 w-5 text-gray-500" />
              ) : (
                <Play className="h-5 w-5 text-gray-500" />
              )}
            </button>
          )}
          <button
            onClick={() => onEdit(rule)}
            className="p-1 rounded-full hover:bg-gray-200"
            title="Editar"
          >
            <Edit2 className="h-5 w-5 text-gray-500" />
          </button>
          {rule.id && (
            <button
              onClick={() => onDelete(rule.id as string)}
              className="p-1 rounded-full hover:bg-gray-200"
              title="Excluir"
            >
              <Trash2 className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 