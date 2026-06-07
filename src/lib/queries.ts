import { getStore } from "./store";
import type { Category, Product, SiteContent } from "./types";

// Public read helpers used by Server Components. These delegate to the active
// store (Supabase when configured, otherwise the local JSON store), so swapping
// backends is a one-line change in `src/lib/store/index.ts`.

export async function getCategories(): Promise<Category[]> {
  const categories = await getStore().listCategories();
  return [...categories].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProducts(opts?: {
  categorySlug?: string;
  featured?: boolean;
}): Promise<Product[]> {
  return getStore().listProducts(opts);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return getStore().getProductBySlug(slug);
}

export async function getSiteContent(): Promise<SiteContent> {
  return getStore().getSiteContent();
}
