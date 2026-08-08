import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/auth";
import Dentist from "@/models/Dentist";
import Appointment from "@/models/Appointment";
import { AppointmentStatus, UserRole } from "@/types";
import {
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "@/utils/apiResponse";

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== UserRole.DENTIST) {
    return forbiddenResponse("Dentist access required");
  }

  try {
    await connectDB();
    const profile = await Dentist.findOne({ userId: auth.userId })
      .select("name specialization clinicLocation")
      .lean();
    if (!profile) return notFoundResponse("Dentist profile not found");

    const now = new Date();
    const dhakaOffsetMs = 6 * 60 * 60 * 1000;
    const dhakaNow = new Date(now.getTime() + dhakaOffsetMs);
    const todayStart = new Date(dhakaNow);
    todayStart.setUTCHours(0, 0, 0, 0);
    todayStart.setTime(todayStart.getTime() - dhakaOffsetMs);
    const todayEnd = new Date(
      todayStart.getTime() + 24 * 60 * 60 * 1000 - 1,
    );

    const [dashboard] = await Appointment.aggregate([
      { $match: { dentistId: profile._id } },
      {
        $facet: {
          total: [{ $count: "value" }],
          today: [
            { $match: { appointmentDate: { $gte: todayStart, $lte: todayEnd } } },
            { $count: "value" },
          ],
          pending: [
            { $match: { status: AppointmentStatus.PENDING } },
            { $count: "value" },
          ],
          completed: [
            { $match: { status: AppointmentStatus.COMPLETED } },
            { $count: "value" },
          ],
          upcoming: [
            {
              $match: {
                appointmentDate: { $gte: todayStart },
                status: {
                  $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
                },
              },
            },
            { $sort: { appointmentDate: 1, timeSlot: 1 } },
            { $limit: 5 },
            {
              $project: {
                patientName: 1,
                appointmentDate: 1,
                timeSlot: 1,
                status: 1,
              },
            },
          ],
        },
      },
    ]);

    const value = (field: Array<{ value: number }> | undefined) =>
      field?.[0]?.value || 0;

    return successResponse({
      profile,
      stats: {
        total: value(dashboard?.total),
        today: value(dashboard?.today),
        pending: value(dashboard?.pending),
        completed: value(dashboard?.completed),
      },
      upcoming: dashboard?.upcoming || [],
    });
  } catch {
    return serverErrorResponse();
  }
}
