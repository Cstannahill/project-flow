import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const DiagramCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.string().min(1, "Type is required"),
});
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
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  let data: z.infer<typeof DiagramCreateSchema>;
  try {
    const body = await req.json();
    console.log(body);
    data = DiagramCreateSchema.parse(body);
    console.log(data);
  } catch (err: any) {
    // Zod errors give you details
    const message =
      err.errors?.map((e: any) => e.message).join(", ") ||
      "Invalid request data";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  // 4) Create under the right project, catching DB issues
  try {
    console.log(projectId);
    const newDiagram = await prisma.diagram.create({
      data: {
        projectId: projectId,
        title: data.title,
        content: data.content,
        type: data.type,
      },
    });
    // 5) Return 201 Created
    return NextResponse.json(newDiagram, { status: 201 });
  } catch (err) {
    console.error("Error creating diagram:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
