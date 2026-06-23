import type { z } from "zod";
import {
  blogPostSchema,
  branchSchema,
  chapterSchema,
  conceptSchema,
  fullBookSchema,
  semesterSchema,
  subjectSchema,
} from "@/lib/server/validation";

type AdminResourceConfig = {
  delegate: string;
  schema?: z.ZodObject;
  orderBy?: Record<string, string>;
  include?: Record<string, unknown>;
  select?: Record<string, unknown>;
};

export const adminResources: Record<string, AdminResourceConfig> = {
  branches: {
    delegate: "branch",
    schema: branchSchema,
    orderBy: { name: "asc" },
  },
  semesters: {
    delegate: "semester",
    schema: semesterSchema,
    orderBy: { number: "asc" },
    include: { branch: true },
  },
  subjects: {
    delegate: "subject",
    schema: subjectSchema,
    orderBy: { name: "asc" },
    include: { semester: { include: { branch: true } } },
  },
  "full-books": {
    delegate: "fullBook",
    schema: fullBookSchema,
    orderBy: { title: "asc" },
    include: { subject: true },
  },
  chapters: {
    delegate: "chapter",
    schema: chapterSchema,
    orderBy: { order: "asc" },
    include: { subject: true },
  },
  concepts: {
    delegate: "concept",
    schema: conceptSchema,
    orderBy: { order: "asc" },
    include: { chapter: { include: { subject: true } } },
  },
  users: {
    delegate: "user",
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, mobile: true, role: true, isActive: true, createdAt: true },
  },
  purchases: {
    delegate: "purchase",
    orderBy: { createdAt: "desc" },
    include: { user: true, subject: true, payment: true },
  },
  payments: {
    delegate: "payment",
    orderBy: { createdAt: "desc" },
    include: { user: true, subject: true },
  },
  "support-tickets": {
    delegate: "supportTicket",
    orderBy: { createdAt: "desc" },
    include: { user: true },
  },
  "blog-posts": {
    delegate: "blogPost",
    schema: blogPostSchema,
    orderBy: { createdAt: "desc" },
  },
};

export type AdminResourceName = keyof typeof adminResources;

export function isAdminResource(resource: string): resource is AdminResourceName {
  return resource in adminResources;
}

export type PrismaDelegate = {
  findMany(args: Record<string, unknown>): Promise<unknown>;
  count(args?: Record<string, unknown>): Promise<number>;
  create(args: Record<string, unknown>): Promise<unknown>;
  update(args: Record<string, unknown>): Promise<unknown>;
  delete(args: Record<string, unknown>): Promise<unknown>;
};
