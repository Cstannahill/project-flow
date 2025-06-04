import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOpenApiSpec, RouteForSpec } from "@/lib/openapi/generator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  console.log(`Checking for OpenAPI spec for project: ${projectId}`);

  // Try to fetch existing spec record
  const specRecord = await prisma.apiSpec.findFirst({
    where: { projectId },
  });

  let specData: any;

  if (specRecord) {
    // Use stored spec
    specData = specRecord.spec;
  } else {
    console.log(
      `No existing spec found. Generating new spec for project ${projectId}`,
    );

    // Fetch all API routes for the project
    const apiRoutes = await prisma.apiRoute.findMany({
      where: { projectId },
    });

    if (apiRoutes.length === 0) {
      return NextResponse.json(
        { error: "No API routes found for this project." },
        { status: 404 },
      );
    } // Sanitize JSON fields to ensure object shape
    const sanitizedRoutes: RouteForSpec[] = apiRoutes.map((r: any) => ({
      path: r.path,
      method: r.method,
      summary: r.summary || "",
      description: r.description || "",
      params:
        typeof r.params === "object" && r.params !== null
          ? (r.params as Record<string, any>)
          : undefined,
      query:
        typeof r.query === "object" && r.query !== null
          ? (r.query as Record<string, any>)
          : undefined,
      body:
        typeof r.body === "object" && r.body !== null
          ? (r.body as Record<string, any>)
          : undefined,
      responses:
        typeof r.responses === "object" && r.responses !== null
          ? (r.responses as Record<string, any>)
          : undefined,
    }));

    // Generate spec and persist
    const generatedSpec = generateOpenApiSpec(sanitizedRoutes, projectId);
    const newRecord = await prisma.apiSpec.create({
      data: {
        projectId,
        title: `Generated API Spec for Project ${projectId}`,
        description: "Automatically generated from API route definitions.",
        version: "1.0.0",
        spec: generatedSpec,
      },
    });

    specData = newRecord.spec;
  }

  // Return the raw OpenAPI document
  const { openapi, info, paths, ...rest } = specData;
  return NextResponse.json({ openapi, info, paths, ...rest });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  await prisma.apiSpec.deleteMany({ where: { projectId } });
  return NextResponse.json({ success: true });
}
