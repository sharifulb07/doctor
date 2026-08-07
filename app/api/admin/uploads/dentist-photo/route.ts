import { NextRequest } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { uploadDentistPhotoToCloudinary } from "@/lib/cloudinary";
import {
  errorResponse,
  forbiddenResponse,
  serverErrorResponse,
  successResponse,
} from "@/utils/apiResponse";
import { UserRole } from "@/types";
import { logError } from "@/lib/logger";
import { requireSameOrigin } from "@/utils/sanitize";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;

  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== UserRole.ADMIN) {
    return forbiddenResponse("Admin access required");
  }

  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return errorResponse("image file is required", 400);
    }

    if (!image.type.startsWith("image/")) {
      return errorResponse("Only image files are allowed", 400);
    }

    if (image.size > MAX_FILE_SIZE_BYTES) {
      return errorResponse("Image must be 5MB or smaller", 400);
    }

    const bytes = await image.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    const uploaded = await uploadDentistPhotoToCloudinary(fileBuffer);

    return successResponse(
      {
        url: uploaded.secureUrl,
        publicId: uploaded.publicId,
      },
      "Photo uploaded successfully",
    );
  } catch (error) {
    logError(error, { context: "admin-dentist-photo-upload" });
    return serverErrorResponse("Failed to upload photo");
  }
}
