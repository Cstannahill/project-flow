import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateOpenApiSpec } from "@/lib/openapi/generator";

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const apiRoutes = await prisma.apiRoute.findMany({
    where: { projectId },
  });

  const spec = generateOpenApiSpec(
    apiRoutes.map((r) => ({
      ...r,
      params: r.params as Record<string, any> | undefined,
      query: r.query as Record<string, any> | undefined,
      body: r.body as Record<string, any> | undefined,
      responses: r.responses as Record<string, any> | undefined,
    })),
    projectId
  );

  await prisma.project.update({
    where: { id: projectId },
    data: { openapiSpec: spec },
  });

  return NextResponse.json({ message: "OpenAPI spec updated" });
}
