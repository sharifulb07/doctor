import { Types } from "mongoose";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Dentist from "@/models/Dentist";
import { AppointmentStatus } from "@/types";

export type DentistDashboardData = {
  profile: {
    name: string;
    specialization: string;
    clinicLocation: string;
  };
  stats: { total: number; today: number; pending: number; completed: number };
  upcoming: Array<{
    _id: string;
    patientName: string;
    appointmentDate: string;
    timeSlot: string;
    status: string;
  }>;
};

export async function getDentistDashboardData(
  userId: string,
): Promise<DentistDashboardData | null> {
  await connectDB();
  const profile = await Dentist.findOne({ userId: new Types.ObjectId(userId) })
    .select("name specialization clinicLocation")
    .lean();
  if (!profile) return null;

  const now = new Date();
  const dhakaOffsetMs = 6 * 60 * 60 * 1000;
  const dhakaNow = new Date(now.getTime() + dhakaOffsetMs);
  const todayStart = new Date(dhakaNow);
  todayStart.setUTCHours(0, 0, 0, 0);
  todayStart.setTime(todayStart.getTime() - dhakaOffsetMs);
  const todayEnd = new Date(todayStart.getTime() + 86_400_000 - 1);

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
          {
            $match: {
              status: AppointmentStatus.PENDING,
              appointmentDate: { $gte: todayStart },
            },
          },
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

  return {
    profile: {
      name: profile.name,
      specialization: profile.specialization,
      clinicLocation: profile.clinicLocation,
    },
    stats: {
      total: value(dashboard?.total),
      today: value(dashboard?.today),
      pending: value(dashboard?.pending),
      completed: value(dashboard?.completed),
    },
    upcoming: (dashboard?.upcoming || []).map(
      (appointment: {
        _id: Types.ObjectId;
        patientName: string;
        appointmentDate: Date;
        timeSlot: string;
        status: string;
      }) => ({
        ...appointment,
        _id: appointment._id.toString(),
        appointmentDate: appointment.appointmentDate.toISOString(),
      }),
    ),
  };
}
