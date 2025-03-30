import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: { projectId: string; diagramId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { diagramId } = await context.params;

  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId },
  });

  if (!diagram) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(diagram);
}

export async function PATCH(
  req: NextRequest,
  context: { params: { projectId: string; diagramId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { diagramId } = await context.params;
  const { title, content, type } = await req.json();

  const updated = await prisma.diagram.update({
    where: { id: diagramId },
    data: {
      ...(title && { title }),
      ...(content && { content }),
      ...(type && { type }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: { projectId: string; diagramId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { diagramId } = await context.params;

  await prisma.diagram.delete({
    where: { id: diagramId },
  });

  return NextResponse.json({ success: true });
}
