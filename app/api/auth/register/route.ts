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

  const { name, email, password, phone, dateOfBirth } = result.data;

  try {
    await connectDB();

    // Check for existing email
    const existing = await User.findOne({ email: sanitizeEmail(email) });
    if (existing) {
      return conflictResponse("An account with this email already exists");
    }

    const user = await User.create({
      name: sanitizeText(name),
      email: sanitizeEmail(email),
      password,
      role: UserRole.PATIENT,
      ...(phone && { phone: sanitizeText(phone) }),
      ...(dateOfBirth && { dateOfBirth: new Date(sanitizeText(dateOfBirth)) }),
    });

    // Fire-and-forget welcome email
    sendWelcomeEmail(sanitizeEmail(email), sanitizeText(name)).catch((err) =>
      logError(err, {
        context: "sendWelcomeEmail",
        email: sanitizeEmail(email),
      }),
    );

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
    logError(error, { context: "register", email, ip });
    return serverErrorResponse();
  }
}

export const POST = applyRateLimit(registerHandler, "auth");
