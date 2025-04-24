import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as alertService from '@/lib/alert-service';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const severity = searchParams.get('severity');
  const resourceType = searchParams.get('resourceType');
  const credentialId = searchParams.get('credentialId');
  const afterId = searchParams.get('after_id');
  
  try {
    // Se temos um ID de referência, buscamos apenas os alertas posteriores a ele
    if (afterId) {
      // Buscar o alerta de referência para obter sua data de criação
      const referenceAlert = await prisma.alert.findUnique({
        where: { id: afterId },
        select: { createdAt: true }
      });
      
      if (!referenceAlert) {
        return NextResponse.json({ error: 'Alerta de referência não encontrado' }, { status: 404 });
      }
      
      // Buscar todos os alertas mais recentes que o alerta de referência
      const newerAlerts = await prisma.alert.findMany({
        where: {
          createdAt: {
            gt: referenceAlert.createdAt
          },
          ...(status && { status }),
          ...(severity && { severity }),
          ...(resourceType && { resourceType }),
          ...(credentialId && { credentialId }),
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
      
      return NextResponse.json({ alerts: newerAlerts });
    }
    
    // Caso contrário, usamos o serviço normal de alertas
    const alerts = await alertService.getAlerts({
      ...(status && { status }),
      ...(severity && { severity }),
      ...(resourceType && { resourceType }),
      ...(credentialId && { credentialId }),
    });
    
    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    return NextResponse.json({ error: 'Erro ao buscar alertas' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { id, action } = body;
    
    if (!id || !action) {
      return NextResponse.json({ error: 'ID do alerta e ação são obrigatórios' }, { status: 400 });
    }
    
    if (action === 'dismiss') {
      const alert = await alertService.dismissAlert(id);
      return NextResponse.json({ alert });
    }
    
    if (action === 'resolve') {
      const alert = await alertService.resolveAlert(id);
      return NextResponse.json({ alert });
    }
    
    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Erro ao atualizar alerta:', error);
    return NextResponse.json({ error: 'Erro ao atualizar alerta' }, { status: 500 });
  }
} 