import { DEFAULT_SITE_CONTENT } from "../sample-data";
import { getAdminClient, getPublicClient } from "../supabase";
import { slugify } from "../utils";
import type {
  Category,
  Product,
  ProductImage,
  ProductInput,
  SiteContent,
} from "../types";
import {
  StoreError,
  type CategoryInput,
  type ProductListOpts,
  type Store,
} from "./types";

const PRODUCT_SELECT = "*, category:categories(*)";
const SITE_CONTENT_ID = "singleton";

function rowFromInput(input: ProductInput) {
  return {
    name: input.name.trim(),
    slug: input.slug?.trim() || slugify(input.name),
    description: input.description ?? null,
    price: input.price ?? null,
    category_id: input.category_id ?? null,
    dimensions: input.dimensions ?? null,
    material: input.material ?? null,
    colors: input.colors ?? [],
    in_stock: input.in_stock ?? true,
    featured: input.featured ?? false,
    images: input.images ?? [],
    details: input.details ?? {},
  };
}

export const supabaseStore: Store = {
  // ---- categories ----
  async listCategories() {
    const { data, error } = await getPublicClient()
      .from("categories")
      .select("*")
      .order("name");
    if (error) throw new StoreError(error.message);
    return (data as Category[]) ?? [];
  },

  async createCategory(input: CategoryInput) {
    const { data, error } = await getAdminClient()
      .from("categories")
      .insert({
        name: input.name.trim(),
        slug: input.slug?.trim() || slugify(input.name),
        description: input.description ?? null,
      })
      .select("*")
      .single();
    if (error)
      throw new StoreError(error.message, error.code === "23505" ? 409 : 500);
    return data as Category;
  },

  async deleteCategory(id: string) {
    const { error } = await getAdminClient()
      .from("categories")
      .delete()
      .eq("id", id);
    if (error) throw new StoreError(error.message);
  },

  // ---- products ----
  async listProducts(opts?: ProductListOpts) {
    const supabase = getPublicClient();
    let query = supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("created_at", { ascending: false });

    if (opts?.featured) query = query.eq("featured", true);
    if (opts?.categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", opts.categorySlug)
        .single();
      if (!cat) return [];
      query = query.eq("category_id", cat.id);
    }
    const { data, error } = await query;
    if (error) throw new StoreError(error.message);
    return (data as Product[]) ?? [];
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await getPublicClient()
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw new StoreError(error.message);
    }
    return data as Product;
  },

  async getProductById(id: string) {
    const { data, error } = await getAdminClient()
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw new StoreError(error.message);
    }
    return data as Product;
  },

  async createProduct(input: ProductInput) {
    const { data, error } = await getAdminClient()
      .from("products")
      .insert(rowFromInput(input))
      .select(PRODUCT_SELECT)
      .single();
    if (error)
      throw new StoreError(error.message, error.code === "23505" ? 409 : 500);
    return data as Product;
  },

  async updateProduct(id: string, input: ProductInput) {
    // Only set provided fields.
    const patch: Record<string, unknown> = {};
    const full = rowFromInput(input);
    (Object.keys(full) as (keyof typeof full)[]).forEach((k) => {
      const inputKey = k === "details" ? "details" : k;
      if ((input as Record<string, unknown>)[inputKey] !== undefined) {
        patch[k] = full[k];
      }
    });

    const { data, error } = await getAdminClient()
      .from("products")
      .update(patch)
      .eq("id", id)
      .select(PRODUCT_SELECT)
      .single();
    if (error)
      throw new StoreError(error.message, error.code === "23505" ? 409 : 500);
    return data as Product;
  },

  async deleteProduct(id: string) {
    const supabase = getAdminClient();
    const { data: existing } = await supabase
      .from("products")
      .select("images")
      .eq("id", id)
      .single();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new StoreError(error.message);
    return { images: ((existing?.images ?? []) as ProductImage[]) };
  },

  // ---- site content ----
  async getSiteContent() {
    const { data, error } = await getPublicClient()
      .from("site_content")
      .select("data")
      .eq("id", SITE_CONTENT_ID)
      .single();
    if (error) {
      if (error.code === "PGRST116") return DEFAULT_SITE_CONTENT;
      throw new StoreError(error.message);
    }
    return (data?.data as SiteContent) ?? DEFAULT_SITE_CONTENT;
  },

  async putSiteContent(content: SiteContent) {
    const { error } = await getAdminClient()
      .from("site_content")
      .upsert({ id: SITE_CONTENT_ID, data: content, updated_at: new Date().toISOString() });
    if (error) throw new StoreError(error.message);
    return content;
  },
};
