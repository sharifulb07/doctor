import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
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
    Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("dentistId", "name")
      .populate("patientId", "name")
      .lean(),
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
        appointmentDate: Date | string;
        status: string;
        patientId?: { name?: string } | null;
        dentistId?: { name?: string } | null;
      };
      return {
        _id: doc._id.toString(),
        patientName: doc.patientName,
        appointmentDate:
          doc.appointmentDate instanceof Date
            ? doc.appointmentDate.toISOString()
            : String(doc.appointmentDate),
        status: doc.status,
        patientId: doc.patientId ?? null,
        dentistId: doc.dentistId ?? null,
      };
    }),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  return <AdminDashboardContent stats={stats} />;
}
