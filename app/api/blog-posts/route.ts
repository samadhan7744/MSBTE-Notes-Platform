import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { paginationSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const query = paginationSchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const where = {
      published: true,
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: "insensitive" as const } },
              { content: { contains: query.q, mode: "insensitive" as const } },
              { keywords: { contains: query.q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.blogPost.count({ where }),
    ]);
    return ok({ posts, pagination: { page: query.page, limit: query.limit, total } });
  } catch (error) {
    return handleApiError(error);
  }
}
