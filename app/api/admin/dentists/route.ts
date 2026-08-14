import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Dentist from "@/models/Dentist";
import {
  successResponse,
  createdResponse,
  forbiddenResponse,
  validationErrorResponse,
  serverErrorResponse,
  conflictResponse,
  errorResponse,
} from "@/utils/apiResponse";
import { getAuthFromRequest } from "@/lib/auth";
import { UserRole } from "@/types";
import { dentistProfileSchema, formatZodErrors } from "@/utils/validators";
import {
  requireSameOrigin,
  escapeRegExp,
  sanitizeId,
  sanitizeMultilineText,
  sanitizeText,
} from "@/utils/sanitize";

/**
 * GET /api/admin/dentists  — list all dentists (admin only)
 * POST /api/admin/dentists — create dentist profile (admin only)
 */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== UserRole.ADMIN)
    return forbiddenResponse("Admin access required");

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") || "12", 10)),
  );
  const search = (searchParams.get("search") || "").trim();

  try {
    await connectDB();

    const query: Record<string, unknown> = {};
    if (search) {
      const safeSearch = escapeRegExp(search);
      query.$or = [
        { name: new RegExp(safeSearch, "i") },
        { email: new RegExp(safeSearch, "i") },
        { specialization: new RegExp(safeSearch, "i") },
        { clinicLocation: new RegExp(safeSearch, "i") },
      ];
    }

    const skip = (page - 1) * limit;
    const [dentists, total] = await Promise.all([
      Dentist.find(query)
        .select(
          "name email photo specialization experience consultationFee rating isActive bio clinicPhone clinicLocation qualifications availableDays availableTimeSlots availableDayTimes maxAppointmentsPerDay createdAt",
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Dentist.countDocuments(query),
    ]);

    return successResponse(
      {
        dentists,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Dentists retrieved",
    );
  } catch {
    return serverErrorResponse();
  }
}

export async function POST(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== UserRole.ADMIN)
    return forbiddenResponse("Admin access required");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const bodyObj = body as Record<string, unknown>;
  const result = dentistProfileSchema.safeParse(bodyObj);
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
    bio: sanitizeMultilineText(result.data.bio),
    clinicLocation: sanitizeText(result.data.clinicLocation),
    clinicPhone: sanitizeText(result.data.clinicPhone),
    photo: sanitizeText(result.data.photo),
    availableDays: result.data.availableDays.map((item) => sanitizeText(item)),
    availableTimeSlots: result.data.availableTimeSlots.map((item) =>
      sanitizeText(item),
    ),
    availableDayTimes: Object.fromEntries(
      Object.entries(result.data.availableDayTimes || {}).map(
        ([day, ranges]) => [
          sanitizeText(day),
          ranges.map((range) => ({
            startTime: sanitizeText(range.startTime),
            endTime: sanitizeText(range.endTime),
          })),
        ],
      ),
    ),
    maxAppointmentsPerDay: result.data.maxAppointmentsPerDay,
  };

  const email = safeData.email;

  try {
    await connectDB();

    // Check if a user with this email exists (dentist user account)
    let dentistUser = await User.findOne({ email });
    if (dentistUser && dentistUser.role !== UserRole.DENTIST) {
      return conflictResponse(
        "A non-dentist user with this email already exists",
      );
    }

    // Create user account if not existing
    if (!dentistUser) {
      if (!bodyObj.password || typeof bodyObj.password !== "string") {
        return errorResponse(
          "password is required when creating a new dentist user",
          400,
        );
      }
      dentistUser = await User.create({
        name: safeData.name,
        email,
        password: bodyObj.password,
        role: UserRole.DENTIST,
      });
    }

    const existing = await Dentist.findOne({ userId: dentistUser._id });
    if (existing)
      return conflictResponse("Dentist profile already exists for this user");

    const dentist = await Dentist.create({
      userId: dentistUser._id,
      ...safeData,
    });

    revalidateTag("dentists", { expire: 0 });

    return createdResponse(dentist, "Dentist created successfully");
  } catch {
    return serverErrorResponse();
  }
}

export async function PATCH(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== UserRole.ADMIN)
    return forbiddenResponse("Admin access required");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const payload = body as Record<string, unknown>;
  const dentistId = payload.dentistId;

  if (!dentistId || typeof dentistId !== "string") {
    return errorResponse("dentistId is required", 400);
  }

  try {
    await connectDB();

    const dentist = await Dentist.findById(sanitizeId(payload.dentistId));
    if (!dentist) return errorResponse("Dentist not found", 404);

    // Simple active-status toggle remains supported
    if (
      typeof payload.isActive === "boolean" &&
      Object.keys(payload).length <= 2
    ) {
      dentist.isActive = payload.isActive;
      await dentist.save();

      revalidateTag("dentists", { expire: 0 });

      return successResponse(dentist, "Dentist status updated");
    }

    const updateSchema = dentistProfileSchema.extend({
      password: z.string().min(8).optional().or(z.literal("")),
    });

    const result = updateSchema.safeParse(payload);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const safeData = {
      ...result.data,
      name: sanitizeText(result.data.name),
      email: sanitizeText(result.data.email).toLowerCase(),
      specialization: sanitizeText(result.data.specialization),
      qualifications: result.data.qualifications.map((item) =>
        sanitizeText(item),
      ),
      bio: sanitizeMultilineText(result.data.bio),
      clinicLocation: sanitizeText(result.data.clinicLocation),
      clinicPhone: sanitizeText(result.data.clinicPhone),
      photo: sanitizeText(result.data.photo),
      availableDays: result.data.availableDays.map((item) =>
        sanitizeText(item),
      ),
      availableTimeSlots: result.data.availableTimeSlots.map((item) =>
        sanitizeText(item),
      ),
      availableDayTimes: Object.fromEntries(
        Object.entries(result.data.availableDayTimes || {}).map(
          ([day, ranges]) => [
            sanitizeText(day),
            ranges.map((range) => ({
              startTime: sanitizeText(range.startTime),
              endTime: sanitizeText(range.endTime),
            })),
          ],
        ),
      ),
      maxAppointmentsPerDay: result.data.maxAppointmentsPerDay,
    };

    const email = safeData.email;
    const user = await User.findById(dentist.userId);
    if (!user) return errorResponse("Linked user account not found", 404);

    const emailTaken = await User.findOne({ email, _id: { $ne: user._id } });
    if (emailTaken) {
      return conflictResponse("Another user already uses this email");
    }

    // If password is provided, update it for the linked user account.
    if (typeof payload.password === "string" && payload.password.trim()) {
      user.password = payload.password;
    }

    user.name = safeData.name;
    user.email = email;
    await user.save();

    dentist.name = safeData.name;
    dentist.email = email;
    dentist.specialization = safeData.specialization;
    dentist.qualifications = safeData.qualifications;
    dentist.experience = safeData.experience;
    dentist.bio = safeData.bio || "";
    dentist.clinicLocation = safeData.clinicLocation;
    dentist.clinicPhone = safeData.clinicPhone;
    dentist.photo = safeData.photo || undefined;
    dentist.availableDays = safeData.availableDays;
    dentist.availableTimeSlots = safeData.availableTimeSlots;
    dentist.availableDayTimes = safeData.availableDayTimes;
    dentist.maxAppointmentsPerDay = safeData.maxAppointmentsPerDay;
    dentist.consultationFee = safeData.consultationFee;
    if (typeof payload.isActive === "boolean")
      dentist.isActive = payload.isActive;

    await dentist.save();

    revalidateTag("dentists", { expire: 0 });

    return successResponse(dentist, "Dentist updated successfully");
  } catch {
    return serverErrorResponse();
  }
}

export async function DELETE(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== UserRole.ADMIN)
    return forbiddenResponse("Admin access required");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const payload = body as { dentistId?: string };
  if (!payload?.dentistId) return errorResponse("dentistId is required", 400);

  try {
    await connectDB();

    const dentist = await Dentist.findById(sanitizeId(payload.dentistId));
    if (!dentist) return errorResponse("Dentist not found", 404);

    await Promise.all([
      User.deleteOne({ _id: dentist.userId }),
      Dentist.deleteOne({ _id: dentist._id }),
    ]);

    revalidateTag("dentists", { expire: 0 });

    return successResponse(null, "Dentist deleted successfully");
  } catch {
    return serverErrorResponse();
  }
}
