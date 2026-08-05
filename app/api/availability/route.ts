import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Availability from "@/models/Availability";
import Appointment from "@/models/Appointment";
import { AppointmentStatus } from "@/types";
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/utils/apiResponse";

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

    if (!availability) {
      return successResponse({ available: false, timeSlots: [] });
    }

    // Cross-reference with actual appointments to ensure accuracy
    const bookedSlots = await Appointment.find({
      dentistId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    }).select("timeSlot");

    const bookedTimes = new Set(bookedSlots.map((a) => a.timeSlot));

    const slots = availability.timeSlots.map((slot) => ({
      time: slot.time,
      isBooked: slot.isBooked || bookedTimes.has(slot.time),
    }));

    return successResponse({ available: true, timeSlots: slots });
  } catch {
    return serverErrorResponse();
  }
}
