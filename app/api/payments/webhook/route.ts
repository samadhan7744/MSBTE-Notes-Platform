import { NextRequest } from "next/server";
import { PaymentStatus, PurchaseStatus } from "@prisma/client";
import { handleApiError, ApiError } from "@/lib/server/errors";
import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { verifyWebhookSignature } from "@/lib/server/razorpay";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      throw new ApiError(400, "Invalid webhook signature", "INVALID_SIGNATURE");
    }

    const event = JSON.parse(rawBody);
    if (event.event === "payment.failed") {
      const orderId = event.payload?.payment?.entity?.order_id;
      if (orderId) {
        await prisma.payment.updateMany({
          where: { providerOrderId: orderId },
          data: { status: PaymentStatus.FAILED },
        });
      }
    }

    if (event.event === "payment.captured") {
      const entity = event.payload?.payment?.entity;
      const orderId = entity?.order_id;
      if (orderId) {
        const payment = await prisma.payment.update({
          where: { providerOrderId: orderId },
          data: {
            status: PaymentStatus.PAID,
            providerPaymentId: entity.id,
          },
        });
        await prisma.purchase.upsert({
          where: { userId_subjectId: { userId: payment.userId, subjectId: payment.subjectId } },
          update: { status: PurchaseStatus.ACTIVE, paymentId: payment.id },
          create: {
            userId: payment.userId,
            subjectId: payment.subjectId,
            paymentId: payment.id,
            status: PurchaseStatus.ACTIVE,
          },
        });
      }
    }

    return ok({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}
