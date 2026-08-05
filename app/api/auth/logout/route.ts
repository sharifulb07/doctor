import { NextRequest } from "next/server";
import { clearAuthCookie, getAuthFromRequest } from "@/lib/auth";
import { successResponse, unauthorizedResponse } from "@/utils/apiResponse";

export async function POST(req: NextRequest) {
  const user = await getAuthFromRequest(req);
  if (!user) {
    return unauthorizedResponse();
  }
  await clearAuthCookie();
  return successResponse(null, "Logged out successfully");
}
