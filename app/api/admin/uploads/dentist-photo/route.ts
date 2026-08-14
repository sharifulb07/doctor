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
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasValidImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }
  if (mimeType === "image/png") {
    return (
      buffer.length >= 8 &&
      buffer
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    );
  }
  return (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

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

    if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
      return errorResponse("Only JPEG, PNG, and WebP images are allowed", 400);
    }

    if (image.size > MAX_FILE_SIZE_BYTES) {
      return errorResponse("Image must be 5MB or smaller", 400);
    }

    const bytes = await image.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    if (!hasValidImageSignature(fileBuffer, image.type)) {
      return errorResponse("The uploaded file is not a valid image", 400);
    }

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
