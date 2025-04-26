import { NextRequest, NextResponse } from 'next/server';
import { CloudWatchLogsClient, FilterLogEventsCommand, StartQueryCommand, GetQueryResultsCommand, DescribeLogGroupsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { CloudWatchClient, GetMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { getAwsCredentials } from '@/lib/aws/credentials';
import { prisma } from '@/lib/prisma';

// Interface para os parâmetros de consulta
interface QueryParams {
  credentialId: string;
  timeRange?: string;
  sources?: string[];
  severities?: string[];
  status?: string[];
  searchTerm?: string;
  limit?: number;
  page?: number;
}

// GET - Obter eventos SIEM do CloudWatch
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get('credentialId');
    
    if (!credentialId) {
      return NextResponse.json({ error: 'ID da credencial AWS é obrigatório' }, { status: 400 });
    }

    // Extrair parâmetros de consulta
    const queryParams: QueryParams = {
      credentialId,
      timeRange: searchParams.get('timeRange') || '24h',
      sources: searchParams.get('sources')?.split(',') || [],
      severities: searchParams.get('severities')?.split(',') || [],
      status: searchParams.get('status')?.split(',') || [],
      searchTerm: searchParams.get('searchTerm') || '',
      limit: parseInt(searchParams.get('limit') || '50'),
      page: parseInt(searchParams.get('page') || '1'),
    };

    // Buscar credencial AWS
    const credential = await getAwsCredentials(credentialId);
    
    if (!credential) {
      return NextResponse.json({ error: 'Credencial AWS não encontrada' }, { status: 404 });
    }

    // Criar cliente CloudWatch Logs
    const cloudWatchLogsClient = new CloudWatchLogsClient({
      region: credential.region,
      credentials: {
        accessKeyId: credential.accessKeyId,
        secretAccessKey: credential.secretKey
      }
    });

    // Criar cliente CloudWatch para métricas
    const cloudWatchClient = new CloudWatchClient({
      region: credential.region,
      credentials: {
        accessKeyId: credential.accessKeyId,
        secretAccessKey: credential.secretKey
      }
    });

    // Verificar se o CloudWatch está disponível na conta
    try {
      // Tentar buscar grupos de logs disponíveis como teste de conectividade
      const describeLogGroupsCommand = new DescribeLogGroupsCommand({
        limit: 1
      });

      const logGroupsResponse = await cloudWatchLogsClient.send(describeLogGroupsCommand);
      
      // Se não conseguir executar o comando, o CloudWatch não está disponível
      if (!logGroupsResponse) {
        return NextResponse.json({ 
          events: [],
          total: 0,
          error: 'CloudWatch não está disponível nesta conta AWS'
        }, { status: 400 });
      }
    } catch (cloudwatchError) {
      console.error('Erro ao verificar disponibilidade do CloudWatch:', cloudwatchError);
      return NextResponse.json({ 
        events: [],
        total: 0,
        error: 'CloudWatch não está disponível ou credenciais não têm permissão para acessá-lo'
      }, { status: 400 });
    }

    // Buscar regras SIEM ativas para este credencial
    const rules = await prisma.siemRule.findMany({
      where: {
        credentialId,
        status: 'active',
      },
    });

    // Buscar grupos de logs disponíveis
    const describeLogGroupsCommand = new DescribeLogGroupsCommand({
      limit: 50  // Ajustar conforme necessário
    });

    const logGroupsResponse = await cloudWatchLogsClient.send(describeLogGroupsCommand);
    const logGroups = logGroupsResponse.logGroups || [];
    
    if (logGroups.length === 0) {
      return NextResponse.json({ 
        events: [],
        total: 0,
        error: 'Nenhum grupo de logs encontrado no CloudWatch'
      }, { status: 206 });
    }

    // Construir consulta CloudWatch Logs Insights com base nas regras e filtros
    let queryString = '';
    
    // Incluir filtros baseados nas regras SIEM
    if (rules.length > 0) {
      const rulePatterns = rules.map(rule => `(${rule.query})`).join(' OR ');
      queryString = `filter ${rulePatterns}`;
    } else {
      // Se não houver regras, usa filtros básicos para eventos de segurança
      queryString = 'filter @message like /error|warn|fail|denied|unauthorized|Exception/';
    }
    
    // Adicionar filtro por termo de pesquisa
    if (queryParams.searchTerm) {
      queryString += ` | filter @message like /${queryParams.searchTerm}/i`;
    }
    
    // Adicionar filtro por severidade
    if (queryParams.severities && queryParams.severities.length > 0) {
      const severityFilter = queryParams.severities
        .map(sev => sev.toLowerCase())
        .map(sev => `@message like /${sev}/i`)
        .join(' OR ');
      
      if (severityFilter) {
        queryString += ` | filter ${severityFilter}`;
      }
    }
    
    // Adicionar ordenação e campos a serem exibidos
    queryString += ` | sort @timestamp desc | limit ${queryParams.limit}`;

    // Determinar o intervalo de tempo para a consulta
    const endTime = new Date();
    let startTime = new Date();
    
    switch (queryParams.timeRange) {
      case '1h':
        startTime.setHours(startTime.getHours() - 1);
        break;
      case '6h':
        startTime.setHours(startTime.getHours() - 6);
        break;
      case '24h':
        startTime.setDate(startTime.getDate() - 1);
        break;
      case '7d':
        startTime.setDate(startTime.getDate() - 7);
        break;
      case '30d':
        startTime.setDate(startTime.getDate() - 30);
        break;
      default:
        startTime.setDate(startTime.getDate() - 1); // Padrão: 24h
    }

    // Selecionar grupos de log para consultar
    // Por padrão, consultamos todos os grupos de log disponíveis
    const targetLogGroups = logGroups.slice(0, 5).map(lg => lg.logGroupName).filter(Boolean) as string[];
    
    // Iniciar consulta CloudWatch Logs Insights
    const startQueryCommand = new StartQueryCommand({
      startTime: Math.floor(startTime.getTime() / 1000),
      endTime: Math.floor(endTime.getTime() / 1000),
      queryString,
      logGroupNames: targetLogGroups,
    });

    const startQueryResponse = await cloudWatchLogsClient.send(startQueryCommand);
    const queryId = startQueryResponse.queryId;
    
    if (!queryId) {
      return NextResponse.json({ 
        events: [],
        total: 0,
        error: 'Falha ao iniciar consulta CloudWatch Logs Insights'
      }, { status: 500 });
    }

    // Aguardar resultados da consulta (com limite de tempo)
    let queryStatus = 'Running';
    let queryResults;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (queryStatus === 'Running' && attempts < maxAttempts) {
      // Pequena pausa para dar tempo ao CloudWatch processar a consulta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const getResultsCommand = new GetQueryResultsCommand({
        queryId,
      });
      
      const getResultsResponse = await cloudWatchLogsClient.send(getResultsCommand);
      queryStatus = getResultsResponse.status || 'Running';
      
      if (queryStatus === 'Complete') {
        queryResults = getResultsResponse.results;
        break;
      }
      
      attempts++;
    }
    
    // Se não obtivermos resultados, tentamos uma abordagem diferente com FilterLogEvents
    if (!queryResults || queryResults.length === 0) {
      // Vamos tentar filtrar eventos diretamente
      const events = await Promise.all(
        targetLogGroups.slice(0, 2).map(async (logGroupName) => {
          try {
            const filterCommand = new FilterLogEventsCommand({
              logGroupName,
              startTime: startTime.getTime(),
              endTime: endTime.getTime(),
              limit: queryParams.limit,
              filterPattern: queryParams.searchTerm || 'ERROR WARNING CRITICAL',
            });
            
            const response = await cloudWatchLogsClient.send(filterCommand);
            return response.events || [];
          } catch (err) {
            console.error(`Erro ao filtrar eventos para ${logGroupName}:`, err);
            return [];
          }
        })
      );

      // Combinar eventos de todos os grupos de log e transformá-los no formato esperado
      const flatEvents = events.flat().map(event => {
        // Analisar a mensagem para determinar a severidade
        const message = event.message || '';
        const severity = determineSeverity(message);
        
        // Identificar a fonte (grupo de log)
        const source = event.logStreamName || 'unknown';
        
        // Criar ID único
        const id = event.eventId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Verificar qual regra SIEM corresponde a este evento
        const matchingRule = findMatchingRule(message, rules);
        
        return {
          id,
          timestamp: new Date(event.timestamp || Date.now()).toISOString(),
          source,
          eventType: matchingRule ? 'rule_match' : 'log_event',
          severity,
          status: 'NEW',
          message,
          rawData: event,
          region: credential.region,
          accountId: credential.accessKeyId.substring(0, 8) || 'unknown',
          resource: extractResource(message),
          ruleName: matchingRule?.name,
          ruleId: matchingRule?.id,
        };
      });

      return NextResponse.json({
        events: flatEvents,
        total: flatEvents.length,
        logGroups: targetLogGroups,
      });
    }

    // Transformar resultados da consulta em objetos de evento SIEM
    const events = queryResults.map(result => {
      // Extrair valores dos campos nos resultados
      const getValue = (fieldName: string) => {
        const field = result.find(field => field.field === fieldName);
        return field?.value || '';
      };
      
      const timestamp = getValue('@timestamp');
      const message = getValue('@message');
      
      // Determinar a severidade com base no conteúdo da mensagem
      const severity = determineSeverity(message);
      
      // Identificar a fonte do log
      const source = getValue('@logStream') || 'unknown';
      
      // Criar ID único
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Verificar qual regra SIEM corresponde a este evento
      const matchingRule = findMatchingRule(message, rules);
      
      return {
        id,
        timestamp: new Date(timestamp).toISOString(),
        source,
        eventType: matchingRule ? 'rule_match' : 'log_event',
        severity,
        status: 'NEW',
        message,
        rawData: result,
        region: credential.region,
        accountId: credential.accessKeyId.substring(0, 8) || 'unknown',
        resource: extractResource(message),
        ruleName: matchingRule?.name,
        ruleId: matchingRule?.id,
      };
    });

    return NextResponse.json({
      events,
      total: events.length,
      logGroups: targetLogGroups,
    });
  } catch (error) {
    console.error('Erro ao buscar eventos SIEM:', error);
    return NextResponse.json(
      { error: `Falha ao buscar eventos SIEM: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// Função para determinar a severidade com base no conteúdo da mensagem
function determineSeverity(message: string): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('critical') || lowerMessage.includes('fatal') || lowerMessage.includes('emergency')) {
    return 'CRITICAL';
  }
  
  if (lowerMessage.includes('error') || lowerMessage.includes('exception') || lowerMessage.includes('fail') || lowerMessage.includes('denied')) {
    return 'HIGH';
  }
  
  if (lowerMessage.includes('warn') || lowerMessage.includes('warning')) {
    return 'MEDIUM';
  }
  
  if (lowerMessage.includes('notice') || lowerMessage.includes('info')) {
    return 'LOW';
  }
  
  return 'INFO';
}

// Função para extrair informações sobre o recurso da mensagem
function extractResource(message: string): string {
  // Tentativa de identificar recursos AWS comuns na mensagem (EC2, S3, etc.)
  const resourcePatterns = [
    { pattern: /i-[a-f0-9]{8,}/, type: 'EC2' },
    { pattern: /arn:aws:[a-z0-9-]+:[a-z0-9-]+:\d+:.+/, type: 'ARN' },
    { pattern: /[a-z0-9][a-z0-9-]{1,61}[a-z0-9]\.s3\./, type: 'S3' },
    { pattern: /[a-z0-9-]+\.execute-api\./, type: 'API Gateway' }
  ];
  
  for (const { pattern, type } of resourcePatterns) {
    const match = message.match(pattern);
    if (match) {
      return `${type}: ${match[0]}`;
    }
  }
  
  return 'unknown';
}

// Função para encontrar a regra que corresponde à mensagem de log
function findMatchingRule(message: string, rules: any[]): any | null {
  // Implementação simples: verifica se algum padrão da regra está presente na mensagem
  for (const rule of rules) {
    // Simplificação: remove operadores CloudWatch Logs e utiliza termos como strings simples
    const query = rule.query
      .replace(/filter/g, '')
      .replace(/\|/g, '')
      .replace(/like/g, '')
      .replace(/=/g, '')
      .replace(/AND/g, '')
      .replace(/OR/g, '')
      .replace(/"/g, '')
      .replace(/'/g, '');
    
    // Dividir em termos e verificar se algum deles está presente na mensagem
    const terms = query.split(/\s+/).filter((term: string) => term.trim().length > 3);
    
    for (const term of terms) {
      if (message.toLowerCase().includes(term.toLowerCase())) {
        return rule;
      }
    }
  }
  
  return null;
} 