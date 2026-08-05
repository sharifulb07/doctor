import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

function ensureCloudinaryConfig() {
  if (isConfigured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary env vars are missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  isConfigured = true;
}

export async function uploadDentistPhotoToCloudinary(fileBuffer: Buffer) {
  ensureCloudinaryConfig();

  return new Promise<{ secureUrl: string; publicId: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "dentistappointment/dentists",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result?.secure_url || !result?.public_id) {
            reject(error || new Error("Cloudinary upload failed"));
            return;
          }

          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      stream.end(fileBuffer);
    },
  );
}
