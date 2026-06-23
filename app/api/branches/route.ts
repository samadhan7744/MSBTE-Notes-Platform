import { handleApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
    return ok({ branches });
  } catch (error) {
    return handleApiError(error);
  }
}
