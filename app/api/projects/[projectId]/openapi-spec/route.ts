import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { generateOpenApiSpec } from "@/lib/openapi/generator";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = await params;
  console.log(`Checking for OpenAPI spec for project: ${projectId}`);

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Look for an existing spec
  let spec = await prisma.apiSpec.findFirst({
    where: { projectId },
  });

  if (!spec) {
    console.log(
      `No existing spec found. Building new spec for project ${projectId}`
    );

    // Get all routes for the project
    const apiRoutes = await prisma.apiRoute.findMany({
      where: { projectId },
    });

    // If no routes, return early
    if (apiRoutes.length === 0) {
      return NextResponse.json(
        { error: "No API routes found for this project." },
        { status: 404 }
      );
    }
    const sanitizedRoutes = apiRoutes.map((r) => ({
      ...r,
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
    // Generate the spec from available routes
    const generatedSpec = generateOpenApiSpec(sanitizedRoutes, projectId);

    // Save the generated spec
    spec = await prisma.apiSpec.create({
      data: {
        projectId,
        title: `Generated API Spec for Project ${projectId}`,
        description: "Automatically generated from API route definitions.",
        version: "1.0.0",
        spec: generatedSpec,
      },
    });
  }

  return NextResponse.json({ spec: spec.spec });
}

// POST: Create or update OpenAPI spec
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  console.log(`entering POST Route for OpenAPI spec. ID: ${id}`);
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, version = "1.0.0", spec } = await req.json();

  if (!title || !spec || typeof spec !== "object") {
    return NextResponse.json(
      { error: "Missing or invalid title/spec" },
      { status: 400 }
    );
  }

  const upserted = await prisma.apiSpec.upsert({
    where: { id },
    create: {
      title,
      description,
      version,
      projectId: id,
      spec,
    },
    update: {
      title,
      description,
      version,
      spec,
    },
  });

  return NextResponse.json(upserted);
}

// DELETE: Remove OpenAPI spec
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = params.id;

  await prisma.apiSpec.deleteMany({
    where: { projectId },
  });

  return NextResponse.json({ success: true });
}
