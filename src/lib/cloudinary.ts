import { v2 as cloudinary } from "cloudinary";

// SERVER ONLY. Configures the Cloudinary SDK from env vars.
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || "asooda";

/** True once Cloudinary credentials are present. */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

/**
 * Produce a signature so the browser can upload directly to Cloudinary
 * without exposing the API secret. The dashboard calls /api/upload to get this.
 */
export function signUpload(timestamp: number) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) throw new Error("Missing CLOUDINARY_API_SECRET");

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: UPLOAD_FOLDER },
    apiSecret,
  );

  return {
    signature,
    timestamp,
    folder: UPLOAD_FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  };
}

/** Remove an image from Cloudinary by its public_id (called on product image delete). */
export async function destroyImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
