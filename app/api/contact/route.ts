import { NextRequest } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { applyRateLimit } from "@/lib/rateLimiter";
import { logError } from "@/lib/logger";
import {
  errorResponse,
  serverErrorResponse,
  successResponse,
  validationErrorResponse,
} from "@/utils/apiResponse";
import {
  requireSameOrigin,
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizeText,
} from "@/utils/sanitize";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  question: z.string().trim().min(10).max(3000),
});

async function contactHandler(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return validationErrorResponse(
      Object.fromEntries(
        Object.entries(result.error.flatten().fieldErrors).map(
          ([key, messages]) => [key, messages ?? []],
        ),
      ),
    );
  }

  const message = {
    name: sanitizeText(result.data.name),
    email: sanitizeEmail(result.data.email),
    question: sanitizeMultilineText(result.data.question),
  };

  try {
    await sendContactEmail(message);
    return successResponse(null, "Your question has been sent successfully.");
  } catch (error) {
    logError(error, { context: "contact-form", email: message.email });
    return serverErrorResponse("We could not send your message. Please try again.");
  }
}

export const POST = applyRateLimit(contactHandler, "booking");
