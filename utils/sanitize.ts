import { NextRequest } from "next/server";
import { errorResponse } from "./apiResponse";

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

export function sanitizeText(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .normalize("NFKC")
    .replace(CONTROL_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeMultilineText(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

export function sanitizeEmail(value: unknown): string {
  return sanitizeText(value).toLowerCase();
}

export function sanitizeId(value: unknown): string {
  return sanitizeText(value);
}

export function sanitizeStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];

  return values
    .map((item) => sanitizeText(item))
    .filter((item) => item.length > 0);
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function requireSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL, req.nextUrl.origin]
    .filter(Boolean)
    .map((entry) => new URL(entry as string).origin);

  const requestOrigin = origin
    ? origin
    : referer
      ? (() => {
          try {
            return new URL(referer).origin;
          } catch {
            return "";
          }
        })()
      : "";

  if (requestOrigin && !allowedOrigins.includes(requestOrigin)) {
    return errorResponse("Invalid request origin", 403);
  }

  return null;
}
