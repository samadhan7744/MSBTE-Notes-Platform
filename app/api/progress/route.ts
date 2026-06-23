import { NextRequest } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { handleApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { progressSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const body = progressSchema.parse(await request.json());
    const progress = await prisma.progress.upsert({
      where: { userId_conceptId: { userId: user.id, conceptId: body.conceptId } },
      update: { completed: body.completed, lastViewedAt: new Date() },
      create: {
        userId: user.id,
        conceptId: body.conceptId,
        completed: body.completed,
        lastViewedAt: new Date(),
      },
    });
    return ok({ progress });
  } catch (error) {
    return handleApiError(error);
  }
}
