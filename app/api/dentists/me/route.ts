import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Dentist from "@/models/Dentist";
import { getAuthFromRequest } from "@/lib/auth";
import { UserRole } from "@/types";
import {
  successResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/utils/apiResponse";

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);

  if (!auth) return forbiddenResponse("Authentication required");
  if (auth.role !== UserRole.DENTIST && auth.role !== UserRole.ADMIN) {
    return forbiddenResponse("Dentist or admin access required");
  }

  try {
    await connectDB();

    const dentist = await Dentist.findOne({ userId: auth.userId }).lean();
    if (!dentist) return notFoundResponse("Dentist profile not found");

    return successResponse(dentist, "Dentist profile retrieved");
  } catch {
    return serverErrorResponse();
  }
}
