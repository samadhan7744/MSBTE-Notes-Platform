function required(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: required("JWT_ACCESS_SECRET", "development-access-secret-change-me"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET", "development-refresh-secret-change-me"),
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  privateStorageDir: process.env.PRIVATE_STORAGE_DIR ?? "./storage/private",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};
