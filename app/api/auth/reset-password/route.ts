import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { resetPasswordSchema, formatZodErrors } from "@/utils/validators";
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
} from "@/utils/apiResponse";
import { applyRateLimit } from "@/lib/rateLimiter";
import { logError } from "@/lib/logger";
import { requireSameOrigin } from "@/utils/sanitize";

async function resetPasswordHandler(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const result = resetPasswordSchema.safeParse(body);
  if (!result.success) {
    return validationErrorResponse(formatZodErrors(result.error));
  }

  try {
    await connectDB();
    const tokenHash = createHash("sha256")
      .update(result.data.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
      isActive: true,
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return errorResponse("This password reset link is invalid or has expired.", 400);
    }

    user.password = result.data.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    return successResponse(null, "Your password has been reset successfully.");
  } catch (error) {
    logError(error, { context: "resetPassword" });
    return serverErrorResponse();
  }
}

export const POST = applyRateLimit(resetPasswordHandler, "auth");
