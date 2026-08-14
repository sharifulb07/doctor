import { SignJWT, jwtVerify } from "jose";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { UserRole, JwtPayload, AuthUser } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "auth-token";

// Session expires after 30 minutes
const SESSION_DURATION_SECONDS = 60 * 30;
const TOKEN_EXPIRY = "30m";

if (!JWT_SECRET || new TextEncoder().encode(JWT_SECRET).length < 32) {
  throw new Error("JWT_SECRET must be set and contain at least 32 bytes");
}

const secret = new TextEncoder().encode(JWT_SECRET);

// ─── Token Generation ─────────────────────────────────────────────

export async function generateToken(payload: {
  userId: string;
  email: string;
  role: UserRole;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .setIssuer("dentist-app")
    .setAudience("dentist-app-users")
    .sign(secret);
}

// ─── Token Verification ───────────────────────────────────────────

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: "dentist-app",
      audience: "dentist-app-users",
    });

    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

// ─── Cookie Helpers ───────────────────────────────────────────────

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",

    // Must match JWT lifetime
    maxAge: SESSION_DURATION_SECONDS,

    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

// ─── Request Auth Extraction ──────────────────────────────────────

export async function getAuthFromRequest(
  req: NextRequest,
): Promise<AuthUser | null> {
  const authorization = req.headers.get("authorization");
  const bearerMatch = authorization?.match(/^Bearer\s+([^\s]+)$/i);
  const token = req.cookies.get(COOKIE_NAME)?.value || bearerMatch?.[1];

  if (!token) return null;

  const payload = await verifyToken(token);

  if (!payload) return null;

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}

// ─── Server-Side Auth ─────────────────────────────────────────────

export async function getServerAuth(): Promise<AuthUser | null> {
  noStore();

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = await verifyToken(token);

  if (!payload) return null;

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}

// ─── Role Helpers ─────────────────────────────────────────────────

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === UserRole.ADMIN;
}

export function isDentist(user: AuthUser | null): boolean {
  return user?.role === UserRole.DENTIST || user?.role === UserRole.ADMIN;
}

export function isPatient(user: AuthUser | null): boolean {
  return user?.role === UserRole.PATIENT;
}

export function hasRole(user: AuthUser | null, ...roles: UserRole[]): boolean {
  return !!user && roles.includes(user.role);
}
