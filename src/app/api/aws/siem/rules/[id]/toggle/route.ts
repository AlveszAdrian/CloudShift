import { NextRequest, NextResponse } from 'next/server';
import { CloudWatchLogsClient, DeleteMetricFilterCommand, DescribeMetricFiltersCommand, PutMetricFilterCommand, DescribeLogGroupsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { getAwsCredentials } from '@/lib/aws/credentials';
import { prisma } from '@/lib/prisma';

// POST - Alternar o status de uma regra SIEM (ativar/desativar)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { credentialId, enabled } = body;

    if (!credentialId) {
      return NextResponse.json({ error: 'ID da credencial AWS é obrigatório' }, { status: 400 });
    }

    // Buscar a regra existente para verificar se existe
    const existingRule = await prisma.siemRule.findUnique({
      where: {
        id,
      },
    });

    if (!existingRule) {
      return NextResponse.json({ error: 'Regra SIEM não encontrada' }, { status: 404 });
    }

    // Buscar a credencial para acessar o CloudWatch
    const credential = await getAwsCredentials(credentialId);
    
    if (!credential) {
      return NextResponse.json({ error: 'Credencial AWS não encontrada' }, { status: 404 });
    }

    // Atualizar o status da regra no banco de dados
    const status = enabled ? 'active' : 'inactive';
    const updatedRule = await prisma.siemRule.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    // Criar cliente CloudWatch Logs
    const cloudWatchLogsClient = new CloudWatchLogsClient({
      region: credential.region,
      credentials: {
        accessKeyId: credential.accessKeyId,
        secretAccessKey: credential.secretKey
      }
    });

    // Buscar os filtros de métrica existentes com o prefixo da regra
    const describeMetricFiltersCommand = new DescribeMetricFiltersCommand({
      filterNamePrefix: `siem-rule-${id}`,
    });

    const metricFiltersResponse = await cloudWatchLogsClient.send(describeMetricFiltersCommand);
    const metricFilters = metricFiltersResponse.metricFilters || [];

    if (enabled) {
      // Se a regra foi ativada, precisamos criar o filtro de métrica no CloudWatch
      // Primeiro, precisamos verificar se existe um grupo de logs para aplicar o filtro
      const describeLogGroupsCommand = new DescribeLogGroupsCommand({
        limit: 1,
      });

      const logGroupsResponse = await cloudWatchLogsClient.send(describeLogGroupsCommand);
      const logGroups = logGroupsResponse.logGroups || [];

      if (logGroups.length === 0 || !logGroups[0].logGroupName) {
        return NextResponse.json({ 
          error: 'Nenhum grupo de logs encontrado no CloudWatch',
          rule: updatedRule
        }, { status: 206 }); // Partial Content - regra atualizada mas sem grupos de log
      }

      const targetLogGroup = logGroups[0].logGroupName;
      const filterName = `siem-rule-${id}`;
      const metricName = `SIEMRule_${id.substring(0, 8)}`;

      // Criar o filtro de métrica com base na regra
      const putMetricFilterCommand = new PutMetricFilterCommand({
        filterName: filterName,
        filterPattern: existingRule.query,
        logGroupName: targetLogGroup,
        metricTransformations: [{
          metricName: metricName,
          metricNamespace: 'SIEM/Rules',
          metricValue: '1',
          defaultValue: 0,
        }],
      });

      // Log para debug
      console.log(`Tentando aplicar filtro: "${existingRule.query}" para regra ${id}`);

      await cloudWatchLogsClient.send(putMetricFilterCommand);
    } else if (!enabled && metricFilters.length > 0 && metricFilters[0].logGroupName) {
      // Se a regra foi desativada, remover o filtro se existir
      const deleteMetricFilterCommand = new DeleteMetricFilterCommand({
        filterName: `siem-rule-${id}`,
        logGroupName: metricFilters[0].logGroupName,
      });

      await cloudWatchLogsClient.send(deleteMetricFilterCommand);
    }

    return NextResponse.json(updatedRule);
  } catch (error) {
    console.error('Erro ao alternar status da regra SIEM:', error);
    return NextResponse.json(
      { error: `Falha ao alternar status da regra SIEM: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 