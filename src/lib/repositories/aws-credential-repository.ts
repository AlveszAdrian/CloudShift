import { prisma } from '../prisma';
import { AwsCredential as PrismaAwsCredential } from '@prisma/client';

// Interface para retorno do repositório
export interface AwsCredential {
  id: string;
  name: string;
  accessKeyId: string;
  secretKey: string;
  region: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AwsCredentialRepository {
  async findById(id: string): Promise<AwsCredential | null> {
    const credential = await prisma.awsCredential.findUnique({
      where: { id }
    });
    
    return credential;
  }
  
  async findByUserId(userId: string): Promise<AwsCredential[]> {
    return prisma.awsCredential.findMany({
      where: { userId }
    });
  }
  
  async create(data: {
    name: string;
    accessKeyId: string;
    secretKey: string;
    region: string;
    userId: string;
  }): Promise<AwsCredential> {
    return prisma.awsCredential.create({
      data
    });
  }
  
  async update(id: string, data: Partial<{
    name: string;
    accessKeyId: string;
    secretKey: string;
    region: string;
  }>): Promise<AwsCredential> {
    return prisma.awsCredential.update({
      where: { id },
      data
    });
  }
  
  async delete(id: string): Promise<void> {
    await prisma.awsCredential.delete({
      where: { id }
    });
  }
} 