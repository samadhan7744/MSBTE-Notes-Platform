import { NextRequest } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { handleApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const [purchases, progress, recentlyViewed] = await Promise.all([
      prisma.purchase.findMany({
        where: { userId: user.id, status: "ACTIVE" },
        include: {
          subject: {
            include: {
              semester: true,
              fullBooks: true,
              chapters: { include: { concepts: true }, orderBy: { order: "asc" } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.progress.findMany({
        where: { userId: user.id },
        include: { concept: { include: { chapter: { include: { subject: true } } } } },
        orderBy: { lastViewedAt: "desc" },
      }),
      prisma.recentlyViewed.findMany({
        where: { userId: user.id },
        include: { subject: true, concept: true },
        orderBy: { viewedAt: "desc" },
        take: 10,
      }),
    ]);

    return ok({ purchases, progress, recentlyViewed });
  } catch (error) {
    return handleApiError(error);
  }
}
