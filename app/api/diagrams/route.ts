import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  // console.log("GET ALL API CALLED");
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const diagrams = await prisma.diagram.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(diagrams);
}
