import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Dentist from "@/models/Dentist";
import Appointment from "@/models/Appointment";
import Log from "@/models/Log";
import {
  successResponse,
  forbiddenResponse,
  serverErrorResponse,
} from "@/utils/apiResponse";
import { getAuthFromRequest } from "@/lib/auth";
import { AppointmentStatus, UserRole } from "@/types";

function requireAdmin(auth: { role: UserRole } | null) {
  if (!auth || auth.role !== UserRole.ADMIN) {
    return forbiddenResponse("Admin access required");
  }
  return null;
}

// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  const deny = requireAdmin(auth);
  if (deny) return deny;

  try {
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
      pendingAppointments,
      todayAppointments,
      recentLogs,
      appointmentsByStatus,
    ] = await Promise.all([
      User.countDocuments({ role: UserRole.PATIENT }),
      Dentist.countDocuments({ isActive: true }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: AppointmentStatus.PENDING }),
      Appointment.countDocuments({
        appointmentDate: { $gte: todayStart, $lte: todayEnd },
      }),
      Log.find({ level: { $in: ["warn", "error"] } })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      Appointment.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    return successResponse({
      stats: {
        totalPatients,
        totalDentists,
        totalAppointments,
        pendingAppointments,
        todayAppointments,
      },
      appointmentsByStatus,
      recentLogs,
    });
  } catch {
    return serverErrorResponse();
  }
}
