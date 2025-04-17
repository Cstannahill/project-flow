import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  props: { params: Promise<{ projectId: string }> }
) {
  const params = await props.params;
  const { projectId } = params;
  console.log(`GET PROJECT(ID) DIAGRAMS API CALLED`);
  console.log(`Project ID: ${projectId}`);
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const diagrams = await prisma.diagram.findMany({
    where: { projectId: projectId },
    orderBy: { createdAt: "asc" },
  });
  // console.log(diagrams);
  return NextResponse.json(diagrams);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { title, content, type } = await req.json();
  const projectId = id;
  if (!title || !content || !type) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newDiagram = await prisma.diagram.create({
    data: {
      title,
      content,
      type,
      projectId,
    },
  });

  return NextResponse.json(newDiagram);
}
