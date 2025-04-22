import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log(projectId);
  const features = await prisma.feature.findMany({
    where: { projectId: projectId },
    orderBy: { order: "asc" },
  });
  // console.log(features);
  return NextResponse.json(features);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, type, status } = await req.json();

  if (!title || !type) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const count = await prisma.feature.count({ where: { projectId } });

  const newFeature = await prisma.feature.create({
    data: {
      title,
      description: description || "",
      type,
      tags: [],
      status: status || undefined,
      order: count,
      projectId,
    },
  });

  return NextResponse.json(newFeature);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderedIds } = await req.json();

  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updates = await Promise.all(
    orderedIds.map((featureId: string, index: number) =>
      prisma.feature.update({
        where: { id: featureId },
        data: { order: index },
      }),
    ),
  );

  return NextResponse.json({ success: true, updated: updates.length });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { featureId } = await req.json();
  if (!featureId) {
    return NextResponse.json({ error: "Feature ID required" }, { status: 400 });
  }

  await prisma.feature.delete({ where: { id: featureId } });

  return NextResponse.json({ success: true });
}
