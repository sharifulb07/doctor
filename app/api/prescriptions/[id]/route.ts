import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/auth";
import Dentist from "@/models/Dentist";
import Prescription from "@/models/Prescription";
import { UserRole } from "@/types";
import { forbiddenResponse, notFoundResponse, serverErrorResponse, successResponse, unauthorizedResponse } from "@/utils/apiResponse";

type Context = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: Context) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorizedResponse();
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) return notFoundResponse("Prescription not found");

  try {
    await connectDB();
    const query: Record<string, unknown> = { _id: id };
    if (auth.role === UserRole.DENTIST) {
      const dentist = await Dentist.findOne({ userId: auth.userId });
      if (!dentist) return forbiddenResponse();
      query.dentistId = dentist._id;
    } else if (auth.role === UserRole.PATIENT) {
      query.patientId = auth.userId;
    } else if (auth.role !== UserRole.ADMIN) {
      return forbiddenResponse();
    }

    const prescription = await Prescription.findOne(query)
      .populate("dentistId", "name email specialization additionalSpecializations qualifications bmdcRegistration clinicLocation clinicPhone")
      .lean();
    if (!prescription) return notFoundResponse("Prescription not found");
    return successResponse(prescription);
  } catch { return serverErrorResponse(); }
}
