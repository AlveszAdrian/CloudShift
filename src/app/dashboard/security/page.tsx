"use client";

import React from 'react';
import { useAlerts } from "@/hooks/useAlerts";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import { 
  Bell, AlertTriangle, AlertCircle, Info, 
  CheckCircle, XCircle, Archive, Shield, 
  Search, Filter, RefreshCw, Trash2 as TrashIcon, 
  User, Key, Lock, Database, Server,
  BarChart as BarChartIcon, PieChart as PieChartIcon,
  ChevronRight, ChevronDown, Eraser,
  Check, Slash, Clock, HardDrive, Cloud,
  FileText, Users, Settings, AlertOctagon,
  X as XMarkIcon, ExternalLink, Loader2 as SpinnerIcon,
  ArrowRight as ArrowRightIcon, 
  RefreshCw as ArrowPathIcon,
  Shield as ShieldExclamationIcon,
  Filter as FunnelIcon,
  Search as MagnifyingGlassIcon,
  Info as InformationCircleIcon,
  AlertTriangle as ExclamationTriangleIcon,
  AlertCircle as ExclamationCircleIcon,
  Database as CircleStackIcon,
  Key as KeyIcon,
  Server as ServerIcon,
  Archive as ArchiveBoxIcon,
  Cog as Cog6ToothIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Settings as AdjustmentsHorizontalIcon,
  Calendar as CalendarIcon
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import CredentialSelector from "@/components/aws/CredentialSelector";
import { AnimatePresence } from 'framer-motion';

// Define Alert type to fix TypeScript errors
type Alert = {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  createdAt: string;
  resourceId: string;
  resourceType: string;
};

// Remove the entire neon styles section
// Replace with more simple vibrant color styles
const colorStyles = `
  /* Vibrant color effects */
  .text-effect-red {
    color: #ef4444;
  }
  .text-effect-orange {
    color: #f97316;
  }
  .text-effect-yellow {
    color: #eab308;
  }
  .text-effect-blue {
    color: #3b82f6;
  }
  .text-effect-violet {
    color: #8b5cf6;
  }
  .text-effect-green {
    color: #22c55e;
  }
  .text-effect-gray {
    color: #9ca3af;
  }
  .text-effect-indigo {
    color: #6366f1;
  }
  .text-effect-cyan {
    color: #06b6d4;
  }

  /* Button hover effects */
  .button-effect-indigo {
    transition: all 0.2s ease;
  }
  .button-effect-indigo:hover {
    background-color: rgba(99, 102, 241, 0.7);
  }
  
  .button-effect-green {
    transition: all 0.2s ease;
  }
  .button-effect-green:hover {
    background-color: rgba(34, 197, 94, 0.7);
  }
  
  .button-effect-gray {
    transition: all 0.2s ease;
  }
  .button-effect-gray:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
  
  /* Destaque para novos alertas */
  @keyframes highlightPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
  
  .highlight-pulse {
    animation: highlightPulse 1.5s ease-in-out 3;
    border: 1px solid rgba(239, 68, 68, 0.7);
    transition: all 0.3s ease;
  }
`;

// Add missing function for status badge colors
const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'OPEN':
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800';
    case 'DISMISSED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Add LineGraph component since it's missing
const LineGraph = ({ data, xKey, yKey, xLabel, yLabel, color }: any) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} label={{ value: xLabel, position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke={color} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default function SecurityPage() {
  const { selectedCredential } = useAwsCredentials();
  const { 
    alerts, 
    loading, 
    error, 
    filters, 
    setFilters, 
    dismissAlert, 
    resolveAlert,
    fetchAlerts
  } = useAlerts();
  
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Ref para controlar o ciclo de scans completos
  const cyclesToFullScan = useRef<number>(10); // Iniciar com 10 ciclos (5 minutos)

  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState<string | null>(null);
  const [showCleanupMessage, setShowCleanupMessage] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [iamScanLoading, setIamScanLoading] = useState(false);
  const [ec2CleanupLoading, setEc2CleanupLoading] = useState(false);
  const [iamScanMessage, setIamScanMessage] = useState<string | null>(null);
  const [showIamScanMessage, setShowIamScanMessage] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all'); // 'all', 'iam', 'ec2', etc.
  const [timeRange, setTimeRange] = useState<string>('week');
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilters, setSeverityFilters] = useState<Record<string, boolean>>({
    'CRITICAL': true,
    'HIGH': true,
    'MEDIUM': true,
    'LOW': true,
    'INFO': true
  });
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    'OPEN': true,
    'IN_PROGRESS': true,
    'RESOLVED': true,
    'DISMISSED': false
  });
  
  // Estado para controlar o modal de detalhes do alerta
  const [alertDetailsModal, setSelectedAlert] = useState<Alert | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Estados para atualização em tempo real
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // segundos
  const [lastAlertId, setLastAlertId] = useState<string | null>(null);
  const [newAlertsCount, setNewAlertsCount] = useState<number>(0);
  const [newAlerts, setNewAlerts] = useState<Alert[]>([]);
  const [highlightedAlerts, setHighlightedAlerts] = useState<string[]>([]);
  
  // Estado para controlar verificações iniciais
  const [initialScanCompleted, setInitialScanCompleted] = useState<boolean>(false);

  // Adicionar um estado para gerenciar os alertas localmente
  const [localAlerts, setLocalAlerts] = useState<Alert[]>([]);

  // Estado para controlar a visibilidade do menu de configuração de auto refresh
  const [showRefreshMenu, setShowRefreshMenu] = useState(false);

  // Estado para controlar o escaneamento de vulnerabilidades
  const [scanning, setScanningUnified] = useState(false);
  
  // Estado para filtrar alertas por severidade
  const [severityFilter, setSeverityFilter] = useState<SeverityType[]>(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
  
  // Função para alternar a exibição do menu de refresh
  const toggleRefreshMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que o clique afete o botão de auto refresh
    setShowRefreshMenu(prev => !prev);
  };
  
  // Função para configurar o intervalo de refresh
  const setRefreshRate = (seconds: number) => {
    setRefreshInterval(seconds);
    setShowRefreshMenu(false);
    // Reiniciar o ciclo com o novo intervalo
    if (autoRefresh) {
      // Feedback visual da alteração
      setCleanupMessage(`Intervalo de atualização alterado para ${seconds} segundos`);
      setShowCleanupMessage(true);
      
      setTimeout(() => {
        setShowCleanupMessage(false);
      }, 3000);
    }
  };

  // Função para alternar o filtro de severidade
  const toggleSeverityFilter = (severity: SeverityType) => {
    if (severityFilter.includes(severity)) {
      setSeverityFilter(severityFilter.filter(s => s !== severity));
    } else {
      setSeverityFilter([...severityFilter, severity]);
    }
  };

  // Fechar o menu quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = () => {
      if (showRefreshMenu) {
        setShowRefreshMenu(false);
      }
    };
    
    // Adicionar o handler apenas quando o menu estiver aberto
    if (showRefreshMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showRefreshMenu]);

  // Atualizar useEffect para sincronizar os alertas da API com os alertas locais
  useEffect(() => {
    // Se não há credencial, limpar alertas
    if (!selectedCredential?.id) {
      setLocalAlerts([]);
      setLastAlertId(null);
      return;
    }
    
    // Substitui completamente os alertas locais com os alertas da API
    // Isso é seguro aqui porque estamos obtendo a lista completa da API
    setLocalAlerts(alerts);
    
    // Se houver alertas, armazena o ID do mais recente
    if (alerts.length > 0 && !lastAlertId) {
      setLastAlertId(alerts[0].id);
    }
  }, [alerts, lastAlertId, selectedCredential]);

  // Função para fechar o modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedAlert(null);
  };

  // Função para abrir o modal com o alerta selecionado
  const openAlertDetails = (alert: Alert) => {
    // Prevenção defensiva - não abrir se não tiver dados
    if (!alert || !alert.id) {
      console.error("Tentativa de abrir modal com alerta inválido:", alert);
      return;
    }
    
    // Definir primeiro o alerta e depois o estado do modal para garantir que os dados estejam prontos
    setSelectedAlert(alert);
    
    // Usar um setTimeout para garantir que o setSelectedAlert seja processado primeiro
    setTimeout(() => {
      setShowModal(true);
      console.log("Modal aberto para alerta:", alert.id); // Log para debugging
    }, 10);
  };

  // Função para fechar o modal com detalhes do alerta
  const handleCloseModal = (e?: React.MouseEvent) => {
    // Se o evento foi passado, impedir a propagação
    if (e) {
      e.stopPropagation();
    }
    
    // Fechar o modal primeiro, depois limpar o alerta selecionado
    setShowModal(false);
    
    // Atrasar a limpeza do alerta selecionado para evitar flashes visuais
    setTimeout(() => {
      setSelectedAlert(null);
    }, 300); // Tempo suficiente para a animação de fechamento
  };

  // Corrigir a função checkForNewAlerts para usar o estado localAlerts e tipar corretamente as variáveis
  const checkForNewAlerts = useCallback(async () => {
    if (!autoRefresh || loading) return;

    // Se não há credencial selecionada, limpar os alertas em vez de tentar buscar
    if (!selectedCredential?.id) {
      // Limpar os alertas quando a credencial é removida
      if (localAlerts.length > 0) {
        setLocalAlerts([]);
        setLastAlertId(null);
        setNewAlertsCount(0);
        setCleanupMessage("Credencial AWS removida. Os alertas foram limpos.");
        setShowCleanupMessage(true);
      }
      return;
    }

    try {
      // Construir a URL com os mesmos filtros que estão sendo usados atualmente
      let url = "/api/alerts";
      const params = new URLSearchParams();
      
      // Adicionar os filtros atuais
      if (activeCategory !== 'all') {
        params.append("resourceType", activeCategory);
      }
      
      // Adicionar o ID da credencial selecionada
      params.append("credentialId", selectedCredential.id);
      
      // Se temos um último alerta conhecido, pegamos apenas os mais recentes que esse
      if (lastAlertId) {
        params.append("after_id", lastAlertId);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao verificar novos alertas");
      }
      
      const data = await response.json();
      
      // Verificar se data.alerts existe para evitar erros de tipo
      if (!data || !Array.isArray(data.alerts)) {
        console.error("Formato inesperado de resposta:", data);
        throw new Error("Formato de resposta inválido");
      }
      
      const freshAlerts: Alert[] = data.alerts;
      
      if (freshAlerts.length > 0) {
        // Armazenar o ID do alerta mais recente
        setLastAlertId(freshAlerts[0].id);
        setNewAlertsCount(prev => prev + freshAlerts.length);
        
        // Adicionar novos alertas no topo da lista, evitando duplicatas
        setLocalAlerts(prev => {
          // Criar um Set com os IDs dos alertas atuais para verificação rápida
          const existingIds = new Set(prev.map(alert => alert.id));
          
          // Filtrar apenas os alertas que não existem na lista atual
          const uniqueNewAlerts = freshAlerts.filter(alert => !existingIds.has(alert.id));
          
          // Retornar a nova lista combinada, sem duplicatas
          return [...uniqueNewAlerts, ...prev];
        });
        
        // Marcar os novos alertas para destacar
        setHighlightedAlerts(freshAlerts.map(alert => alert.id));
        
        // Remover o destaque após 5 segundos
        setTimeout(() => {
          setHighlightedAlerts([]);
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao verificar novos alertas:", error);
      // Não mostrar o erro para o usuário se for devido à credencial ter sido removida
      if (selectedCredential?.id) {
        setCleanupMessage(`Erro ao verificar alertas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        setShowCleanupMessage(true);
      }
    }
  }, [autoRefresh, loading, lastAlertId, activeCategory, selectedCredential, localAlerts.length]);

  // Função modificada para verificar ameaças de EC2 em segundo plano
  const handleScanEC2Threats = async () => {
    if (!selectedCredential) {
      setCleanupMessage("Selecione uma credencial AWS para realizar a verificação");
      setShowCleanupMessage(true);
      return;
    }

    // Mostrar notificação de início do scan em background
    setCleanupMessage("Verificação de EC2 iniciada em segundo plano. Você será notificado quando estiver completa.");
    setShowCleanupMessage(true);
    
    // Definir flag para evitar escaneamentos duplicados
    let scanInProgress = true;
    
    // Função que será executada de forma assíncrona em segundo plano
    const runBackgroundScan = async () => {
      try {
        // Não bloqueamos a UI com setEC2CleanupLoading mais
        // Apenas executamos o scan em background
        const response = await fetch('/api/alerts/ec2/scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            credentialId: selectedCredential.id,
            skipExisting: true // Ignorar alertas já existentes
          })
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao verificar ameaças do EC2');
        }
        
        const result = await response.json();
        
        // Quando o scan terminar, atualizar os alertas sem interromper a UI
        await fetchAlerts();
        
        // Exibir notificação suave com resultado
        setCleanupMessage(`Verificação de EC2 concluída: ${result.alertsCreated} novos alertas encontrados.`);
        setShowCleanupMessage(true);
        
        // Se encontrou novos alertas, mostra highlights
        if (result.alertsCreated > 0) {
          // Apenas recarregar se encontrou novos alertas
          setNewAlertsCount(prev => prev + result.alertsCreated);
          
          // Destacar novos alertas apenas se estiver na categoria EC2
          if (activeCategory === 'ec2' || activeCategory === 'all') {
            // Atualizar a UI delicadamente
            setTimeout(() => {
              // Buscar apenas os novos alertas para adicionar aos atuais sem recarregar tudo
              checkForNewAlerts();
            }, 500);
          }
        }
      } catch (error) {
        console.error("Erro no scan de EC2 em background:", error);
        setCleanupMessage(`Erro na verificação de EC2 em segundo plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        setShowCleanupMessage(true);
      } finally {
        scanInProgress = false;
      }
    };
    
    // Executar o scan em segundo plano
    runBackgroundScan();
  };

  // Modificar a função de verificação IAM para executar em segundo plano
  const performIAMScan = async (skipExisting: boolean = false) => {
    if (!selectedCredential) {
      setIamScanMessage("Selecione uma credencial AWS para realizar a verificação");
      setShowIamScanMessage(true);
      return;
    }

    // Mostrar notificação de início do scan em background
    setIamScanMessage("Verificação de IAM iniciada em segundo plano. Você será notificado quando estiver completa.");
    setShowIamScanMessage(true);
    
    // Definir flag para evitar escaneamentos duplicados
    let scanInProgress = true;
    
    // Função que será executada de forma assíncrona em segundo plano
    const runBackgroundScan = async () => {
      try {
        // Não bloqueamos a UI com setIamScanLoading mais
        // Apenas executamos o scan em background
        const response = await fetch('/api/alerts/iam', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            credentialId: selectedCredential.id,
            skipExisting: skipExisting // Parâmetro para ignorar alertas existentes
          })
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao verificar ameaças do IAM');
        }
        
        const result = await response.json();
        
        // Quando o scan terminar, atualizar os alertas sem interromper a UI
        await fetchAlerts();
        
        // Exibir notificação suave com resultado
        setIamScanMessage(`Verificação de IAM concluída: ${result.alertsCreated} novos alertas encontrados.`);
        setShowIamScanMessage(true);
        
        // Se encontrou novos alertas, mostra highlights
        if (result.alertsCreated > 0) {
          // Apenas recarregar se encontrou novos alertas
          setNewAlertsCount(prev => prev + result.alertsCreated);
          
          // Destacar novos alertas apenas se estiver na categoria IAM
          if (activeCategory === 'iam' || activeCategory === 'all') {
            // Atualizar a UI delicadamente
            setTimeout(() => {
              // Buscar apenas os novos alertas para adicionar aos atuais sem recarregar tudo
              checkForNewAlerts();
            }, 500);
          }
        }
      } catch (error) {
        console.error("Erro no scan de IAM em background:", error);
        setIamScanMessage(`Erro na verificação de IAM em segundo plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        setShowIamScanMessage(true);
      } finally {
        scanInProgress = false;
      }
    };
    
    // Executar o scan em segundo plano
    runBackgroundScan();
  };
  
  // Atualizar a função handleScanIAMThreats para usar a nova função
  const handleScanIAMThreats = async () => {
    await performIAMScan(false); // Sem pular existentes quando acionado manualmente
  };

  // Configurar o intervalo para verificar novos alertas e executar scans periódicos
  useEffect(() => {
    if (!autoRefresh) return;
    
    // Função para realizar um ciclo completo de verificação
    const runCompleteCycle = async () => {
      // Se não há credencial selecionada, limpar alertas e sair
      if (!selectedCredential?.id) {
        // Limpar os alertas quando não há credencial
        if (localAlerts.length > 0) {
          setLocalAlerts([]);
          setLastAlertId(null);
          setNewAlertsCount(0);
        }
        return;
      }
      
      // Primeiro verificar novos alertas (operação leve)
      await checkForNewAlerts();
      
      // A cada 5 minutos (10 ciclos de 30s), executar um scan completo se tivermos uma credencial
      if (selectedCredential?.id) {
        // Usar um contador de ciclos armazenado em uma ref para controlar quando fazer scans completos
        cyclesToFullScan.current -= 1;
        
        // Exibir contagem regressiva quando faltar pouco para o próximo scan
        if (cyclesToFullScan.current <= 3 && cyclesToFullScan.current > 0) {
          console.log(`Próximo scan automático em ${cyclesToFullScan.current * 30} segundos...`);
        }
        
        if (cyclesToFullScan.current <= 0) {
          console.log("Executando scan automático em segundo plano...");
          
          // Executar um scan periódico usando fetch direto em vez de chamar runUnifiedBackgroundScan
          try {
            // Mostrar notificação de início do scan em background
            setCleanupMessage("Verificação automática de segurança iniciada. Você será notificado quando novos alertas forem encontrados.");
            setShowCleanupMessage(true);
            
            const response = await fetch('/api/alerts/scan', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                credentialId: selectedCredential.id,
                skipExisting: true // Pular alertas existentes em scans automáticos
              })
            });
            
            if (!response.ok) {
              throw new Error('Falha na verificação automática');
            }
            
            // Atualizar a mensagem para indicar que o scan foi iniciado com sucesso
            setCleanupMessage("Verificação automática iniciada com sucesso. Monitorando alertas...");
            setShowCleanupMessage(true);
            
            // Configurar verificações periódicas para novos alertas após iniciar o scan
            const scanCheckInterval = setInterval(async () => {
              // Cancelar o intervalo se a credencial for removida
              if (!selectedCredential?.id) {
                clearInterval(scanCheckInterval);
                return;
              }
              
              const previousCount = newAlertsCount;
              await checkForNewAlerts();
              
              // Se encontramos novos alertas, informar o usuário
              if (newAlertsCount > previousCount) {
                setCleanupMessage(`Novos alertas de segurança encontrados (${newAlertsCount - previousCount})! Verificação continua em segundo plano.`);
                setShowCleanupMessage(true);
                
                // Reproduzir um som ou fazer um flash na tela para chamar atenção (opcional)
                // document.getElementById('alert-sound')?.play();
                
                // Destacar a área de novos alertas
                const alertsSection = document.querySelector('.alerts-section');
                if (alertsSection) {
                  alertsSection.classList.add('highlight-pulse');
                  setTimeout(() => {
                    alertsSection.classList.remove('highlight-pulse');
                  }, 3000);
                }
              }
            }, 5000); // Verificar a cada 5 segundos durante 1 minuto
            
            // Limpar o intervalo após um tempo razoável (60 segundos)
            setTimeout(() => {
              clearInterval(scanCheckInterval);
              
              // Não executar se a credencial foi removida
              if (!selectedCredential?.id) return;
              
              // Verificação final
      checkForNewAlerts();
              
              if (newAlertsCount > 0) {
                setCleanupMessage(`Verificação automática concluída. ${newAlertsCount} novos alertas foram encontrados e carregados.`);
              } else {
                setCleanupMessage("Verificação automática concluída. Nenhum novo alerta encontrado.");
              }
              setShowCleanupMessage(true);
              
              // Reiniciar o contador após um scan bem-sucedido
              cyclesToFullScan.current = 10; // 10 ciclos de 30s = 5 minutos
            }, 60000);
            
          } catch (error) {
            console.error("Erro ao executar scan automático:", error);
            
            // Não mostrar o erro para o usuário se for devido à credencial ter sido removida
            if (selectedCredential?.id) {
              setCleanupMessage(`Erro na verificação automática: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
              setShowCleanupMessage(true);
            }
            
            // Ainda reseta o contador, mas com valor menor para tentar novamente mais cedo
            cyclesToFullScan.current = 4; // Tentar novamente em 2 minutos
          }
        }
      }
    };
    
    // Executar imediatamente na primeira vez
    runCompleteCycle();
    
    // Configurar o intervalo
    const intervalId = setInterval(runCompleteCycle, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, checkForNewAlerts, selectedCredential, newAlertsCount, localAlerts.length]);

  // Resetar contador de novos alertas quando o usuário visualiza a página
  const resetNewAlertsCounter = () => {
    setNewAlertsCount(0);
  };

  // Limpar os indicadores de novos alertas quando o usuário interage com a página
  useEffect(() => {
    window.addEventListener('click', resetNewAlertsCounter);
    return () => {
      window.removeEventListener('click', resetNewAlertsCounter);
    };
  }, []);

  // Atualizar manualmente e limpar o contador
  const handleManualRefresh = async () => {
    resetNewAlertsCounter();
    // Limpa o estado anterior para evitar potencial duplicação
    setLocalAlerts([]);
    await fetchAlerts();
    if (alerts.length > 0) {
      setLastAlertId(alerts[0].id);
    }
  };

  // Alternar atualização automática
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  // Modificar a verificação automática ao carregar a página para usar o scan unificado
  useEffect(() => {
    // Carregar alertas existentes primeiro
    const initPage = async () => {
      await fetchAlerts();
      
      // Armazenar o ID do alerta mais recente, se houver
      if (alerts.length > 0) {
        setLastAlertId(alerts[0].id);
      }
      
      // Verificar se já completou a verificação inicial para evitar duplicações
      // E também verificar se há uma credencial válida selecionada
      if (selectedCredential && selectedCredential.id && !initialScanCompleted) {
        // Realizar verificação unificada em segundo plano sem bloquear a UI
        console.log("Agendando verificação unificada inicial em segundo plano...");
        
        // Usamos setTimeout para garantir que a UI seja carregada primeiro
        setTimeout(() => {
          // Iniciar o scan unificado em background
          runUnifiedBackgroundScan(true);
          
          // Marcar que a verificação inicial foi agendada
          setInitialScanCompleted(true);
        }, 1000); // Iniciar após 1 segundo de carregamento da UI
      }
    };
    
    initPage();
  }, [selectedCredential]);

  // Nova função unificada para executar scan em background usando o endpoint unificado
  const runUnifiedBackgroundScan = async (skipExisting: boolean = true) => {
    if (!selectedCredential || !selectedCredential.id) {
      setCleanupMessage("Selecione uma credencial AWS para realizar a verificação");
      setShowCleanupMessage(true);
      return;
    }

    // Mostrar notificação de início do scan em background
    setCleanupMessage("Verificação de segurança unificada iniciada em segundo plano. Você será notificado quando novos alertas forem encontrados.");
    setShowCleanupMessage(true);
    
    try {
      const response = await fetch('/api/alerts/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id,
          skipExisting: skipExisting
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          setCleanupMessage(`Erro de credenciais: ${data.error || 'Credenciais AWS inválidas ou com permissões insuficientes'}`);
          setShowCleanupMessage(true);
          return;
        }
        throw new Error(data.error || 'Erro ao iniciar verificação de segurança unificada');
      }
      
      const result = await response.json();
      console.log("Scan unificado iniciado:", result);
      
      // Configurar um intervalo para verificar novos alertas periodicamente
      // sem precisar esperar pelo término do scan
      const checkInterval = setInterval(async () => {
        const previousCount = newAlertsCount;
        await checkForNewAlerts();
        
        // Se encontramos novos alertas, informar o usuário
        if (newAlertsCount > previousCount) {
          setCleanupMessage(`Novos alertas de segurança encontrados (${newAlertsCount - previousCount}). A verificação continua em segundo plano.`);
          setShowCleanupMessage(true);
        }
      }, 5000); // Verificar a cada 5 segundos
      
      // Limpar o intervalo após um tempo razoável (2 minutos)
      setTimeout(() => {
        clearInterval(checkInterval);
        // Verificação final
        checkForNewAlerts();
        setCleanupMessage("Verificação de segurança concluída. Todos os novos alertas foram carregados.");
        setShowCleanupMessage(true);
      }, 120000);
      
    } catch (error) {
      console.error("Erro ao iniciar scan unificado:", error);
      setCleanupMessage(`Erro ao iniciar verificação unificada: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setShowCleanupMessage(true);
    }
  };

  // Função para determinar a categoria de um alerta com base no tipo de recurso
  const getAlertCategory = (resourceType: string): string => {
    if (resourceType.startsWith('IAM') || resourceType === 'SecretManagerSecret') {
      return 'iam';
    } else if (resourceType.startsWith('EC2') || resourceType === 'SecurityGroup' || 
              resourceType === 'Volume' || resourceType === 'VPC' || 
              resourceType.includes('Gateway') || resourceType === 'Subnet' || 
              resourceType === 'RouteTable' || resourceType === 'NetworkInterface' || 
              resourceType === 'ElasticIP' || resourceType === 'NetworkACL' ||
              resourceType.includes('ACL')) {
      return 'ec2';
    } else if (resourceType.startsWith('S3') || resourceType.includes('Bucket')) {
      return 's3';
    } else if (resourceType.startsWith('RDS') || resourceType.startsWith('DB') || 
               resourceType.includes('Database')) {
      return 'rds';
    } else if (resourceType.startsWith('DynamoDB') || resourceType.includes('DynamoDB')) {
      return 'dynamodb';
    } else if (resourceType.startsWith('Lambda')) {
      return 'lambda';
    }
    
    // Log tipos desconhecidos para depuração
    console.log('Tipo de recurso não categorizado:', resourceType);
    return 'other';
  };

  // Set initial category from URL parameter
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  // Effect to show notification messages when they're set
  useEffect(() => {
    if (cleanupMessage) setShowCleanupMessage(true);
    if (iamScanMessage) setShowIamScanMessage(true);
  }, [cleanupMessage, iamScanMessage]);

  // Effect to load alerts when component mounts
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const activeAlerts = alerts.filter(a => a.status === 'active' || a.status === 'OPEN');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'CRITICAL');
  const highAlerts = activeAlerts.filter(a => a.severity === 'HIGH');
  const mediumAlerts = activeAlerts.filter(a => a.severity === 'MEDIUM');
  const lowAlerts = activeAlerts.filter(a => a.severity === 'LOW');

  // Função auxiliar para remover duplicatas de alertas com base no ID
  const removeDuplicateAlerts = useCallback((alertsList: Alert[]): Alert[] => {
    const uniqueAlerts = new Map<string, Alert>();
    
    // Usa um Map para garantir que cada ID aparece apenas uma vez
    // Se houver duplicatas, a última ocorrência será mantida
    alertsList.forEach(alert => {
      uniqueAlerts.set(alert.id, alert);
    });
    
    return Array.from(uniqueAlerts.values());
  }, []);

  // Usar localAlerts em vez de alerts na renderização da lista
  const filteredAlerts = useMemo(() => {
    // Primeiro remove quaisquer duplicatas que possam existir
    const uniqueAlerts = removeDuplicateAlerts(localAlerts);
    
    // Em seguida, aplica os filtros
    return uniqueAlerts.filter(alert => {
    // Filter by category
    if (activeCategory !== 'all' && getAlertCategory(alert.resourceType) !== activeCategory) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !alert.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !alert.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !alert.resourceId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !alert.resourceType.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by severity
    if (!severityFilters[alert.severity as keyof typeof severityFilters]) {
      return false;
    }
    
    // Filter by status (normalize 'active' to 'OPEN' for consistency)
    const normalizedStatus = alert.status === 'active' ? 'OPEN' : alert.status;
    
    if (!statusFilters[normalizedStatus as keyof typeof statusFilters]) {
      return false;
    }
    
    return true;
  });
  }, [localAlerts, activeCategory, searchTerm, severityFilters, statusFilters, removeDuplicateAlerts]);

  const handleDismiss = async (id: string) => {
    setActionLoading(id);
    await dismissAlert(id);
    setActionLoading(null);
  };

  const handleResolve = async (id: string) => {
    setActionLoading(id);
    await resolveAlert(id);
    setActionLoading(null);
  };

  const handleRefresh = async () => {
    await handleManualRefresh();
  };

  const handleCleanupDuplicates = async () => {
    if (window.confirm("Deseja remover todos os alertas duplicados? Esta ação não pode ser desfeita.")) {
      try {
        setCleanupLoading(true);
        setCleanupMessage(null);
        
        const response = await fetch('/api/alerts/cleanup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao limpar alertas duplicados');
        }
        
        const result = await response.json();
        setCleanupMessage(result.message);
        setShowCleanupMessage(true);
        
        // Recarregar alertas em vez de recarregar a página inteira
        await fetchAlerts();
      } catch (error) {
        setCleanupMessage(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        setShowCleanupMessage(true);
      } finally {
        setCleanupLoading(false);
      }
    }
  };
  
  // Função para limpar alertas de EC2
  const handleCleanupEC2Alerts = async () => {
    const confirmCleanup = window.confirm("Esta ação removerá todos os alertas de EC2 da plataforma. Deseja continuar?");
    
    if (!confirmCleanup) return;
    
    setEc2CleanupLoading(true);
    setCleanupMessage(null);
    
    try {
      const response = await fetch("/api/alerts/ec2/cleanup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        setCleanupMessage(result.message);
        setShowCleanupMessage(true);
        handleRefresh();
      } else {
        const errorData = await response.json();
        setCleanupMessage(`Erro ao limpar alertas de EC2: ${errorData.error || "Erro desconhecido"}`);
        setShowCleanupMessage(true);
      }
    } catch (error: any) {
      console.error("Erro ao limpar alertas de EC2:", error);
      setCleanupMessage("Erro ao limpar alertas de EC2: " + (error.message || "Erro desconhecido"));
      setShowCleanupMessage(true);
    } finally {
      setEc2CleanupLoading(false);
    }
  };

  // Função para formatar o tipo de recurso para exibição
  const formatResourceType = (resourceType: string): string => {
    // Identificar o prefixo do serviço
    let prefix = '';
    let name = resourceType;
    
    if (resourceType.startsWith('IAM')) {
      prefix = 'IAM';
      name = resourceType.substring(3);
    } else if (resourceType.startsWith('EC2')) {
      prefix = 'EC2';
      name = resourceType.substring(3);
    } else if (resourceType.startsWith('S3')) {
      prefix = 'S3';
      name = resourceType.substring(2);
    } else if (resourceType.startsWith('RDS')) {
      prefix = 'RDS';
      name = resourceType.substring(3);
    } else if (resourceType.startsWith('DB')) {
      prefix = 'DB';
      name = resourceType.substring(2);
    } else if (resourceType.startsWith('DynamoDB')) {
      prefix = 'DynamoDB';
      name = resourceType.substring(8);
    } else if (resourceType.startsWith('Lambda')) {
      prefix = 'Lambda';
      name = resourceType.substring(6);
    }
    
    // Se o nome começar com letra maiúscula e não tiver espaço, 
    // adiciona um espaço antes de cada letra maiúscula (exceto a primeira)
    if (name.length > 0 && /^[A-Z]/.test(name) && !name.includes(' ')) {
      name = name.replace(/([A-Z])/g, ' $1').trim();
    }
    
    return prefix ? `${prefix}-${name}` : resourceType;
  };

  // Função para formatar o tipo de recurso para texto legível
  const getResourceTypeText = (resourceType: string): string => {
    switch (resourceType) {
      case 'AccessKey':
        return 'Chave de Acesso';
      case 'IAMPolicy':
        return 'Política IAM';
      case 'IAMRole':
        return 'Função IAM';
      case 'IAMUser':
        return 'Usuário IAM';
      case 'SecretManager':
        return 'Secret Manager';
      case 'EC2Instance':
        return 'Instância EC2';
      case 'SecurityGroup':
        return 'Grupo de Segurança';
      case 'VPC':
        return 'VPC';
      case 'NetworkACL':
        return 'ACL de Rede';
      case 'ELB':
        return 'Load Balancer';
      case 'ENI':
        return 'Interface de Rede';
      case 'S3Bucket':
        return 'Bucket S3';
      case 'S3Object':
        return 'Objeto S3';
      case 'RDSInstance':
        return 'Instância RDS';
      case 'DBSecurityGroup':
        return 'Grupo de Segurança BD';
      default:
        return formatResourceType(resourceType);
    }
  };

  // Helper functions for severity and status
  type SeverityType = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  type StatusType = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      'CRITICAL': 'Crítico',
      'HIGH': 'Alto',
      'MEDIUM': 'Médio',
      'LOW': 'Baixo',
      'INFO': 'Informativo'
    };
    return labels[severity] || severity;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'OPEN': 'Aberto',
      'IN_PROGRESS': 'Em Progresso',
      'RESOLVED': 'Resolvido',
      'DISMISSED': 'Ignorado'
    };
    return labels[status] || status;
  };

  // Funções de manipulação de UI
  const handleResetFilters = () => {
    setSeverityFilters({
      'CRITICAL': true,
      'HIGH': true,
      'MEDIUM': true,
      'LOW': true,
      'INFO': true
    });
    
    setStatusFilters({
      'OPEN': true,
      'IN_PROGRESS': true,
      'RESOLVED': false,
      'DISMISSED': false
    });
    
    setTimeRange('week');
    setSearchTerm('');
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Funções para obter cores e cabeçalhos baseados na severidade
  function getSeverityHeaderColor(severity: string): string {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-600';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-blue-500';
      case 'INFO':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  // Funções para obter recomendações de mitigação baseadas no tipo de alerta
  function getMitigationRecommendation(alert: Alert): string {
    const resourceType = alert.resourceType;
    
    if (['AccessKey', 'IAMPolicy', 'IAMRole', 'IAMUser', 'SecretManager'].includes(resourceType)) {
      return 'Este alerta está relacionado a vulnerabilidades de identidade e acesso na AWS. Recomendamos uma revisão das permissões e políticas para garantir que estejam alinhadas com o princípio de privilégio mínimo.';
    } else if (['EC2Instance', 'SecurityGroup', 'VPC', 'NetworkACL', 'ELB', 'ENI'].includes(resourceType)) {
      return 'Este alerta está relacionado a configurações de rede e computação que podem expor seus recursos a riscos de segurança. Recomendamos revisar e ajustar as configurações de acordo com as melhores práticas.';
    } else if (['S3Bucket', 'S3Object'].includes(resourceType)) {
      return 'Este alerta está relacionado a vulnerabilidades de armazenamento S3 que podem resultar em exposição de dados. Verifique as permissões de acesso e a configuração de criptografia para proteger seus dados.';
    } else if (['RDSInstance', 'DBSecurityGroup'].includes(resourceType)) {
      return 'Este alerta está relacionado a configurações de banco de dados que podem comprometer a segurança de seus dados. Recomendamos revisar as configurações de segurança e acesso ao banco de dados.';
    } else {
      return 'Este alerta indica uma possível vulnerabilidade de segurança em seu ambiente AWS. Recomendamos revisar a configuração do recurso afetado e aplicar as melhores práticas de segurança.';
    }
  }

  // Função para obter passos de mitigação específicos baseados no alerta
  function getMitigationSteps(alert: Alert): string[] {
    const resourceType = alert.resourceType;
    
    if (['AccessKey', 'IAMUser'].includes(resourceType)) {
      return [
        'Revise as políticas de IAM anexadas ao usuário ou à chave de acesso',
        'Verifique se o princípio de privilégio mínimo está sendo aplicado',
        'Considere implementar a rotação automática de credenciais',
        'Ative a autenticação multifator (MFA) para usuários com acesso ao console',
        'Monitore regularmente atividades suspeitas usando o AWS CloudTrail'
      ];
    } else if (['IAMPolicy', 'IAMRole'].includes(resourceType)) {
      return [
        'Revise as políticas para remover permissões excessivas ou desnecessárias',
        'Implemente condições nas políticas para restringir o acesso por IP, hora ou outros fatores',
        'Considere usar políticas gerenciadas pela AWS quando apropriado',
        'Implemente análise regular de permissões não utilizadas',
        'Configure o AWS Access Analyzer para identificar recursos compartilhados externamente'
      ];
    } else if (['EC2Instance', 'SecurityGroup'].includes(resourceType)) {
      return [
        'Revise as regras de grupos de segurança para garantir que apenas as portas necessárias estejam abertas',
        'Implemente o princípio de menor privilégio para as regras de entrada e saída',
        'Configure o registro e monitoramento de atividades suspeitas',
        'Mantenha as imagens do sistema operacional atualizadas',
        'Considere implementar um host bastion para acessar instâncias privadas'
      ];
    } else if (['S3Bucket', 'S3Object'].includes(resourceType)) {
      return [
        'Desative o acesso público aos buckets S3 quando não necessário',
        'Implemente políticas de bucket restritivas',
        'Ative a criptografia em repouso para todos os objetos',
        'Configure o registro de acesso ao bucket',
        'Implemente o versionamento para proteger contra exclusão acidental'
      ];
    } else if (['RDSInstance', 'DBSecurityGroup'].includes(resourceType)) {
      return [
        'Garanta que as instâncias de banco de dados não sejam publicamente acessíveis',
        'Implemente grupos de segurança restritivos para controlar o acesso',
        'Ative a criptografia para dados em repouso e em trânsito',
        'Configure backups automatizados e retenção adequada',
        'Implemente a autenticação IAM para MySQL e PostgreSQL quando possível'
      ];
    } else {
      return [
        'Revise a configuração do recurso de acordo com as melhores práticas de segurança da AWS',
        'Implemente o princípio de menor privilégio para controle de acesso',
        'Configure o monitoramento e alertas para atividades suspeitas',
        'Documente e atualize regularmente seus procedimentos de segurança',
        'Realize revisões periódicas de segurança de sua infraestrutura'
      ];
    }
  }

  // Função para obter link de documentação baseado no tipo de alerta
  function getDocumentationLink(alert: Alert): string {
    const resourceType = alert.resourceType;
    
    if (['AccessKey', 'IAMPolicy', 'IAMRole', 'IAMUser', 'SecretManager'].includes(resourceType)) {
      return 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html';
    } else if (['EC2Instance', 'SecurityGroup', 'VPC', 'NetworkACL', 'ELB', 'ENI'].includes(resourceType)) {
      return 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security.html';
    } else if (['S3Bucket', 'S3Object'].includes(resourceType)) {
      return 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html';
    } else if (['RDSInstance', 'DBSecurityGroup'].includes(resourceType)) {
      return 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.Security.html';
    } else {
      return 'https://aws.amazon.com/security/security-resources/';
    }
  }

  // Função para formatar a data para exibição
  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  }

  // Função para obter dados de alertas por data para o gráfico de tendência
  function getAlertsByDate(alerts: Alert[]): { date: string; count: number }[] {
    const dateMap = new Map<string, number>();
    
    // Agrupar alertas por data (dia)
    alerts.forEach(alert => {
      const date = new Date(alert.createdAt);
      const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
      
      if (dateMap.has(dateKey)) {
        dateMap.set(dateKey, dateMap.get(dateKey)! + 1);
      } else {
        dateMap.set(dateKey, 1);
      }
    });
    
    // Ordenar por data
    const sortedEntries = Array.from(dateMap.entries()).sort((a, b) => {
      return new Date(a[0]).getTime() - new Date(b[0]).getTime();
    });
    
    // Limitar para os últimos 30 dias se houver muitos dados
    const limitedEntries = sortedEntries.length > 30 
      ? sortedEntries.slice(sortedEntries.length - 30) 
      : sortedEntries;
    
    // Formatar para o gráfico
    return limitedEntries.map(([date, count]) => {
      return {
        date: new Date(date).toLocaleDateString('pt-BR'),
        count
      };
    });
  }

  // Função para limpar TODOS os alertas (nova funcionalidade)
  const handleCleanupAllAlerts = async () => {
    if (window.confirm("Esta ação removerá TODOS os alertas do sistema. Esta operação não pode ser desfeita. Deseja continuar?")) {
      try {
        setCleanupLoading(true);
        setCleanupMessage(null);
        
        const response = await fetch('/api/alerts/cleanup/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao limpar todos os alertas');
        }
        
        const result = await response.json();
        setCleanupMessage(result.message);
        setShowCleanupMessage(true);
        
        // Recarregar alertas em vez de recarregar a página inteira
        await fetchAlerts();
      } catch (error) {
        setCleanupMessage(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        setShowCleanupMessage(true);
      } finally {
        setCleanupLoading(false);
      }
    }
  };

  // Efeito para garantir que o modal permaneça aberto quando os alertas mudam
  useEffect(() => {
    if (showModal && alertDetailsModal) {
      // Se o alerta selecionado não estiver mais presente nos alertas, podemos buscar novamente
      const alertStillExists = alerts.some(a => a.id === alertDetailsModal.id);
      
      if (!alertStillExists) {
        // Opção 1: Manter o modal aberto mesmo assim
        console.log("Alerta no modal não encontrado mais na lista, mas mantendo aberto");
        
        // Opção 2 (alternativa): Fechar o modal se o alerta não existir mais
        // console.log("Alerta no modal não encontrado mais na lista, fechando modal");
        // handleCloseModal();
      }
    }
  }, [alerts, showModal, alertDetailsModal]);

  return (
    <div className="container px-2 py-4 mx-auto max-w-full h-screen flex flex-col">
      {/* Mensagem de limpeza flutuante */}
      <AnimatePresence>
        {showCleanupMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center"
            style={{ maxWidth: '90vw' }}
          >
            <InformationCircleIcon className="h-5 w-5 mr-2 text-indigo-400" />
            <span>{cleanupMessage}</span>
            <button 
              onClick={() => setShowCleanupMessage(false)} 
              className="ml-3 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
        
      {/* Mensagem de scan IAM */}
      <AnimatePresence>
        {showIamScanMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-900 text-yellow-200 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center"
            style={{ maxWidth: '90vw' }}
          >
            <InformationCircleIcon className="h-5 w-5 mr-2 text-yellow-400" />
            <span>{iamScanMessage}</span>
            <button 
              onClick={() => setShowIamScanMessage(false)} 
              className="ml-3 text-yellow-400 hover:text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cabeçalho da página com título e ações */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              Análise de Segurança AWS
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monitore vulnerabilidades e configurações de segurança em sua infraestrutura
            </p>
          </div>
          
          {/* Botões de ação agrupados à direita */}
          <div className="flex space-x-2">
            {/* Botão de Auto-Refresh com indicador de status */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAutoRefresh}
                className={`px-3 py-2 rounded-lg shadow-sm flex items-center font-medium text-sm transition-colors duration-200 ${
                  autoRefresh 
                    ? 'bg-green-700/80 dark:bg-green-900/50 text-green-50 dark:text-green-300 hover:bg-green-600 dark:hover:bg-green-900/70' 
                    : 'bg-gray-200 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/70'
                  }`}
              >
                <Clock className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-pulse' : ''}`} />
                {autoRefresh ? `Auto (${refreshInterval}s)` : 'Auto Off'}
                {autoRefresh && (
                  <span className="ml-2 relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
                <span className="w-5"></span>
              </motion.button>
              
              <div 
                onClick={toggleRefreshMenu}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-black/20 transition-colors cursor-pointer"
              >
                <Settings className="h-3 w-3 text-current opacity-70" />
              </div>
              
              {showRefreshMenu && (
                <div className="absolute right-0 top-10 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 border border-gray-200 dark:border-gray-700">
                  <div className="p-2">
                    <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Intervalo de Atualização</h4>
                    <div className="space-y-1">
                      {[15, 30, 60, 120, 300].map((seconds) => (
                        <button
                          key={seconds}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded-md ${
                            refreshInterval === seconds
                              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                          onClick={() => setRefreshRate(seconds)}
                        >
                          {seconds < 60 ? `${seconds} segundos` : `${seconds / 60} ${seconds === 60 ? 'minuto' : 'minutos'}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Botão para escanear vulnerabilidades */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => runUnifiedBackgroundScan(true)}
              className="bg-indigo-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200 flex items-center font-medium text-sm"
              disabled={scanning}
            >
              {scanning ? (
                <>
                  <SpinnerIcon className="animate-spin h-4 w-4 mr-2" />
                  Escaneando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Escanear Vulnerabilidades
                </>
              )}
            </motion.button>
            
            {/* Botão para limpar duplicatas */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCleanupDuplicates}
              className="bg-amber-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-amber-700 transition-colors duration-200 flex items-center font-medium text-sm"
              disabled={cleanupLoading}
            >
              {cleanupLoading ? (
                <>
                  <SpinnerIcon className="animate-spin h-4 w-4 mr-2" />
                  Limpando...
                </>
              ) : (
                <>
                  <Eraser className="h-4 w-4 mr-2" />
                  Limpar Duplicados
                </>
              )}
            </motion.button>
            
            {/* Botão para limpar TODOS os alertas */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCleanupAllAlerts}
              className="bg-pink-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-pink-700 transition-colors duration-200 flex items-center font-medium text-sm"
              disabled={cleanupLoading}
            >
              {cleanupLoading ? (
                <>
                  <SpinnerIcon className="animate-spin h-4 w-4 mr-2" />
                  Limpando...
                </>
              ) : (
                <>
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Limpar Alertas
                </>
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Mensagem de erro/aviso quando não há credenciais selecionadas */}
        {!selectedCredential?.id ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-30 rounded-lg p-3 mt-3 mx-auto"
          >
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium mb-1">Nenhuma credencial AWS selecionada</h3>
                <p className="text-xs">
                  Para visualizar os alertas de segurança, selecione uma credencial AWS válida no menu superior.
                </p>
                <div className="mt-2">
                  <Link href="/dashboard/credentials" className="inline-flex items-center px-3 py-1 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-md text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-700 transition-colors">
                    <KeyIcon className="h-3 w-3 mr-1" />
                    Gerenciar Credenciais
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
        
        {/* Filtros */}
        <div className="mt-3">
          <button
            onClick={handleToggleFilters}
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtros
            {showFilters ? (
              <ChevronDown className="h-4 w-4 ml-1 transform rotate-180" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
          
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 mb-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Filtro de Severidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Severidade
                  </label>
                  <div className="space-y-1">
                    {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
                      <div key={sev} className="flex items-center">
                        <input
                          id={`filter-severity-${sev}`}
                          type="checkbox"
                          checked={severityFilter.includes(sev as SeverityType)}
                          onChange={() => toggleSeverityFilter(sev as SeverityType)}
                          className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor={`filter-severity-${sev}`} className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                          {getSeverityLabel(sev)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Filtro de Período */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Período
                  </label>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input
                        id="filter-date-week"
                        type="radio"
                        checked={timeRange === 'week'}
                        onChange={() => setTimeRange('week')}
                        className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor="filter-date-week" className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                        Últimos 7 dias
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="filter-date-month"
                        type="radio"
                        checked={timeRange === 'month'}
                        onChange={() => setTimeRange('month')}
                        className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor="filter-date-month" className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                        Últimos 30 dias
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Pesquisa */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Pesquisar alertas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="mt-1 flex justify-end">
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-indigo-500 hover:text-indigo-700"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Conteúdo Principal - flexível para ocupar espaço restante */}
      <div className="flex-grow flex flex-col min-h-0">
        {loading ? (
          <div className="flex justify-center items-center flex-grow">
            <div className="text-center">
              <SpinnerIcon className="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Carregando alertas de segurança...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            <p className="font-bold">Erro ao carregar alertas</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col flex-grow min-h-0">
            {/* Resumo de Alertas */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-100 dark:border-gray-600 flex items-center">
                <div className="bg-gray-200 dark:bg-gray-600 p-1.5 rounded-lg mr-2">
                  <AlertOctagon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{alerts.length}</p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-800/50 flex items-center">
                <div className="bg-red-200 dark:bg-red-800/50 p-1.5 rounded-lg mr-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-red-600 dark:text-red-400">Críticos</p>
                  <p className="text-lg font-bold text-red-700 dark:text-red-300">{alerts.filter(a => a.severity === 'CRITICAL').length}</p>
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-100 dark:border-orange-800/50 flex items-center">
                <div className="bg-orange-200 dark:bg-orange-800/50 p-1.5 rounded-lg mr-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-orange-600 dark:text-orange-400">Altos</p>
                  <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{alerts.filter(a => a.severity === 'HIGH').length}</p>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-100 dark:border-yellow-800/50 flex items-center">
                <div className="bg-yellow-200 dark:bg-yellow-800/50 p-1.5 rounded-lg mr-2">
                  <AlertOctagon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">Médios</p>
                  <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{alerts.filter(a => a.severity === 'MEDIUM').length}</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800/50 flex items-center">
                <div className="bg-blue-200 dark:bg-blue-800/50 p-1.5 rounded-lg mr-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Baixos</p>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{alerts.filter(a => a.severity === 'LOW').length}</p>
                </div>
              </div>
            </div>
            
            {/* Lista de Alertas - flex-grow para ocupar o espaço restante */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 flex-grow flex flex-col min-h-0">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Alertas de Segurança</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {filteredAlerts.length} 
                    {filteredAlerts.length === 1 ? ' alerta encontrado' : ' alertas encontrados'}
                    {autoRefresh && (
                      <span className="ml-2 text-indigo-500 dark:text-indigo-400">
                        • Atualização automática ativa
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center flex-grow flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhum alerta encontrado</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      {!selectedCredential?.id
                        ? "Selecione uma credencial AWS válida para visualizar os alertas de segurança."
                        : "Não foram encontrados alertas com os filtros atuais. Tente ajustar os filtros ou realizar uma nova verificação de segurança."}
                    </p>
                    {selectedCredential?.id && (
                      <button
                        onClick={handleRefresh}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Atualizar Alertas
                      </button>
                    )}
                  </motion.div>
                </div>
              ) : (
                <div className="overflow-auto flex-grow">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Severidade
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Título
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Recurso
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Detectado em
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredAlerts.map((alert) => (
                        <motion.tr 
                          key={alert.id} 
                          initial={highlightedAlerts.includes(alert.id) ? { backgroundColor: '#4f46e533' } : {}}
                          animate={{ backgroundColor: 'transparent' }}
                          transition={{ duration: 2.5 }}
                          onClick={() => handleOpenModal(alert)}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                              alert.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                              alert.severity === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                              alert.severity === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                              alert.severity === 'LOW' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                            }`}>
                              {getSeverityLabel(alert.severity)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate max-w-xs">
                              {alert.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {alert.description.length > 80 
                                ? `${alert.description.slice(0, 80)}...` 
                                : alert.description}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {formatResourceType(alert.resourceType)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {alert.resourceId?.length > 15 
                                ? `${alert.resourceId.slice(0, 15)}...` 
                                : alert.resourceId}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(alert.createdAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(alert.status)}`}>
                              {getStatusLabel(alert.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDismiss(alert.id);
                                }}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                title="Descartar"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResolve(alert.id);
                                }}
                                className="text-green-500 hover:text-green-600 dark:hover:text-green-400"
                                title="Marcar como resolvido"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalhes do alerta */}
      {showModal && alertDetailsModal && (
        <div
          className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => handleCloseModal()} // Fechar apenas ao clicar no fundo
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Impedir que cliques dentro do modal propaguem
          >
            {/* Cabeçalho com cor baseada na severidade */}
            <div className={`px-4 py-4 sm:px-6 ${getSeverityHeaderColor(alertDetailsModal.severity)}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {alertDetailsModal.title}
                </h3>
                <button
                  type="button"
                  className="bg-transparent rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={(e) => handleCloseModal(e)}
                >
                  <span className="sr-only">Fechar</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Corpo com os detalhes */}
            <div className="px-4 py-5 sm:p-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {/* Badges de severidade e status */}
              <div className="col-span-2 flex flex-wrap gap-2 mb-4">
                <span
                  className={`inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    alertDetailsModal.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                    alertDetailsModal.severity === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                    alertDetailsModal.severity === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                    alertDetailsModal.severity === 'LOW' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {getSeverityLabel(alertDetailsModal.severity)}
                </span>

                <span
                  className={`inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeColor(alertDetailsModal.status)}`}
                >
                  {getStatusLabel(alertDetailsModal.status)}
                </span>
              </div>

              {/* Tipo de recurso */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tipo de recurso</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{formatResourceType(alertDetailsModal.resourceType)}</p>
              </div>

              {/* ID do recurso */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID do recurso</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 overflow-ellipsis overflow-hidden">{alertDetailsModal.resourceId}</p>
              </div>

              {/* Data de detecção */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Detectado em</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{formatDate(alertDetailsModal.createdAt)}</p>
              </div>

              {/* Descrição - ocupa toda a largura */}
              <div className="col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Descrição</p>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{alertDetailsModal.description}</p>
              </div>

              {/* Recomendação - ocupa toda a largura */}
              <div className="col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Recomendação</p>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{getMitigationRecommendation(alertDetailsModal)}</p>
              </div>

              {/* Passos para mitigação - ocupa toda a largura */}
              <div className="col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Passos para mitigação</p>
                <ul className="mt-1 space-y-2">
                  {getMitigationSteps(alertDetailsModal).map((step, index) => (
                    <li key={index} className="text-sm text-gray-900 dark:text-white flex items-start">
                      <span className="mr-2 text-sm text-indigo-600 dark:text-indigo-400">•</span> {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Link para documentação - se existir */}
              {getDocumentationLink(alertDetailsModal) && (
                <div className="col-span-2 mt-2">
                  <a
                    href={getDocumentationLink(alertDetailsModal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ver documentação de referência
                  </a>
                </div>
              )}
            </div>

            {/* Rodapé com botões de ação - Modificados para evitar fechamento acidental */}
            <div className="px-4 py-4 sm:px-6 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                onClick={(e) => {
                  e.stopPropagation(); // Impedir propagação
                  handleResolve(alertDetailsModal.id);
                  setTimeout(() => handleCloseModal(), 300); // Atrasar fechamento para feedback visual
                }}
              >
                <Check className="h-4 w-4 mr-1" /> Marcar como resolvido
              </button>
              <button
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                onClick={(e) => {
                  e.stopPropagation(); // Impedir propagação
                  handleDismiss(alertDetailsModal.id);
                  setTimeout(() => handleCloseModal(), 300); // Atrasar fechamento para feedback visual
                }}
              >
                <Slash className="h-4 w-4 mr-1" /> Descartar alerta
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}