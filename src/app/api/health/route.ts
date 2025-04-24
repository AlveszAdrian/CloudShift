import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar conexão com o banco de dados
    const dbStatus = 'ok'; // Em uma implementação real, você verificaria a conexão com o banco de dados aqui
    
    return NextResponse.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        api: 'ok'
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Erro no health check:', error);
    
    return NextResponse.json({ 
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
} 