import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Dentist from "@/models/Dentist";
import Availability from "@/models/Availability";
import { bookAppointmentSchema, formatZodErrors } from "@/utils/validators";
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
  errorResponse,
  conflictResponse,
} from "@/utils/apiResponse";
import { getAuthFromRequest } from "@/lib/auth";
import { AppointmentStatus, UserRole } from "@/types";
import { logAppointment, logError } from "@/lib/logger";
import { sendConfirmationEmail } from "@/lib/email";
import { applyRateLimit } from "@/lib/rateLimiter";
import {
  requireSameOrigin,
  sanitizeId,
  sanitizeMultilineText,
  sanitizeText,
} from "@/utils/sanitize";
import { isDailyAppointmentLimitReached } from "@/utils/appointmentCapacity";

function buildSlotsFromDayRanges(
  ranges: Array<{ startTime: string; endTime: string }> = [],
): string[] {
  const slots: string[] = [];

  for (const range of ranges) {
    const start = parseHHMM(range.startTime);
    const end = parseHHMM(range.endTime);
    if (start === null || end === null || end <= start) continue;

    for (let minute = start; minute <= end; minute += 30) {
      slots.push(formatHHMM(minute));
    }
  }

  return Array.from(new Set(slots)).sort();
}

function parseHHMM(value: string): number | null {
  const match = value.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function formatHHMM(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

async function getAppointmentsHandler(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorizedResponse();

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));
  const status = searchParams.get("status");

  try {
    await connectDB();

    const query: Record<string, unknown> = {};

    if (auth.role === UserRole.PATIENT) {
      query.patientId = auth.userId;
    } else if (auth.role === UserRole.DENTIST) {
      const dentist = await Dentist.findOne({ userId: auth.userId });
      if (!dentist) return successResponse([], "No appointments");
      query.dentistId = dentist._id;
    }
    // ADMIN sees all

    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .sort({ appointmentDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("dentistId", "name specialization clinicLocation")
        .populate("patientId", "name email phone")
        .lean(),
      Appointment.countDocuments(query),
    ]);

    return successResponse(appointments, "Appointments retrieved", 200, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    logError(error, { context: "getAppointments" });
    return serverErrorResponse();
  }
}

async function createAppointmentHandler(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const result = bookAppointmentSchema.safeParse(body);
  if (!result.success)
    return validationErrorResponse(formatZodErrors(result.error));

  const {
    dentistId,
    appointmentDate,
    timeSlot,
    patientName,
    phone,
    notes,
    treatmentType,
  } = result.data;
  const safeDentistId = sanitizeId(dentistId);
  const safePatientName = sanitizeText(patientName);
  const safePhone = sanitizeText(phone);
  const safeNotes = sanitizeMultilineText(notes);
  const safeTreatmentType = sanitizeText(treatmentType);

  try {
    await connectDB();

    // Validate dentist exists and is active
    const dentist = await Dentist.findById(safeDentistId);
    if (!dentist || !dentist.isActive) {
      return errorResponse("Dentist not found or not available", 404);
    }

    const apptDate = new Date(appointmentDate);
    const startOfDay = new Date(apptDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(apptDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Try explicit per-date availability first
    const availability = await Availability.findOne({
      dentistId: safeDentistId,
      date: { $gte: startOfDay, $lte: endOfDay },
      isAvailable: true,
      "timeSlots.time": timeSlot,
      "timeSlots.isBooked": false,
    });

    // Fallback to dentist fixed weekly schedule when daily availability is not set
    if (!availability) {
      const weekday = apptDate.toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "UTC",
      });
      const isFixedDay = dentist.availableDays.includes(weekday);

      const dayRanges =
        (
          dentist.availableDayTimes as Record<
            string,
            Array<{ startTime: string; endTime: string }>
          > | null
        )?.[weekday] || [];

      const fixedSlotsForDay =
        dayRanges.length > 0
          ? buildSlotsFromDayRanges(dayRanges)
          : dentist.availableTimeSlots;

      const inFixedRange = fixedSlotsForDay.includes(timeSlot);
      if (!isFixedDay || !inFixedRange) {
        return conflictResponse("This time slot is not available");
      }
    }

    // Prevent double-booking
    const existing = await Appointment.findOne({
      dentistId: safeDentistId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    });
    if (existing) {
      return conflictResponse("This time slot has already been booked");
    }

    const bookedCount = await Appointment.countDocuments({
      dentistId: safeDentistId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    });

    if (
      isDailyAppointmentLimitReached(
        bookedCount,
        dentist.maxAppointmentsPerDay ?? 10,
      )
    ) {
      return conflictResponse(
        "This dentist has reached the daily appointment limit",
      );
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: auth.userId,
      dentistId: safeDentistId,
      appointmentDate: apptDate,
      timeSlot,
      patientName: safePatientName,
      phone: safePhone,
      notes: safeNotes,
      treatmentType: safeTreatmentType,
      status: AppointmentStatus.PENDING,
    });

    // Mark slot as booked in daily availability record when it exists
    await Availability.updateOne(
      {
        dentistId: safeDentistId,
        date: { $gte: startOfDay, $lte: endOfDay },
        "timeSlots.time": timeSlot,
      },
      {
        $set: {
          "timeSlots.$.isBooked": true,
          "timeSlots.$.appointmentId": appointment._id,
        },
      },
    );

    logAppointment({
      appointmentId: appointment._id.toString(),
      patientId: auth.userId,
      dentistId: safeDentistId,
      action: "created",
      date: appointmentDate,
      timeSlot,
    });

    // Send confirmation email async
    sendConfirmationEmail(auth.email, {
      ...appointment.toObject(),
      dentistName: dentist.name,
      clinicLocation: dentist.clinicLocation,
    }).catch((err) => logError(err, { context: "sendConfirmationEmail" }));

    return createdResponse(appointment, "Appointment booked successfully");
  } catch (error) {
    logError(error, { context: "createAppointment" });
    return serverErrorResponse();
  }
}

export const GET = getAppointmentsHandler;
export const POST = applyRateLimit(createAppointmentHandler, "booking");
