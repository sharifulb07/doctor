import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextRequest, NextResponse } from "next/server";
import { rateLimitResponse } from "@/utils/apiResponse";
import { logSecurity } from "@/lib/logger";

// ─── Rate Limiter Instances ───────────────────────────────────────────────────

/**
 * Strict limiter for auth endpoints (login / register)
 * Max 10 attempts per 15 minutes per IP
 */
const authLimiter = new RateLimiterMemory({
  keyPrefix: "auth",
  points: 10,
  duration: 60 * 15, // 15 minutes
  blockDuration: 60 * 15,
});

/**
 * Standard API limiter
 * Max 100 requests per minute per IP
 */
const apiLimiter = new RateLimiterMemory({
  keyPrefix: "api",
  points: 100,
  duration: 60,
  blockDuration: 60,
});

/**
 * Booking limiter — prevent spam bookings
 * Max 5 bookings per 10 minutes per IP
 */
const bookingLimiter = new RateLimiterMemory({
  keyPrefix: "booking",
  points: 5,
  duration: 60 * 10,
  blockDuration: 60 * 10,
});

// ─── IP Extraction ────────────────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // Take only the first IP from the list; strip unwanted characters
    const first = forwarded.split(",")[0].trim();
    // Basic IPv4/IPv6 validation — reject anything suspicious
    if (/^[\d.:a-f]+$/i.test(first)) return first;
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

// ─── Middleware Factories ─────────────────────────────────────────────────────

export function withRateLimit(limiter: RateLimiterMemory, label: string) {
  return async function applyLimit(
    req: NextRequest,
    next: () => Promise<NextResponse>,
  ): Promise<NextResponse> {
    const ip = getClientIp(req);

    try {
      await limiter.consume(ip);
      return next();
    } catch {
      logSecurity(`Rate limit exceeded [${label}]`, {
        ip,
        path: req.nextUrl.pathname,
      });
      return rateLimitResponse();
    }
  };
}

/**
 * Higher-order helper: wraps a route handler with a specific limiter.
 */
export function applyRateLimit(
  handler: (
    req: NextRequest,
    context: Record<string, unknown>,
  ) => Promise<NextResponse>,
  limiterType: "auth" | "api" | "booking" = "api",
) {
  const limiterMap = {
    auth: authLimiter,
    api: apiLimiter,
    booking: bookingLimiter,
  };
  const limiter = limiterMap[limiterType];

  return async (
    req: NextRequest,
    context: Record<string, unknown>,
  ): Promise<NextResponse> => {
    const ip = getClientIp(req);

    try {
      await limiter.consume(ip);
    } catch {
      logSecurity(`Rate limit exceeded [${limiterType}]`, {
        ip,
        path: req.nextUrl.pathname,
      });
      return rateLimitResponse();
    }

    return handler(req, context);
  };
}

export { authLimiter, apiLimiter, bookingLimiter, getClientIp };
