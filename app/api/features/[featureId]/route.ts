import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ featureId: string }> }
) {
  const { featureId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, type } = await req.json();

  const feature = await prisma.feature.findUnique({
    where: { id: featureId },
    include: { project: { select: { user: true } } },
  });

  if (!feature) {
    return NextResponse.json({ error: "Feature not found" }, { status: 404 });
  }

  if (feature.project.user.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.feature.update({
    where: { id: featureId },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(type && { type }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ featureId: string }> }
) {
  const { featureId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const feature = await prisma.feature.findUnique({
    where: { id: featureId },
    include: { project: { select: { user: true } } },
  });

  if (!feature) {
    return NextResponse.json({ error: "Feature not found" }, { status: 404 });
  }

  if (feature.project.user.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.feature.delete({
    where: { id: featureId },
  });

  return NextResponse.json({ success: true });
}
