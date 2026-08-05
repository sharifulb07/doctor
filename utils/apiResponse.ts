import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

// ─── Success Responses ────────────────────────────────────────────────────────

export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200,
  pagination?: ApiResponse["pagination"],
): NextResponse {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(pagination && { pagination }),
  };
  return NextResponse.json(body, { status });
}

export function createdResponse<T>(
  data: T,
  message = "Created successfully",
): NextResponse {
  return successResponse(data, message, 201);
}

// ─── Error Responses ──────────────────────────────────────────────────────────

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string[]>,
): NextResponse {
  const body: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return NextResponse.json(body, { status });
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden"): NextResponse {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = "Not found"): NextResponse {
  return errorResponse(message, 404);
}

export function conflictResponse(message = "Conflict"): NextResponse {
  return errorResponse(message, 409);
}

export function validationErrorResponse(
  errors: Record<string, string[]>,
  message = "Validation failed",
): NextResponse {
  return errorResponse(message, 422, errors);
}

export function serverErrorResponse(
  message = "Internal server error",
): NextResponse {
  return errorResponse(message, 500);
}

export function rateLimitResponse(): NextResponse {
  return errorResponse("Too many requests. Please try again later.", 429);
}
