"use client";

import { useState, useEffect } from "react";
import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import { motion } from "framer-motion";
import CredentialSelector from "@/components/aws/CredentialSelector";

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  totalControls: number;
  passedControls: number;
  failedControls: number;
  warningControls: number;
  lastScan: string;
}

interface ComplianceControl {
  id: string;
  frameworkId: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'warning';
  severity: 'critical' | 'high' | 'medium' | 'low';
  resourcesAffected: number;
  remediationSteps: string;
}

export default function CompliancePage() {
  const { selectedCredential } = useAwsCredentials();
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [controls, setControls] = useState<ComplianceControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'summary' | 'details'>('summary');

  useEffect(() => {
    if (selectedCredential) {
      loadComplianceData();
    } else {
      setLoading(false);
    }
  }, [selectedCredential]);

  const loadComplianceData = async () => {
    if (!selectedCredential) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simular carregamento de dados de frameworks de compliance
      // Em uma implementação real, isso viria da API
      setTimeout(() => {
        const demoFrameworks: ComplianceFramework[] = [
          {
            id: "gdpr",
            name: "GDPR",
            description: "General Data Protection Regulation - Regulamentação europeia de proteção de dados",
            totalControls: 35,
            passedControls: 28,
            failedControls: 4,
            warningControls: 3,
            lastScan: "2023-10-12T15:32:44Z"
          },
          {
            id: "pci-dss",
            name: "PCI DSS",
            description: "Payment Card Industry Data Security Standard - Padrão de segurança para dados de cartão de pagamento",
            totalControls: 42,
            passedControls: 38,
            failedControls: 2,
            warningControls: 2,
            lastScan: "2023-10-10T09:15:22Z"
          },
          {
            id: "hipaa",
            name: "HIPAA",
            description: "Health Insurance Portability and Accountability Act - Regulamento para informações de saúde protegidas",
            totalControls: 28,
            passedControls: 24,
            failedControls: 1,
            warningControls: 3,
            lastScan: "2023-10-08T14:27:55Z"
          },
          {
            id: "nist",
            name: "NIST 800-53",
            description: "National Institute of Standards and Technology - Controles de segurança para sistemas federais",
            totalControls: 54,
            passedControls: 45,
            failedControls: 5,
            warningControls: 4,
            lastScan: "2023-10-05T11:42:18Z"
          },
          {
            id: "iso27001",
            name: "ISO 27001",
            description: "International Standard for Information Security Management",
            totalControls: 47,
            passedControls: 42,
            failedControls: 3,
            warningControls: 2,
            lastScan: "2023-10-11T16:38:29Z"
          }
        ];
        
        const demoControls: ComplianceControl[] = [
          // GDPR Controls
          {
            id: "gdpr-1",
            frameworkId: "gdpr",
            name: "Criptografia de Dados Pessoais",
            description: "Dados pessoais devem ser criptografados em repouso e em trânsito",
            status: "passed",
            severity: "high",
            resourcesAffected: 0,
            remediationSteps: "N/A - Controle aprovado"
          },
          {
            id: "gdpr-2",
            frameworkId: "gdpr",
            name: "Logs de Acesso a Dados Sensíveis",
            description: "Deve haver logs de todos os acessos a dados pessoais sensíveis",
            status: "warning",
            severity: "medium",
            resourcesAffected: 2,
            remediationSteps: "Habilitar logs detalhados para os buckets S3 que contêm dados pessoais"
          },
          {
            id: "gdpr-3",
            frameworkId: "gdpr",
            name: "Exposição Pública de Dados Pessoais",
            description: "Dados pessoais não devem estar expostos publicamente",
            status: "failed",
            severity: "critical",
            resourcesAffected: 1,
            remediationSteps: "Remover acesso público do bucket S3 'customer-data-backup'"
          },
          
          // PCI DSS Controls
          {
            id: "pci-1",
            frameworkId: "pci-dss",
            name: "Segmentação de Rede para Dados de Cartão",
            description: "Ambiente de dados de cartão deve estar isolado logicamente",
            status: "passed",
            severity: "high",
            resourcesAffected: 0,
            remediationSteps: "N/A - Controle aprovado"
          },
          {
            id: "pci-2",
            frameworkId: "pci-dss",
            name: "Criptografia TLS 1.2+ para Transmissão",
            description: "Comunicações contendo dados de cartão devem usar TLS 1.2 ou superior",
            status: "failed",
            severity: "critical",
            resourcesAffected: 1,
            remediationSteps: "Atualizar configuração do ELB para só aceitar TLS 1.2 ou superior"
          },
          
          // HIPAA Controls
          {
            id: "hipaa-1",
            frameworkId: "hipaa",
            name: "Backups de Informações de Saúde",
            description: "Backups regulares de PHI devem ser realizados e testados",
            status: "passed",
            severity: "high",
            resourcesAffected: 0,
            remediationSteps: "N/A - Controle aprovado"
          },
          {
            id: "hipaa-2",
            frameworkId: "hipaa",
            name: "Logs de Acesso a Registros Médicos",
            description: "Todos os acessos a registros médicos devem ser logados e auditáveis",
            status: "warning",
            severity: "high",
            resourcesAffected: 3,
            remediationSteps: "Configurar CloudTrail para capturar todos os eventos de API em serviços relacionados a saúde"
          },
          
          // NIST Controls
          {
            id: "nist-1",
            frameworkId: "nist",
            name: "Controle de Acesso por Privilégio Mínimo",
            description: "Usuários devem ter apenas permissões mínimas necessárias",
            status: "failed",
            severity: "high",
            resourcesAffected: 5,
            remediationSteps: "Revisar e restringir permissões IAM dos usuários listados no relatório"
          },
          {
            id: "nist-2",
            frameworkId: "nist",
            name: "Proteção de Fronteira",
            description: "Implementação de controles de fronteira entre diferentes zonas de segurança",
            status: "passed",
            severity: "medium",
            resourcesAffected: 0,
            remediationSteps: "N/A - Controle aprovado"
          },
          
          // ISO 27001 Controls
          {
            id: "iso-1",
            frameworkId: "iso27001",
            name: "Gestão de Incidentes",
            description: "Processo formal para gestão e resposta a incidentes de segurança",
            status: "warning",
            severity: "medium",
            resourcesAffected: 1,
            remediationSteps: "Configurar alertas SNS para notificações automáticas de eventos de segurança"
          },
          {
            id: "iso-2",
            frameworkId: "iso27001",
            name: "Classificação de Informações",
            description: "Informações devem ser classificadas de acordo com sua sensibilidade",
            status: "passed",
            severity: "low",
            resourcesAffected: 0,
            remediationSteps: "N/A - Controle aprovado"
          }
        ];
        
        setFrameworks(demoFrameworks);
        setControls(demoControls);
        
        // Selecionar o primeiro framework por padrão se não houver nenhum selecionado
        if (!selectedFramework && demoFrameworks.length > 0) {
          setSelectedFramework(demoFrameworks[0].id);
        }
        
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError("Erro ao carregar dados de compliance: " + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  const getFrameworkById = (id: string) => {
    return frameworks.find(f => f.id === id);
  };

  const getControlsByFramework = (frameworkId: string) => {
    return controls.filter(c => c.frameworkId === frameworkId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderComplianceScore = (framework: ComplianceFramework) => {
    const percentPassed = Math.round((framework.passedControls / framework.totalControls) * 100);
    let colorClass = "";
    
    if (percentPassed >= 90) colorClass = "text-green-600";
    else if (percentPassed >= 70) colorClass = "text-yellow-600";
    else colorClass = "text-red-600";
    
    return (
      <div className="flex items-center">
        <span className={`text-2xl font-bold ${colorClass}`}>{percentPassed}%</span>
        <div className="ml-3 w-full max-w-xs bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${percentPassed >= 90 ? 'bg-green-500' : percentPassed >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${percentPassed}%` }}>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Compliance e Conformidade</h1>
        <p className="mt-2 text-gray-600">
          Monitore a conformidade da sua infraestrutura AWS com diversas normas e regulamentações.
        </p>
      </motion.div>

      <CredentialSelector />

      {!selectedCredential ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-500 mb-4">Selecione uma credencial AWS para visualizar os dados de compliance.</p>
        </motion.div>
      ) : loading ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-500">Carregando dados de compliance...</p>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 bg-red-50 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Frameworks Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {frameworks.map((framework) => (
              <div 
                key={framework.id}
                className={`bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow duration-200 ${selectedFramework === framework.id ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => {
                  setSelectedFramework(framework.id);
                  setViewMode('summary');
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{framework.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{framework.description}</p>
                
                {renderComplianceScore(framework)}
                
                <div className="mt-4 flex justify-between text-sm">
                  <div>
                    <span className="font-medium text-green-600">{framework.passedControls}</span>
                    <span className="text-gray-500"> aprovados</span>
                  </div>
                  <div>
                    <span className="font-medium text-red-600">{framework.failedControls}</span>
                    <span className="text-gray-500"> falhas</span>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-600">{framework.warningControls}</span>
                    <span className="text-gray-500"> avisos</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Framework Details */}
          {selectedFramework && (
            <motion.div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {getFrameworkById(selectedFramework)?.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {getFrameworkById(selectedFramework)?.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1 text-sm rounded-md ${viewMode === 'summary' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setViewMode('summary')}
                    >
                      Resumo
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded-md ${viewMode === 'details' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setViewMode('details')}
                    >
                      Detalhes
                    </button>
                  </div>
                </div>
                
                {viewMode === 'summary' && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="rounded-full bg-green-200 p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-green-800">Controles Aprovados</p>
                          <p className="text-2xl font-bold text-green-800">
                            {getFrameworkById(selectedFramework)?.passedControls}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="rounded-full bg-red-200 p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-red-800">Controles com Falha</p>
                          <p className="text-2xl font-bold text-red-800">
                            {getFrameworkById(selectedFramework)?.failedControls}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="rounded-full bg-yellow-200 p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-yellow-800">Controles com Aviso</p>
                          <p className="text-2xl font-bold text-yellow-800">
                            {getFrameworkById(selectedFramework)?.warningControls}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Controls List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Controle
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Severidade
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recursos Afetados
                      </th>
                      {viewMode === 'details' && (
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Remediação
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getControlsByFramework(selectedFramework).map((control) => (
                      <tr key={control.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{control.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{control.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(control.status)}`}>
                            {control.status === 'passed' ? 'Aprovado' : 
                             control.status === 'failed' ? 'Falha' : 'Aviso'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(control.severity)}`}>
                            {control.severity === 'critical' ? 'Crítico' : 
                             control.severity === 'high' ? 'Alto' : 
                             control.severity === 'medium' ? 'Médio' : 'Baixo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {control.resourcesAffected}
                        </td>
                        {viewMode === 'details' && (
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <p className="max-w-md">{control.remediationSteps}</p>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Última verificação:</span> {getFrameworkById(selectedFramework) ? new Date(getFrameworkById(selectedFramework)!.lastScan).toLocaleString() : '-'}
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
} 