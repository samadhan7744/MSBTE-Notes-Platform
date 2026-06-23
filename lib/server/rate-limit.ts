import { NextRequest } from "next/server";
import { ApiError } from "@/lib/server/errors";

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(request: NextRequest, scope: string, limit = 20, windowMs = 60_000) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const current = hits.get(key);

  if (!current || current.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  current.count += 1;
  if (current.count > limit) {
    throw new ApiError(429, "Too many requests. Please retry shortly.", "RATE_LIMITED");
  }
}
