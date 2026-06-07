import { isAdmin, unauthorized } from "@/lib/guard";
import { isCloudinaryConfigured, signUpload } from "@/lib/cloudinary";

// Returns a signed payload the dashboard uses to upload directly to Cloudinary.
// When Cloudinary isn't configured yet, returns { configured: false } so the
// uploader UI can fall back to pasting an image URL.
export async function POST() {
  if (!(await isAdmin())) return unauthorized();

  if (!isCloudinaryConfigured()) {
    return Response.json({ configured: false });
  }

  const timestamp = Math.round(Date.now() / 1000);
  return Response.json({ configured: true, ...signUpload(timestamp) });
}
