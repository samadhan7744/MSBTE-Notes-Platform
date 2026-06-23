import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, getAuthUserFromRequest } from "@/lib/server/auth";
import { handleApiError } from "@/lib/server/errors";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (user) {
      await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash: null } });
    }
    const response = NextResponse.json({ data: { ok: true } });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
