// AWS Credential Type
export interface AwsCredential {
  id: string;
  name: string;
  accessKeyId: string;
  secretKey: string;
  region: string;
  accountId?: string;
  status?: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

// CloudWatch Logs Insights Types
export interface LogsInsightsQuery {
  id?: string;
  name: string;
  description: string;
  logGroups: string[];
  queryString: string;
  timeRange: number; // em milissegundos
}

export type LogsInsightsQueryStatus = 'Scheduled' | 'Running' | 'Complete' | 'Failed' | 'Cancelled' | 'Timeout' | 'Unknown';

export interface LogsInsightsResult {
  queryId: string;
  status: LogsInsightsQueryStatus;
  statistics?: {
    recordsMatched: number;
    recordsScanned: number;
    bytesScanned: number;
  };
  results: any[];
  error?: string;
} 