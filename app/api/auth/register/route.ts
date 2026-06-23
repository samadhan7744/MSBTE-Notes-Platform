import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { handleApiError, ApiError } from "@/lib/server/errors";
import { issueAuthCookies } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rate-limit";
import { registerSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "auth:register", 10);
    const body = registerSchema.parse(await request.json());
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new ApiError(409, "Email is already registered", "EMAIL_EXISTS");

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        passwordHash: await bcrypt.hash(body.password, 12),
        role: UserRole.STUDENT,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    const response = NextResponse.json({ data: { user } }, { status: 201 });
    await issueAuthCookies(response, user);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
