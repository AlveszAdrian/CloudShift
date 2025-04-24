"use client";

import { useState, useEffect } from "react";
import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import { motion } from "framer-motion";
import CredentialSelector from "@/components/aws/CredentialSelector";
import { Check, AlertTriangle, AlertCircle, Info, Shield, ClipboardCheck, RefreshCw, FileText } from "lucide-react";

interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  complianceScore: number;
  totalControls: number;
  passedControls: number;
  failedControls: number;
  notApplicableControls: number;
}

interface ComplianceControl {
  id: string;
  standardId: string;
  title: string;
  description: string;
  status: "passed" | "failed" | "not_applicable";
  severity: "critical" | "high" | "medium" | "low";
  remediation?: string;
  resources?: string[];
}

export default function CompliancePage() {
  const { selectedCredential } = useAwsCredentials();
  const [standards, setStandards] = useState<ComplianceStandard[]>([]);
  const [controls, setControls] = useState<ComplianceControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [lastCredentialId, setLastCredentialId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!selectedCredential) {
      setLoading(false);
      return;
    }

    try {
      // Verificar se já temos dados no localStorage
      const complianceCache = localStorage.getItem('complianceData');
      const cachedCredentialId = localStorage.getItem('complianceLastCredentialId');
      const cachedTimestamp = localStorage.getItem('complianceLastUpdateTime');

      if (complianceCache && cachedCredentialId === selectedCredential.id) {
        // Usar dados do cache
        const parsedData = JSON.parse(complianceCache);
        setStandards(parsedData.standards);
        setControls(parsedData.controls);
        setLoading(false);
        
        if (cachedTimestamp) {
          setLastUpdated(new Date(parseInt(cachedTimestamp)));
        }
        
        // Verificar se é hora de atualizar em background
        if (cachedTimestamp) {
          const timeSinceLastUpdate = Date.now() - parseInt(cachedTimestamp);
          const fiveMinutesInMs = 5 * 60 * 1000;
          
          if (timeSinceLastUpdate > fiveMinutesInMs) {
            // Atualiza em background se passou mais de 5 minutos
            fetchComplianceInBackground();
          }
        }
      } else {
        // Se não tem cache ou a credencial mudou, buscar novos dados
        fetchCompliance();
      }
      
      setLastCredentialId(selectedCredential.id);
    } catch (error) {
      console.error("Erro ao restaurar cache:", error);
      fetchCompliance();
    }
  }, [selectedCredential]);

  // Função para atualizar dados em background
  const fetchComplianceInBackground = async () => {
    if (!selectedCredential) return;
    
    try {
      setBackgroundLoading(true);
      
      // Simular busca de dados reais (substituir com chamada de API real)
      // Em uma implementação real, buscaria dados de compliance da AWS Config ou Security Hub
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = generateMockComplianceData();
      setStandards(mockData.standards);
      setControls(mockData.controls);
      
      const currentTime = new Date();
      setLastUpdated(currentTime);
      
      // Salvar no cache
      localStorage.setItem('complianceData', JSON.stringify(mockData));
      localStorage.setItem('complianceLastCredentialId', selectedCredential.id);
      localStorage.setItem('complianceLastUpdateTime', currentTime.getTime().toString());
      
      console.log("Atualização em background de dados de compliance concluída");
    } catch (err) {
      console.error("Erro na atualização em background:", err);
    } finally {
      setBackgroundLoading(false);
    }
  };

  const fetchCompliance = async () => {
    if (!selectedCredential) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simular um scan progressivo para UX melhor
      setScanning(true);
      setScanProgress(0);
      
      const scanTimer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 95) {
            clearInterval(scanTimer);
            return 95;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 300);
      
      // Simular busca de dados reais (substituir com chamada de API real)
      // Em uma implementação real, buscaria dados de compliance da AWS Config ou Security Hub
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockData = generateMockComplianceData();
      
      // Atrasar um pouco para simular o processamento
      setTimeout(() => {
        setStandards(mockData.standards);
        setControls(mockData.controls);
        setScanning(false);
        setScanProgress(100);
        setLoading(false);
        
        const currentTime = new Date();
        setLastUpdated(currentTime);
        
        // Salvar no cache
        localStorage.setItem('complianceData', JSON.stringify(mockData));
        localStorage.setItem('complianceLastCredentialId', selectedCredential.id);
        localStorage.setItem('complianceLastUpdateTime', currentTime.getTime().toString());
      }, 1000);
      
      clearInterval(scanTimer);
    } catch (err) {
      console.error("Erro ao buscar dados de compliance:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar dados de compliance");
      setScanning(false);
      setLoading(false);
    }
  };

  const runNewScan = () => {
    fetchCompliance();
  };

  // Função para gerar dados simulados de compliance
  const generateMockComplianceData = () => {
    const standards: ComplianceStandard[] = [
      {
        id: "pci-dss",
        name: "PCI DSS",
        description: "Payment Card Industry Data Security Standard",
        complianceScore: 78,
        totalControls: 28,
        passedControls: 22,
        failedControls: 6,
        notApplicableControls: 0
      },
      {
        id: "hipaa",
        name: "HIPAA",
        description: "Health Insurance Portability and Accountability Act",
        complianceScore: 85,
        totalControls: 42,
        passedControls: 36,
        failedControls: 6,
        notApplicableControls: 0
      },
      {
        id: "gdpr",
        name: "GDPR",
        description: "General Data Protection Regulation",
        complianceScore: 91,
        totalControls: 35,
        passedControls: 32,
        failedControls: 3,
        notApplicableControls: 0
      },
      {
        id: "nist",
        name: "NIST 800-53",
        description: "National Institute of Standards and Technology",
        complianceScore: 72,
        totalControls: 52,
        passedControls: 37,
        failedControls: 15,
        notApplicableControls: 0
      }
    ];

    const controls: ComplianceControl[] = [
      // PCI DSS Controls
      {
        id: "pci-1.1",
        standardId: "pci-dss",
        title: "Firewall Configuration",
        description: "Estabelecer regras de firewall para proteger dados de titulares de cartões",
        status: "passed",
        severity: "high"
      },
      {
        id: "pci-1.2",
        standardId: "pci-dss",
        title: "Default Passwords",
        description: "Alterar senhas padrão de fornecedor e outros parâmetros de segurança",
        status: "passed",
        severity: "critical"
      },
      {
        id: "pci-2.1",
        standardId: "pci-dss",
        title: "Stored Cardholder Data Protection",
        description: "Proteger dados de titulares de cartões armazenados",
        status: "failed",
        severity: "critical",
        remediation: "Implantar criptografia para dados de cartões armazenados em buckets S3",
        resources: ["s3://customer-data"]
      },
      {
        id: "pci-3.1",
        standardId: "pci-dss",
        title: "Encrypted Transmission",
        description: "Criptografar a transmissão de dados de titulares de cartões",
        status: "passed",
        severity: "high"
      },
      {
        id: "pci-4.1",
        standardId: "pci-dss",
        title: "Antivirus Protection",
        description: "Usar software antivírus em sistemas comumente afetados por malware",
        status: "failed",
        severity: "medium",
        remediation: "Implantar proteção antivírus em instâncias EC2",
        resources: ["i-1234abcd", "i-5678efgh"]
      },
      
      // HIPAA Controls
      {
        id: "hipaa-1.1",
        standardId: "hipaa",
        title: "Access Controls",
        description: "Implementar controles técnicos para acesso a PHI",
        status: "passed",
        severity: "high"
      },
      {
        id: "hipaa-1.2",
        standardId: "hipaa",
        title: "Audit Controls",
        description: "Implementar mecanismos para registrar e examinar atividades",
        status: "passed",
        severity: "medium"
      },
      {
        id: "hipaa-2.1",
        standardId: "hipaa",
        title: "Data Integrity",
        description: "Proteger PHI de alteração ou destruição inadequada",
        status: "failed",
        severity: "high",
        remediation: "Habilitar versionamento de objetos para buckets S3 contendo PHI",
        resources: ["s3://patient-data", "s3://medical-images"]
      },
      
      // GDPR Controls
      {
        id: "gdpr-1.1",
        standardId: "gdpr",
        title: "Data Minimization",
        description: "Coletar apenas dados pessoais necessários para fins específicos",
        status: "passed",
        severity: "medium"
      },
      {
        id: "gdpr-1.2",
        standardId: "gdpr",
        title: "Privacy by Design",
        description: "Implementar medidas técnicas e organizacionais para proteção de dados",
        status: "passed",
        severity: "high"
      },
      {
        id: "gdpr-2.1",
        standardId: "gdpr",
        title: "Data Breach Notification",
        description: "Processo para notificar violações de dados pessoais",
        status: "failed",
        severity: "high",
        remediation: "Configurar alertas automatizados para potenciais violações de dados",
        resources: ["CloudWatch", "SNS"]
      },
      
      // NIST Controls
      {
        id: "nist-1.1",
        standardId: "nist",
        title: "Access Control",
        description: "Limitar acesso a sistemas e informações autorizados",
        status: "passed",
        severity: "high"
      },
      {
        id: "nist-1.2",
        standardId: "nist",
        title: "Awareness and Training",
        description: "Conscientizar e treinar usuários sobre segurança da informação",
        status: "failed",
        severity: "medium",
        remediation: "Implementar programa de treinamento de segurança para funcionários",
        resources: ["IAM Users"]
      },
      {
        id: "nist-2.1",
        standardId: "nist",
        title: "Audit and Accountability",
        description: "Criar, proteger e reter registros de auditoria do sistema",
        status: "passed",
        severity: "high"
      }
    ];

    return { standards, controls };
  };

  // Filtrar controles
  const filteredControls = controls.filter(control => {
    if (selectedStandard && control.standardId !== selectedStandard) return false;
    if (filterStatus && control.status !== filterStatus) return false;
    if (filterSeverity && control.severity !== filterSeverity) return false;
    return true;
  });

  // Helper para cores
  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "not_applicable": return "bg-gray-100 text-gray-800";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <Check className="h-4 w-4 text-green-600" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "not_applicable": return <Info className="h-4 w-4 text-gray-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <ClipboardCheck className="h-6 w-6 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Avaliação de Conformidade</h1>
        </div>
        <p className="mt-2 text-gray-600">
          Avalie a conformidade dos seus recursos AWS com padrões e regulamentações de segurança.
        </p>
      </motion.div>

      <CredentialSelector />

      {/* Header com informações de última atualização */}
      {lastUpdated && (
        <div className="flex justify-end items-center mb-4 text-sm text-gray-500">
          <span>Última atualização: {lastUpdated.toLocaleString()}</span>
          {backgroundLoading && (
            <span className="ml-3 inline-flex items-center">
              <RefreshCw className="animate-spin h-3 w-3 mr-1" />
              Atualizando...
            </span>
          )}
        </div>
      )}

      {!selectedCredential ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-500 mb-4">Selecione uma credencial AWS para começar a avaliação de conformidade.</p>
        </motion.div>
      ) : loading ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-12 flex justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {scanning ? (
            <div className="text-center">
              <div className="mb-4 relative h-20 w-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent"
                  style={{ 
                    transform: `rotate(${scanProgress * 3.6}deg)`,
                    transition: 'transform 0.5s ease' 
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-indigo-700">
                  {scanProgress}%
                </div>
              </div>
              <p className="text-gray-500">Verificando conformidade dos recursos...</p>
            </div>
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          )}
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
          {/* Botão de nova verificação */}
          <div className="mb-6 flex justify-between">
            <div></div>
            <button
              onClick={runNewScan}
              disabled={scanning}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Analisando...
                </>
              ) : (
                <>
                  <RefreshCw className="-ml-1 mr-2 h-4 w-4 text-white" />
                  Nova Verificação
                </>
              )}
            </button>
          </div>

          {/* Cartões de padrões de conformidade */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {standards.map(standard => (
              <div
                key={standard.id}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer border-2 ${selectedStandard === standard.id ? 'border-indigo-500' : 'border-transparent'}`}
                onClick={() => setSelectedStandard(selectedStandard === standard.id ? null : standard.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{standard.name}</h3>
                    <p className="text-xs text-gray-500">{standard.description}</p>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(standard.complianceScore)}`}>
                    {standard.complianceScore}%
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full ${standard.complianceScore >= 90 ? 'bg-green-500' : standard.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${standard.complianceScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <div>
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    {standard.passedControls} Aprovados
                  </div>
                  <div>
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                    {standard.failedControls} Falhas
                  </div>
                  <div>
                    <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
                    {standard.notApplicableControls} N/A
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
          
          {/* Filtros e lista de controles */}
          <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Filtros */}
            <div className="border-b border-gray-200 bg-gray-50 p-4 flex flex-wrap gap-4">
              <div>
                <label htmlFor="filter-standard" className="block text-sm font-medium text-gray-700 mb-1">
                  Padrão de Conformidade
                </label>
                <select
                  id="filter-standard"
                  value={selectedStandard || ""}
                  onChange={(e) => setSelectedStandard(e.target.value || null)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  {standards.map(standard => (
                    <option key={standard.id} value={standard.id}>
                      {standard.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="filter-status"
                  value={filterStatus || ""}
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="passed">Aprovado</option>
                  <option value="failed">Falha</option>
                  <option value="not_applicable">Não Aplicável</option>
                </select>
              </div>
              <div>
                <label htmlFor="filter-severity" className="block text-sm font-medium text-gray-700 mb-1">
                  Severidade
                </label>
                <select
                  id="filter-severity"
                  value={filterSeverity || ""}
                  onChange={(e) => setFilterSeverity(e.target.value || null)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Todas</option>
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="medium">Média</option>
                  <option value="low">Baixa</option>
                </select>
              </div>
            </div>
            
            {/* Lista de controles */}
            <div className="divide-y divide-gray-200">
              {filteredControls.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Nenhum controle encontrado com os filtros atuais.</p>
                </div>
              ) : (
                filteredControls.map((control) => {
                  const standard = standards.find(s => s.id === control.standardId);
                  return (
                    <div key={control.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start">
                        {/* Indicador de status */}
                        <div className="mt-1 mr-4">
                          {getStatusIcon(control.status)}
                        </div>
                        
                        {/* Conteúdo principal */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-medium text-gray-900">{control.title}</h4>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                  {standard?.name} | {control.id}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{control.description}</p>
                            </div>
                            <div className="flex space-x-2">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(control.status)}`}>
                                {control.status === 'passed' ? 'Aprovado' : 
                                control.status === 'failed' ? 'Falha' : 'N/A'}
                              </span>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(control.severity)}`}>
                                {control.severity === 'critical' ? 'Crítica' : 
                                control.severity === 'high' ? 'Alta' : 
                                control.severity === 'medium' ? 'Média' : 'Baixa'}
                              </span>
                            </div>
                          </div>
                          
                          {control.status === 'failed' && control.remediation && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-md">
                              <h5 className="text-xs font-medium text-blue-800 mb-1">Recomendação:</h5>
                              <p className="text-sm text-blue-700">{control.remediation}</p>
                              
                              {control.resources && control.resources.length > 0 && (
                                <div className="mt-2">
                                  <h5 className="text-xs font-medium text-blue-800 mb-1">Recursos Afetados:</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {control.resources.map((resource, index) => (
                                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                                        {resource}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
} 