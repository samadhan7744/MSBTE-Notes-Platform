import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { handleApiError, ApiError } from "@/lib/server/errors";
import { savePdf } from "@/lib/server/files";
import { created } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "admin:upload", 30);
    await requireAdmin(request);
    const formData = await request.formData();
    const file = formData.get("file");
    const target = String(formData.get("target") ?? "raw");
    const id = String(formData.get("id") ?? "");

    if (!(file instanceof File)) throw new ApiError(422, "PDF file is required", "FILE_REQUIRED");
    const fileKey = await savePdf(file, target);

    if (target === "full-book" && id) {
      await prisma.fullBook.update({ where: { id }, data: { pdfFileKey: fileKey } });
    }
    if (target === "preview" && id) {
      await prisma.fullBook.update({ where: { id }, data: { previewPdfKey: fileKey } });
    }
    if (target === "concept" && id) {
      await prisma.concept.update({ where: { id }, data: { pdfFileKey: fileKey } });
    }

    return created({ fileKey });
  } catch (error) {
    return handleApiError(error);
  }
}
