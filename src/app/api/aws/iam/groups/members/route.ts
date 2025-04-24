import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AwsClientManager } from "@/lib/aws-client";
import * as awsService from "@/lib/aws-service";
import { prisma } from "@/lib/prisma";

async function getIAMClient(credentialId: string) {
  try {
    const credential = await prisma.awsCredential.findUnique({
      where: { id: credentialId }
    });
    
    if (!credential) {
      throw new Error('Credencial não encontrada');
    }
    
    return awsService.getIAMService(credentialId);
  } catch (error) {
    console.error('Erro ao obter cliente IAM:', error);
    throw error;
  }
}

// Get users in a group
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get("credentialId");
    const groupName = searchParams.get("groupName");
    
    if (!credentialId) {
      return NextResponse.json({ error: "Credential ID is required" }, { status: 400 });
    }
    
    if (!groupName) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }

    console.log(`Buscando usuários para o grupo ${groupName} com credencial ${credentialId}`);
    
    const iamService = await getIAMClient(credentialId);
    const awsUsers = await iamService.listUsersInGroup(groupName);
    
    const users = awsUsers.map(user => ({
      userName: user.UserName || '',
      userId: user.UserId || '',
      arn: user.Arn || '',
      createDate: user.CreateDate?.toISOString() || new Date().toISOString(),
      passwordLastUsed: user.PasswordLastUsed?.toISOString(),
      hasMFA: false,
      accessKeysCount: 0,
      policiesCount: 0,
      riskLevel: 'medium'
    }));
    
    console.log(`Encontrados ${users.length} usuários no grupo ${groupName}`);
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/aws/iam/groups/members:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Add user to group
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { credentialId, groupName, userName } = body;
    
    if (!credentialId) {
      return NextResponse.json({ error: "Credential ID is required" }, { status: 400 });
    }
    
    if (!groupName) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }
    
    if (!userName) {
      return NextResponse.json({ error: "User name is required" }, { status: 400 });
    }

    console.log(`Tentando adicionar usuário ${userName} ao grupo ${groupName} com credencial ${credentialId}`);
    
    const awsService = await getIAMClient(credentialId);
    await awsService.addUserToGroup(userName, groupName);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error in POST /api/aws/iam/groups/members:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Remove user from group
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get("credentialId");
    const groupName = searchParams.get("groupName");
    const userName = searchParams.get("userName");
    
    if (!credentialId) {
      return NextResponse.json({ error: "Credential ID is required" }, { status: 400 });
    }
    
    if (!groupName) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }
    
    if (!userName) {
      return NextResponse.json({ error: "User name is required" }, { status: 400 });
    }

    console.log(`Removendo usuário ${userName} do grupo ${groupName} com credencial ${credentialId}`);
    
    const awsService = await getIAMClient(credentialId);
    await awsService.removeUserFromGroup(userName, groupName);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error in DELETE /api/aws/iam/groups/members:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 