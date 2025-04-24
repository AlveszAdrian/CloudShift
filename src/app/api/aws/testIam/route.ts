import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as awsService from '@/lib/aws-service';

export async function GET(request: NextRequest) {
  try {
    // Buscar a primeira credencial disponível
    const credential = await prisma.awsCredential.findFirst();
    
    if (!credential) {
      return NextResponse.json({ error: 'Nenhuma credencial encontrada' }, { status: 404 });
    }
    
    // Chamar o serviço diretamente
    const users = await awsService.getIamUsers(credential.id);
    
    return NextResponse.json({
      credentialId: credential.id,
      credentialName: credential.name,
      users,
      userCount: users.length
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error("Erro ao testar IAM:", error);
    
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
} 