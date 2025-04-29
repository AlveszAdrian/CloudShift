import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CloudWatchLogsClient, StartQueryCommand, GetQueryResultsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { prisma } from '@/lib/prisma';
import { DetectionService } from '@/lib/aws/siem/detections';
import { InsightsRule } from '@/types/siem';

export async function POST(req: NextRequest) {
  try {
    console.log('Iniciando execução da query...');
    
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Sessão não autorizada');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Corpo da requisição:', body);
    
    const { query, logGroup, ruleId } = body;
    
    // Variáveis para estatísticas de detecções
    let duplicatesSkipped = 0;
    let successfullySaved = 0;

    if (!query || !logGroup) {
      console.log('Query ou logGroup não fornecidos:', { query, logGroup });
      return NextResponse.json({ error: 'Query and logGroup are required' }, { status: 400 });
    }

    // Obter credenciais AWS do usuário
    console.log('Buscando credenciais AWS do usuário...');
    const credential = await prisma.awsCredential.findFirst({
      where: { userId: session.user.id }
    });

    if (!credential) {
      console.log('Credenciais AWS não encontradas para o usuário');
      return NextResponse.json({ error: 'AWS credentials not found' }, { status: 404 });
    }

    // Validar credenciais
    if (!credential.accessKeyId || !credential.secretKey || !credential.region) {
      console.log('Credenciais AWS inválidas:', credential);
      return NextResponse.json({ error: 'Invalid AWS credentials' }, { status: 400 });
    }

    // Configurar cliente CloudWatch Logs com as credenciais
    console.log('Configurando cliente CloudWatch Logs...');
    const cloudWatchLogs = new CloudWatchLogsClient({
      region: credential.region,
      credentials: {
        accessKeyId: credential.accessKeyId,
        secretAccessKey: credential.secretKey
      }
    });

    console.log('Iniciando consulta:', { logGroup, query });

    // Iniciar consulta
    const startQueryResponse = await cloudWatchLogs.send(new StartQueryCommand({
      logGroupName: logGroup,
      queryString: query,
      startTime: Math.floor(Date.now() / 1000) - (12 * 3600), // Últimas 12 horas
      endTime: Math.floor(Date.now() / 1000)
    }));

    if (!startQueryResponse.queryId) {
      console.log('Falha ao iniciar query:', startQueryResponse);
      throw new Error('Failed to start query');
    }

    console.log('Query iniciada com ID:', startQueryResponse.queryId);

    // Aguardar resultados
    let queryResults: any[] = [];
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      console.log(`Tentativa ${attempts + 1} de obter resultados...`);
      
      const getQueryResultsResponse = await cloudWatchLogs.send(new GetQueryResultsCommand({
        queryId: startQueryResponse.queryId
      }));

      console.log('Status da query:', getQueryResultsResponse.status);
      console.log('Resultados brutos:', getQueryResultsResponse.results);

      if (getQueryResultsResponse.status === 'Complete') {
        // Verificar se temos resultados
        if (!getQueryResultsResponse.results || !Array.isArray(getQueryResultsResponse.results)) {
          console.log('Nenhum resultado encontrado ou formato inválido:', getQueryResultsResponse);
          queryResults = [];
          break;
        }

        try {
          // Processar resultados
          queryResults = getQueryResultsResponse.results.map((row: any[]) => {
            if (!Array.isArray(row)) {
              console.log('Linha inválida:', row);
              return {};
            }
            
            // Converter array de objetos {field, value} em objeto
            const result = row.reduce((acc: Record<string, any>, item) => {
              if (!item || typeof item !== 'object' || !('field' in item) || !('value' in item)) {
                console.log('Item inválido:', item);
                return acc;
              }
              
              // Extrair field e value do item
              const { field, value } = item;
              
              // Remover @ do início dos campos
              const cleanField = field.startsWith('@') ? field.substring(1) : field;
              
              // Tentar converter valores numéricos
              let processedValue = value;
              if (typeof value === 'string') {
                // Tenta converter para número se parecer um número
                if (/^-?\d+(\.\d+)?$/.test(value)) {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue)) {
                    processedValue = numValue;
                  }
                }
                // Tenta converter para booleano
                else if (value.toLowerCase() === 'true') {
                  processedValue = true;
                }
                else if (value.toLowerCase() === 'false') {
                  processedValue = false;
                }
              }
              
              acc[cleanField] = processedValue;
              return acc;
            }, {});
            
            // Garantir que timestamp esteja presente
            if (!result.timestamp) {
              result.timestamp = new Date().toISOString();
            }
            
            // Remover raw para evitar referências circulares e objetos muito grandes
            delete result.raw;
            
            return result;
          });

          console.log('Resultados processados:', queryResults);
          
          // Se temos um ruleId, salvar os resultados como detecções
          if (ruleId) {
            console.log('Salvando resultados como detecções para a regra:', ruleId);
            try {
              // Verificar se a regra existe no banco de dados
              let ruleData = await prisma.insightsRule.findUnique({
                where: { id: ruleId }
              });
              
              // Se a regra não existir, criar temporariamente
              if (!ruleData) {
                console.log(`Regra ${ruleId} não encontrada no banco, criando temporariamente...`);
                
                try {
                  ruleData = await prisma.insightsRule.create({
                    data: {
                      id: ruleId,
                      name: body.name || 'Regra Temporária',
                      query: query,
                      logGroup: logGroup,
                      severity: body.severity || 'medium',
                      description: body.description || 'Regra criada automaticamente',
                      isActive: true,
                      region: credential.region,
                      credentialId: credential.id,
                      triggers: 0
                    }
                  });
                  console.log('Regra criada temporariamente:', ruleData);
                } catch (createError) {
                  console.error('Erro ao criar regra temporária:', createError);
                  // Se não conseguir criar, continua mesmo assim para mostrar resultados
                }
              }
              
              if (ruleData) {
                console.log('Regra encontrada ou criada:', ruleData);
                
                // Converter para o formato necessário para o DetectionService
                const rule: InsightsRule = {
                  id: ruleData.id,
                  name: ruleData.name,
                  query: ruleData.query,
                  logGroup: ruleData.logGroup,
                  severity: ruleData.severity as 'critical' | 'high' | 'medium' | 'low',
                  description: ruleData.description || '',
                  region: ruleData.region || undefined,
                  isActive: ruleData.isActive,
                  createdAt: ruleData.createdAt,
                  updatedAt: ruleData.updatedAt,
                  triggers: ruleData.triggers,
                  lastTriggered: ruleData.lastTriggered || undefined,
                  lastExecuted: ruleData.lastExecuted || undefined,
                  credentialId: ruleData.credentialId
                };
                
                console.log('Número de resultados para salvar:', queryResults.length);
                
                // Garantir que cada resultado tenha os campos necessários
                for (const result of queryResults) {
                  try {
                    console.log('Salvando detecção para resultado:', 
                      Object.keys(result).map(k => `${k}: ${typeof result[k]}`).join(', ')
                    );
                    
                    // Garantir que temos campos mínimos necessários
                    if (!result.message && result.sourceIPAddress) {
                      result.message = `Atividade detectada de IP: ${result.sourceIPAddress}`;
                    } else if (!result.message) {
                      result.message = 'Detecção sem mensagem específica';
                    }
                    
                    // Garantir que fields seja um objeto válido e sem referências circulares
                    const safeFields: Record<string, string> = {};
                    for (const [key, value] of Object.entries(result)) {
                      if (key !== 'timestamp' && key !== 'message' && typeof value !== 'object') {
                        safeFields[key] = String(value);
                      }
                    }
                    
                    // Verificar se já existe detecção similar com os mesmos campos
                    // Criar uma "assinatura" única da detecção baseada no timestamp e campos
                    const detectionTimestamp = new Date(result.timestamp || Date.now());
                    
                    // Criar uma assinatura baseada em campos importantes
                    // Seleciona até 3 campos únicos para comparação (se disponíveis)
                    const signatureFields = Object.entries(safeFields)
                      .filter(([key]) => key !== 'timestamp' && key !== 'message')
                      .slice(0, 3)
                      .map(([key, value]) => `${key}:${value}`)
                      .join('|');
                    
                    console.log('Assinatura para verificação de duplicação:', signatureFields);
                    
                    // Limitar a janela de tempo para verificação (últimos 30 minutos)
                    const timeWindow = new Date(detectionTimestamp.getTime() - 30 * 60 * 1000);
                    
                    // Buscar detecções com a mesma regra e período de tempo próximo
                    const existingDetections = await prisma.detection.findMany({
                      where: {
                        ruleId: rule.id!,
                        timestamp: {
                          gte: timeWindow
                        }
                      },
                      take: 20 // Limitar a busca para evitar sobrecarga
                    });
                    
                    // Verificar se alguma detecção existente tem campos similares
                    const isDuplicate = existingDetections.some(detection => {
                      // Se a mensagem for exatamente igual, considerar duplicata
                      if (detection.message === result.message && result.message) {
                        return true;
                      }
                      
                      // Verificar campos específicos
                      if (detection.fields && typeof detection.fields === 'object') {
                        // Criar assinatura para detecção existente com os mesmos campos usados acima
                        const existingSignature = Object.entries(detection.fields)
                          .filter(([key]) => key !== 'timestamp' && key !== 'message')
                          .slice(0, 3)
                          .map(([key, value]) => `${key}:${value}`)
                          .join('|');
                        
                        // Se a assinatura for similar, considerar duplicata
                        if (signatureFields && existingSignature && 
                            signatureFields === existingSignature) {
                          return true;
                        }
                      }
                      
                      return false;
                    });
                    
                    if (isDuplicate) {
                      console.log('Detecção similar já existe, ignorando');
                      duplicatesSkipped++;
                      continue;
                    }
                    
                    const detectionData = {
                      ruleId: rule.id!,
                      timestamp: detectionTimestamp,
                      message: result.message || '',
                      severity: rule.severity,
                      fields: safeFields,
                      acknowledged: false
                    };
                    
                    console.log('Dados da detecção preparados:', {
                      ruleId: detectionData.ruleId,
                      message: detectionData.message,
                      fieldsKeys: Object.keys(detectionData.fields)
                    });
                    
                    const detection = await prisma.detection.create({
                      data: detectionData
                    });
                    
                    console.log('Detecção criada com sucesso:', detection.id);
                    successfullySaved++;
                    
                    // Atualiza o contador de acionamentos da regra
                    await prisma.insightsRule.update({
                      where: { id: rule.id },
                      data: {
                        triggers: { increment: 1 },
                        lastTriggered: new Date()
                      }
                    });
                  } catch (itemError) {
                    console.error('Erro ao salvar detecção individual:', itemError);
                  }
                }
                console.log(`Processamento de ${queryResults.length} detecções concluído`);
                console.log(`Resumo: ${successfullySaved} detecções salvas, ${duplicatesSkipped} duplicações ignoradas`);
              } else {
                console.log(`Regra ${ruleId} não encontrada no banco de dados`);
              }
            } catch (detectionError) {
              console.error('Erro ao salvar detecções:', detectionError);
              // Continuamos mesmo com erro ao salvar detecções
            }
          }
        } catch (error) {
          console.error('Erro ao processar resultados:', error);
          throw error;
        }
        break;
      }

      if (getQueryResultsResponse.status === 'Failed') {
        console.log('Query falhou:', getQueryResultsResponse);
        throw new Error('Query failed to complete');
      }

      // Aguardar 1 segundo antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.log('Query expirou após', maxAttempts, 'tentativas');
      throw new Error('Query timed out');
    }

    // Atualizar a regra com a última execução
    if (ruleId) {
      try {
        // Verificar se a regra existe
        const ruleExists = await prisma.insightsRule.findUnique({
          where: { id: ruleId }
        });
        
        if (ruleExists) {
          await prisma.insightsRule.update({
            where: { id: ruleId },
            data: { lastExecuted: new Date() }
          });
        } else {
          console.log(`Não foi possível atualizar regra ${ruleId}: regra não encontrada`);
        }
      } catch (updateError) {
        console.error('Erro ao atualizar regra:', updateError);
        // Continuamos mesmo com erro ao atualizar
      }
    }

    // Garantir que todos os resultados são serializáveis para JSON
    const safeResults = queryResults.map(result => {
      // Criar uma versão segura do resultado para retornar ao cliente
      const safeResult: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(result)) {
        if (typeof value !== 'object' || value === null) {
          safeResult[key] = value;
        } else if (value instanceof Date) {
          safeResult[key] = value.toISOString();
        } else {
          try {
            // Se for um objeto, tentamos convertê-lo para string e de volta para garantir que é serializável
            const serialized = JSON.stringify(value);
            safeResult[key] = JSON.parse(serialized);
          } catch (error) {
            // Se não for serializável, convertemos para string
            safeResult[key] = String(value);
          }
        }
      }
      
      return safeResult;
    });

    // Log final antes de retornar
    console.log('Retornando resultados formatados:', {
      count: safeResults.length,
      firstResult: safeResults.length > 0 ? Object.keys(safeResults[0]) : [],
      region: credential.region
    });

    return NextResponse.json({ 
      results: safeResults,
      count: safeResults.length,
      region: credential.region,
      // Incluir estatísticas de detecções na resposta
      detectionStats: ruleId ? {
        duplicatesSkipped,
        saved: successfullySaved
      } : undefined
    });
  } catch (error) {
    console.error('Erro ao executar consulta:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 