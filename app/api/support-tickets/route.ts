import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/server/auth";
import { handleApiError } from "@/lib/server/errors";
import { created } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rate-limit";
import { supportTicketSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "support:create", 8);
    const user = await getAuthUserFromRequest(request);
    const body = supportTicketSchema.parse(await request.json());
    const ticket = await prisma.supportTicket.create({
      data: { ...body, userId: user?.id },
    });
    return created({ ticket });
  } catch (error) {
    return handleApiError(error);
  }
}
