"use client";

import { useState, useEffect } from "react";
import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import { motion } from "framer-motion";
import CredentialSelector from "@/components/aws/CredentialSelector";
import { 
  AlertTriangle, CheckCircle, Database, 
  Key, Network, RefreshCw, Server, Shield, Info
} from "lucide-react";
import React from 'react';
import SecuritySummaryCard from "@/components/dashboard/SecuritySummaryCard";

// Tipos para o EC2
interface EC2Instance {
  id: string;
  type: string;
  state: string;
  publicIp: string;
  privateIp: string;
  launchTime: string;
}

// Tipos para o EC2 Security Service
interface EC2SecurityData {
  results: {
    securityGroups: SecurityGroup[];
    networkAcls: NetworkACL[];
    instances: SecurityInstance[];
    keyPairs: KeyPair[];
    volumes: Volume[];
    iamRoles: IAMRole[];
  };
  summary: {
    totalIssues: number;
    securityGroupIssues: number;
    networkAclIssues: number;
    instanceIssues: number;
    keyPairIssues: number;
    volumeIssues: number;
    iamRoleIssues: number;
  };
}

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  vpcId: string;
  inboundRules: SecurityGroupRule[];
  outboundRules: SecurityGroupRule[];
  issues: SecurityGroupIssue[];
}

interface SecurityGroupRule {
  protocol: string;
  fromPort: number;
  toPort: number;
  ipRanges: IPRange[];
  ipv6Ranges: IPRange[];
}

interface IPRange {
  cidr: string;
  description?: string;
}

interface SecurityGroupIssue {
  type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedRule: SecurityGroupRule;
}

interface NetworkACL {
  id: string;
  vpcId: string;
  default: boolean;
  inboundRules: ACLRule[];
  outboundRules: ACLRule[];
  issues: ACLIssue[];
}

interface ACLRule {
  ruleNumber: number;
  protocol: string;
  action: string;
  cidrBlock: string;
  fromPort: number;
  toPort: number;
}

interface ACLIssue {
  type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  affectedRule: ACLRule;
}

interface SecurityInstance {
  id: string;
  type: string;
  state: string;
  publicIp?: string;
  privateIp?: string;
  subnetId?: string;
  vpcId?: string;
  launchTime?: Date;
  imageId?: string;
  keyName?: string;
  iamInstanceProfile?: string;
  issues: InstanceIssue[];
}

interface InstanceIssue {
  type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface KeyPair {
  name: string;
  fingerprint: string;
  issues: KeyPairIssue[];
}

interface KeyPairIssue {
  type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM';
}

interface Volume {
  id: string;
  instanceId?: string;
  size: number;
  type: string;
  encrypted: boolean;
  state: string;
  issues: VolumeIssue[];
}

interface VolumeIssue {
  type: string;
  description: string;
  severity: 'MEDIUM' | 'HIGH';
}

interface IAMRole {
  name: string;
  arn: string;
  instanceProfiles: string[];
  permissions: string[];
  issues: IAMRoleIssue[];
}

interface IAMRoleIssue {
  type: string;
  description: string;
  severity: 'MEDIUM' | 'HIGH';
}

export default function EC2Page() {
  const { selectedCredential } = useAwsCredentials();
  const [instances, setInstances] = useState<EC2Instance[]>([]);
  const [securityData, setSecurityData] = useState<EC2SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [securityLoading, setSecurityLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'instances' | 'security'>('instances');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Função para buscar instâncias com feedback visual
  async function fetchInstances() {
    if (!selectedCredential) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Buscando instâncias EC2 para credencial: ${selectedCredential.id}`);
      const response = await fetch(`/api/aws/resources?credentialId=${selectedCredential.id}&type=EC2`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar instâncias: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dados obtidos:", data);
      
      setInstances(data.resources || []);
      setLastRefreshed(new Date());
      
      // Armazenar no cache
      localStorage.setItem('ec2Instances', JSON.stringify(data.resources || []));
    } catch (err) {
      console.error("Erro ao buscar instâncias:", err);
      setError("Não foi possível carregar as instâncias EC2. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }
  
  // Função para buscar dados de segurança com feedback visual
  async function fetchSecurityData() {
    if (!selectedCredential) return;
    
    setSecurityLoading(true);
    setSecurityError(null);
    
    try {
      console.log(`Buscando dados de segurança EC2 para credencial: ${selectedCredential.id}`);
      const response = await fetch(`/api/aws/ec2/security?credentialId=${selectedCredential.id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de segurança: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dados de segurança obtidos:", data);
      
      setSecurityData(data);
      setLastRefreshed(new Date());
      
      // Armazenar no cache
      localStorage.setItem('ec2SecurityData', JSON.stringify(data));
    } catch (err) {
      console.error("Erro ao buscar dados de segurança:", err);
      setSecurityError("Não foi possível carregar os dados de segurança EC2. Tente novamente mais tarde.");
    } finally {
      setSecurityLoading(false);
    }
  }
  
  useEffect(() => {
    // Tenta restaurar dados do cache ao iniciar
    if (!selectedCredential) return;
    
    // Verificar se já temos dados de instâncias no localStorage
    try {
      const instancesCache = localStorage.getItem('ec2Instances');
      const securityCache = localStorage.getItem('ec2SecurityData');
      
      if (instancesCache && selectedCredential.id) {
        const parsedInstances = JSON.parse(instancesCache);
        setInstances(parsedInstances);
        setLoading(false);
      }
      
      if (securityCache && selectedCredential.id) {
        const parsedSecurityData = JSON.parse(securityCache);
        setSecurityData(parsedSecurityData);
        setSecurityLoading(false);
      }
      
      // Função para buscar instâncias sem feedback visual (em background)
      async function fetchInstancesInBackground() {
        if (!selectedCredential) return;
      
        try {
          console.log(`Atualizando instâncias EC2 em background para credencial: ${selectedCredential.id}`);
          const response = await fetch(`/api/aws/resources?credentialId=${selectedCredential.id}&type=EC2`);
          
          if (!response.ok) {
            throw new Error(`Erro ao buscar instâncias em background: ${response.status}`);
          }
          
          const data = await response.json();
          
          setInstances(data.resources || []);
          setLastRefreshed(new Date());
          
          // Atualizar cache
          localStorage.setItem('ec2Instances', JSON.stringify(data.resources || []));
        } catch (err) {
          console.error("Erro na atualização em background das instâncias:", err);
          // Não exibimos erros de background para o usuário
        }
      }
      
      // Função para buscar dados de segurança sem feedback visual (em background)
      async function fetchSecurityDataInBackground() {
        if (!selectedCredential) return;
      
        try {
          console.log(`Atualizando dados de segurança EC2 em background para credencial: ${selectedCredential.id}`);
          const response = await fetch(`/api/aws/ec2/security?credentialId=${selectedCredential.id}`);
          
          if (!response.ok) {
            throw new Error(`Erro ao buscar dados de segurança em background: ${response.status}`);
          }
          
          const data = await response.json();
          
          setSecurityData(data);
          setLastRefreshed(new Date());
          
          // Atualizar cache
          localStorage.setItem('ec2SecurityData', JSON.stringify(data));
        } catch (err) {
          console.error("Erro na atualização em background dos dados de segurança:", err);
          // Não exibimos erros de background para o usuário
        }
      }
      
      // Atualiza em background
      if (selectedCredential.id) {
        fetchInstancesInBackground();
        fetchSecurityDataInBackground();
      }
    } catch (error) {
      console.error("Erro ao restaurar do cache:", error);
    }
  }, [selectedCredential]);

  // Função para obter a cor baseada no estado da instância
  const getStateColor = (state?: string) => {
    switch (state?.toLowerCase()) {
      case "running":
        return "bg-green-100 text-green-800";
      case "stopped":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "stopping":
        return "bg-orange-100 text-orange-800";
      case "terminated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Função para obter a cor baseada na severidade
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Função para obter o ícone baseado na severidade
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "HIGH":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "MEDIUM":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "LOW":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
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
          <Server className="h-6 w-6 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Monitoramento EC2</h1>
        </div>
        <p className="mt-2 text-gray-600">
          Visualize e analise a segurança das suas instâncias EC2 na AWS.
        </p>
      </motion.div>

      <CredentialSelector />
      
      {/* Header Actions */}
      <div className="flex justify-end mb-4">
        <div className="flex flex-col items-end">
          <button
            onClick={() => {
              if (selectedCredential) {
                if (activeTab === 'instances') {
                  fetchInstances();
                } else {
                  fetchSecurityData();
                }
              }
            }}
            disabled={!selectedCredential || (activeTab === 'instances' ? loading : securityLoading)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {(activeTab === 'instances' ? loading : securityLoading) ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Atualizar Dados
          </button>
          {lastRefreshed && (
            <span className="text-xs text-gray-500 mt-1">
              Última atualização: {lastRefreshed.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'instances'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => { setActiveTab('instances'); }}
        >
          <Server className="h-4 w-4" />
          Instâncias
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => { setActiveTab('security'); }}
        >
          <Shield className="h-4 w-4" />
          Segurança
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'instances' ? (
        <InstancesTab 
          instances={instances} 
          loading={loading} 
          error={error} 
          selectedCredential={selectedCredential}
          getStateColor={getStateColor}
          onRefresh={fetchInstances}
        />
      ) : (
        <SecurityTab 
          securityData={securityData} 
          loading={securityLoading} 
          error={securityError}
          selectedCredential={selectedCredential}
          getSeverityColor={getSeverityColor}
          getSeverityIcon={getSeverityIcon}
          onRefresh={fetchSecurityData}
        />
      )}
    </div>
  );
}

// Componente para a aba de instâncias
interface InstancesTabProps {
  instances: EC2Instance[];
  loading: boolean;
  error: string | null;
  selectedCredential: { id: string; region: string } | null;
  getStateColor: (state?: string) => string;
  onRefresh: () => void;
}

function InstancesTab({ 
  instances, 
  loading, 
  error, 
  selectedCredential,
  getStateColor,
  onRefresh 
}: InstancesTabProps) {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!selectedCredential ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Selecione uma credencial AWS para visualizar as instâncias.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : instances.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Nenhuma instância EC2 encontrada na região {selectedCredential.region}.</p>
          <p className="text-sm text-gray-400 mt-2">
            Verifique se você tem instâncias EC2 nesta região ou se suas credenciais têm permissão para acessá-las.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {instances.length} {instances.length === 1 ? "Instância" : "Instâncias"} Encontradas
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Atualizar
              </button>
              <span className="text-sm text-gray-500">
                Região: {selectedCredential.region}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID da Instância
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Público
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Privado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Iniciada Em
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {instances.map((instance) => (
                  <tr key={instance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {instance.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {instance.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColor(instance.state)}`}>
                        {instance.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {instance.publicIp || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {instance.privateIp || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {instance.launchTime ? new Date(instance.launchTime).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Componente para a aba de segurança
interface SecurityTabProps {
  securityData: EC2SecurityData | null;
  loading: boolean;
  error: string | null;
  selectedCredential: { id: string; region: string } | null;
  getSeverityColor: (severity: string) => string;
  getSeverityIcon: (severity: string) => React.ReactNode;
  onRefresh: () => void;
}

function SecurityTab({ 
  securityData, 
  loading, 
  error, 
  selectedCredential,
  getSeverityColor,
  getSeverityIcon,
  onRefresh
}: SecurityTabProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [sendingToAnalysis, setSendingToAnalysis] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const sendToSecurityAnalysis = async () => {
    if (!selectedCredential) return;
    
    try {
      setSendingToAnalysis(true);
      setAnalysisMessage(null);
      
      const response = await fetch(`/api/aws/ec2/security?credentialId=${selectedCredential.id}&sendToSecurityAnalysis=true`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao enviar para análise de segurança");
      }
      
      const data = await response.json();
      setAnalysisMessage(`${data.summary.totalIssues} problemas de segurança enviados para a Análise de Segurança.`);
    } catch (err) {
      console.error("Erro ao enviar para análise de segurança:", err);
      setAnalysisMessage(err instanceof Error ? err.message : "Erro ao enviar para análise de segurança");
    } finally {
      setSendingToAnalysis(false);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!selectedCredential ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Selecione uma credencial AWS para analisar a segurança do EC2.</p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500">Verificando segurança do EC2...</p>
          <p className="text-xs text-gray-400 mt-1">Isso pode levar alguns minutos</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : !securityData ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Nenhum dado de segurança disponível.</p>
        </div>
      ) : (
        <div>
          {/* Sumário de Problemas */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Shield className="h-5 w-5 text-indigo-600 mr-2" />
                Resumo de Segurança
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  Atualizar
                </button>
                <button
                  onClick={sendToSecurityAnalysis}
                  disabled={sendingToAnalysis || securityData.summary.totalIssues === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingToAnalysis ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Enviar para Análise de Segurança
                    </>
                  )}
                </button>
                <span className="text-sm text-gray-500">
                  Região: {selectedCredential.region}
                </span>
              </div>
            </div>
            
            {analysisMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
                {analysisMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <SecuritySummaryCard 
                title="Problemas Totais" 
                count={securityData.summary.totalIssues} 
                icon={<AlertTriangle className="h-6 w-6 text-red-500" />} 
                color="bg-red-50 border-red-200"
              />
              <SecuritySummaryCard 
                title="Security Groups" 
                count={securityData.summary.securityGroupIssues} 
                icon={<Shield className="h-6 w-6 text-orange-500" />}
                color="bg-orange-50 border-orange-200" 
              />
              <SecuritySummaryCard 
                title="Network ACLs" 
                count={securityData.summary.networkAclIssues} 
                icon={<Network className="h-6 w-6 text-yellow-500" />}
                color="bg-yellow-50 border-yellow-200"
              />
              <SecuritySummaryCard 
                title="Instâncias" 
                count={securityData.summary.instanceIssues} 
                icon={<Server className="h-6 w-6 text-indigo-500" />}
                color="bg-indigo-50 border-indigo-200"
              />
              <SecuritySummaryCard 
                title="Chaves" 
                count={securityData.summary.keyPairIssues} 
                icon={<Key className="h-6 w-6 text-purple-500" />}
                color="bg-purple-50 border-purple-200"
              />
              <SecuritySummaryCard 
                title="Volumes EBS" 
                count={securityData.summary.volumeIssues} 
                icon={<Database className="h-6 w-6 text-blue-500" />}
                color="bg-blue-50 border-blue-200"
              />
            </div>
          </div>
          
          {/* Seções de Problemas */}
          <div className="divide-y divide-gray-200">
            {/* Security Groups */}
            <SectionHeader 
              title="Security Groups" 
              count={securityData.summary.securityGroupIssues}
              icon={<Shield className="h-5 w-5 text-orange-500" />}
              isExpanded={expandedSection === 'securityGroups'}
              onClick={() => toggleSection('securityGroups')}
            />
            
            {expandedSection === 'securityGroups' && (
              <div className="p-4">
                {securityData.results.securityGroups.map(sg => (
                  sg.issues.length > 0 && (
                    <div key={sg.id} className="mb-4 border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                        <div>
                          <span className="font-medium">{sg.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{sg.id}</span>
                        </div>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {sg.issues.length} {sg.issues.length === 1 ? 'problema' : 'problemas'}
                        </span>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2">
                          {sg.issues.map((issue, issueIndex) => (
                            <li key={issueIndex} className="flex items-start gap-2">
                              {getSeverityIcon(issue.severity)}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{issue.type}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{issue.description}</p>
                                <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                  <div>Protocolo: {issue.affectedRule.protocol === '-1' ? 'Todos' : issue.affectedRule.protocol}</div>
                                  <div>Portas: {issue.affectedRule.fromPort === 0 && issue.affectedRule.toPort === 65535 
                                    ? 'Todas (0-65535)' 
                                    : `${issue.affectedRule.fromPort}-${issue.affectedRule.toPort}`}
                                  </div>
                                  <div>
                                    CIDRs: 
                                    {issue.affectedRule.ipRanges.map(range => range.cidr).join(', ')}
                                    {issue.affectedRule.ipv6Ranges.length > 0 && ', '}
                                    {issue.affectedRule.ipv6Ranges.map(range => range.cidr).join(', ')}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                ))}
                {securityData.results.securityGroups.every(sg => sg.issues.length === 0) && (
                  <div className="p-4 bg-green-50 text-green-800 rounded flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Nenhum problema encontrado em Security Groups
                  </div>
                )}
              </div>
            )}
            
            {/* Network ACLs */}
            <SectionHeader 
              title="Network ACLs" 
              count={securityData.summary.networkAclIssues}
              icon={<Network className="h-5 w-5 text-yellow-500" />}
              isExpanded={expandedSection === 'networkAcls'}
              onClick={() => toggleSection('networkAcls')}
            />
            
            {expandedSection === 'networkAcls' && (
              <div className="p-4">
                {securityData.results.networkAcls.map(acl => (
                  acl.issues.length > 0 && (
                    <div key={acl.id} className="mb-4 border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                        <div>
                          <span className="font-medium">{acl.id}</span>
                          <span className="ml-2 text-xs text-gray-500">VPC: {acl.vpcId}</span>
                          {acl.default && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          {acl.issues.length} {acl.issues.length === 1 ? 'problema' : 'problemas'}
                        </span>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2">
                          {acl.issues.map((issue, issueIndex) => (
                            <li key={issueIndex} className="flex items-start gap-2">
                              {getSeverityIcon(issue.severity)}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{issue.type}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{issue.description}</p>
                                <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                  <div>Regra #: {issue.affectedRule.ruleNumber}</div>
                                  <div>Ação: {issue.affectedRule.action}</div>
                                  <div>Protocolo: {issue.affectedRule.protocol === '-1' ? 'Todos' : issue.affectedRule.protocol}</div>
                                  <div>CIDR: {issue.affectedRule.cidrBlock}</div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                ))}
                {securityData.results.networkAcls.every(acl => acl.issues.length === 0) && (
                  <div className="p-4 bg-green-50 text-green-800 rounded flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Nenhum problema encontrado em Network ACLs
                  </div>
                )}
              </div>
            )}
            
            {/* Instâncias EC2 */}
            <SectionHeader 
              title="Instâncias EC2" 
              count={securityData.summary.instanceIssues}
              icon={<Server className="h-5 w-5 text-indigo-500" />}
              isExpanded={expandedSection === 'instances'}
              onClick={() => toggleSection('instances')}
            />
            
            {expandedSection === 'instances' && (
              <div className="p-4">
                {securityData.results.instances.map(instance => (
                  instance.issues.length > 0 && (
                    <div key={instance.id} className="mb-4 border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                        <div>
                          <span className="font-medium">{instance.id}</span>
                          <span className="ml-2 text-xs text-gray-500">{instance.type}</span>
                        </div>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                          {instance.issues.length} {instance.issues.length === 1 ? 'problema' : 'problemas'}
                        </span>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2">
                          {instance.issues.map((issue, issueIndex) => (
                            <li key={issueIndex} className="flex items-start gap-2">
                              {getSeverityIcon(issue.severity)}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{issue.type}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{issue.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                ))}
                {securityData.results.instances.every(instance => instance.issues.length === 0) && (
                  <div className="p-4 bg-green-50 text-green-800 rounded flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Nenhum problema encontrado em Instâncias EC2
                  </div>
                )}
              </div>
            )}
            
            {/* Key Pairs */}
            <SectionHeader 
              title="Chaves de Acesso (Key Pairs)" 
              count={securityData.summary.keyPairIssues}
              icon={<Key className="h-5 w-5 text-purple-500" />}
              isExpanded={expandedSection === 'keyPairs'}
              onClick={() => toggleSection('keyPairs')}
            />
            
            {expandedSection === 'keyPairs' && (
              <div className="p-4">
                {securityData.results.keyPairs.map(keyPair => (
                  keyPair.issues.length > 0 && (
                    <div key={keyPair.name} className="mb-4 border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                        <div>
                          <span className="font-medium">{keyPair.name}</span>
                        </div>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {keyPair.issues.length} {keyPair.issues.length === 1 ? 'problema' : 'problemas'}
                        </span>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2">
                          {keyPair.issues.map((issue, issueIndex) => (
                            <li key={issueIndex} className="flex items-start gap-2">
                              {getSeverityIcon(issue.severity)}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{issue.type}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{issue.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                ))}
                {securityData.results.keyPairs.every(keyPair => keyPair.issues.length === 0) && (
                  <div className="p-4 bg-green-50 text-green-800 rounded flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Nenhum problema encontrado em Chaves de Acesso
                  </div>
                )}
              </div>
            )}
            
            {/* Volumes EBS */}
            <SectionHeader 
              title="Volumes EBS" 
              count={securityData.summary.volumeIssues}
              icon={<Database className="h-5 w-5 text-blue-500" />}
              isExpanded={expandedSection === 'volumes'}
              onClick={() => toggleSection('volumes')}
            />
            
            {expandedSection === 'volumes' && (
              <div className="p-4">
                {securityData.results.volumes.map(volume => (
                  volume.issues.length > 0 && (
                    <div key={volume.id} className="mb-4 border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                        <div>
                          <span className="font-medium">{volume.id}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            {volume.size} GB, {volume.type}
                            {volume.instanceId && `, anexado a ${volume.instanceId}`}
                          </span>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {volume.issues.length} {volume.issues.length === 1 ? 'problema' : 'problemas'}
                        </span>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2">
                          {volume.issues.map((issue, issueIndex) => (
                            <li key={issueIndex} className="flex items-start gap-2">
                              {getSeverityIcon(issue.severity)}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{issue.type}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{issue.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                ))}
                {securityData.results.volumes.every(volume => volume.issues.length === 0) && (
                  <div className="p-4 bg-green-50 text-green-800 rounded flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Nenhum problema encontrado em Volumes EBS
                  </div>
                )}
              </div>
            )}
            
            {/* IAM Roles */}
            <SectionHeader 
              title="IAM Roles" 
              count={securityData.summary.iamRoleIssues}
              icon={<Info className="h-5 w-5 text-green-500" />}
              isExpanded={expandedSection === 'iamRoles'}
              onClick={() => toggleSection('iamRoles')}
            />
            
            {expandedSection === 'iamRoles' && (
              <div className="p-4">
                {securityData.results.iamRoles.map(role => (
                  role.issues.length > 0 && (
                    <div key={role.name} className="mb-4 border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                        <div>
                          <span className="font-medium">{role.name}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            {role.instanceProfiles.length} {role.instanceProfiles.length === 1 ? 'instância' : 'instâncias'}
                          </span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {role.issues.length} {role.issues.length === 1 ? 'problema' : 'problemas'}
                        </span>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2">
                          {role.issues.map((issue, issueIndex) => (
                            <li key={issueIndex} className="flex items-start gap-2">
                              {getSeverityIcon(issue.severity)}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{issue.type}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{issue.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                ))}
                {securityData.results.iamRoles.every(role => role.issues.length === 0) && (
                  <div className="p-4 bg-green-50 text-green-800 rounded flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Nenhum problema encontrado em IAM Roles
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Componente para cabeçalhos de seção
interface SectionHeaderProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  isExpanded: boolean;
  onClick: () => void;
}

function SectionHeader({ title, count, icon, isExpanded, onClick }: SectionHeaderProps) {
  return (
    <button
      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon}
        <h2 className="ml-2 text-base font-medium text-gray-900">{title}</h2>
        {count > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
            {count}
          </span>
        )}
      </div>
      <svg
        className={`h-5 w-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  );
} 