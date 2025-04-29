import { CloudWatchLogsClient, StartQueryCommand, GetQueryResultsCommand, DescribeLogGroupsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { InsightsQueryResult } from '@/types/siem';

interface AwsCredential {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

export class InsightsService {
  private client: CloudWatchLogsClient;
  private baseUrl: string;

  constructor(credential: AwsCredential) {
    if (!credential.region || !credential.accessKeyId || !credential.secretAccessKey) {
      throw new Error('Credenciais AWS inválidas');
    }

    this.client = new CloudWatchLogsClient({
      region: credential.region,
      credentials: {
        accessKeyId: credential.accessKeyId,
        secretAccessKey: credential.secretAccessKey,
        sessionToken: credential.sessionToken
      }
    });

    this.baseUrl = '/api/aws/siem/insights';
  }

  async startQuery(query: string, logGroups: string[], startTime: number, endTime: number): Promise<string> {
    const command = new StartQueryCommand({
      queryString: query,
      logGroupNames: logGroups,
      startTime,
      endTime,
    });

    const response = await this.client.send(command);
    return response.queryId!;
  }

  async getQueryResults(queryId: string): Promise<InsightsQueryResult[]> {
    const command = new GetQueryResultsCommand({
      queryId,
    });

    const response = await this.client.send(command);
    
    if (!response.results) {
      return [];
    }

    return response.results.map(result => {
      const fields: Record<string, string> = {};
      result.forEach(field => {
        if (field.field && field.value) {
          fields[field.field] = field.value;
        }
      });

      return {
        timestamp: fields['@timestamp'] || new Date().toISOString(),
        message: fields['@message'] || '',
        fields,
        raw: result
      };
    });
  }

  async getLogGroups(): Promise<string[]> {
    const command = new DescribeLogGroupsCommand({});
    const response = await this.client.send(command);
    
    if (!response.logGroups) {
      return [];
    }

    return response.logGroups
      .map(group => group.logGroupName)
      .filter((name): name is string => name !== undefined);
  }

  async executeQuery(query: string, logGroups: string[], timeRange: number): Promise<InsightsQueryResult[]> {
    const endTime = Date.now();
    const startTime = endTime - timeRange;

    const queryId = await this.startQuery(query, logGroups, startTime, endTime);
    
    // Aguardar um pouco para os resultados estarem disponíveis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return this.getQueryResults(queryId);
  }

  async executeInsightsQuery(params: {
    query: string;
    logGroup: string;
  }): Promise<InsightsQueryResult[]> {
    try {
      console.log('Executando query de insights:', params);
      
      if (!params.query || !params.logGroup) {
        throw new Error('Query e logGroup são obrigatórios');
      }

      const response = await fetch(`${this.baseUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na execução da query:', errorData);
        throw new Error(errorData.error || 'Failed to execute insights query');
      }

      const data = await response.json();
      console.log('Resultados da query:', data);
      
      return data.results || [];
    } catch (error) {
      console.error('Erro ao executar query de insights:', error);
      throw error;
    }
  }
}

export async function executeInsightsQuery({
  query,
  logGroup
}: {
  query: string;
  logGroup: string;
}): Promise<InsightsQueryResult[]> {
  try {
    if (!query || !logGroup) {
      throw new Error('Query e logGroup são obrigatórios');
    }

    const response = await fetch('/api/aws/siem/insights/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        logGroup
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao executar consulta');
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erro ao executar consulta:', error);
    throw error;
  }
} 