import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { AwsClientManager } from '@/lib/aws-client';
import AWS from 'aws-sdk';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    
    // Coletar informações de diagnóstico
    const diagnosticInfo: any = {
      system: {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform,
        aws_sdk_version: require('aws-sdk/package.json').version,
      },
      credentials: []
    };
    
    // Buscar credenciais do usuário
    const credentials = await prisma.awsCredential.findMany({
      where: { userId: session.user.id }
    });
    
    // Verificar se existem credenciais
    if (credentials.length === 0) {
      return NextResponse.json({
        ...diagnosticInfo,
        message: 'Nenhuma credencial AWS encontrada. Adicione pelo menos uma credencial para visualizar recursos.'
      });
    }
    
    // Testar cada credencial
    for (const credential of credentials) {
      const credInfo: any = {
        id: credential.id,
        name: credential.name,
        region: credential.region,
        masked_access_key: `${credential.accessKeyId.substring(0, 4)}...${credential.accessKeyId.substring(credential.accessKeyId.length - 4)}`,
        tests: {
          ec2: { status: 'untested' },
          s3: { status: 'untested' },
          guardduty: { status: 'untested' }
        }
      };
      
      // Configurar AWS
      const config = {
        accessKeyId: credential.accessKeyId,
        secretAccessKey: credential.secretKey,
        region: credential.region
      };
      
      // Testar EC2
      try {
        const ec2 = new AWS.EC2(config);
        const ec2Result = await ec2.describeInstances().promise();
        const instanceCount = ec2Result.Reservations?.reduce(
          (count, reservation) => count + (reservation.Instances?.length || 0), 0
        ) || 0;
        
        credInfo.tests.ec2 = {
          status: 'success',
          message: `Encontradas ${instanceCount} instâncias`,
          count: instanceCount
        };
      } catch (error: any) {
        credInfo.tests.ec2 = {
          status: 'error',
          message: error.message,
          code: error.code,
          statusCode: error.statusCode
        };
      }
      
      // Testar S3
      try {
        const s3 = new AWS.S3(config);
        const s3Result = await s3.listBuckets().promise();
        
        credInfo.tests.s3 = {
          status: 'success',
          message: `Encontrados ${s3Result.Buckets?.length || 0} buckets`,
          count: s3Result.Buckets?.length || 0,
          bucketNames: s3Result.Buckets?.map(b => b.Name) || []
        };
      } catch (error: any) {
        credInfo.tests.s3 = {
          status: 'error',
          message: error.message,
          code: error.code, 
          statusCode: error.statusCode
        };
      }
      
      // Testar GuardDuty
      try {
        const guardDuty = new AWS.GuardDuty(config);
        const gdResult = await guardDuty.listDetectors().promise();
        
        credInfo.tests.guardduty = {
          status: 'success',
          message: `Encontrados ${gdResult.DetectorIds?.length || 0} detectores`,
          detectorIds: gdResult.DetectorIds || []
        };
      } catch (error: any) {
        credInfo.tests.guardduty = {
          status: 'error',
          message: error.message,
          code: error.code,
          statusCode: error.statusCode
        };
      }
      
      diagnosticInfo.credentials.push(credInfo);
    }
    
    // Verificar status geral
    const anyServiceWorking = diagnosticInfo.credentials.some((cred: any) => 
      cred.tests.ec2.status === 'success' || 
      cred.tests.s3.status === 'success' || 
      cred.tests.guardduty.status === 'success'
    );
    
    if (!anyServiceWorking) {
      diagnosticInfo.recommendation = "Todas as tentativas de acesso à AWS falharam. Verifique suas credenciais e permissões.";
    }
    
    return NextResponse.json(diagnosticInfo);
  } catch (error: any) {
    console.error('Erro no diagnóstico:', error);
    return NextResponse.json({
      error: 'Erro no diagnóstico',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 