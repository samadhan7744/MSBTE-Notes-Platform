import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { ApiError } from "@/lib/server/errors";
import { env } from "@/lib/server/env";
import { prisma } from "@/lib/server/prisma";

const accessCookie = "msbte_access";
const refreshCookie = "msbte_refresh";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

function secret(value: string) {
  return new TextEncoder().encode(value);
}

async function signToken(user: AuthUser, type: "access" | "refresh") {
  const ttl = type === "access" ? "15m" : "30d";
  const jwtSecret = type === "access" ? env.jwtAccessSecret : env.jwtRefreshSecret;
  return new SignJWT({ role: user.role, email: user.email, name: user.name, tokenType: type })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(secret(jwtSecret));
}

export async function issueAuthCookies(response: NextResponse, user: AuthUser) {
  const accessToken = await signToken(user, "access");
  const refreshToken = await signToken(user, "refresh");
  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash },
  });

  response.cookies.set(accessCookie, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });
  response.cookies.set(refreshCookie, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(accessCookie);
  response.cookies.delete(refreshCookie);
}

async function verifyAccessToken(token?: string): Promise<AuthUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(env.jwtAccessSecret));
    if (payload.tokenType !== "access" || !payload.sub) return null;
    return {
      id: payload.sub,
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function getAuthUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(accessCookie)?.value;
  const user = await verifyAccessToken(token);
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });
  if (!dbUser?.isActive) return null;
  return { id: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role };
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(accessCookie)?.value;
  return verifyAccessToken(token);
}

export async function requireUser(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);
  if (!user) throw new ApiError(401, "Authentication required", "UNAUTHENTICATED");
  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireUser(request);
  if (user.role !== UserRole.ADMIN) {
    throw new ApiError(403, "Admin access required", "FORBIDDEN");
  }
  return user;
}

export async function refreshSession(request: NextRequest, response: NextResponse) {
  const refreshToken = request.cookies.get(refreshCookie)?.value;
  if (!refreshToken) throw new ApiError(401, "Refresh token missing", "UNAUTHENTICATED");

  const { payload } = await jwtVerify(refreshToken, secret(env.jwtRefreshSecret));
  if (payload.tokenType !== "refresh" || !payload.sub) {
    throw new ApiError(401, "Invalid refresh token", "UNAUTHENTICATED");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user?.refreshTokenHash || !user.isActive) {
    throw new ApiError(401, "Refresh token revoked", "UNAUTHENTICATED");
  }

  const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!valid) throw new ApiError(401, "Invalid refresh token", "UNAUTHENTICATED");

  await issueAuthCookies(response, {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}
