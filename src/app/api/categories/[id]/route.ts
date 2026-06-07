import { isAdmin, unauthorized } from "@/lib/guard";
import { getStore, StoreError } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

// DELETE /api/categories/:id (admin) — products keep existing, category_id set null.
export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;

  try {
    await getStore().deleteCategory(id);
    return Response.json({ ok: true });
  } catch (e) {
    const status = e instanceof StoreError ? e.status : 500;
    return Response.json({ error: (e as Error).message }, { status });
  }
}
