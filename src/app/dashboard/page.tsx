"use client";

import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAlerts } from "@/hooks/useAlerts";
import AlertsDashboard from "@/components/dashboard/AlertsDashboard";
import SecurityScoreChart from "@/components/dashboard/SecurityScoreChart";
import ResourcesChart from "@/components/dashboard/ResourcesChart";
import ResourceDistributionChart from "@/components/dashboard/ResourceDistributionChart";
import ComplianceChart from "@/components/dashboard/ComplianceChart";
import SecurityIssuesChart from "@/components/dashboard/SecurityIssuesChart";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  Shield, 
  Server, 
  Database, 
  Cloud, 
  HardDrive,
  Code
} from "lucide-react";

// Interface para os dados do dashboard
interface DashboardData {
  resources: {
    ec2: number;
    s3: number;
    rds: number;
    lambda: number;
    cloudfront: number;
  };
  security: {
    score: number;
    issues: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    highRiskUsers: number;
    mediumRiskUsers: number;
    lowRiskUsers: number;
  };
  compliance: {
    pci: number;
    hipaa: number;
    gdpr: number;
    nist: number;
  };
}

export default function DashboardPage() {
  const { credentials, selectedCredential, loading: credentialsLoading } = useAwsCredentials();
  const { alerts, loading: alertsLoading, error: alertsError, fetchAlerts } = useAlerts();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lastCredentialId, setLastCredentialId] = useState<string | null>(null);

  // Carregar dados do dashboard quando a credencial mudar
  useEffect(() => {
    if (!selectedCredential) {
      setLoading(false);
      return;
    }
    
    // Verificar se já temos dados no localStorage
    try {
      const dashboardCache = localStorage.getItem('dashboardData');
      const cachedCredentialId = localStorage.getItem('dashboardLastCredentialId');
      const cachedTimestamp = localStorage.getItem('dashboardLastUpdateTime');
      
      if (dashboardCache && cachedCredentialId === selectedCredential.id) {
        // Usar dados do cache
        const parsedData = JSON.parse(dashboardCache);
        setDashboardData(parsedData);
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
            fetchDashboardDataInBackground();
          }
        }
      } else {
        // Se não tem cache ou a credencial mudou, buscar novos dados
        fetchDashboardData();
      }
      
      setLastCredentialId(selectedCredential.id);
    } catch (error) {
      console.error("Erro ao restaurar cache:", error);
      fetchDashboardData();
    }
  }, [selectedCredential]);

  // Carregar alertas quando a credencial mudar
  useEffect(() => {
    if (selectedCredential) {
      fetchAlerts();
    }
  }, [selectedCredential, fetchAlerts]);

  // Função para buscar dados do dashboard com feedback visual
  async function fetchDashboardData() {
    if (!selectedCredential) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/aws/dashboard?credentialId=${selectedCredential.id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
      const currentTime = new Date();
      setLastUpdated(currentTime);
      
      // Salvar no cache
      localStorage.setItem('dashboardData', JSON.stringify(data));
      localStorage.setItem('dashboardLastCredentialId', selectedCredential.id);
      localStorage.setItem('dashboardLastUpdateTime', currentTime.getTime().toString());
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  // Função para atualizar em background sem interferir na experiência do usuário
  async function fetchDashboardDataInBackground() {
    if (!selectedCredential) return;
    
    try {
      setBackgroundLoading(true);
      
      const response = await fetch(`/api/aws/dashboard?credentialId=${selectedCredential.id}`);
      
      if (!response.ok) {
        throw new Error("Erro na atualização em background");
      }
      
      const data = await response.json();
      setDashboardData(data);
      const currentTime = new Date();
      setLastUpdated(currentTime);
      
      // Salvar no cache
      localStorage.setItem('dashboardData', JSON.stringify(data));
      localStorage.setItem('dashboardLastCredentialId', selectedCredential.id);
      localStorage.setItem('dashboardLastUpdateTime', currentTime.getTime().toString());
      
      console.log("Atualização em background do dashboard concluída");
    } catch (err) {
      console.error("Erro na atualização em background:", err);
      // Não exibimos erros de background para o usuário
    } finally {
      setBackgroundLoading(false);
    }
  }

  // Função para atualizar dados manualmente
  const handleRefresh = async () => {
    await fetchDashboardData();
    await fetchAlerts();
  };

  // Filtrar alertas ativos por severidade
  const activeAlerts = alerts.filter(a => a.status === 'active' || a.status === 'OPEN');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'CRITICAL');
  const highAlerts = activeAlerts.filter(a => a.severity === 'HIGH');
  const mediumAlerts = activeAlerts.filter(a => a.severity === 'MEDIUM');
  const lowAlerts = activeAlerts.filter(a => a.severity === 'LOW');

  // Calcular score de segurança baseado nos alertas (alternativa quando não há dados)
  const calculateSecurityScore = () => {
    if (dashboardData) return dashboardData.security.score;
    
    // Pontuação base é 100, e reduz com base na ponderação dos alertas
    const totalWeight = criticalAlerts.length * 10 + highAlerts.length * 5 + 
                         mediumAlerts.length * 2 + lowAlerts.length * 0.5;
    let score = 100 - totalWeight;
    
    // Garantir que a pontuação esteja entre 0 e 100
    score = Math.max(0, Math.min(100, score));
    
    // Arredondar para o inteiro mais próximo
    return Math.round(score);
  };
  
  // Função para agrupar alertas por tipo de recurso
  const getResourceAlertCounts = () => {
    const resourceCounts = {
      ec2: 0,
      s3: 0,
      rds: 0,
      lambda: 0,
      cloudfront: 0
    };
    
    activeAlerts.forEach(alert => {
      const resourceType = alert.resourceType.toLowerCase();
      
      if (resourceType.includes('ec2') || resourceType.includes('instance')) {
        resourceCounts.ec2++;
      } else if (resourceType.includes('s3') || resourceType.includes('bucket')) {
        resourceCounts.s3++;
      } else if (resourceType.includes('rds') || resourceType.includes('database')) {
        resourceCounts.rds++;
      } else if (resourceType.includes('lambda') || resourceType.includes('function')) {
        resourceCounts.lambda++;
      } else if (resourceType.includes('cloudfront') || resourceType.includes('distribution')) {
        resourceCounts.cloudfront++;
      }
    });
    
    return resourceCounts;
  };

  const securityScore = calculateSecurityScore();
  const resourceAlertCounts = getResourceAlertCounts();

  return (
    <div>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Visão geral dos seus recursos AWS e segurança.
            </p>
          </div>
          {selectedCredential && (
            <div className="bg-white shadow rounded-lg px-4 py-2 flex items-center">
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-bold mr-3">
                {selectedCredential.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedCredential.name}</p>
                <p className="text-xs text-gray-500">{selectedCredential.region}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Header com botão de atualização e última atualização */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {lastUpdated && (
            <span>Última atualização: {lastUpdated.toLocaleTimeString()}</span>
          )}
          {backgroundLoading && (
            <span className="ml-3 inline-flex items-center">
              <div className="animate-spin h-3 w-3 border-t-2 border-b-2 border-indigo-500 mr-1"></div>
              Atualizando...
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || alertsLoading}
          className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${(loading || alertsLoading) ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {credentialsLoading || loading ? (
        <div className="flex justify-center py-12 bg-white rounded-lg shadow">
          <RefreshCw className="h-12 w-12 text-indigo-500 animate-spin" />
        </div>
      ) : error ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 bg-red-50 rounded-md mb-4">
            <p className="text-red-700 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              {error}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50"
          >
            Tentar novamente
          </button>
        </motion.div>
      ) : credentials.length === 0 ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Bem-vindo ao AWS Monitoring</h2>
          <p className="text-gray-600 mb-6">
            Para começar a monitorar seus recursos AWS, adicione sua primeira credencial.
          </p>
          <button
            onClick={() => router.push("/dashboard/credentials")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Adicionar Credencial AWS
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Resumo de alertas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Alertas Críticos</h2>
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{criticalAlerts.length}</div>
              <div className="mt-2 text-sm text-gray-500">
                {criticalAlerts.length === 0 ? 'Nenhum alerta crítico' : 'Requer atenção imediata'}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Alertas Altos</h2>
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{highAlerts.length}</div>
              <div className="mt-2 text-sm text-gray-500">
                {highAlerts.length === 0 ? 'Nenhum alerta alto' : 'Risco significativo'}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Total de Alertas</h2>
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-indigo-500" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{activeAlerts.length}</div>
              <div className="mt-2 text-sm text-gray-500">
                {activeAlerts.length === 0 ? 'Ambiente seguro' : 'Alertas ativos'}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Score de Segurança</h2>
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{securityScore}%</div>
              <div className="mt-2 text-sm text-gray-500">
                {securityScore > 80 ? 'Boa postura de segurança' : 'Requer melhorias'}
              </div>
            </div>
          </div>

          {/* Gráficos principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alertas por severidade */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Distribuição de Alertas</h2>
              <div className="h-64">
                <DashboardContainer>
                  <SecurityIssuesChart 
                    issues={{
                      critical: criticalAlerts.length,
                      high: highAlerts.length,
                      medium: mediumAlerts.length,
                      low: lowAlerts.length
                    }} 
                  />
                </DashboardContainer>
              </div>
            </div>
            
            {/* Alertas por tipo de recurso */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Alertas por Serviço</h2>
              <div className="h-64">
                <DashboardContainer>
                  <ResourceDistributionChart resources={resourceAlertCounts} />
                </DashboardContainer>
              </div>
            </div>
          </div>

          {/* Alertas recentes */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Alertas Recentes</h2>
              <button 
                onClick={() => router.push('/dashboard/security')}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Ver todos
              </button>
            </div>
            
            {alertsLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
              </div>
            ) : alertsError ? (
              <div className="py-4 px-4 bg-red-50 text-red-700 rounded-md">
                {alertsError}
              </div>
            ) : activeAlerts.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p>Nenhum alerta de segurança ativo.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeAlerts.slice(0, 5).map((alert) => (
                  <motion.div
                    key={alert.id}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)} mr-3`}></div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800">{alert.title}</h3>
                      <p className="text-xs text-gray-500 truncate">
                        {alert.resourceType}: {alert.resourceId}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Recursos AWS */}
          {dashboardData && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recursos AWS</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                  <Server className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">EC2</p>
                    <p className="text-xl font-bold text-blue-700">{dashboardData.resources.ec2}</p>
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg flex items-center">
                  <Cloud className="h-6 w-6 text-amber-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">S3</p>
                    <p className="text-xl font-bold text-amber-700">{dashboardData.resources.s3}</p>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg flex items-center">
                  <Database className="h-6 w-6 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">RDS</p>
                    <p className="text-xl font-bold text-purple-700">{dashboardData.resources.rds}</p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg flex items-center">
                  <Code className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Lambda</p>
                    <p className="text-xl font-bold text-green-700">{dashboardData.resources.lambda}</p>
                  </div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                  <HardDrive className="h-6 w-6 text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-indigo-800">CloudFront</p>
                    <p className="text-xl font-bold text-indigo-700">{dashboardData.resources.cloudfront}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Função para obter a cor da severidade
function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-500';
    case 'HIGH':
      return 'bg-orange-500';
    case 'MEDIUM':
      return 'bg-yellow-500';
    case 'LOW':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
}

function getTotalResources(data: DashboardData) {
  return data.resources.ec2 + 
    data.resources.s3 + 
    data.resources.rds + 
    data.resources.lambda + 
    data.resources.cloudfront;
} 