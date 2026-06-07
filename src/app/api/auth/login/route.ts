import { cookies } from "next/headers";
import {
  checkPassword,
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = await req.json();
    password = String(body?.password ?? "");
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await createSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions);

  return Response.json({ ok: true });
}
