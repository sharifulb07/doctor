import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Dentist from "@/models/Dentist";
import { successResponse, serverErrorResponse } from "@/utils/apiResponse";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const specialization = searchParams.get("specialization");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = { isActive: true };

    if (specialization) query.specialization = new RegExp(specialization, "i");
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { specialization: new RegExp(search, "i") },
        { clinicLocation: new RegExp(search, "i") },
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
  } catch (error) {
    return serverErrorResponse();
  }
}
