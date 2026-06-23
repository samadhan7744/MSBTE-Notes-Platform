import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const branchId = request.nextUrl.searchParams.get("branchId") ?? undefined;
    const semesters = await prisma.semester.findMany({
      where: { branchId },
      include: { branch: true },
      orderBy: { number: "asc" },
    });
    return ok({ semesters });
  } catch (error) {
    return handleApiError(error);
  }
}
