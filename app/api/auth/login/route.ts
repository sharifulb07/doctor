import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken, setAuthCookie } from "@/lib/auth";
import { loginSchema, formatZodErrors } from "@/utils/validators";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/apiResponse";
import { logAuth, logError } from "@/lib/logger";
import { applyRateLimit, getClientIp } from "@/lib/rateLimiter";
import { UserRole } from "@/types";
import { requireSameOrigin, sanitizeEmail } from "@/utils/sanitize";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

async function loginHandler(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent") || "";

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return validationErrorResponse(formatZodErrors(result.error));
  }

  const { role, email, password } = result.data;

  try {
    await connectDB();

    // Include password explicitly since it's select: false
    const user = await User.findOne({ email: sanitizeEmail(email) }).select(
      "+password",
    );

    if (!user || !user.isActive || user.role !== role) {
      logAuth({
        email: sanitizeEmail(email),
        ip,
        userAgent,
        success: false,
        reason: "User not found, inactive, or role mismatch",
      });
      return unauthorizedResponse("Invalid email or password");
    }

    // Check account lock
    if (user.isLocked()) {
      logAuth({
        email: sanitizeEmail(email),
        ip,
        userAgent,
        success: false,
        reason: "Account locked",
      });
      return errorResponse(
        "Account is temporarily locked due to multiple failed attempts. Please try again later.",
        423,
      );
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        logAuth({
          email: sanitizeEmail(email),
          ip,
          userAgent,
          success: false,
          reason: "Account locked after max attempts",
        });
      }
      await user.save();
      logAuth({
        email: sanitizeEmail(email),
        ip,
        userAgent,
        success: false,
        reason: "Invalid password",
      });
      return unauthorizedResponse("Invalid email or password");
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = await generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    });

    await setAuthCookie(token);

    logAuth({ email, ip, userAgent, success: true });

    return successResponse(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful",
    );
  } catch (error) {
    logError(error, { context: "login", email });
    return serverErrorResponse();
  }
}

export const POST = applyRateLimit(loginHandler, "auth");
