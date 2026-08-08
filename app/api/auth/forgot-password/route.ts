import { createHash, randomBytes } from "node:crypto";
import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";
import { forgotPasswordSchema, formatZodErrors } from "@/utils/validators";
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
} from "@/utils/apiResponse";
import { applyRateLimit } from "@/lib/rateLimiter";
import { logError } from "@/lib/logger";
import { requireSameOrigin, sanitizeEmail } from "@/utils/sanitize";

const GENERIC_MESSAGE =
  "If an account matches that information, password reset instructions have been sent.";

async function forgotPasswordHandler(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const result = forgotPasswordSchema.safeParse(body);
  if (!result.success) {
    return validationErrorResponse(formatZodErrors(result.error));
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: sanitizeEmail(result.data.email) });
    if (!user || !user.isActive) return successResponse(null, GENERIC_MESSAGE);

    const token = randomBytes(32).toString("hex");
    user.passwordResetToken = createHash("sha256").update(token).digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const resetUrl = new URL("/reset-password", baseUrl);
    resetUrl.searchParams.set("token", token);

    try {
      if (user.email) {
        await sendPasswordResetEmail(user.email, user.name, resetUrl.toString());
      }
    } catch (deliveryError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      throw deliveryError;
    }

    return successResponse(null, GENERIC_MESSAGE);
  } catch (error) {
    logError(error, { context: "forgotPassword" });
    return serverErrorResponse(
      "Password reset instructions could not be sent. Please try again later.",
    );
  }
}

export const POST = applyRateLimit(forgotPasswordHandler, "auth");
