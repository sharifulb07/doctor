import { NextRequest } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/utils/apiResponse";

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorizedResponse();

  try {
    await connectDB();
    const user = await User.findById(auth.userId).select(
      "-password -failedLoginAttempts -lockUntil",
    );
    if (!user || !user.isActive) return notFoundResponse("User not found");

    return successResponse({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      createdAt: user.createdAt,
    });
  } catch {
    return serverErrorResponse();
  }
}
