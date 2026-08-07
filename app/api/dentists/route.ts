import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Dentist from "@/models/Dentist";
import { successResponse, serverErrorResponse } from "@/utils/apiResponse";
import { escapeRegExp, sanitizeText } from "@/utils/sanitize";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const specialization = sanitizeText(searchParams.get("specialization")).slice(0, 100);
    const search = sanitizeText(searchParams.get("search")).slice(0, 100);

    const query: Record<string, unknown> = { isActive: true };

    if (specialization) {
      query.specialization = new RegExp(escapeRegExp(specialization), "i");
    }
    if (search) {
      const safeSearch = new RegExp(escapeRegExp(search), "i");
      query.$or = [
        { name: safeSearch },
        { specialization: safeSearch },
        { clinicLocation: safeSearch },
      ];
    }

    const skip = (page - 1) * limit;
    const [dentists, total] = await Promise.all([
      Dentist.find(query)
        .select("-__v")
        .sort({ rating: -1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Dentist.countDocuments(query),
    ]);

    return successResponse(dentists, "Dentists retrieved", 200, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch {
    return serverErrorResponse();
  }
}
