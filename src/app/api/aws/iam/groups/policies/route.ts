import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AwsCredentialManager } from "@/lib/aws-credential-manager";
import { AwsService } from "@/lib/aws-service";

async function getIAMClient(credentialId: string) {
  const credentialManager = new AwsCredentialManager();
  const credential = await credentialManager.getCredentialById(credentialId);
  
  if (!credential) {
    throw new Error("AWS credential not found");
  }
  
  const awsService = new AwsService(credential);
  return awsService;
}

// Get policies attached to a group
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const awsService = await getIAMClient(credentialId);
    const policies = await awsService.listGroupPolicies(groupName);
    
    return NextResponse.json({ policies }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/aws/iam/groups/policies:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Attach policy to group
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { credentialId, groupName, policyArn } = body;
    
    if (!credentialId) {
      return NextResponse.json({ error: "Credential ID is required" }, { status: 400 });
    }
    
    if (!groupName) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }
    
    if (!policyArn) {
      return NextResponse.json({ error: "Policy ARN is required" }, { status: 400 });
    }

    const awsService = await getIAMClient(credentialId);
    await awsService.attachGroupPolicy(groupName, policyArn);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error in POST /api/aws/iam/groups/policies:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Detach policy from group
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const credentialId = searchParams.get("credentialId");
    const groupName = searchParams.get("groupName");
    const policyArn = searchParams.get("policyArn");
    
    if (!credentialId) {
      return NextResponse.json({ error: "Credential ID is required" }, { status: 400 });
    }
    
    if (!groupName) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }
    
    if (!policyArn) {
      return NextResponse.json({ error: "Policy ARN is required" }, { status: 400 });
    }

    const awsService = await getIAMClient(credentialId);
    await awsService.detachGroupPolicy(groupName, policyArn);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error in DELETE /api/aws/iam/groups/policies:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 