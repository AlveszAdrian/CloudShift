import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    
    // Buscar todas as credenciais do usuário
    const credentials = await prisma.awsCredential.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        region: true,
        createdAt: true
      }
    });
    
    return NextResponse.json({ 
      credentials,
      credentialCount: credentials.length,
      userId: session.user.id
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error("Erro ao verificar credenciais:", error);
    
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
} 