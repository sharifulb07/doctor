import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Dentist from "@/models/Dentist";
import Availability from "@/models/Availability";
import {
  updateAppointmentStatusSchema,
  rescheduleAppointmentSchema,
  formatZodErrors,
} from "@/utils/validators";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  validationErrorResponse,
  serverErrorResponse,
  errorResponse,
  conflictResponse,
} from "@/utils/apiResponse";
import { getAuthFromRequest } from "@/lib/auth";
import { AppointmentStatus, UserRole } from "@/types";
import { logAppointment, logError } from "@/lib/logger";
import { sendCancellationEmail } from "@/lib/email";
import { requireSameOrigin, sanitizeMultilineText } from "@/utils/sanitize";

type Context = { params: Promise<{ id: string }> };

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

// ─── GET single appointment ───────────────────────────────────────────────────

export async function GET(req: NextRequest, ctx: Context) {
  const { id } = await ctx.params;
  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorizedResponse();

  try {
    await connectDB();
    const appt = await Appointment.findById(id)
      .populate("dentistId", "name specialization clinicLocation clinicPhone")
      .populate("patientId", "name email phone")
      .lean();

    if (!appt) return notFoundResponse("Appointment not found");

    // Access control: patient can only view their own, dentist/admin can view all
    const isOwner =
      appt.patientId?.toString() === auth.userId ||
      auth.role === UserRole.ADMIN;

    if (!isOwner && auth.role === UserRole.PATIENT) {
      return forbiddenResponse("Permission denied");
    }

    return successResponse(appt);
  } catch {
    return serverErrorResponse();
  }
}

// ─── PATCH — update status (dentist/admin) or reschedule (patient) ────────────

export async function PATCH(req: NextRequest, ctx: Context) {
  const { id } = await ctx.params;
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

  try {
    await connectDB();
    const appt = await Appointment.findById(id);
    if (!appt) return notFoundResponse("Appointment not found");

    const isPatient = auth.role === UserRole.PATIENT;
    const isAdminOrDentist =
      auth.role === UserRole.ADMIN || auth.role === UserRole.DENTIST;

    // Patients can only cancel or reschedule their own appointments
    if (isPatient && appt.patientId.toString() !== auth.userId) {
      return forbiddenResponse("Permission denied");
    }

    const bodyObj = body as Record<string, unknown>;

    // ── Reschedule flow ──────────────────────────────────────────────────────
    if (bodyObj.appointmentDate || bodyObj.timeSlot) {
      if (!isPatient && !isAdminOrDentist) return forbiddenResponse();

      const result = rescheduleAppointmentSchema.safeParse(body);
      if (!result.success)
        return validationErrorResponse(formatZodErrors(result.error));

      if (
        appt.status === AppointmentStatus.COMPLETED ||
        appt.status === AppointmentStatus.CANCELLED
      ) {
        return errorResponse(
          "Cannot reschedule a completed or cancelled appointment",
        );
      }

      const newDate = new Date(result.data.appointmentDate);
      const startOfDay = new Date(newDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(newDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      // Check new slot availability
      const availability = await Availability.findOne({
        dentistId: appt.dentistId,
        date: { $gte: startOfDay, $lte: endOfDay },
        isAvailable: true,
        "timeSlots.time": result.data.timeSlot,
        "timeSlots.isBooked": false,
      });

      let isSlotAvailable = Boolean(availability);

      if (!isSlotAvailable) {
        const dentist = await Dentist.findById(appt.dentistId)
          .select("isActive availableDays availableTimeSlots availableDayTimes")
          .lean();

        if (!dentist || !dentist.isActive) {
          return conflictResponse("The requested time slot is not available");
        }

        const weekday = newDate.toLocaleDateString("en-US", {
          weekday: "long",
          timeZone: "UTC",
        });

        const isFixedDay = dentist.availableDays?.includes(weekday);
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
            : dentist.availableTimeSlots || [];

        isSlotAvailable =
          Boolean(isFixedDay) &&
          fixedSlotsForDay.includes(result.data.timeSlot);
      }

      if (!isSlotAvailable)
        return conflictResponse("The requested time slot is not available");

      // Prevent double-booking on new slot
      const conflict = await Appointment.findOne({
        _id: { $ne: id },
        dentistId: appt.dentistId,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        timeSlot: result.data.timeSlot,
        status: {
          $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
      });
      if (conflict) return conflictResponse("Slot already booked");

      // Free old slot
      const oldStart = new Date(appt.appointmentDate);
      oldStart.setUTCHours(0, 0, 0, 0);
      const oldEnd = new Date(appt.appointmentDate);
      oldEnd.setUTCHours(23, 59, 59, 999);
      await Availability.updateOne(
        {
          dentistId: appt.dentistId,
          date: { $gte: oldStart, $lte: oldEnd },
          "timeSlots.time": appt.timeSlot,
        },
        {
          $set: {
            "timeSlots.$.isBooked": false,
            "timeSlots.$.appointmentId": null,
          },
        },
      );

      // Book new slot
      if (availability) {
        await Availability.updateOne(
          {
            dentistId: appt.dentistId,
            date: { $gte: startOfDay, $lte: endOfDay },
            "timeSlots.time": result.data.timeSlot,
          },
          {
            $set: {
              "timeSlots.$.isBooked": true,
              "timeSlots.$.appointmentId": appt._id,
            },
          },
        );
      }

      appt.appointmentDate = newDate;
      appt.timeSlot = result.data.timeSlot;
      appt.status = AppointmentStatus.PENDING;
      await appt.save();

      logAppointment({
        appointmentId: id,
        patientId: appt.patientId.toString(),
        dentistId: appt.dentistId.toString(),
        action: "updated",
        date: result.data.appointmentDate,
        timeSlot: result.data.timeSlot,
      });

      return successResponse(appt, "Appointment rescheduled");
    }

    // ── Status update flow ────────────────────────────────────────────────────
    const result = updateAppointmentStatusSchema.safeParse(body);
    if (!result.success)
      return validationErrorResponse(formatZodErrors(result.error));

    const { status, cancellationReason } = result.data;
    const safeCancellationReason = sanitizeMultilineText(cancellationReason);

    // Patients can only cancel
    if (isPatient && status !== AppointmentStatus.CANCELLED) {
      return forbiddenResponse("Patients can only cancel appointments");
    }

    if (appt.status === AppointmentStatus.COMPLETED) {
      return errorResponse("Cannot modify a completed appointment");
    }

    if (status === AppointmentStatus.CANCELLED) {
      const startDay = new Date(appt.appointmentDate);
      startDay.setUTCHours(0, 0, 0, 0);
      const endDay = new Date(appt.appointmentDate);
      endDay.setUTCHours(23, 59, 59, 999);

      // Free the slot
      await Availability.updateOne(
        {
          dentistId: appt.dentistId,
          date: { $gte: startDay, $lte: endDay },
          "timeSlots.time": appt.timeSlot,
        },
        {
          $set: {
            "timeSlots.$.isBooked": false,
            "timeSlots.$.appointmentId": null,
          },
        },
      );

      if (safeCancellationReason)
        appt.cancellationReason = safeCancellationReason;

      // Send cancellation email
      sendCancellationEmail(
        auth.email,
        appt.toObject(),
        safeCancellationReason,
      ).catch((err) => logError(err, { context: "sendCancellationEmail" }));
    }

    appt.status = status as AppointmentStatus;
    await appt.save();

    logAppointment({
      appointmentId: id,
      patientId: appt.patientId.toString(),
      dentistId: appt.dentistId.toString(),
      action: status as "cancelled" | "confirmed" | "completed" | "updated",
    });

    return successResponse(appt, `Appointment ${status} successfully`);
  } catch (error) {
    logError(error, { context: "updateAppointment", id });
    return serverErrorResponse();
  }
}

// ─── DELETE — hard delete (admin only) ───────────────────────────────────────

export async function DELETE(req: NextRequest, ctx: Context) {
  const { id } = await ctx.params;
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== UserRole.ADMIN)
    return forbiddenResponse("Admin only");

  try {
    await connectDB();
    const appt = await Appointment.findByIdAndDelete(id);
    if (!appt) return notFoundResponse("Appointment not found");
    return successResponse(null, "Appointment deleted");
  } catch {
    return serverErrorResponse();
  }
}
