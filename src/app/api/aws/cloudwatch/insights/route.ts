import { NextRequest, NextResponse } from 'next/server';
import { CloudWatchInsightsService } from '@/lib/services/cloudwatch-insights-service';
import { getAwsCredentials } from '@/lib/aws/credentials';
import { LogsInsightsQuery } from '@/lib/types';

// Rota para listar consultas predefinidas
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const credentialId = url.searchParams.get('credentialId');
    const queryId = url.searchParams.get('queryId');
    
    if (!credentialId) {
      return NextResponse.json(
        { error: 'Credential ID is required' },
        { status: 400 }
      );
    }
    
    // Obter as credenciais AWS
    const credential = await getAwsCredentials(credentialId);
    if (!credential) {
      return NextResponse.json(
        { error: 'Credential not found' },
        { status: 404 }
      );
    }
    
    const insightsService = new CloudWatchInsightsService(credential);
    
    // Se tiver um queryId, retornar os resultados da consulta
    if (queryId) {
      const results = await insightsService.getQueryResults(queryId);
      return NextResponse.json(results);
    }
    
    // Caso contrário, retornar a lista de consultas predefinidas
    const queries = await insightsService.getStoredQueries();
    return NextResponse.json(queries);
  } catch (error) {
    console.error('Error in CloudWatch Insights API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Rota para executar uma consulta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credentialId, query } = body;
    
    if (!credentialId) {
      return NextResponse.json(
        { error: 'Credential ID is required' },
        { status: 400 }
      );
    }
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Obter as credenciais AWS
    const credential = await getAwsCredentials(credentialId);
    if (!credential) {
      return NextResponse.json(
        { error: 'Credential not found' },
        { status: 404 }
      );
    }
    
    const insightsService = new CloudWatchInsightsService(credential);
    
    // Validar a consulta
    if (!query.logGroups || query.logGroups.length === 0) {
      return NextResponse.json(
        { error: 'At least one log group is required' },
        { status: 400 }
      );
    }
    
    if (!query.queryString) {
      return NextResponse.json(
        { error: 'Query string is required' },
        { status: 400 }
      );
    }
    
    // Configurar valores padrão se não forem fornecidos
    const queryToExecute: LogsInsightsQuery = {
      name: query.name || 'Ad-hoc Query',
      description: query.description || 'Query executed from API',
      logGroups: query.logGroups,
      queryString: query.queryString,
      timeRange: query.timeRange || 24 * 60 * 60 * 1000 // 24 horas por padrão
    };
    
    // Executar a consulta
    const queryId = await insightsService.runQuery(queryToExecute);
    
    if (!queryId) {
      return NextResponse.json(
        { error: 'Failed to start query' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      queryId,
      message: 'Query started successfully' 
    });
  } catch (error) {
    console.error('Error executing CloudWatch Insights query:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Rota para cancelar uma consulta em andamento
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const credentialId = url.searchParams.get('credentialId');
    const queryId = url.searchParams.get('queryId');
    
    if (!credentialId || !queryId) {
      return NextResponse.json(
        { error: 'Credential ID and Query ID are required' },
        { status: 400 }
      );
    }
    
    // Obter as credenciais AWS
    const credential = await getAwsCredentials(credentialId);
    if (!credential) {
      return NextResponse.json(
        { error: 'Credential not found' },
        { status: 404 }
      );
    }
    
    const insightsService = new CloudWatchInsightsService(credential);
    
    // Cancelar a consulta
    const success = await insightsService.stopQuery(queryId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to stop query' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Query stopped successfully' 
    });
  } catch (error) {
    console.error('Error stopping CloudWatch Insights query:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 