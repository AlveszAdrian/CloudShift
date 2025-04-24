import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Rota para limpar TODOS os alertas do sistema
 * Uso: POST /api/alerts/cleanup/all
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    
    // Excluir todos os alertas
    const deletedCount = await prisma.alert.deleteMany({});
    
    console.log(`Total de ${deletedCount.count} alertas excluídos pelo usuário ${session.user.id}`);
    
    return NextResponse.json({
      success: true,
      message: `Todos os alertas foram removidos com sucesso. Total de ${deletedCount.count} alertas excluídos.`
    });
  } catch (error) {
    console.error('Erro ao limpar alertas:', error);
    return NextResponse.json({ 
      error: 'Erro ao limpar alertas',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 