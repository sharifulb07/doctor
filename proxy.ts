import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "auth-token";

// Routes requiring authentication
const PROTECTED_ROUTES = [
  "/appointments",
  "/book-appointment",
  "/admin",
  "/dentist",
  "/profile",
];

// Routes only for unauthenticated users
const AUTH_ROUTES = [
  "/login",
  "/register",
];

// Admin-only routes
const ADMIN_ROUTES = ["/admin"];
const DENTIST_ROUTES = ["/dentist"];

type ProxyUser = {
  userId: string;
  email: string;
  role: "admin" | "dentist" | "patient";
};

async function verifyTokenInProxy(token: string): Promise<ProxyUser | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      {
        issuer: "dentist-app",
        audience: "dentist-app-users",
      },
    );

    return {
      userId: String(payload.userId || ""),
      email: String(payload.email || ""),
      role: String(payload.role || "patient") as ProxyUser["role"],
    };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Add security headers to ALL responses
  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  );

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const hasToken = !!token;
  const user = token ? await verifyTokenInProxy(token) : null;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isDentistRoute = DENTIST_ROUTES.some((r) => pathname.startsWith(r));

  // Redirect users with no token away from protected routes
  if (isProtected && !hasToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If a token exists but couldn't be verified in edge runtime,
  // allow request to continue and let server-side guards decide.
  if (isProtected && hasToken && !user) {
    return res;
  }

  // Redirect authenticated users away from auth pages to their role dashboard
  if (isAuthRoute && user) {
    const redirectParam = req.nextUrl.searchParams.get("redirect");
    const isSafeInternalRedirect =
      !!redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//");

    if (isSafeInternalRedirect) {
      const isAdminPath = redirectParam.startsWith("/admin");
      const isDentistPath = redirectParam.startsWith("/dentist");

      const allowedByRole =
        (isAdminPath && user.role === "admin") ||
        (isDentistPath && (user.role === "dentist" || user.role === "admin")) ||
        (!isAdminPath && !isDentistPath);

      if (allowedByRole) {
        return NextResponse.redirect(new URL(redirectParam, req.url));
      }
    }

    const dashboardByRole: Record<string, string> = {
      admin: "/admin",
      dentist: "/dentist",
      patient: "/appointments",
    };
    const target = dashboardByRole[user.role] ?? "/";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // Restrict admin routes to admin users only
  if (isAdminRoute && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Restrict dentist routes to dentist or admin users only
  if (isDentistRoute && user?.role !== "dentist" && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/appointments/:path*",
    "/book-appointment/:path*",
    "/admin/:path*",
    "/dentist/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
