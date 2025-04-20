import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ diagramId: string }> }
) {
  const { diagramId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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
  { params }: { params: Promise<{ diagramId: string }> }
) {
  const { diagramId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.diagram.delete({
    where: { id: diagramId },
  });

  return NextResponse.json({ success: true });
}
