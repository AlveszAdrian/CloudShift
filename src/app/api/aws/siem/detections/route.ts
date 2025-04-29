import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DetectionService } from '@/lib/aws/siem/detections';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params = {
      acknowledged: searchParams.get('acknowledged') === 'true',
      severity: searchParams.get('severity') || undefined,
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10
    };

    const { detections, total } = await DetectionService.getDetections(params);
    
    return NextResponse.json({
      detections,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit)
    });
  } catch (error) {
    console.error('Erro ao buscar detecções:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detecções' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Sessão não autorizada');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { ruleId } = body;

    console.log('Buscando detecções para regra ID:', ruleId);

    if (!ruleId) {
      console.log('Erro: Rule ID não fornecido');
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    // Verificar se a regra existe
    const ruleExists = await prisma.insightsRule.findUnique({
      where: { id: ruleId }
    });

    console.log('Resultado da busca da regra:', ruleExists ? 'Encontrada' : 'Não encontrada');

    // Mesmo se a regra não existir, tentamos buscar as detecções
    // pois ela pode ter sido excluída mas as detecções permanecem
    console.log(`Buscando detecções para a regra ${ruleId}...`);
    const detections = await DetectionService.getDetectionsByRule(ruleId);
    console.log(`Encontradas ${detections.length} detecções para a regra ${ruleId}`);
    
    if (detections.length === 0 && !ruleExists) {
      console.log('Aviso: Regra não existe e não foram encontradas detecções');
    }

    return NextResponse.json(detections);
  } catch (error) {
    console.error('Erro ao buscar detecções:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Detection ID is required' }, { status: 400 });
    }

    const detection = await DetectionService.acknowledgeDetection(id);
    return NextResponse.json(detection);
  } catch (error) {
    console.error('Erro ao reconhecer detecção:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 