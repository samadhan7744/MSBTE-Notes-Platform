import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { handleApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { paginationSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const query = paginationSchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const q = query.q ?? "";
    const subjectWhere: Prisma.SubjectWhereInput = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { semester: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {};
    const conceptWhere: Prisma.ConceptWhereInput = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { chapter: { title: { contains: q, mode: "insensitive" } } },
            { chapter: { subject: { name: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {};

    const [subjects, concepts] = await Promise.all([
      prisma.subject.findMany({
        where: subjectWhere,
        include: { semester: true },
        take: query.limit,
        skip: (query.page - 1) * query.limit,
      }),
      prisma.concept.findMany({
        where: conceptWhere,
        include: { chapter: { include: { subject: true } } },
        take: query.limit,
        skip: (query.page - 1) * query.limit,
      }),
    ]);

    return ok({ subjects, concepts, pagination: { page: query.page, limit: query.limit } });
  } catch (error) {
    return handleApiError(error);
  }
}
