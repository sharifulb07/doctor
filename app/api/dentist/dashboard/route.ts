import { NextRequest } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getDentistDashboardData } from "@/lib/dentistDashboard";
import { UserRole } from "@/types";
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
    const dashboard = await getDentistDashboardData(auth.userId);
    if (!dashboard) return notFoundResponse("Dentist profile not found");
    return successResponse(dashboard);
  } catch {
    return serverErrorResponse();
  }
}
