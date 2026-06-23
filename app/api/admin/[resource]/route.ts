import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { adminResources, isAdminResource, type PrismaDelegate } from "@/lib/server/admin-resources";
import { handleApiError, ApiError } from "@/lib/server/errors";
import { created, ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { paginationSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

function getDelegate(resource: string) {
  if (!isAdminResource(resource)) throw new ApiError(404, "Admin resource not found", "NOT_FOUND");
  const config = adminResources[resource];
  return { config, delegate: (prisma as unknown as Record<string, PrismaDelegate>)[config.delegate as string] };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  try {
    await requireAdmin(request);
    const { resource } = await params;
    const { config, delegate } = getDelegate(resource);
    const query = paginationSchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const args = {
      orderBy: config.orderBy,
      include: config.include,
      select: config.select,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    };
    const [items, total] = await Promise.all([delegate.findMany(args), delegate.count()]);
    return ok({ items, pagination: { page: query.page, limit: query.limit, total } });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  try {
    await requireAdmin(request);
    const { resource } = await params;
    const { config, delegate } = getDelegate(resource);
    if (!config.schema) throw new ApiError(405, "Resource is read-only", "READ_ONLY_RESOURCE");
    const data = config.schema.parse(await request.json());
    const item = await delegate.create({ data });
    return created({ item });
  } catch (error) {
    return handleApiError(error);
  }
}
