import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { adminResources, isAdminResource, type PrismaDelegate } from "@/lib/server/admin-resources";
import { handleApiError, ApiError } from "@/lib/server/errors";
import { noContent, ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

function getDelegate(resource: string) {
  if (!isAdminResource(resource)) throw new ApiError(404, "Admin resource not found", "NOT_FOUND");
  const config = adminResources[resource];
  return { config, delegate: (prisma as unknown as Record<string, PrismaDelegate>)[config.delegate as string] };
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  try {
    await requireAdmin(request);
    const { resource, id } = await params;
    const { config, delegate } = getDelegate(resource);
    if (!config.schema) throw new ApiError(405, "Resource is read-only", "READ_ONLY_RESOURCE");
    const data = config.schema.partial().parse(await request.json());
    const item = await delegate.update({ where: { id }, data });
    return ok({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  try {
    await requireAdmin(request);
    const { resource, id } = await params;
    const { delegate } = getDelegate(resource);
    await delegate.delete({ where: { id } });
    return noContent();
  } catch (error) {
    return handleApiError(error);
  }
}
