import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const schemas = await prisma.databaseSchema.findMany({
    where: { projectId: projectId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(schemas);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  console.log("projectId", projectId);
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, data } = await req.json();

  if (!title || !data) {
    return NextResponse.json(
      { error: "Missing title or data" },
      { status: 400 }
    );
  }

  const created = await prisma.databaseSchema.create({
    data: {
      title,
      projectId: projectId,
      data,
    },
  });

  return NextResponse.json(created);
}
