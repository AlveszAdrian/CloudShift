import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  const { id } = params;
  
  try {
    const credential = await prisma.awsCredential.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    });
    
    if (!credential) {
      return NextResponse.json({ error: 'Credencial não encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: credential.id,
      name: credential.name,
      region: credential.region,
      createdAt: credential.createdAt
    });
  } catch (error) {
    console.error('Erro ao buscar credencial:', error);
    return NextResponse.json({ error: 'Erro ao buscar credencial' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  const { id } = params;
  
  try {
    // Verificar se a credencial existe e pertence ao usuário
    const existingCredential = await prisma.awsCredential.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    });
    
    if (!existingCredential) {
      return NextResponse.json({ error: 'Credencial não encontrada' }, { status: 404 });
    }
    
    const body = await request.json();
    
    // Atualizar apenas os campos fornecidos
    const updatedCredential = await prisma.awsCredential.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.accessKeyId && { accessKeyId: body.accessKeyId }),
        ...(body.secretKey && { secretKey: body.secretKey }),
        ...(body.region && { region: body.region })
      }
    });
    
    return NextResponse.json({
      id: updatedCredential.id,
      name: updatedCredential.name,
      region: updatedCredential.region,
      createdAt: updatedCredential.createdAt
    });
  } catch (error) {
    console.error('Erro ao atualizar credencial:', error);
    return NextResponse.json({ error: 'Erro ao atualizar credencial' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  const { id } = params;
  
  try {
    console.log(`Iniciando exclusão da credencial com ID: ${id}`);
    
    // Verificar se a credencial existe e pertence ao usuário
    const credential = await prisma.awsCredential.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    });
    
    if (!credential) {
      return NextResponse.json({ error: 'Credencial não encontrada' }, { status: 404 });
    }
    
    // Listar alertas antes da exclusão para depuração
    const alertsBeforeDeletion = await prisma.alert.findMany({
      where: { credentialId: id },
      select: {
        id: true,
        resourceType: true,
      }
    });
    
    console.log(`Alertas encontrados antes da exclusão: ${alertsBeforeDeletion.length}`);
    console.log(`Tipos de recursos encontrados: ${[...new Set(alertsBeforeDeletion.map(a => a.resourceType))].join(', ')}`);
    
    // Verificar especificamente alertas de EC2
    const ec2Alerts = alertsBeforeDeletion.filter(a => 
      a.resourceType === 'EC2Instance' || 
      a.resourceType === 'SecurityGroup' ||
      a.resourceType === 'Volume' ||
      a.resourceType.includes('VPC') ||
      a.resourceType.includes('Network') ||
      a.resourceType === 'NetworkACL' ||
      a.resourceType.includes('ACL') ||
      a.resourceType === 'ElasticIP' ||
      a.resourceType === 'RouteTable' ||
      a.resourceType === 'Subnet'
    );
    console.log(`Alertas de EC2 e rede encontrados: ${ec2Alerts.length}`);
    
    // Verificar especificamente alertas de IAM
    const iamAlerts = alertsBeforeDeletion.filter(a => 
      a.resourceType === 'IAMUser' || 
      a.resourceType === 'IAMAccessKey' || 
      a.resourceType === 'SecretManagerSecret' || 
      a.resourceType === 'IAMPolicy' || 
      a.resourceType === 'IAMGroup' || 
      a.resourceType === 'IAMPasswordPolicy'
    );
    console.log(`Alertas de IAM encontrados: ${iamAlerts.length}`);

    // Abordagem 1: Excluir por categorias específicas para garantir que nada seja perdido
    
    // Excluir alertas de EC2 e rede
    const deletedEC2Alerts = await prisma.alert.deleteMany({
      where: {
        credentialId: id,
        OR: [
          { resourceType: 'EC2Instance' },
          { resourceType: 'SecurityGroup' },
          { resourceType: 'Volume' },
          { resourceType: { contains: 'VPC' } },
          { resourceType: { contains: 'Network' } },
          { resourceType: 'NetworkACL' },
          { resourceType: { contains: 'ACL' } },
          { resourceType: 'ElasticIP' },
          { resourceType: 'RouteTable' },
          { resourceType: 'Subnet' }
        ]
      }
    });
    console.log(`Alertas de EC2 e rede excluídos: ${deletedEC2Alerts.count}`);
    
    // Excluir alertas de IAM e segurança
    const deletedIAMAlerts = await prisma.alert.deleteMany({
      where: {
        credentialId: id,
        OR: [
          { resourceType: 'IAMUser' },
          { resourceType: 'IAMAccessKey' },
          { resourceType: 'SecretManagerSecret' },
          { resourceType: 'IAMPolicy' },
          { resourceType: 'IAMGroup' },
          { resourceType: 'IAMPasswordPolicy' }
        ]
      }
    });
    console.log(`Alertas de IAM excluídos: ${deletedIAMAlerts.count}`);
    
    // Abordagem 2: Garantir que todos os alertas restantes com essa credencial sejam excluídos
    const deletedRemainingAlerts = await prisma.alert.deleteMany({
      where: { credentialId: id }
    });
    console.log(`Alertas restantes excluídos: ${deletedRemainingAlerts.count}`);
    
    // Verificar se ainda resta algum alerta
    const alertsAfterDeletion = await prisma.alert.findMany({
      where: { credentialId: id }
    });
    console.log(`Alertas remanescentes após exclusão: ${alertsAfterDeletion.length}`);
    
    if (alertsAfterDeletion.length > 0) {
      console.warn('Ainda existem alertas associados à credencial após tentativa de exclusão');
      console.warn('Tipos de alertas remanescentes:', alertsAfterDeletion.map(a => a.resourceType));
      
      // Última tentativa: forçar exclusão direta no banco de dados
      await prisma.$executeRaw`DELETE FROM "Alert" WHERE "credentialId" = ${id}`;
      console.log('Executada exclusão forçada via SQL direto');
    }
    
    // Excluir a credencial
    await prisma.awsCredential.delete({
      where: { id }
    });
    
    const totalDeleted = deletedEC2Alerts.count + deletedIAMAlerts.count + deletedRemainingAlerts.count;
    return NextResponse.json({ 
      success: true,
      message: `Credencial excluída com sucesso. ${totalDeleted} alertas associados foram removidos.`
    });
  } catch (error) {
    console.error('Erro ao excluir credencial:', error);
    return NextResponse.json({ error: 'Erro ao excluir credencial' }, { status: 500 });
  }
} 