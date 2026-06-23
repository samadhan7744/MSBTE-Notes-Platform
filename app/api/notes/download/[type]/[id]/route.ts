import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/server/auth";
import { resolveAccessibleNote, type NoteType } from "@/lib/server/access";
import { handleApiError, ApiError } from "@/lib/server/errors";
import { streamPrivatePdf } from "@/lib/server/files";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const allowedTypes = new Set(["full-book", "concept", "preview"]);

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  try {
    const { type, id } = await params;
    if (!allowedTypes.has(type)) throw new ApiError(400, "Invalid note type", "INVALID_NOTE_TYPE");
    const user = await getAuthUserFromRequest(request);
    const note = await resolveAccessibleNote(type as NoteType, id, user);

    if (user) {
      await prisma.recentlyViewed.create({
        data: { userId: user.id, subjectId: note.subjectId },
      });
    }

    return streamPrivatePdf(note.fileKey);
  } catch (error) {
    return handleApiError(error);
  }
}
