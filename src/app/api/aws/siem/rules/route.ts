import { NextRequest, NextResponse } from 'next/server';
import { CloudWatchLogsClient, DescribeLogGroupsCommand, PutMetricFilterCommand, DeleteMetricFilterCommand, DescribeMetricFiltersCommand } from '@aws-sdk/client-cloudwatch-logs';
import { v4 as uuidv4 } from 'uuid';
import { getAwsCredentials } from '@/lib/aws/credentials';
import { prisma } from '@/lib/prisma';

// Interface para as regras SIEM
interface SIEMRule {
  id?: string;
  name: string;
  description: string;
  type: string;
  query: string;
  severity: string;
  status: string;
  createdAt?: Date;
  triggers?: number;
  lastTriggered?: Date | null;
  credentialId: string;
}

// GET - Listar todas as regras SIEM para uma credencial
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get('credentialId');
    
    if (!credentialId) {
      return NextResponse.json({ error: 'ID da credencial AWS é obrigatório' }, { status: 400 });
    }

    // Buscar as regras no banco de dados
    const rules = await prisma.siemRule.findMany({
      where: {
        credentialId: credentialId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Buscar as regras direto do CloudWatch também para verificar estado atual
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

    // Verificar se o CloudWatch está disponível na conta
    try {
      // Tentar buscar grupos de logs disponíveis como teste de conectividade
      const testCommand = new DescribeLogGroupsCommand({
        limit: 1
      });

      const testResponse = await cloudWatchLogsClient.send(testCommand);
      
      // Se não conseguir executar o comando, o CloudWatch não está disponível
      if (!testResponse) {
        return NextResponse.json({ 
          error: 'CloudWatch não está disponível nesta conta AWS',
          rules: rules.map(rule => ({ ...rule, active: false }))
        }, { status: 206 });
      }
    } catch (cloudwatchError) {
      console.error('Erro ao verificar disponibilidade do CloudWatch:', cloudwatchError);
      return NextResponse.json({ 
        error: 'CloudWatch não está disponível ou credenciais não têm permissão para acessá-lo',
        rules: rules.map(rule => ({ ...rule, active: false }))
      }, { status: 206 });
    }

    // Buscar os filtros de métrica existentes (essencialmente regras no CloudWatch)
    const describeMetricFiltersCommand = new DescribeMetricFiltersCommand({
      limit: 50  // Reduzido para 50 conforme limitação da AWS
    });

    const metricFiltersResponse = await cloudWatchLogsClient.send(describeMetricFiltersCommand);
    const cloudWatchRules = metricFiltersResponse.metricFilters || [];
    
    // Atualizar o status das regras com base nos filtros de métrica encontrados
    const updatedRules = rules.map(rule => {
      // Verificar se a regra existe no CloudWatch como um filtro de métrica
      const existsInCloudWatch = cloudWatchRules.some(
        filter => filter.filterName && filter.filterName.includes(rule.id)
      );
      
      return {
        ...rule,
        active: existsInCloudWatch,
      };
    });

    return NextResponse.json(updatedRules);
  } catch (error) {
    console.error('Erro ao listar regras SIEM:', error);
    return NextResponse.json(
      { error: `Falha ao buscar regras SIEM: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// POST - Criar uma nova regra SIEM
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credentialId, rule } = body;
    
    if (!credentialId) {
      return NextResponse.json({ error: 'ID da credencial AWS é obrigatório' }, { status: 400 });
    }

    if (!rule || !rule.name || !rule.query || !rule.severity || !rule.type) {
      return NextResponse.json({ error: 'Dados da regra incompletos' }, { status: 400 });
    }

    // Buscar a credencial para acessar o CloudWatch
    const credential = await getAwsCredentials(credentialId);
    
    if (!credential) {
      return NextResponse.json({ error: 'Credencial AWS não encontrada' }, { status: 404 });
    }

    // Gerar um ID único para a regra
    const ruleId = uuidv4();
    
    // Criar a regra no banco de dados
    const newRule = await prisma.siemRule.create({
      data: {
        id: ruleId,
        name: rule.name,
        description: rule.description,
        type: rule.type,
        query: rule.query,
        severity: rule.severity,
        status: rule.status || 'active',
        triggers: 0,
        credentialId: credentialId,
      },
    });

    // Se a regra está ativa, criar o filtro de métrica no CloudWatch
    if (newRule.status === 'active') {
      // Criar cliente CloudWatch Logs
      const cloudWatchLogsClient = new CloudWatchLogsClient({
        region: credential.region,
        credentials: {
          accessKeyId: credential.accessKeyId,
          secretAccessKey: credential.secretKey
        }
      });

      // Primeiro, verificar quais grupos de log existem
      const describeLogGroupsCommand = new DescribeLogGroupsCommand({
        limit: 50
      });

      const logGroupsResponse = await cloudWatchLogsClient.send(describeLogGroupsCommand);
      const logGroups = logGroupsResponse.logGroups || [];
      
      if (logGroups.length === 0) {
        return NextResponse.json({ 
          error: 'Nenhum grupo de logs encontrado no CloudWatch',
          rule: newRule
        }, { status: 206 }); // Partial Content - regra criada mas sem grupos de log
      }

      // Selecionar o grupo de log para aplicar o filtro (pode ser customizado)
      const targetLogGroup = logGroups[0].logGroupName;
      
      // Criar o filtro de métrica com base na regra
      const filterName = `siem-rule-${ruleId}`;
      const metricName = `SIEMRule_${ruleId.substring(0, 8)}`;
      
      const putMetricFilterCommand = new PutMetricFilterCommand({
        filterName: filterName,
        filterPattern: rule.query,
        logGroupName: targetLogGroup,
        metricTransformations: [{
          metricName: metricName,
          metricNamespace: 'SIEM/Rules',
          metricValue: '1',
          defaultValue: 0,
        }],
      });

      await cloudWatchLogsClient.send(putMetricFilterCommand);
    }

    return NextResponse.json(newRule);
  } catch (error) {
    console.error('Erro ao criar regra SIEM:', error);
    return NextResponse.json(
      { error: `Falha ao criar regra SIEM: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 