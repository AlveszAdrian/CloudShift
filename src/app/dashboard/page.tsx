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
  Code,
  BarChart3,
  LineChart,
  Cpu,
  Activity,
  Users,
  Clock,
  Zap,
  ArrowUpRight,
  ChevronRight,
  PieChart
} from "lucide-react";
import Link from "next/link";

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

// Componente de card animado
const AnimatedCard = ({ 
  title, 
  icon, 
  children, 
  color = "blue", 
  linkTo = "", 
  delay = 0,
  className = ""
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  color?: "blue" | "amber" | "green" | "red" | "purple" | "teal"; 
  linkTo?: string; 
  delay?: number;
  className?: string;
}) => {
  const colorStyles = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 shadow-blue-100/50 dark:shadow-blue-900/20",
    amber: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 border-amber-200 dark:border-amber-800 shadow-amber-100/50 dark:shadow-amber-900/20",
    green: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 border-emerald-200 dark:border-emerald-800 shadow-emerald-100/50 dark:shadow-emerald-900/20",
    red: "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/50 dark:to-rose-900/50 border-rose-200 dark:border-rose-800 shadow-rose-100/50 dark:shadow-rose-900/20",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 shadow-purple-100/50 dark:shadow-purple-900/20",
    teal: "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/50 border-teal-200 dark:border-teal-800 shadow-teal-100/50 dark:shadow-teal-900/20"
  };
  
  const iconColors = {
    blue: "text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50",
    amber: "text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50",
    green: "text-emerald-500 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50",
    red: "text-rose-500 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50",
    purple: "text-purple-500 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50",
    teal: "text-teal-500 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/50"
  };
  
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`rounded-xl border p-5 h-full ${colorStyles[color]} ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${iconColors[color]}`}>
          {icon}
        </div>
        {linkTo && (
          <span className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
            <ChevronRight size={18} />
          </span>
        )}
      </div>
      <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">{title}</h3>
      <div className="mt-2">
        {children}
      </div>
    </motion.div>
  );
  
  if (linkTo) {
    return (
      <Link href={linkTo} className="block h-full">
        {cardContent}
      </Link>
    );
  }
  
  return cardContent;
};

export default function DashboardPage() {
  const { credentials, selectedCredential, isLoading: credentialsLoading } = useAwsCredentials();
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

  // Obter string da última atualização
  const getLastUpdatedString = () => {
    if (!lastUpdated) return "Nunca atualizado";
    
    // Formatação mais amigável da data/hora
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(lastUpdated);
  };

  // Obter status de alerta
  const getAlertStatus = () => {
    if (criticalAlerts.length > 0) return "critical";
    if (highAlerts.length > 0) return "high";
    if (mediumAlerts.length > 0) return "medium";
    return "normal";
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard de Monitoramento AWS</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Visão geral da sua infraestrutura e segurança na nuvem
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              Atualizado: {getLastUpdatedString()}
            </span>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors border border-blue-200 dark:border-blue-800"
          >
            <RefreshCw size={16} className={`mr-2 ${loading || backgroundLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>
      
      {/* Alerta de erro */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-center"
        >
          <AlertCircle className="mr-2 h-5 w-5 text-red-500 dark:text-red-400" />
          <span>{error}</span>
        </motion.div>
      )}
      
      {/* Loading Skeleton */}
      {loading && !dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-60 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-24 bg-gray-100 dark:bg-gray-700/50 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}
      
      {/* Grid de Cards - Nova visualização com cards modernos */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Score de Segurança */}
          <AnimatedCard 
            title="Score de Segurança" 
            icon={<Shield size={20} />} 
            color={securityScore >= 80 ? "green" : securityScore >= 60 ? "amber" : "red"}
            linkTo="/dashboard/security"
            delay={0}
          >
            <div className="flex justify-center items-center h-32">
              <SecurityScoreChart score={securityScore} />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {securityScore >= 80 ? "Boa segurança" : securityScore >= 60 ? "Necessita atenção" : "Riscos críticos detectados"}
            </p>
          </AnimatedCard>
          
          {/* Alertas Ativos */}
          <AnimatedCard 
            title="Alertas Ativos" 
            icon={<AlertTriangle size={20} />} 
            color={getAlertStatus() === "critical" ? "red" : getAlertStatus() === "high" ? "amber" : "blue"}
            linkTo="/dashboard/security"
            delay={1}
            className="flex flex-col"
          >
            <div className="flex-1 grid grid-cols-2 gap-3 mt-4">
              <div className="bg-rose-50 dark:bg-rose-900/30 rounded-lg p-3 text-center">
                <p className="text-rose-600 dark:text-rose-400 text-xl font-bold">{criticalAlerts.length}</p>
                <p className="text-xs font-medium text-rose-800 dark:text-rose-300 mt-1">Críticos</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3 text-center">
                <p className="text-amber-600 dark:text-amber-400 text-xl font-bold">{highAlerts.length}</p>
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mt-1">Altos</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-center">
                <p className="text-blue-600 dark:text-blue-400 text-xl font-bold">{mediumAlerts.length}</p>
                <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mt-1">Médios</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-xl font-bold">{lowAlerts.length}</p>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-300 mt-1">Baixos</p>
              </div>
            </div>
          </AnimatedCard>
          
          {/* Recursos */}
          <AnimatedCard 
            title="Recursos AWS" 
            icon={<Server size={20} />} 
            color="blue"
            linkTo="/dashboard/resources"
            delay={2}
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center text-gray-600 dark:text-gray-300"><Server size={14} className="mr-1" /> EC2</span>
              <span className="font-semibold">{dashboardData?.resources.ec2 || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center text-gray-600 dark:text-gray-300"><Cloud size={14} className="mr-1" /> S3</span>
              <span className="font-semibold">{dashboardData?.resources.s3 || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center text-gray-600 dark:text-gray-300"><Database size={14} className="mr-1" /> RDS</span>
              <span className="font-semibold">{dashboardData?.resources.rds || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-gray-600 dark:text-gray-300"><Code size={14} className="mr-1" /> Lambda</span>
              <span className="font-semibold">{dashboardData?.resources.lambda || 0}</span>
            </div>
          </AnimatedCard>
          
          {/* Compliance */}
          <AnimatedCard 
            title="Compliance" 
            icon={<Shield size={20} />} 
            color="purple"
            linkTo="/dashboard/security/compliance"
            delay={3}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">PCI DSS</span>
                <span className="text-sm font-medium">{dashboardData?.compliance.pci || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${dashboardData?.compliance.pci || 0}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-300">HIPAA</span>
                <span className="text-sm font-medium">{dashboardData?.compliance.hipaa || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${dashboardData?.compliance.hipaa || 0}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-300">GDPR</span>
                <span className="text-sm font-medium">{dashboardData?.compliance.gdpr || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${dashboardData?.compliance.gdpr || 0}%` }}></div>
              </div>
            </div>
          </AnimatedCard>
          
          {/* Distribuição de Recursos */}
          <AnimatedCard 
            title="Distribuição de Recursos" 
            icon={<PieChart size={20} />} 
            color="teal"
            delay={4}
            className="col-span-1 md:col-span-2"
          >
            <div className="h-48">
              <ResourceDistributionChart resources={dashboardData?.resources || {ec2: 0, s3: 0, rds: 0, lambda: 0, cloudfront: 0}} />
            </div>
          </AnimatedCard>
          
          {/* IAM - Usuários em Risco */}
          <AnimatedCard 
            title="Usuários IAM por Risco" 
            icon={<Users size={20} />} 
            color="amber"
            linkTo="/dashboard/iam"
            delay={5}
          >
            <div className="flex items-center justify-center h-40">
              <div className="grid grid-cols-3 gap-2 w-full">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xl font-bold mb-2">
                    {dashboardData?.security.highRiskUsers || 0}
                  </div>
                  <span className="text-xs text-gray-600">Alto Risco</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xl font-bold mb-2">
                    {dashboardData?.security.mediumRiskUsers || 0}
                  </div>
                  <span className="text-xs text-gray-600">Médio Risco</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold mb-2">
                    {dashboardData?.security.lowRiskUsers || 0}
                  </div>
                  <span className="text-xs text-gray-600">Baixo Risco</span>
                </div>
              </div>
            </div>
          </AnimatedCard>
          
          {/* Issues de Segurança */}
          <AnimatedCard 
            title="Problemas de Segurança" 
            icon={<AlertTriangle size={20} />} 
            color="red"
            linkTo="/dashboard/security/issues"
            delay={6}
            className="col-span-1 md:col-span-2"
          >
            <div className="h-48">
              <SecurityIssuesChart 
                issues={dashboardData?.security.issues || {critical: 0, high: 0, medium: 0, low: 0}} 
              />
            </div>
          </AnimatedCard>
          
          {/* Links Rápidos */}
          <AnimatedCard 
            title="Acessos Rápidos" 
            icon={<Zap size={20} />} 
            color="blue"
            delay={7}
          >
            <div className="space-y-3 mt-2">
              <Link href="/dashboard/security" className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/60 transition-colors">
                <span className="flex items-center">
                  <Shield size={16} className="mr-2" />
                  Segurança
                </span>
                <ArrowUpRight size={16} />
              </Link>
              
              <Link href="/dashboard/iam" className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/40 rounded-lg text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/60 transition-colors">
                <span className="flex items-center">
                  <Users size={16} className="mr-2" />
                  IAM
                </span>
                <ArrowUpRight size={16} />
              </Link>
              
              <Link href="/dashboard/cloud-siem" className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/40 rounded-lg text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/60 transition-colors">
                <span className="flex items-center">
                  <Activity size={16} className="mr-2" />
                  Cloud SIEM
                </span>
                <ArrowUpRight size={16} />
              </Link>
              
              <Link href="/dashboard/resources" className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-lg text-sm text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/60 transition-colors">
                <span className="flex items-center">
                  <Cpu size={16} className="mr-2" />
                  Recursos AWS
                </span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </AnimatedCard>
        </div>
      )}
    </div>
  );
}

function getSeverityColor(severity: string): string {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'LOW':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getTotalResources(data: DashboardData) {
  return data.resources.ec2 + data.resources.s3 + data.resources.rds + data.resources.lambda + data.resources.cloudfront;
} 