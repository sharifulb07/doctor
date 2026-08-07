import { NextRequest } from "next/server";
import { clearAuthCookie, getAuthFromRequest } from "@/lib/auth";
import { successResponse, unauthorizedResponse } from "@/utils/apiResponse";
import { requireSameOrigin } from "@/utils/sanitize";

export async function POST(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const user = await getAuthFromRequest(req);
  if (!user) {
    return unauthorizedResponse();
  }
  await clearAuthCookie();
  return successResponse(null, "Logged out successfully");
}
