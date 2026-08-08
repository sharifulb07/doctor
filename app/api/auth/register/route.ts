import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { registerSchema, formatZodErrors } from "@/utils/validators";
import {
  createdResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
  conflictResponse,
} from "@/utils/apiResponse";
import { logError } from "@/lib/logger";
import { applyRateLimit, getClientIp } from "@/lib/rateLimiter";
import { UserRole } from "@/types";
import { sendWelcomeEmail } from "@/lib/email";
import {
  requireSameOrigin,
  sanitizeEmail,
  sanitizeText,
} from "@/utils/sanitize";

async function registerHandler(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const ip = getClientIp(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return validationErrorResponse(formatZodErrors(result.error));
  }

  const { identifier, password } = result.data;
  const isEmail = identifier.includes("@");
  const email = isEmail ? sanitizeEmail(identifier) : undefined;
  const phone = isEmail ? undefined : sanitizeText(identifier);

  try {
    await connectDB();

    const existing = await User.findOne(isEmail ? { email } : { phone });
    if (existing) {
      return conflictResponse(
        `An account with this ${isEmail ? "email" : "mobile number"} already exists`,
      );
    }

    const user = await User.create({
      name: "Patient",
      ...(email && { email }),
      password,
      role: UserRole.PATIENT,
      ...(phone && { phone }),
    });

    if (email) {
      sendWelcomeEmail(email, "Patient").catch((err) =>
        logError(err, { context: "sendWelcomeEmail", email }),
      );
    }

    return createdResponse(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Account created successfully",
    );
  } catch (error) {
    logError(error, { context: "register", email: identifier, ip });
    return serverErrorResponse();
  }
}

export const POST = applyRateLimit(registerHandler, "auth");
