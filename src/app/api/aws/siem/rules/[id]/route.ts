import { NextRequest, NextResponse } from 'next/server';
import { CloudWatchLogsClient, DeleteMetricFilterCommand, DescribeMetricFiltersCommand, PutMetricFilterCommand, DescribeLogGroupsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { getAwsCredentials } from '@/lib/aws/credentials';
import { prisma } from '@/lib/prisma';

// GET - Obter uma regra SIEM específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Buscar a regra no banco de dados
    const rule = await prisma.siemRule.findUnique({
      where: {
        id,
      },
    });

    if (!rule) {
      return NextResponse.json({ error: 'Regra SIEM não encontrada' }, { status: 404 });
    }

    return NextResponse.json(rule);
  } catch (error) {
    console.error('Erro ao buscar regra SIEM:', error);
    return NextResponse.json(
      { error: `Falha ao buscar regra SIEM: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// PUT - Atualizar uma regra SIEM existente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { credentialId, rule } = body;

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

    // Atualizar a regra no banco de dados
    const updatedRule = await prisma.siemRule.update({
      where: {
        id,
      },
      data: {
        name: rule.name,
        description: rule.description,
        type: rule.type,
        query: rule.query,
        severity: rule.severity,
        status: rule.status,
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

    // Primeiro, verificar quais grupos de log existem
    const describeMetricFiltersCommand = new DescribeMetricFiltersCommand({
      filterNamePrefix: `siem-rule-${id}`,
    });

    const metricFiltersResponse = await cloudWatchLogsClient.send(describeMetricFiltersCommand);
    const metricFilters = metricFiltersResponse.metricFilters || [];

    // Verificar se a regra está ativa ou não para determinar a ação
    if (updatedRule.status === 'active') {
      // Se a regra está ativa, devemos criar ou atualizar o filtro
      // Criar o filtro de métrica com base na regra atualizada
      const filterName = `siem-rule-${id}`;
      const metricName = `SIEMRule_${id.substring(0, 8)}`;

      // Se já existir um filtro, precisamos excluí-lo primeiro
      if (metricFilters.length > 0 && metricFilters[0].logGroupName) {
        const deleteMetricFilterCommand = new DeleteMetricFilterCommand({
          filterName: filterName,
          logGroupName: metricFilters[0].logGroupName,
        });

        await cloudWatchLogsClient.send(deleteMetricFilterCommand);
      }

      // Agora, criar o novo filtro de métrica com os dados atualizados
      // Primeiro precisamos de um grupo de logs para aplicar
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
    } else if (updatedRule.status === 'inactive' && metricFilters.length > 0 && metricFilters[0].logGroupName) {
      // Se a regra foi desativada, remover o filtro se existir
      const deleteMetricFilterCommand = new DeleteMetricFilterCommand({
        filterName: `siem-rule-${id}`,
        logGroupName: metricFilters[0].logGroupName,
      });

      await cloudWatchLogsClient.send(deleteMetricFilterCommand);
    }

    return NextResponse.json(updatedRule);
  } catch (error) {
    console.error('Erro ao atualizar regra SIEM:', error);
    return NextResponse.json(
      { error: `Falha ao atualizar regra SIEM: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// DELETE - Excluir uma regra SIEM
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { credentialId } = body;

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

    // Excluir a regra do banco de dados
    await prisma.siemRule.delete({
      where: {
        id,
      },
    });

    // Criar cliente CloudWatch Logs para remover o filtro de métrica
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

    // Se o filtro existir, removê-lo
    if (metricFilters.length > 0 && metricFilters[0].logGroupName) {
      const deleteMetricFilterCommand = new DeleteMetricFilterCommand({
        filterName: `siem-rule-${id}`,
        logGroupName: metricFilters[0].logGroupName,
      });

      await cloudWatchLogsClient.send(deleteMetricFilterCommand);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir regra SIEM:', error);
    return NextResponse.json(
      { error: `Falha ao excluir regra SIEM: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 