import { isAdmin, unauthorized } from "@/lib/guard";
import { getStore, StoreError } from "@/lib/store";
import { destroyImage, isCloudinaryConfigured } from "@/lib/cloudinary";
import type { ProductInput } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

function fail(e: unknown) {
  const status = e instanceof StoreError ? e.status : 500;
  return Response.json({ error: (e as Error).message }, { status });
}

// GET /api/products/:id  (public read)
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    const product = await getStore().getProductById(id);
    if (!product) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ product });
  } catch (e) {
    return fail(e);
  }
}

// PUT /api/products/:id  (admin only)
export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;

  let body: ProductInput;
  try {
    body = (await req.json()) as ProductInput;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const product = await getStore().updateProduct(id, body);
    return Response.json({ product });
  } catch (e) {
    return fail(e);
  }
}

// DELETE /api/products/:id  (admin only) — also removes Cloudinary images when configured.
export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;

  try {
    const { images } = await getStore().deleteProduct(id);
    if (isCloudinaryConfigured()) {
      await Promise.allSettled(
        images
          .filter((img) => !img.public_id.startsWith("external:") && !img.public_id.startsWith("seed:") && !img.public_id.startsWith("sample/"))
          .map((img) => destroyImage(img.public_id)),
      );
    }
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
