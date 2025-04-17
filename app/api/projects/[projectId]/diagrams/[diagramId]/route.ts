import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ projectId: string; diagramId: string }> }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // `params` is an object, not a tuple or a promise
  const { projectId, diagramId } = params;

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
  props: { params: Promise<{ projectId: string; diagramId: string }> }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, diagramId } = params;
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
  props: { params: Promise<{ projectId: string; diagramId: string }> }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, diagramId } = params;

  await prisma.diagram.delete({
    where: { id: diagramId },
  });

  return NextResponse.json({ success: true });
}
