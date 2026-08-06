import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Availability from "@/models/Availability";
import Appointment from "@/models/Appointment";
import Dentist from "@/models/Dentist";
import { AppointmentStatus } from "@/types";
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/utils/apiResponse";

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

/**
 * GET /api/availability?dentistId=...&date=...
 * Returns available (non-booked) time slots for a dentist on a given date.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dentistId = searchParams.get("dentistId");
  const dateStr = searchParams.get("date");

  if (!dentistId || !dateStr) {
    return notFoundResponse("dentistId and date are required");
  }

  try {
    await connectDB();

    const dentist = await Dentist.findById(dentistId)
      .select("availableDays availableTimeSlots availableDayTimes isActive")
      .lean();
    if (!dentist || !dentist.isActive) {
      return successResponse({ available: false, timeSlots: [] });
    }

    const targetDate = new Date(dateStr);
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const availability = await Availability.findOne({
      dentistId,
      date: { $gte: startOfDay, $lte: endOfDay },
      isAvailable: true,
    }).lean();

    // Cross-reference with actual appointments to ensure accuracy
    const bookedSlots = await Appointment.find({
      dentistId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    }).select("timeSlot");

    const bookedTimes = new Set(bookedSlots.map((a) => a.timeSlot));

    if (!availability) {
      const weekday = targetDate.toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "UTC",
      });
      const isFixedDay = dentist.availableDays?.includes(weekday);
      if (!isFixedDay) {
        return successResponse({ available: false, timeSlots: [] });
      }

      const dayRanges =
        (
          dentist.availableDayTimes as Record<
            string,
            Array<{ startTime: string; endTime: string }>
          > | null
        )?.[weekday] || [];

      const slotsForDay =
        dayRanges.length > 0
          ? buildSlotsFromDayRanges(dayRanges)
          : dentist.availableTimeSlots || [];

      const fixedSlots = slotsForDay.map((time) => ({
        time,
        isBooked: bookedTimes.has(time),
      }));

      return successResponse({
        available: fixedSlots.length > 0,
        timeSlots: fixedSlots,
      });
    }

    const slots = availability.timeSlots.map((slot) => ({
      time: slot.time,
      isBooked: slot.isBooked || bookedTimes.has(slot.time),
    }));

    return successResponse({ available: true, timeSlots: slots });
  } catch {
    return serverErrorResponse();
  }
}
