import type {
  Category,
  Product,
  ProductImage,
  ProductInput,
  SiteContent,
} from "../types";

export type ProductListOpts = { categorySlug?: string; featured?: boolean };

export type CategoryInput = {
  name: string;
  slug?: string;
  description?: string | null;
};

/** A storage-agnostic data layer. Implemented by the local JSON store (dev)
 *  and the Supabase store (production). `getStore()` picks one at runtime. */
export interface Store {
  // categories
  listCategories(): Promise<Category[]>;
  createCategory(input: CategoryInput): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // products
  listProducts(opts?: ProductListOpts): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(input: ProductInput): Promise<Product>;
  updateProduct(id: string, input: ProductInput): Promise<Product>;
  deleteProduct(id: string): Promise<{ images: ProductImage[] }>;

  // editorial site content
  getSiteContent(): Promise<SiteContent>;
  putSiteContent(content: SiteContent): Promise<SiteContent>;
}

/** Error carrying an HTTP status so API routes can map it (e.g. 409 duplicate slug). */
export class StoreError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "StoreError";
    this.status = status;
  }
}
