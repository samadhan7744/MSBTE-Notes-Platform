import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { handleApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { paginationSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const query = paginationSchema.extend({
      semester: paginationSchema.shape.page.optional(),
      branch: paginationSchema.shape.q.optional(),
    }).parse(Object.fromEntries(request.nextUrl.searchParams));
    const where: Prisma.SubjectWhereInput = {
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { description: { contains: query.q, mode: "insensitive" } },
              { chapters: { some: { title: { contains: query.q, mode: "insensitive" } } } },
              { chapters: { some: { concepts: { some: { title: { contains: query.q, mode: "insensitive" } } } } } },
            ],
          }
        : {}),
      ...(query.semester ? { semester: { number: query.semester } } : {}),
      ...(query.branch ? { semester: { branch: { slug: query.branch } } } : {}),
    };

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        include: { semester: { include: { branch: true } }, fullBooks: true },
        orderBy: { name: "asc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.subject.count({ where }),
    ]);

    return ok({ subjects, pagination: { page: query.page, limit: query.limit, total } });
  } catch (error) {
    return handleApiError(error);
  }
}
