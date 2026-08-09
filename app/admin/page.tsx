import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Dentist from "@/models/Dentist";
import User from "@/models/User";
import { AppointmentStatus, UserRole } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizedPhone(field: string) {
  return [" ", "-", "(", ")", "+"].reduce<unknown>(
    (input, find) => ({ $replaceAll: { input, find, replacement: "" } }),
    field,
  );
}

async function countUniquePatients() {
  const [result] = await User.aggregate([
    {
      $match: {
        role: UserRole.PATIENT,
        name: { $type: "string", $ne: "" },
        phone: { $type: "string", $ne: "" },
      },
    },
    {
      $project: {
        key: {
          $concat: [
            { $toLower: { $trim: { input: "$name" } } },
            "|",
            normalizedPhone("$phone"),
          ],
        },
      },
    },
    {
      $unionWith: {
        coll: "appointments",
        pipeline: [
          {
            $match: {
              patientName: { $type: "string", $ne: "" },
              phone: { $type: "string", $ne: "" },
            },
          },
          {
            $project: {
              key: {
                $concat: [
                  { $toLower: { $trim: { input: "$patientName" } } },
                  "|",
                  normalizedPhone("$phone"),
                ],
              },
            },
          },
        ],
      },
    },
    { $group: { _id: "$key" } },
    { $count: "total" },
  ]);

  return result?.total || 0;
}

async function getStats() {
  await connectDB();
  const now = new Date();
  const dhakaOffsetMs = 6 * 60 * 60 * 1000;
  const dhakaNow = new Date(now.getTime() + dhakaOffsetMs);
  const todayStart = new Date(dhakaNow);
  todayStart.setUTCHours(0, 0, 0, 0);
  todayStart.setTime(todayStart.getTime() - dhakaOffsetMs);
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

  const [totalPatients, totalDentists, appointmentDashboard] = await Promise.all([
    countUniquePatients(),
    Dentist.countDocuments({ isActive: true }),
    Appointment.aggregate([
      {
        $facet: {
          total: [{ $count: "value" }],
          pending: [
            { $match: { status: AppointmentStatus.PENDING } },
            { $count: "value" },
          ],
          today: [
            { $match: { appointmentDate: { $gte: todayStart, $lte: todayEnd } } },
            { $count: "value" },
          ],
          recent: [
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "patientId",
          foreignField: "_id",
          pipeline: [{ $project: { name: 1 } }],
          as: "patient",
        },
      },
      {
        $lookup: {
          from: "dentists",
          localField: "dentistId",
          foreignField: "_id",
          pipeline: [{ $project: { name: 1 } }],
          as: "dentist",
        },
      },
      {
        $project: {
          _id: 1,
          patientName: {
            $ifNull: ["$patientName", { $arrayElemAt: ["$patient.name", 0] }],
          },
          dentistName: {
            $ifNull: [{ $arrayElemAt: ["$dentist.name", 0] }, "—"],
          },
          appointmentDate: 1,
          timeSlot: 1,
          status: 1,
        },
      },
          ],
        },
      },
    ]),
  ]);

  const dashboard = appointmentDashboard[0];
  const value = (field: Array<{ value: number }> | undefined) =>
    field?.[0]?.value || 0;
  const recent = dashboard?.recent || [];

  return {
    totalPatients,
    totalDentists,
    totalAppointments: value(dashboard?.total),
    pending: value(dashboard?.pending),
    today: value(dashboard?.today),
    recent: recent.map((a: unknown) => {
      const doc = a as unknown as {
        _id: { toString(): string };
        patientName: string;
        dentistName: string;
        appointmentDate: Date | string;
        timeSlot: string;
        status: string;
      };
      return {
        _id: doc._id.toString(),
        patientName: doc.patientName,
        dentistName: doc.dentistName,
        appointmentDate:
          doc.appointmentDate instanceof Date
            ? doc.appointmentDate.toISOString()
            : String(doc.appointmentDate),
        timeSlot: doc.timeSlot,
        status: doc.status,
      };
    }),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  return <AdminDashboardContent stats={stats} />;
}
