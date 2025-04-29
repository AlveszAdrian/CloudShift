export interface InsightsRule {
  id?: string;
  name: string;
  description?: string;
  query: string;
  logGroup: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  isActive: boolean;
  triggers?: number;
  lastTriggered?: Date;
  lastExecuted?: Date;
  region?: string;
  createdAt?: Date;
  updatedAt?: Date;
  credentialId?: string;
  lastResults?: Array<Record<string, any>>;
  testResults?: Array<Record<string, any>>;
  testError?: string;
  testLoading?: boolean;
}

export interface LogResult {
  timestamp: string;
  message: string;
  fields: Record<string, any>;
  eventName?: string;
  [key: string]: any;
}

export interface InsightsQueryResult {
  timestamp: string;
  message: string;
  fields: Record<string, string>;
  raw: any;
} 