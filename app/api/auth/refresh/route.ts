import { NextRequest, NextResponse } from "next/server";
import { refreshSession } from "@/lib/server/auth";
import { handleApiError } from "@/lib/server/errors";
import { rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "auth:refresh", 30);
    const response = NextResponse.json({ data: { ok: true } });
    await refreshSession(request, response);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
