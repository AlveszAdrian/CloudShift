import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  try {
    // Encontrar todos os alertas relacionados a EC2
    const ec2ResourceTypes = [
      'EC2Instance', 
      'SecurityGroup', 
      'Volume', 
      'VPC', 
      'NetworkInterface', 
      'ElasticIP', 
      'RouteTable', 
      'Subnet',
      'NetworkACL'
    ];
    
    // Limpar todos os alertas de EC2 do banco de dados
    const { count } = await prisma.alert.deleteMany({
      where: {
        resourceType: {
          in: ec2ResourceTypes
        }
      }
    });
    
    console.log(`Removidos ${count} alertas de EC2`);
    
    return NextResponse.json({
      message: `${count} alertas de EC2 foram removidos com sucesso.`,
      removed: count
    });
  } catch (error) {
    console.error('Erro ao limpar alertas de EC2:', error);
    return NextResponse.json({ 
      error: 'Erro ao limpar alertas de EC2',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 