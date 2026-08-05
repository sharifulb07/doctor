import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
  successResponse,
  forbiddenResponse,
  serverErrorResponse,
  errorResponse,
} from "@/utils/apiResponse";
import { getAuthFromRequest } from "@/lib/auth";
import { UserRole } from "@/types";
import { requireSameOrigin, sanitizeId, escapeRegExp } from "@/utils/sanitize";

/**
 * GET /api/admin/users — list all patients (admin only)
 */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== UserRole.ADMIN)
    return forbiddenResponse("Admin access required");

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
  const role = searchParams.get("role") || UserRole.PATIENT;
  const search = (searchParams.get("search") || "").trim();

  try {
    await connectDB();

    const query: Record<string, unknown> = { role };
    if (search) {
      const safeSearch = escapeRegExp(search);
      query.$or = [
        { name: new RegExp(safeSearch, "i") },
        { email: new RegExp(safeSearch, "i") },
        { phone: new RegExp(safeSearch, "i") },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -failedLoginAttempts -lockUntil")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return successResponse({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return serverErrorResponse();
  }
}

export async function PATCH(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== UserRole.ADMIN)
    return forbiddenResponse("Admin access required");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const payload = body as { userId?: string; isActive?: boolean };

  if (!payload?.userId || typeof payload.isActive !== "boolean") {
    return errorResponse("userId and isActive are required", 400);
  }

  try {
    await connectDB();

    const user = await User.findById(sanitizeId(payload.userId)).select(
      "-password -failedLoginAttempts -lockUntil",
    );

    if (!user) return errorResponse("User not found", 404);
    if (user.role === UserRole.ADMIN)
      return errorResponse("Admin user cannot be deactivated", 400);

    user.isActive = payload.isActive;
    await user.save();

    return successResponse(user, "User status updated");
  } catch {
    return serverErrorResponse();
  }
}

export async function DELETE(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== UserRole.ADMIN)
    return forbiddenResponse("Admin access required");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const payload = body as { userId?: string };

  if (!payload?.userId || typeof payload.userId !== "string") {
    return errorResponse("userId is required", 400);
  }

  try {
    await connectDB();

    const user = await User.findById(sanitizeId(payload.userId)).select(
      "-password -failedLoginAttempts -lockUntil",
    );

    if (!user) return errorResponse("User not found", 404);
    if (user.role === UserRole.ADMIN) {
      return errorResponse("Admin user cannot be deleted", 400);
    }
    if (user.role !== UserRole.PATIENT) {
      return errorResponse(
        "Only patients can be deleted from this endpoint",
        400,
      );
    }

    await User.deleteOne({ _id: user._id });

    return successResponse(null, "User deleted successfully");
  } catch {
    return serverErrorResponse();
  }
}
