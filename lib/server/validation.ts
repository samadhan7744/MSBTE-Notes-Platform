import { z } from "zod";

export const idSchema = z.string().min(8);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  q: z.string().trim().optional(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  mobile: z.string().trim().min(7).max(15).optional(),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1).max(72),
});

export const supportTicketSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  mobile: z.string().trim().min(7).max(15).optional(),
  category: z.string().trim().min(2).max(50),
  message: z.string().trim().min(10).max(2000),
});

export const progressSchema = z.object({
  conceptId: z.string().min(8),
  completed: z.boolean(),
});

export const createOrderSchema = z.object({
  subjectId: z.string().min(8),
});

export const verifyPaymentSchema = z.object({
  paymentId: z.string().min(8),
  razorpayOrderId: z.string().min(3),
  razorpayPaymentId: z.string().min(3),
  razorpaySignature: z.string().min(10),
});

export const branchSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120),
});

export const semesterSchema = z.object({
  branchId: z.string().min(8),
  name: z.string().trim().min(2).max(60),
  number: z.number().int().min(1).max(12),
});

export const subjectSchema = z.object({
  semesterId: z.string().min(8),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140),
  description: z.string().trim().min(10).max(3000),
  price: z.number().int().min(0),
  isFree: z.boolean(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
});

export const fullBookSchema = z.object({
  subjectId: z.string().min(8),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(3000),
  pdfFileKey: z.string().trim().min(3).max(500),
  previewPdfKey: z.string().trim().min(3).max(500).optional(),
  price: z.number().int().min(0),
  isFree: z.boolean(),
});

export const chapterSchema = z.object({
  subjectId: z.string().min(8),
  title: z.string().trim().min(2).max(160),
  order: z.number().int().min(1),
});

export const conceptSchema = z.object({
  chapterId: z.string().min(8),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(3000),
  pdfFileKey: z.string().trim().min(3).max(500).optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  isFree: z.boolean(),
  order: z.number().int().min(1),
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(180),
  content: z.string().trim().min(20),
  metaTitle: z.string().trim().max(160).optional(),
  metaDescription: z.string().trim().max(300).optional(),
  keywords: z.string().trim().max(300).optional(),
  published: z.boolean().default(false),
});
