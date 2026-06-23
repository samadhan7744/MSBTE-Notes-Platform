import crypto from "node:crypto";
import Razorpay from "razorpay";
import { ApiError } from "@/lib/server/errors";
import { env } from "@/lib/server/env";

export function razorpayClient() {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    throw new ApiError(503, "Razorpay credentials are not configured", "PAYMENT_PROVIDER_UNAVAILABLE");
  }

  return new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret,
  });
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  if (!env.razorpayKeySecret) {
    throw new ApiError(503, "Razorpay credentials are not configured", "PAYMENT_PROVIDER_UNAVAILABLE");
  }

  const expected = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  if (!env.razorpayWebhookSecret) {
    throw new ApiError(503, "Razorpay webhook secret is not configured", "PAYMENT_PROVIDER_UNAVAILABLE");
  }

  const expected = crypto.createHmac("sha256", env.razorpayWebhookSecret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
