import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ databaseId: string }> }
) {
  const { databaseId } = await params;
  console.log("PATCHING", databaseId);
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log(req);
  const { title, data, projectId } = await req.json();
  console.log("PATCHING", title, data);
  const databaseSchema = await prisma.databaseSchema.findUnique({
    where: { id: databaseId },
    include: { project: { select: { user: true } } },
  });

  if (!databaseSchema) {
    return NextResponse.json(
      { error: "databaseSchema not found" },
      { status: 404 }
    );
  }

  if (databaseSchema.project.user.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.databaseSchema.update({
    where: { id: databaseId },
    data: {
      ...(title && { title }),
      projectId: projectId,
      data: data,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ databaseId: string }> }
) {
  const { databaseId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const databaseSchema = await prisma.databaseSchema.findUnique({
    where: { id: databaseId },
    include: { project: { select: { user: true } } },
  });

  if (!databaseSchema) {
    return NextResponse.json(
      { error: "databaseSchema not found" },
      { status: 404 }
    );
  }

  if (databaseSchema.project.user.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.databaseSchema.delete({
    where: { id: databaseId },
  });

  return NextResponse.json({ success: true });
}
