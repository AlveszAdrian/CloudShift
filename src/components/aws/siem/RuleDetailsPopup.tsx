import { X, AlertTriangle, Clock, Bell, Search, Info, ExternalLink, Play, RefreshCw } from "lucide-react";
import { InsightsRule } from "@/types/siem";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInsights } from "@/hooks/useInsights";
import { Detection } from '@/lib/aws/siem/detections';

interface RuleDetailsPopupProps {
  rule: InsightsRule;
  onClose: () => void;
}

export function RuleDetailsPopup({ rule, onClose }: RuleDetailsPopupProps) {
  const { executeRule, results: hookResults } = useInsights();
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  // Monitorar mudanças nos resultados
  useEffect(() => {
    console.log('Resultados do hook atualizados no RuleDetailsPopup:', {
      resultsLength: Array.isArray(hookResults) ? hookResults.length : 'não é array',
      resultsType: typeof hookResults,
      firstResult: Array.isArray(hookResults) && hookResults.length > 0 ? Object.keys(hookResults[0]) : []
    });
  }, [hookResults]);

  const loadDetections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando detecções para a regra:', rule.id);
      
      const response = await fetch('/api/aws/siem/detections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId: rule.id })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta da API:', errorData);
        throw new Error(errorData.error || 'Falha ao carregar detecções');
      }
      
      const data = await response.json();
      console.log('Detecções recebidas da API:', data);
      
      if (Array.isArray(data)) {
        // Ordenar por timestamp (mais recentes primeiro) antes de exibir
        const sortedDetections = [...data].sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return dateB - dateA; // Ordem decrescente (mais recentes primeiro)
        });
        
        // Verificar e remover possíveis duplicações baseadas em campos críticos
        const uniqueDetections = sortedDetections.reduce((acc: Detection[], current) => {
          // Verificar se já existe uma detecção similar no array acumulado
          const isDuplicate = acc.some(item => 
            item.message === current.message && 
            new Date(item.timestamp).getTime() === new Date(current.timestamp).getTime()
          );
          
          if (!isDuplicate) {
            acc.push(current);
          } else {
            console.log('Detecção duplicada removida da exibição:', current.id);
          }
          
          return acc;
        }, []);
        
        setDetections(uniqueDetections);
        console.log(`${uniqueDetections.length} detecções carregadas com sucesso (de ${data.length} originais)`);
      } else {
        console.log('Nenhuma detecção encontrada (ou formato inválido)');
        setDetections([]);
      }
    } catch (err) {
      console.error('Erro ao carregar detecções:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar detecções');
      setDetections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadDetections();
      } catch (err) {
        setDetections([]);
      }
    };
    load();
  }, [rule.id]);

  const handleTestRule = async () => {
    try {
      setTestLoading(true);
      setTestError(null);
      
      console.log('Executando teste da regra:', rule);
      
      // Verificar se a regra tem ID
      if (!rule.id) {
        console.warn('Regra sem ID, gerando ID temporário');
        // eslint-disable-next-line no-param-reassign
        rule.id = crypto.randomUUID();
        console.log('ID temporário gerado:', rule.id);
      }
      
      // Limpar resultados anteriores antes de executar novo teste
      setTestResults([]);
      
      const executionResults = await executeRule(rule);
      console.log('Teste executado com sucesso, resultados:', 
        Array.isArray(executionResults) ? `${executionResults.length} resultados` : 'Formato inválido');
      
      // Guardar resultados localmente
      setTestResults(executionResults);
      
      // Se houver resultados, aguardar um pouco antes de recarregar detecções
      // para dar tempo ao banco de dados processar
      if (executionResults.length > 0) {
        console.log('Aguardando processamento de detecções...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Recarregar detecções após testar a regra
      await loadDetections();
    } catch (err) {
      console.error('Erro ao testar regra:', err);
      setTestError(err instanceof Error ? err.message : 'Erro ao testar regra');
    } finally {
      setTestLoading(false);
    }
  };

  const handleAcknowledge = async (detectionId: string) => {
    try {
      const response = await fetch('/api/aws/siem/detections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: detectionId })
      });
      
      if (!response.ok) throw new Error('Falha ao reconhecer detecção');
      
      // Recarregar detecções após reconhecer
      await loadDetections();
    } catch (err) {
      console.error('Erro ao reconhecer detecção:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{rule.name}</h2>
              <div className="flex gap-2 mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  rule.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  rule.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  rule.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {rule.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição</h3>
                <p className="text-gray-900">{rule.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Grupo de Log</h3>
                <p className="text-gray-900 font-mono">{rule.logGroup}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Consulta CloudWatch</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <code className="text-sm font-mono whitespace-pre-wrap">{rule.query}</code>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Detalhes da Regra</h3>
                <div className="space-y-2">
                  {rule.createdAt && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      Criado em: {new Date(rule.createdAt).toLocaleString()}
                    </div>
                  )}
                  {rule.updatedAt && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      Atualizado em: {new Date(rule.updatedAt).toLocaleString()}
                    </div>
                  )}
                  {rule.lastTriggered && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Bell className="h-4 w-4 mr-2 text-gray-400" />
                      Último disparo: {new Date(rule.lastTriggered).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Estatísticas</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Bell className="h-4 w-4 mr-2 text-gray-400" />
                    Total de disparos: {rule.triggers || 0}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Bell className="h-4 w-4 mr-2 text-gray-400" />
                    Detecções encontradas: {detections.length}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Search className="h-4 w-4 mr-2 text-gray-400" />
                    Última execução: {rule.lastExecuted ? new Date(rule.lastExecuted).toLocaleString() : 'Nunca'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Resultados */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Resultados do Teste</h3>
              <div className="flex gap-2">
                <button
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => window.open(`https://console.aws.amazon.com/cloudwatch/home?region=${rule.region}#logsV2:log-groups/log-group/${encodeURIComponent(rule.logGroup)}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver no Console AWS
                </button>
                <button
                  className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={handleTestRule}
                  disabled={testLoading}
                >
                  {testLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {testLoading ? 'Executando...' : 'Executar Teste'}
                </button>
              </div>
            </div>

            {testError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-red-700">{testError}</p>
                </div>
              </div>
            )}

            {testLoading ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <RefreshCw className="h-8 w-8 text-gray-400 mx-auto animate-spin" />
                <p className="mt-2 text-sm text-gray-500">Executando consulta...</p>
              </div>
            ) : Array.isArray(testResults) && testResults.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4">
                {(() => {
                  console.log('Renderizando tabela com resultados do teste:', {
                    count: testResults.length,
                    headers: Object.keys(testResults[0] || {}).filter(h => h !== 'raw'),
                    sample: testResults[0]
                  });
                  return null;
                })()}
                <p className="text-sm text-gray-500 mb-2">Encontrados {testResults.length} resultados:</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        {Object.keys(testResults[0] || {})
                          .filter(header => header !== 'raw') // Filtrar o campo 'raw'
                          .map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testResults.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.entries(result)
                            .filter(([key]) => key !== 'raw') // Filtrar o campo 'raw'
                            .map(([key, value], i) => (
                            <td
                              key={i}
                              className="px-4 py-2 text-sm text-gray-500"
                            >
                              {typeof value === 'object' 
                                ? JSON.stringify(value) 
                                : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Info className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">Nenhum resultado encontrado</p>
                {testError ? (
                  <p className="mt-2 text-sm text-red-500">Erro: {testError}</p>
                ) : null}
              </div>
            )}
          </div>

          {/* Seção de Detecções */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Detecções</h3>
              <button
                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                onClick={loadDetections}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <RefreshCw className="h-8 w-8 text-gray-400 mx-auto animate-spin" />
                <p className="mt-2 text-sm text-gray-500">Carregando detecções...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            ) : detections.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mensagem
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campos
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {detections.map((detection) => (
                        <tr key={detection.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {new Date(detection.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {detection.message}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {detection.fields && typeof detection.fields === 'object' ? (
                              <div className="max-h-20 overflow-y-auto">
                                {Object.entries(detection.fields).map(([key, value]) => (
                                  <div key={key} className="text-xs">
                                    <span className="font-semibold">{key}:</span> {String(value)}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              "Nenhum campo adicional"
                            )}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              detection.acknowledged ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {detection.acknowledged ? 'Reconhecido' : 'Pendente'}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {!detection.acknowledged && (
                              <button
                                onClick={() => handleAcknowledge(detection.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Reconhecer
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Info className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">Nenhuma detecção encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 