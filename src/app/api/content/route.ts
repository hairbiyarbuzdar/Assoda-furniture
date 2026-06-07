import { isAdmin, unauthorized } from "@/lib/guard";
import { getStore, StoreError } from "@/lib/store";
import type { SiteContent } from "@/lib/types";

// GET /api/content -> editorial site content (public)
export async function GET() {
  try {
    const content = await getStore().getSiteContent();
    return Response.json({ content });
  } catch (e) {
    const status = e instanceof StoreError ? e.status : 500;
    return Response.json({ error: (e as Error).message }, { status });
  }
}

// PUT /api/content -> replace site content (admin only)
export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  let body: SiteContent;
  try {
    body = (await req.json()) as SiteContent;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body?.home || !body?.ourStory) {
    return Response.json({ error: "Invalid content shape" }, { status: 400 });
  }

  try {
    const content = await getStore().putSiteContent(body);
    return Response.json({ content });
  } catch (e) {
    const status = e instanceof StoreError ? e.status : 500;
    return Response.json({ error: (e as Error).message }, { status });
  }
}
