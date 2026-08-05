import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Availability from "@/models/Availability";
import Dentist from "@/models/Dentist";
import { availabilitySchema, formatZodErrors } from "@/utils/validators";
import {
  successResponse,
  createdResponse,
  forbiddenResponse,
  notFoundResponse,
  validationErrorResponse,
  serverErrorResponse,
  errorResponse,
} from "@/utils/apiResponse";
import { getAuthFromRequest } from "@/lib/auth";
import { UserRole } from "@/types";
import { requireSameOrigin, sanitizeId } from "@/utils/sanitize";

type Context = { params: Promise<{ dentistId: string }> };

/**
 * GET /api/availability/[dentistId] — list all future availability for a dentist
 */
export async function GET(_req: NextRequest, ctx: Context) {
  const { dentistId } = await ctx.params;
  try {
    await connectDB();
    const records = await Availability.find({
      dentistId,
      date: { $gte: new Date() },
      isAvailable: true,
    })
      .sort({ date: 1 })
      .lean();

    return successResponse(records);
  } catch {
    return serverErrorResponse();
  }
}

/**
 * POST /api/availability/[dentistId] — create or replace availability for a date
 */
export async function POST(req: NextRequest, ctx: Context) {
  const { dentistId } = await ctx.params;
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const auth = await getAuthFromRequest(req);
  if (!auth) return forbiddenResponse("Authentication required");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return errorResponse("Request body must be a JSON object");
  }

  const result = availabilitySchema.safeParse({
    ...body,
    dentistId: sanitizeId(dentistId),
  });
  if (!result.success)
    return validationErrorResponse(formatZodErrors(result.error));

  try {
    await connectDB();

    const dentist = await Dentist.findById(dentistId);
    if (!dentist) return notFoundResponse("Dentist not found");

    const isOwner = dentist.userId.toString() === auth.userId;
    const isAdmin = auth.role === UserRole.ADMIN;
    if (!isOwner && !isAdmin) return forbiddenResponse("Permission denied");

    const dateObj = new Date(result.data.date);
    const startOfDay = new Date(dateObj);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(dateObj);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const timeSlots = result.data.timeSlots.map((t: string) => ({
      time: t,
      isBooked: false,
    }));

    const availability = await Availability.findOneAndUpdate(
      { dentistId, date: { $gte: startOfDay, $lte: endOfDay } },
      {
        dentistId,
        date: dateObj,
        timeSlots,
        isAvailable: result.data.isAvailable,
      },
      { upsert: true, new: true, runValidators: true },
    );

    return createdResponse(availability, "Availability set successfully");
  } catch {
    return serverErrorResponse();
  }
}
