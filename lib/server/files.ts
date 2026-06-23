import path from "node:path";
import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { env } from "@/lib/server/env";
import { ApiError } from "@/lib/server/errors";

const maxPdfSize = 25 * 1024 * 1024;

export function sanitizeFileName(name: string) {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  return cleaned.slice(0, 160) || `notes-${Date.now()}.pdf`;
}

export function storagePath(fileKey: string) {
  const root = path.resolve(env.privateStorageDir);
  const target = path.resolve(root, fileKey);
  if (!target.startsWith(root)) {
    throw new ApiError(400, "Invalid file key", "INVALID_FILE_KEY");
  }
  return target;
}

export async function savePdf(file: File, folder = "uploads") {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new ApiError(422, "Only PDF uploads are allowed", "INVALID_FILE_TYPE");
  }
  if (file.size > maxPdfSize) {
    throw new ApiError(422, "PDF file is too large", "FILE_TOO_LARGE");
  }

  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const fileKey = `${folder}/${fileName}`;
  const target = storagePath(fileKey);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await file.arrayBuffer()));
  return fileKey;
}

export async function streamPrivatePdf(fileKey: string) {
  const target = storagePath(fileKey);
  try {
    const info = await stat(target);
    const stream = Readable.toWeb(createReadStream(target)) as ReadableStream;
    return new Response(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(info.size),
        "Content-Disposition": `attachment; filename="${path.basename(target)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    throw new ApiError(404, "PDF file not found in private storage", "FILE_NOT_FOUND");
  }
}
