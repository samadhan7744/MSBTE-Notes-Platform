import { NextRequest } from "next/server";
import { PaymentStatus, PurchaseStatus } from "@prisma/client";
import { requireUser } from "@/lib/server/auth";
import { handleApiError, ApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rate-limit";
import { verifyRazorpaySignature } from "@/lib/server/razorpay";
import { verifyPaymentSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "payments:verify", 20);
    const user = await requireUser(request);
    const body = verifyPaymentSchema.parse(await request.json());
    const payment = await prisma.payment.findUnique({ where: { id: body.paymentId } });
    if (!payment || payment.userId !== user.id) throw new ApiError(404, "Payment not found", "NOT_FOUND");
    if (payment.providerOrderId !== body.razorpayOrderId) {
      throw new ApiError(400, "Payment order mismatch", "ORDER_MISMATCH");
    }

    const valid = verifyRazorpaySignature(body.razorpayOrderId, body.razorpayPaymentId, body.razorpaySignature);
    if (!valid) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: PaymentStatus.FAILED } });
      throw new ApiError(400, "Invalid payment signature", "INVALID_SIGNATURE");
    }

    const result = await prisma.$transaction(async (tx) => {
      const paid = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
          providerPaymentId: body.razorpayPaymentId,
          providerSignature: body.razorpaySignature,
        },
      });

      const purchase = await tx.purchase.upsert({
        where: { userId_subjectId: { userId: user.id, subjectId: payment.subjectId } },
        update: { status: PurchaseStatus.ACTIVE, paymentId: paid.id },
        create: {
          userId: user.id,
          subjectId: payment.subjectId,
          paymentId: paid.id,
          status: PurchaseStatus.ACTIVE,
        },
      });

      return { payment: paid, purchase };
    });

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
