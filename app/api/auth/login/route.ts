import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError, ApiError } from "@/lib/server/errors";
import { issueAuthCookies } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rate-limit";
import { loginSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "auth:login", 15);
    const body = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user?.isActive) throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");

    const authUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    const response = NextResponse.json({ data: { user: authUser } });
    await issueAuthCookies(response, authUser);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
