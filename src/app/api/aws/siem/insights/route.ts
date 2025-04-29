import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CloudWatchLogsClient, StartQueryCommand, GetQueryResultsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { getAwsCredentials } from '@/lib/aws/credentials';
import { prisma } from '@/lib/prisma';

// Endpoint para listar regras
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const credentialId = searchParams.get('credentialId');

    // Se tiver ID, busca uma regra específica
    if (id) {
      const rule = await prisma.insightsRule.findUnique({
        where: { id }
      });
      
      if (!rule) {
        return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
      }
      
      // Busca também o total de detecções para esta regra
      const detectionsCount = await prisma.detection.count({
        where: { ruleId: id }
      });
      
      return NextResponse.json({
        ...rule,
        detectionsCount
      });
    }

    // Busca todas as regras, opcionalmente filtrando por credentialId
    const where = credentialId ? { credentialId } : {};
    
    const rules = await prisma.insightsRule.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    // Para cada regra, busca o número de detecções
    const rulesWithCounts = await Promise.all(
      rules.map(async (rule) => {
        const detectionsCount = await prisma.detection.count({
          where: { ruleId: rule.id }
        });
        
        return {
          ...rule,
          detectionsCount
        };
      })
    );

    return NextResponse.json(rulesWithCounts);
  } catch (error) {
    console.error('Error fetching rules:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Endpoint para criar regras
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Dados recebidos:', data);

    // Validação dos campos obrigatórios
    const requiredFields = ['name', 'query', 'logGroup', 'severity', 'credentialId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Campos obrigatórios faltando:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` }, 
        { status: 400 }
      );
    }

    // Validação do tipo de severidade
    const validSeverities = ['critical', 'high', 'medium', 'low'];
    if (!validSeverities.includes(data.severity)) {
      console.error('Severidade inválida:', data.severity);
      return NextResponse.json(
        { error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}` },
        { status: 400 }
      );
    }

    // Verificar se a credencial existe
    const credential = await prisma.awsCredential.findUnique({
      where: { id: data.credentialId }
    });

    if (!credential) {
      return NextResponse.json({ error: 'AWS credential not found' }, { status: 404 });
    }

    // Criar a regra no banco de dados
    const rule = await prisma.insightsRule.create({
      data: {
        name: data.name,
        query: data.query,
        logGroup: data.logGroup,
        severity: data.severity,
        description: data.description || '',
        isActive: data.isActive ?? true,
        region: data.region || credential.region,
        credentialId: data.credentialId,
        triggers: 0 // Inicializa com zero disparos
      }
    });

    console.log('Regra salva com sucesso:', rule);

    return NextResponse.json(rule);
  } catch (error) {
    console.error('Erro detalhado ao salvar regra:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Endpoint para executar consultas
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { credentialId, query, logGroup, ruleId } = await req.json();

    if (!credentialId) {
      return NextResponse.json({ error: 'AWS credential ID is required' }, { status: 400 });
    }

    if (!query || !logGroup) {
      return NextResponse.json({ error: 'Query and logGroup are required' }, { status: 400 });
    }

    // Obter credenciais AWS
    const credentials = await getAwsCredentials(credentialId);
    if (!credentials) {
      return NextResponse.json({ error: 'AWS credentials not found' }, { status: 404 });
    }

    // Se fornecido um ruleId, atualiza o lastExecuted da regra
    if (ruleId) {
      try {
        await prisma.insightsRule.update({
          where: { id: ruleId },
          data: { lastExecuted: new Date() }
        });
        console.log(`Atualizado lastExecuted para regra ${ruleId}`);
      } catch (updateError) {
        console.error('Erro ao atualizar regra:', updateError);
        // Continuamos mesmo com erro ao atualizar
      }
    }

    // Configurar cliente CloudWatch Logs com as credenciais
    const cloudWatchLogs = new CloudWatchLogsClient({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretKey
      }
    });

    console.log('Iniciando consulta:', { logGroup, query });

    // Iniciar consulta
    const startQueryResponse = await cloudWatchLogs.send(new StartQueryCommand({
      logGroupName: logGroup,
      queryString: query,
      startTime: Math.floor(Date.now() / 1000) - 3600, // Última hora
      endTime: Math.floor(Date.now() / 1000)
    }));

    if (!startQueryResponse.queryId) {
      throw new Error('Failed to start query');
    }

    console.log('Query iniciada com ID:', startQueryResponse.queryId);

    // Aguardar resultados
    let queryResults;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const getQueryResultsResponse = await cloudWatchLogs.send(new GetQueryResultsCommand({
        queryId: startQueryResponse.queryId
      }));

      if (getQueryResultsResponse.status === 'Complete') {
        queryResults = getQueryResultsResponse.results;
        break;
      }

      if (getQueryResultsResponse.status === 'Failed') {
        throw new Error('Query failed to complete');
      }

      // Aguardar 1 segundo antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!queryResults) {
      throw new Error('Query timed out');
    }

    return NextResponse.json({ results: queryResults });
  } catch (error) {
    console.error('Erro ao executar consulta:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Endpoint para deletar regras
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    // Deletar a regra do banco de dados
    await prisma.insightsRule.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 