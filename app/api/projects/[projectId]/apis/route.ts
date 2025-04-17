// app/api/projects/[projectId]/apis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const routes = await prisma.apiRoute.findMany({
    where: { projectId: projectId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(routes);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = await params;
  console.log("IN POST API ROUTE", projectId);
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const newRoute = await prisma.apiRoute.create({
    data: {
      projectId: projectId,
      method: body.method,
      path: body.path,
      summary: body.summary,
      description: body.description,
      params: body.params,
      query: body.query,
      body: body.body,
      responses: body.responses,
    },
  });

  return NextResponse.json(newRoute, { status: 201 });
}

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = await params;
//   const tar = req.nextUrl.searchParams;
//   console.log(tar, id);
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { routeId } = await req.json();

//   if (!routeId) {
//     return NextResponse.json({ error: "Missing routeId" }, { status: 400 });
//   }

//   await prisma.apiRoute.delete({
//     where: { projectId: routeId },
//   });

//   return NextResponse.json({ success: true });
// }
