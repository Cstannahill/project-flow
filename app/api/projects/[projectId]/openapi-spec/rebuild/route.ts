import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOpenApiSpec } from "@/lib/openapi/generator";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  // fetch an array of ApiRoute records
  const routes = await prisma.apiRoute.findMany({
    where: { projectId },
    select: {
      projectId: true,
      path: true,
      method: true,
      summary: true,
      description: true,
      params: true,
      query: true,
      body: true,
      responses: true,
    },
  });

  // sanity check
  if (!Array.isArray(routes)) {
    console.error("Expected an array of routes but got:", routes);
    return NextResponse.json(
      { error: "Internal: routes not iterable" },
      { status: 500 },
    );
  }

  const spec = generateOpenApiSpec(routes, projectId);
  return NextResponse.json(spec);
}
