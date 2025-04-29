import AWS from 'aws-sdk';
import { AwsCredential, LogsInsightsQuery, LogsInsightsResult, LogsInsightsQueryStatus } from '../types';

export class CloudWatchInsightsService {
  private logs: AWS.CloudWatchLogs;
  private region: string;
  private credentials: AWS.Credentials;

  constructor(credential: AwsCredential) {
    this.credentials = new AWS.Credentials({
      accessKeyId: credential.accessKeyId,
      secretAccessKey: credential.secretKey
    });

    this.region = credential.region;
    this.logs = new AWS.CloudWatchLogs({
      credentials: this.credentials,
      region: this.region
    });
  }

  /**
   * Obtém as consultas predefinidas armazenadas
   */
  public async getStoredQueries(): Promise<LogsInsightsQuery[]> {
    // Implementação futura: obter consultas salvas do banco de dados
    // Por enquanto, retornamos consultas predefinidas
    return this.getDefaultQueries();
  }

  /**
   * Retorna um conjunto de consultas predefinidas
   */
  public getDefaultQueries(): LogsInsightsQuery[] {
    return [
      {
        name: 'Root Account Usage',
        description: 'Detecta uso da conta root da AWS nas últimas 24 horas',
        logGroups: ['/aws/cloudtrail/management-events'],
        queryString: 'filter userIdentity.type = "Root" | fields eventTime, eventName, awsRegion, sourceIPAddress, userAgent',
        timeRange: 24 * 60 * 60 * 1000 // 24 horas em milissegundos
      },
      {
        name: 'Failed Login Attempts',
        description: 'Detecta tentativas de login malsucedidas nas últimas 24 horas',
        logGroups: ['/aws/cloudtrail/management-events'],
        queryString: 'filter eventName = "ConsoleLogin" and errorMessage like "Failed authentication" | fields eventTime, sourceIPAddress, userAgent, errorMessage | sort eventTime desc',
        timeRange: 24 * 60 * 60 * 1000
      },
      {
        name: 'Security Group Changes',
        description: 'Mostra alterações em grupos de segurança',
        logGroups: ['/aws/cloudtrail/management-events'],
        queryString: 'filter eventName like "AuthorizeSecurityGroup" or eventName like "RevokeSecurityGroup" or eventName = "CreateSecurityGroup" or eventName = "DeleteSecurityGroup" | fields eventTime, eventName, userIdentity.arn, requestParameters.groupId || requestParameters.groupName, sourceIPAddress | sort eventTime desc',
        timeRange: 7 * 24 * 60 * 60 * 1000 // 7 dias
      },
      {
        name: 'IAM Changes',
        description: 'Detecta mudanças em políticas e usuários IAM',
        logGroups: ['/aws/cloudtrail/management-events'],
        queryString: 'filter eventName like "Create" or eventName like "Delete" or eventName like "Put" or eventName like "Attach" or eventName like "Detach" | filter userIdentity.type != "AssumedRole" | fields eventTime, eventName, userIdentity.arn, requestParameters | sort eventTime desc',
        timeRange: 7 * 24 * 60 * 60 * 1000
      },
      {
        name: 'S3 Bucket Policy Changes',
        description: 'Monitora alterações nas políticas de buckets S3',
        logGroups: ['/aws/cloudtrail/management-events'],
        queryString: 'filter eventSource = "s3.amazonaws.com" and (eventName = "PutBucketPolicy" or eventName = "DeleteBucketPolicy" or eventName = "PutBucketAcl") | fields eventTime, eventName, requestParameters.bucketName, userIdentity.arn, sourceIPAddress | sort eventTime desc',
        timeRange: 7 * 24 * 60 * 60 * 1000
      }
    ];
  }

  /**
   * Executa uma consulta do CloudWatch Logs Insights
   */
  public async runQuery(query: LogsInsightsQuery): Promise<string> {
    const now = new Date();
    const startTime = new Date(now.getTime() - query.timeRange);

    const params = {
      logGroupNames: query.logGroups,
      startTime: Math.floor(startTime.getTime() / 1000),
      endTime: Math.floor(now.getTime() / 1000),
      queryString: query.queryString,
      limit: 100
    };

    try {
      const response = await this.logs.startQuery(params).promise();
      return response.queryId || '';
    } catch (error) {
      console.error('Erro ao iniciar consulta:', error);
      throw error;
    }
  }

  /**
   * Obtém os resultados de uma consulta em andamento
   */
  public async getQueryResults(queryId: string): Promise<LogsInsightsResult> {
    try {
      const response = await this.logs.getQueryResults({ queryId }).promise();
      
      // Mapear o status para um dos valores válidos do tipo LogsInsightsQueryStatus
      const status = this.mapQueryStatus(response.status || '');
      
      return {
        queryId,
        status,
        statistics: {
          recordsMatched: response.statistics?.recordsMatched || 0,
          recordsScanned: response.statistics?.recordsScanned || 0,
          bytesScanned: response.statistics?.bytesScanned || 0
        },
        results: response.results || []
      };
    } catch (error) {
      console.error('Erro ao obter resultados da consulta:', error);
      return {
        queryId,
        status: 'Failed',
        results: [],
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Mapeia o status da resposta da API para um valor válido do tipo LogsInsightsQueryStatus
   */
  private mapQueryStatus(status: string): LogsInsightsQueryStatus {
    switch (status) {
      case 'Scheduled':
      case 'Running':
      case 'Complete':
      case 'Failed':
      case 'Cancelled':
      case 'Timeout':
        return status as LogsInsightsQueryStatus;
      default:
        return 'Unknown';
    }
  }

  /**
   * Cancela uma consulta em andamento
   */
  public async stopQuery(queryId: string): Promise<boolean> {
    try {
      const response = await this.logs.stopQuery({ queryId }).promise();
      return response.success || false;
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error);
      return false;
    }
  }

  /**
   * Lista os grupos de log disponíveis
   */
  public async listLogGroups(): Promise<string[]> {
    try {
      const response = await this.logs.describeLogGroups().promise();
      return (response.logGroups || []).map(group => group.logGroupName || '').filter(Boolean);
    } catch (error) {
      console.error('Erro ao listar grupos de log:', error);
      return [];
    }
  }
} 