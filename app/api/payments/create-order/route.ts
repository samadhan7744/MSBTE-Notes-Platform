import { NextRequest } from "next/server";
import { PaymentStatus } from "@prisma/client";
import { requireUser } from "@/lib/server/auth";
import { handleApiError, ApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rate-limit";
import { razorpayClient } from "@/lib/server/razorpay";
import { createOrderSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "payments:create", 10);
    const user = await requireUser(request);
    const body = createOrderSchema.parse(await request.json());
    const subject = await prisma.subject.findUnique({ where: { id: body.subjectId } });
    if (!subject) throw new ApiError(404, "Subject not found", "NOT_FOUND");
    if (subject.isFree || subject.price <= 0) throw new ApiError(400, "Subject is free", "SUBJECT_IS_FREE");

    const existingPurchase = await prisma.purchase.findUnique({
      where: { userId_subjectId: { userId: user.id, subjectId: subject.id } },
    });
    if (existingPurchase?.status === "ACTIVE") {
      throw new ApiError(409, "Subject already purchased", "DUPLICATE_PURCHASE");
    }

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        subjectId: subject.id,
        provider: "RAZORPAY",
        amount: subject.price,
        status: PaymentStatus.CREATED,
      },
    });

    const order = await razorpayClient().orders.create({
      amount: subject.price,
      currency: "INR",
      receipt: payment.id,
      notes: { userId: user.id, subjectId: subject.id },
    });

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: { providerOrderId: order.id },
    });

    return ok({
      payment: updated,
      razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
