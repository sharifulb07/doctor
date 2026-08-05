import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Dentist from "@/models/Dentist";
import { dentistProfileSchema, formatZodErrors } from "@/utils/validators";
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  forbiddenResponse,
  validationErrorResponse,
  errorResponse,
} from "@/utils/apiResponse";
import { getAuthFromRequest } from "@/lib/auth";
import { UserRole } from "@/types";
import {
  requireSameOrigin,
  sanitizeMultilineText,
  sanitizeText,
} from "@/utils/sanitize";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Context) {
  const { id } = await ctx.params;
  try {
    await connectDB();
    const dentist = await Dentist.findById(id).select("-__v").lean();
    if (!dentist) return notFoundResponse("Dentist not found");
    return successResponse(dentist);
  } catch {
    return serverErrorResponse();
  }
}

export async function PUT(req: NextRequest, ctx: Context) {
  const { id } = await ctx.params;
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

  const result = dentistProfileSchema.safeParse(body);
  if (!result.success)
    return validationErrorResponse(formatZodErrors(result.error));

  const safeData = {
    ...result.data,
    name: sanitizeText(result.data.name),
    email: sanitizeText(result.data.email).toLowerCase(),
    specialization: sanitizeText(result.data.specialization),
    qualifications: result.data.qualifications.map((item) =>
      sanitizeText(item),
    ),
    experience: result.data.experience,
    bio: sanitizeMultilineText(result.data.bio),
    clinicLocation: sanitizeText(result.data.clinicLocation),
    clinicPhone: sanitizeText(result.data.clinicPhone),
    photo: sanitizeText(result.data.photo),
    availableDays: result.data.availableDays.map((item) => sanitizeText(item)),
    availableTimeSlots: result.data.availableTimeSlots.map((item) =>
      sanitizeText(item),
    ),
    consultationFee: result.data.consultationFee,
  };

  try {
    await connectDB();
    const dentist = await Dentist.findById(id);
    if (!dentist) return notFoundResponse("Dentist not found");

    // Only admin or the dentist themselves can update
    const isOwner = dentist.userId.toString() === auth.userId;
    const isAdmin = auth.role === UserRole.ADMIN;
    if (!isOwner && !isAdmin) return forbiddenResponse("Permission denied");

    Object.assign(dentist, safeData);
    await dentist.save();

    return successResponse(dentist, "Profile updated successfully");
  } catch {
    return serverErrorResponse();
  }
}
