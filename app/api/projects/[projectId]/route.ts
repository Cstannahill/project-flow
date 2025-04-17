import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const { params } = await context;
  const { projectId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requ = await req.json();
  const title = requ?.title;
  const description = requ?.description;
  const diagram = requ?.diagram;
  const techStack = requ?.stack;

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(diagram && { diagram }),
      ...(techStack && { techStack }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return NextResponse.json({ success: true });
}
