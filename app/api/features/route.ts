// app/api/projects/[projectId]/features/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const features = await prisma.feature.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(features);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const body = await request.json();
  const { title, description, type, status, tags } = body;

  // Basic validation
  if (!title || !type) {
    return NextResponse.json(
      { error: "`title` and `type` are required" },
      { status: 400 },
    );
  }

  try {
    const feature = await prisma.feature.create({
      data: {
        title,
        description,
        type,
        order: 0,
        status,
        tags,
        project: { connect: { id: projectId } },
      },
    });
    return NextResponse.json(feature, { status: 201 });
  } catch (err) {
    console.error("Error creating feature:", err);
    return NextResponse.json(
      { error: "Failed to create feature" },
      { status: 500 },
    );
  }
}
