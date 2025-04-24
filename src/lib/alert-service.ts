import { SecurityIssue } from './aws-service';
import { prisma } from './prisma';

export async function createAlertFromSecurityIssue(issue: SecurityIssue, credentialId?: string) {
  console.log("Criando alerta para:", issue.title, issue.resourceType, "Credential:", credentialId);
  
  // Verificar se já existe um alerta ativo com o mesmo título, descrição e resourceId
  const existingAlert = await prisma.alert.findFirst({
    where: {
      title: issue.title,
      description: issue.description,
      resourceId: issue.resourceId,
      resourceType: issue.resourceType,
      status: 'active',
      ...(credentialId && { credentialId })
    }
  });

  // Se já existir um alerta ativo, não criar um novo
  if (existingAlert) {
    console.log(`Alerta já existe para o problema: ${issue.title} em ${issue.resourceId}`);
    return existingAlert;
  }

  // Se não existir, criar um novo alerta
  const createdAlert = await prisma.alert.create({
    data: {
      title: issue.title,
      description: issue.description,
      resourceId: issue.resourceId,
      resourceType: issue.resourceType,
      severity: issue.severity,
      status: 'active', // Sempre definir como 'active' para novos alertas
      ...(credentialId && { credentialId })
    }
  });
  
  console.log(`Novo alerta criado: ${createdAlert.id}, status: ${createdAlert.status}`);
  return createdAlert;
}

export async function cleanupDuplicateAlerts() {
  // 1. Obter todos os alertas
  const allAlerts = await prisma.alert.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  // 2. Identificar duplicados (mesmo título, descrição, resourceId, resourceType)
  const uniqueKeys = new Set();
  const duplicateIds = [];
  const keptIds = new Set();

  for (const alert of allAlerts) {
    const key = `${alert.title}|${alert.description}|${alert.resourceId}|${alert.resourceType}`;
    
    if (uniqueKeys.has(key)) {
      // Este é um duplicado
      duplicateIds.push(alert.id);
    } else {
      // Este é o primeiro (mais recente) de seu tipo
      uniqueKeys.add(key);
      keptIds.add(alert.id);
    }
  }

  console.log(`Encontrados ${duplicateIds.length} alertas duplicados para remover`);

  // 3. Remover os duplicados
  if (duplicateIds.length > 0) {
    await prisma.alert.deleteMany({
      where: {
        id: {
          in: duplicateIds
        }
      }
    });
  }

  return {
    removed: duplicateIds.length,
    kept: keptIds.size
  };
}

export async function getAlerts(filters?: {
  status?: string;
  severity?: string;
  resourceType?: string;
  credentialId?: string;
}) {
  return prisma.alert.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.severity && { severity: filters.severity }),
      ...(filters?.resourceType && { resourceType: filters.resourceType }),
      ...(filters?.credentialId && { credentialId: filters.credentialId }),
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      credential: {
        select: {
          name: true
        }
      }
    }
  });
}

export async function dismissAlert(alertId: string) {
  return prisma.alert.update({
    where: { id: alertId },
    data: { status: 'dismissed' }
  });
}

export async function resolveAlert(alertId: string) {
  return prisma.alert.update({
    where: { id: alertId },
    data: { status: 'resolved' }
  });
} 