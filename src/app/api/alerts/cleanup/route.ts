import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as alertService from '@/lib/alert-service';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  try {
    const result = await alertService.cleanupDuplicateAlerts();
    
    return NextResponse.json({ 
      message: `Limpeza concluída. Removidos ${result.removed} alertas duplicados. Mantidos ${result.kept} alertas únicos.`,
      ...result
    });
  } catch (error) {
    console.error('Erro ao limpar alertas duplicados:', error);
    return NextResponse.json({ 
      error: 'Erro ao limpar alertas duplicados', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 