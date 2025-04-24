// Script para testar credenciais AWS
const AWS = require('aws-sdk');
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Iniciando teste de credenciais AWS...');
        
        // Listar todas as credenciais no banco de dados
        const credentials = await prisma.awsCredential.findMany();
        
        if (credentials.length === 0) {
            console.log('Nenhuma credencial AWS encontrada no banco de dados!');
            console.log('Por favor, adicione credenciais através da interface web primeiro.');
            return;
        }
        
        console.log(`Encontradas ${credentials.length} credenciais cadastradas.`);
        
        // Testar cada credencial
        for (const credential of credentials) {
            console.log(`\n----- Testando credencial: ${credential.name} (Região: ${credential.region}) -----`);
            
            // Configurar AWS com esta credencial
            AWS.config.update({
                accessKeyId: credential.accessKeyId,
                secretAccessKey: credential.secretKey,
                region: credential.region
            });
            
            // Testar EC2
            try {
                console.log('\nTestando acesso ao EC2...');
                const ec2 = new AWS.EC2();
                const ec2Result = await ec2.describeInstances().promise();
                const instanceCount = ec2Result.Reservations?.reduce(
                    (count, reservation) => count + (reservation.Instances?.length || 0), 0
                ) || 0;
                console.log(`✅ EC2 OK: Encontradas ${instanceCount} instâncias`);
            } catch (ec2Error) {
                console.log(`❌ EC2 ERRO: ${ec2Error.message}`);
                console.log('Detalhes:', ec2Error.code, ec2Error.statusCode);
                
                if (ec2Error.code === 'UnauthorizedOperation') {
                    console.log('DICA: Verifique se as permissões EC2 estão habilitadas para este usuário IAM.');
                } else if (ec2Error.code === 'InvalidClientTokenId') {
                    console.log('DICA: Credenciais inválidas. Verifique o Access Key ID e Secret Key.');
                }
            }
            
            // Testar S3
            try {
                console.log('\nTestando acesso ao S3...');
                const s3 = new AWS.S3();
                const s3Result = await s3.listBuckets().promise();
                console.log(`✅ S3 OK: Encontrados ${s3Result.Buckets?.length || 0} buckets`);
                
                if (s3Result.Buckets?.length > 0) {
                    console.log('Buckets:');
                    s3Result.Buckets.forEach(bucket => {
                        console.log(`  - ${bucket.Name} (criado em ${bucket.CreationDate})`);
                    });
                }
            } catch (s3Error) {
                console.log(`❌ S3 ERRO: ${s3Error.message}`);
                console.log('Detalhes:', s3Error.code, s3Error.statusCode);
                
                if (s3Error.code === 'AccessDenied') {
                    console.log('DICA: Verifique se as permissões S3 estão habilitadas para este usuário IAM.');
                }
            }
            
            // Testar IAM
            try {
                console.log('\nTestando acesso ao IAM...');
                const iam = new AWS.IAM();
                const iamResult = await iam.listUsers().promise();
                console.log(`✅ IAM OK: Encontrados ${iamResult.Users?.length || 0} usuários`);
                
                if (iamResult.Users?.length > 0) {
                    console.log('Usuários IAM:');
                    iamResult.Users.forEach(user => {
                        console.log(`  - ${user.UserName} (criado em ${user.CreateDate})`);
                        
                        // Verificar se há políticas anexadas
                        iam.listAttachedUserPolicies({ UserName: user.UserName }).promise()
                            .then(policies => {
                                if (policies.AttachedPolicies?.length > 0) {
                                    console.log(`    Políticas (${policies.AttachedPolicies.length}):`);
                                    policies.AttachedPolicies.forEach(policy => {
                                        console.log(`      - ${policy.PolicyName}`);
                                    });
                                }
                            })
                            .catch(err => {
                                console.log(`    Não foi possível listar políticas: ${err.message}`);
                            });
                    });
                }
            } catch (iamError) {
                console.log(`❌ IAM ERRO: ${iamError.message}`);
                console.log('Detalhes:', iamError.code, iamError.statusCode);
                
                if (iamError.code === 'AccessDenied') {
                    console.log('DICA: Verifique se as permissões IAM estão habilitadas para este usuário IAM.');
                }
            }
            
            // Testar GuardDuty
            try {
                console.log('\nTestando acesso ao GuardDuty...');
                const guardDuty = new AWS.GuardDuty();
                const guardDutyResult = await guardDuty.listDetectors().promise();
                console.log(`✅ GuardDuty OK: Encontrados ${guardDutyResult.DetectorIds?.length || 0} detectores`);
            } catch (gdError) {
                console.log(`❌ GuardDuty ERRO: ${gdError.message}`);
                console.log('Detalhes:', gdError.code, gdError.statusCode);
                
                if (gdError.code === 'AccessDenied') {
                    console.log('DICA: O GuardDuty pode não estar habilitado nesta conta ou região.');
                    console.log('      Isso não é crítico, outras funcionalidades ainda podem funcionar.');
                }
            }
        }
    } catch (error) {
        console.error('Erro no teste de credenciais:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 