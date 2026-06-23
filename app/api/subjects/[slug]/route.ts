import { NextRequest } from "next/server";
import { handleApiError, ApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const subject = await prisma.subject.findUnique({
      where: { slug },
      include: {
        semester: { include: { branch: true } },
        fullBooks: true,
        chapters: { include: { concepts: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
      },
    });
    if (!subject) throw new ApiError(404, "Subject not found", "NOT_FOUND");
    return ok({ subject });
  } catch (error) {
    return handleApiError(error);
  }
}
