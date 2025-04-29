import { prisma } from '@/lib/prisma';
import { InsightsRule } from '@/types/siem';
import { Prisma } from '@/generated/prisma';

export interface Detection {
  id: string;
  ruleId: string;
  timestamp: Date;
  message: string;
  severity: string;
  fields: any; // Usando any para compatibilidade com JsonValue
  acknowledged: boolean;
  createdAt: Date;
  updatedAt: Date;
  rule?: any; // Para incluir relacionamentos
}

export class DetectionService {
  /**
   * Registra uma nova detecção para uma regra
   */
  static async createDetection(rule: InsightsRule, result: any): Promise<Detection> {
    console.log('DetectionService.createDetection - Iniciando com rule:', rule.id);
    
    // Criar uma cópia segura dos campos para evitar problemas de serialização
    const safeFields: Record<string, string> = {};
    
    try {
      // Processamos campos que podem existir no resultado
      if (result && typeof result === 'object') {
        for (const [key, value] of Object.entries(result)) {
          // Excluímos campos especiais e objetos complexos
          if (key !== 'timestamp' && key !== 'message' && key !== 'raw') {
            // Convertemos para string para garantir que não haja objetos complexos
            safeFields[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
          }
        }
      }
      
      console.log('Dados da detecção a ser criada:', {
        ruleId: rule.id,
        timestamp: new Date(result?.timestamp || Date.now()),
        message: result?.message || '',
        severity: rule.severity,
        fieldsCount: Object.keys(safeFields).length
      });
    
      try {
        const detection = await prisma.detection.create({
          data: {
            ruleId: rule.id!,
            timestamp: new Date(result?.timestamp || Date.now()),
            message: result?.message || '',
            severity: rule.severity,
            fields: safeFields,
            acknowledged: false,
          }
        });
        
        console.log('Detecção criada com sucesso:', detection.id);
    
        // Atualiza o contador de acionamentos da regra
        console.log('Atualizando contador de acionamentos da regra:', rule.id);
        await prisma.insightsRule.update({
          where: { id: rule.id },
          data: {
            triggers: { increment: 1 },
            lastTriggered: new Date()
          }
        });
        console.log('Contador atualizado com sucesso');
    
        return detection as unknown as Detection;
      } catch (error) {
        console.error('Erro ao criar detecção:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao processar campos da detecção:', error);
      throw error;
    }
  }

  /**
   * Busca todas as detecções de uma regra específica
   */
  static async getDetectionsByRule(ruleId: string): Promise<Detection[]> {
    const detections = await prisma.detection.findMany({
      where: { ruleId },
      orderBy: { timestamp: 'desc' }
    });
    return detections as unknown as Detection[];
  }

  /**
   * Marca uma detecção como reconhecida
   */
  static async acknowledgeDetection(id: string): Promise<Detection> {
    const detection = await prisma.detection.update({
      where: { id },
      data: { acknowledged: true }
    });
    return detection as unknown as Detection;
  }

  /**
   * Busca detecções com filtros
   */
  static async getDetections(params: {
    acknowledged?: boolean;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ detections: Detection[]; total: number }> {
    const {
      acknowledged,
      severity,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = params;

    const where: any = {};
    
    if (typeof acknowledged === 'boolean') {
      where.acknowledged = acknowledged;
    }
    
    if (severity) {
      where.severity = severity;
    }
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const [detections, total] = await Promise.all([
      prisma.detection.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          rule: true
        }
      }),
      prisma.detection.count({ where })
    ]);

    return { 
      detections: detections as unknown as Detection[], 
      total 
    };
  }
} 