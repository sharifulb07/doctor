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

  const [
    totalPatients,
    totalDentists,
    totalAppointments,
    pending,
    today,
    recent,
  ] = await Promise.all([
    countUniquePatients(),
    Dentist.countDocuments({ isActive: true }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: AppointmentStatus.PENDING }),
    Appointment.countDocuments({
      appointmentDate: { $gte: todayStart, $lte: todayEnd },
    }),
    Appointment.aggregate([
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
    ]),
  ]);

  return {
    totalPatients,
    totalDentists,
    totalAppointments,
    pending,
    today,
    recent: recent.map((a) => {
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
