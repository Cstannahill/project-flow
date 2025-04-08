import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; routeId: string } }
) {
  const { id: projectId, routeId } = await params;
  console.log(
    `---------------------${projectId} ${routeId}-------------------------------`
  );
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (routeId) {
      const updated = await prisma.apiRoute.update({
        where: { id: routeId },
        data: body,
      });

      return NextResponse.json(updated);
    }
  } catch (err) {
    console.error("PUT /api/projects/[id]/apis/[routeId] error:", err);
    return NextResponse.json(
      { error: "Failed to update API route" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { routeId: string } }
) {
  const { routeId } = await params;
  const tar = req.nextUrl.searchParams;
  console.log(routeId);
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // const { routeId } = await req.json();

  if (!routeId) {
    return NextResponse.json({ error: "Missing routeId" }, { status: 400 });
  }

  await prisma.apiRoute.delete({
    where: { id: routeId },
  });

  return NextResponse.json({ success: true });
}
