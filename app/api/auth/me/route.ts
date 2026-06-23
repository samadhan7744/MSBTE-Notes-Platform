import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/server/auth";
import { handleApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    return ok({ user: await getAuthUserFromRequest(request) });
  } catch (error) {
    return handleApiError(error);
  }
}
