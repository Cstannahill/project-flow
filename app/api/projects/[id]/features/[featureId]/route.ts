import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; featureId: string } }
) {
  const { featureId } = await params;
  console.log(params);
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, type, tags, status } = await req.json();
  console.log(featureId);
  const feature = await prisma.feature.findUnique({
    where: { id: featureId },
    include: { project: { select: { user: true } } },
  });
  console.log("feature", feature);
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
      ...(tags && { tags: tags }),
      ...(status && { status }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const feature = await prisma.feature.findUnique({
    where: { id: id },
    include: { project: { select: { user: true } } },
  });

  if (!feature) {
    return NextResponse.json({ error: "Feature not found" }, { status: 404 });
  }

  if (feature.project.user.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.feature.delete({
    where: { id: id },
  });

  return NextResponse.json({ success: true });
}
