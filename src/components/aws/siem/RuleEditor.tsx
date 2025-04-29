import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";

export type RuleType = "log-pattern" | "threshold" | "event-based" | "anomaly-detection";
export type RuleSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type RuleStatus = "active" | "inactive" | "testing";

export interface SIEMRule {
  id?: string;
  name: string;
  description: string;
  type: RuleType;
  query: string;
  severity: RuleSeverity;
  status?: RuleStatus;
  createdAt?: Date;
  triggers?: number;
  lastTriggered?: Date | null;
  credentialId?: string;
}

interface RuleEditorProps {
  rule?: SIEMRule;
  onSave: (rule: SIEMRule) => void;
  onCancel: () => void;
  credentialId?: string;
}

const defaultRule: SIEMRule = {
  name: "",
  description: "",
  type: "log-pattern",
  query: "",
  severity: "MEDIUM",
  status: "testing"
};

export default function RuleEditor({ rule, onSave, onCancel, credentialId }: RuleEditorProps) {
  const [formData, setFormData] = useState<SIEMRule>(rule || defaultRule);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (rule) {
      setFormData(rule);
    } else {
      setFormData({
        ...defaultRule,
        credentialId: credentialId || ""
      });
    }
  }, [rule, credentialId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro ao editar campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Function to handle raw query input without escaping special characters
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    setFormData(prev => ({ ...prev, query: rawValue }));
    
    // Clear error when editing query
    if (errors.query) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.query;
        return newErrors;
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }
    
    if (!formData.query.trim()) {
      newErrors.query = "Consulta é obrigatória";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Enviar dados sem modificar a query
    onSave(formData);
  };
  
  const getQueryPlaceholder = () => {
    switch (formData.type) {
      case "log-pattern":
        return 'filter userIdentity.type = "Root" | fields eventTime, eventName, awsRegion';
      case "threshold":
        return 'metric.ec2.instances > 10';
      case "event-based":
        return 'filter eventName = "CreateUser" or eventName = "DeleteUser" | fields eventTime, userIdentity.arn';
      case "anomaly-detection":
        return 'filter @message like "error" | stats count(*) as errorCount by bin(1h)';
    }
  };
  
  const getQueryHelp = () => {
    switch (formData.type) {
      case "log-pattern":
        return "Use a sintaxe CloudWatch Logs Insights (filter, fields, sort, etc). Caracteres como | e \" são suportados.";
      case "threshold":
        return "Defina limites para métricas como uso de CPU, memória, requisições, etc.";
      case "event-based":
        return "Use a sintaxe do CloudWatch Logs Insights para filtrar eventos específicos.";
      case "anomaly-detection":
        return "Use funções estatísticas como stats, avg, max para detectar anomalias.";
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome da Regra
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          placeholder="Digite um nome descritivo para a regra"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
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
          rows={2}
          className={`mt-1 block w-full border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          placeholder="Descreva o propósito e funcionamento desta regra"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo de Regra
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="log-pattern">Padrão de Log</option>
            <option value="threshold">Limite</option>
            <option value="event-based">Evento</option>
            <option value="anomaly-detection">Detecção de Anomalia</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
            Severidade
          </label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="CRITICAL">Crítico</option>
            <option value="HIGH">Alto</option>
            <option value="MEDIUM">Médio</option>
            <option value="LOW">Baixo</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="query" className="block text-sm font-medium text-gray-700">
          Consulta CloudWatch Logs Insights
        </label>
        <textarea
          id="query"
          name="query"
          value={formData.query}
          onChange={handleQueryChange}
          rows={4}
          spellCheck="false"
          className={`mt-1 block w-full border ${errors.query ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono`}
          placeholder={getQueryPlaceholder()}
        />
        {errors.query ? (
          <p className="mt-1 text-sm text-red-600">{errors.query}</p>
        ) : (
          <div className="mt-1 text-xs text-gray-500">
            <p>{getQueryHelp()}</p>
            <p className="mt-1">Exemplo: <code className="bg-gray-100 px-1 py-0.5 rounded">{getQueryPlaceholder()}</code></p>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Save className="h-4 w-4 mr-2" />
          {rule?.id ? "Atualizar" : "Criar"}
        </button>
      </div>
    </form>
  );
} 