import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { HttpMethod, ApiRoutePayload } from "@/types/entities/apiRoutes";

const ALLOWED: (keyof ApiRoutePayload)[] = [
  "path",
  "method",
  "summary",
  "description",
  "params",
  "query",
  "body",
  "responses",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ routeId: string }> },
) {
  const { routeId } = await params;
  // console.log(routeId);
  let payload: Partial<ApiRoutePayload>;

  try {
    payload = await req.json();
    // console.log(payload);
  } catch (err) {
    // console.error("Invalid JSON:", err);
    return NextResponse.json({ error: "Malformed body" }, { status: 400 });
  }

  // Build an object with only allowed keys:
  const data: Record<string, any> = {};
  for (const key of ALLOWED) {
    if (typeof payload[key] !== "undefined") {
      data[key] = payload[key];
    }
  }

  // If you want to require at least one updatable field:
  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 422 },
    );
  }

  try {
    const updated = await prisma.apiRoute.update({
      where: { id: routeId },
      data,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Error updating API route:", err);
    return NextResponse.json(
      { error: "Could not update API route" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ routeId: string }> },
) {
  const { routeId } = await params;
  console.log("Deleting route", routeId);
  try {
    await prisma.apiRoute.delete({ where: { id: routeId } });
    return NextResponse.json({ id: routeId }, { status: 200 });
  } catch (err) {
    console.error("Error deleting API route:", err);
    return NextResponse.json(
      { error: "Could not delete API route" },
      { status: 500 },
    );
  }
}
