import { UserRole } from "@prisma/client";
import { ApiError } from "@/lib/server/errors";
import { prisma } from "@/lib/server/prisma";
import type { AuthUser } from "@/lib/server/auth";

export type NoteType = "full-book" | "concept" | "preview";

export async function resolveAccessibleNote(type: NoteType, id: string, user: AuthUser | null) {
  if (type === "full-book" || type === "preview") {
    const book = await prisma.fullBook.findUnique({
      where: { id },
      include: { subject: true },
    });
    if (!book) throw new ApiError(404, "Full book not found", "NOT_FOUND");

    if (type === "preview") {
      if (!book.previewPdfKey) throw new ApiError(404, "Preview PDF not available", "NOT_FOUND");
      return { fileKey: book.previewPdfKey, subjectId: book.subjectId };
    }

    if (book.isFree || book.subject.isFree) {
      return { fileKey: book.pdfFileKey, subjectId: book.subjectId };
    }
    await assertPurchasedOrAdmin(user, book.subjectId);
    return { fileKey: book.pdfFileKey, subjectId: book.subjectId };
  }

  const concept = await prisma.concept.findUnique({
    where: { id },
    include: { chapter: { include: { subject: true } } },
  });
  if (!concept) throw new ApiError(404, "Concept not found", "NOT_FOUND");
  if (!concept.pdfFileKey) throw new ApiError(404, "Concept PDF not available", "NOT_FOUND");

  if (concept.isFree || concept.chapter.subject.isFree) {
    return { fileKey: concept.pdfFileKey, subjectId: concept.chapter.subjectId };
  }
  await assertPurchasedOrAdmin(user, concept.chapter.subjectId);
  return { fileKey: concept.pdfFileKey, subjectId: concept.chapter.subjectId };
}

async function assertPurchasedOrAdmin(user: AuthUser | null, subjectId: string) {
  if (!user) throw new ApiError(401, "Login required to access paid notes", "UNAUTHENTICATED");
  if (user.role === UserRole.ADMIN) return;

  const purchase = await prisma.purchase.findUnique({
    where: { userId_subjectId: { userId: user.id, subjectId } },
    select: { status: true },
  });

  if (purchase?.status !== "ACTIVE") {
    throw new ApiError(402, "Purchase required to download this note", "PAYMENT_REQUIRED");
  }
}
