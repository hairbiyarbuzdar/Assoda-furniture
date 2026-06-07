import { isAdmin, unauthorized } from "@/lib/guard";
import { getStore, StoreError } from "@/lib/store";
import type { ProductInput } from "@/lib/types";

// GET /api/products  -> list all products (public read)
export async function GET() {
  try {
    const products = await getStore().listProducts();
    return Response.json({ products });
  } catch (e) {
    const status = e instanceof StoreError ? e.status : 500;
    return Response.json({ error: (e as Error).message }, { status });
  }
}

// POST /api/products  -> create (admin only)
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  let body: ProductInput;
  try {
    body = (await req.json()) as ProductInput;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.name?.trim()) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const product = await getStore().createProduct(body);
    return Response.json({ product }, { status: 201 });
  } catch (e) {
    const status = e instanceof StoreError ? e.status : 500;
    return Response.json({ error: (e as Error).message }, { status });
  }
}
