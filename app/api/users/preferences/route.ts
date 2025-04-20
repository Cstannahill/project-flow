// app/api/user/preferences/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // find or create preferences
  let prefs = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  });
  if (!prefs) {
    prefs = await prisma.userPreferences.create({
      data: { userId: session.user.id },
    });
  }
  return NextResponse.json(prefs);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updates = (await req.json()) as Partial<{
    prevProjectId: string;
    theme: string;
    language: string;
    notificationsEnabled: boolean;
  }>;

  // upsert preferences
  const prefs = await prisma.userPreferences.upsert({
    where: { userId: session.user.id },
    update: updates,
    create: { userId: session.user.id, ...updates },
  });
  return NextResponse.json(prefs);
}
