// app/api/user/route.ts
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(user);
}
