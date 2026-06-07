import { isAdmin, unauthorized } from "@/lib/guard";
import { getStore, StoreError } from "@/lib/store";

// GET /api/categories (public)
export async function GET() {
  try {
    const categories = await getStore().listCategories();
    return Response.json({ categories });
  } catch (e) {
    const status = e instanceof StoreError ? e.status : 500;
    return Response.json({ error: (e as Error).message }, { status });
  }
}

// POST /api/categories (admin)
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  let body: { name?: string; slug?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.name?.trim()) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const category = await getStore().createCategory({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
    });
    return Response.json({ category }, { status: 201 });
  } catch (e) {
    const status = e instanceof StoreError ? e.status : 500;
    return Response.json({ error: (e as Error).message }, { status });
  }
}
