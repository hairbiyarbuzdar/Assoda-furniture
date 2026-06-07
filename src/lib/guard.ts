import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/** Throw-free admin check for API routes. Returns true when authenticated. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Standard 401 response for unauthenticated API calls. */
export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
