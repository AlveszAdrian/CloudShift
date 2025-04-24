import React, { useEffect } from 'react';
import { useAlerts } from '@/hooks/useAlerts';
import SecurityScoreChart from './SecurityScoreChart';
import SecurityIssuesChart from './SecurityIssuesChart';
import ResourceDistributionChart from './ResourceDistributionChart';
import DashboardContainer from './DashboardContainer';
import { motion } from 'framer-motion';

interface AlertsDashboardProps {
  dashboardData?: any; // Dados do dashboard geral, caso necessário
}

/**
 * Componente que exibe dashboards baseados nos dados reais de alertas
 */
const AlertsDashboard: React.FC<AlertsDashboardProps> = ({ dashboardData }) => {
  const { alerts, loading, error, fetchAlerts } = useAlerts();
  
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);
  
  // Se estiver carregando, mostrar loading
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Se houver erro, mostrar erro
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p>Erro ao carregar dados de alertas: {error}</p>
      </div>
    );
  }
  
  // Filtrar alertas por status e severidade
  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'CRITICAL');
  const highAlerts = activeAlerts.filter(alert => alert.severity === 'HIGH');
  const mediumAlerts = activeAlerts.filter(alert => alert.severity === 'MEDIUM');
  const lowAlerts = activeAlerts.filter(alert => alert.severity === 'LOW');
  
  // Calcular pontuação de segurança baseada nos alertas (100 - ponderação de alertas)
  const securityScore = calculateSecurityScore(criticalAlerts.length, highAlerts.length, mediumAlerts.length, lowAlerts.length);
  
  // Agrupar alertas por tipo de recurso
  const resourceTypes = groupAlertsByResourceType(activeAlerts);
  
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Score de Segurança</h3>
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/3">
            <DashboardContainer>
              <SecurityScoreChart score={securityScore} />
            </DashboardContainer>
          </div>
          <div className="w-full md:w-2/3 mt-6 md:mt-0 md:pl-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Problemas de Segurança</h4>
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
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Tipo de Recurso</h3>
        <DashboardContainer className="h-full">
          <ResourceDistributionChart 
            resources={{
              ec2: resourceTypes.ec2 || 0,
              s3: resourceTypes.s3 || 0,
              rds: resourceTypes.rds || 0,
              lambda: resourceTypes.lambda || 0,
              cloudfront: resourceTypes.cloudfront || 0
            }}
          />
        </DashboardContainer>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas Recentes</h3>
        <DashboardContainer>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-red-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700">{criticalAlerts.length}</div>
              <div className="text-xs text-red-600">Críticos</div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-700">{highAlerts.length}</div>
              <div className="text-xs text-orange-600">Altos</div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-700">{mediumAlerts.length}</div>
              <div className="text-xs text-yellow-600">Médios</div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700">{lowAlerts.length}</div>
              <div className="text-xs text-blue-600">Baixos</div>
            </div>
          </div>
          
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
        </DashboardContainer>
      </div>
    </div>
  );
};

// Função para calcular a pontuação de segurança baseada na quantidade de alertas
function calculateSecurityScore(critical: number, high: number, medium: number, low: number): number {
  // Pontuação base é 100, e reduz com base na ponderação dos alertas
  const totalWeight = critical * 10 + high * 5 + medium * 2 + low * 0.5;
  let score = 100 - totalWeight;
  
  // Garantir que a pontuação esteja entre 0 e 100
  score = Math.max(0, Math.min(100, score));
  
  // Arredondar para o inteiro mais próximo
  return Math.round(score);
}

// Função para agrupar alertas por tipo de recurso
function groupAlertsByResourceType(alerts: any[]): Record<string, number> {
  const resourceCounts: Record<string, number> = {
    ec2: 0,
    s3: 0,
    rds: 0,
    lambda: 0,
    cloudfront: 0
  };
  
  alerts.forEach(alert => {
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

export default AlertsDashboard; 