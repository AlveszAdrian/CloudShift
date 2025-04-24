import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  try {
    // Buscar a primeira credencial do usuário
    const credential = await prisma.awsCredential.findFirst({
      where: {
        userId: session.user.id
      }
    });
    
    if (!credential) {
      return NextResponse.json({ error: 'Nenhuma credencial encontrada para este usuário' }, { status: 404 });
    }
    
    return NextResponse.json({
      credentialId: credential.id,
      name: credential.name,
      region: credential.region
    });
  } catch (error) {
    console.error('Erro ao buscar credencial atual:', error);
    return NextResponse.json({ error: 'Erro ao buscar credencial atual' }, { status: 500 });
  }
} 