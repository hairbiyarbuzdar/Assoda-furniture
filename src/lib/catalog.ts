import type { Product } from "./types";

// Curated material keywords used for both the catalog Material filter and the
// per-card material pills. Matching is substring-based against product.material,
// so verbose sample strings ("Solid European oak") still resolve to "Oak".
// When real, concise product data lands, this list can be regenerated from it.
export const MATERIAL_FILTERS = [
  "Oak",
  "Walnut",
  "Ash",
  "Beech",
  "Linen",
  "Boucle",
  "Steel",
] as const;

export const CATALOG_PAGE_SIZE = 6;

/** Material keywords present in a product (e.g. "Walnut veneer, steel" -> ["Walnut","Steel"]). */
export function productMaterials(product: Product): string[] {
  const haystack = (product.material ?? "").toLowerCase();
  return MATERIAL_FILTERS.filter((m) => haystack.includes(m.toLowerCase()));
}

export type CatalogFilter = {
  categories: string[]; // category slugs
  materials: string[]; // material keywords
};

/** Apply room-type (category) and material filters. Empty filter = pass-through. */
export function filterProducts(
  products: Product[],
  { categories, materials }: CatalogFilter,
): Product[] {
  return products.filter((p) => {
    if (categories.length && !categories.includes(p.category?.slug ?? "")) {
      return false;
    }
    if (materials.length) {
      const mats = productMaterials(p);
      if (!materials.some((m) => mats.includes(m))) return false;
    }
    return true;
  });
}

/** Parse a comma-separated query value into a clean string[]. */
export function parseListParam(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
