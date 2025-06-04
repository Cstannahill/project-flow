import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return NextResponse.json({ error: "User already exists" }, { status: 409 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  await prisma.userPreferences.create({
    data: { userId: user.id }, // uses the model defaults
  });

  return NextResponse.json(
    { message: "User created", userId: user.id },
    { status: 201 },
  );
}
