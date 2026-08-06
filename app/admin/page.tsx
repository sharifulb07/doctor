import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Dentist from "@/models/Dentist";
import User from "@/models/User";
import { AppointmentStatus, UserRole } from "@/types";

async function getStats() {
  await connectDB();
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const [
    totalPatients,
    totalDentists,
    totalAppointments,
    pending,
    today,
    recent,
  ] = await Promise.all([
    User.countDocuments({ role: UserRole.PATIENT }),
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
            $ifNull: [{ $arrayElemAt: ["$patient.name", 0] }, "$patientName"],
          },
          dentistName: {
            $ifNull: [{ $arrayElemAt: ["$dentist.name", 0] }, "—"],
          },
          appointmentDate: 1,
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
        status: doc.status,
      };
    }),
  };
}

const getCachedStats = unstable_cache(getStats, ["admin-dashboard-stats"], {
  revalidate: 30,
  tags: ["admin-dashboard"],
});

export default async function AdminDashboardPage() {
  const stats = await getCachedStats();
  return <AdminDashboardContent stats={stats} />;
}
