import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import {
  DEFAULT_SITE_CONTENT,
  sampleCategories,
  sampleProducts,
} from "../sample-data";
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

// fs-backed dev store. Files live in <project>/data and are seeded from
// sample-data on first read. NODE RUNTIME ONLY; persistence is local-dev only
// (serverless filesystems are ephemeral) — production should use Supabase.

const DATA_DIR = path.join(process.cwd(), "data");
const FILES = {
  products: path.join(DATA_DIR, "products.json"),
  categories: path.join(DATA_DIR, "categories.json"),
  content: path.join(DATA_DIR, "site-content.json"),
};

async function readJson<T>(file: string, seed: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

// Serialize writes so concurrent requests can't corrupt a file.
let writeChain: Promise<unknown> = Promise.resolve();
function serialize<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.catch(() => undefined);
  return run;
}

function stripJoin(p: Product): Product {
  const { category: _drop, ...rest } = p;
  void _drop;
  return rest as Product;
}

async function loadCategories(): Promise<Category[]> {
  return readJson<Category[]>(FILES.categories, sampleCategories);
}

async function loadProducts(): Promise<Product[]> {
  return readJson<Product[]>(FILES.products, sampleProducts);
}

async function withCategory(products: Product[]): Promise<Product[]> {
  const cats = await loadCategories();
  const byId = new Map(cats.map((c) => [c.id, c]));
  return products.map((p) => ({
    ...p,
    category: p.category_id ? byId.get(p.category_id) ?? null : null,
  }));
}

export const localStore: Store = {
  // ---- categories ----
  async listCategories() {
    return loadCategories();
  },

  createCategory(input: CategoryInput) {
    return serialize(async () => {
      const cats = await loadCategories();
      const slug = input.slug?.trim() || slugify(input.name);
      if (cats.some((c) => c.slug === slug)) {
        throw new StoreError("A category with that slug already exists", 409);
      }
      const category: Category = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        slug,
        description: input.description ?? null,
        created_at: new Date().toISOString(),
      };
      await writeJson(FILES.categories, [...cats, category]);
      return category;
    });
  },

  deleteCategory(id: string) {
    return serialize(async () => {
      const cats = await loadCategories();
      await writeJson(
        FILES.categories,
        cats.filter((c) => c.id !== id),
      );
      // Orphan products referencing it (mirrors ON DELETE SET NULL).
      const products = await loadProducts();
      if (products.some((p) => p.category_id === id)) {
        await writeJson(
          FILES.products,
          products.map((p) =>
            p.category_id === id ? { ...p, category_id: null } : p,
          ),
        );
      }
    });
  },

  // ---- products ----
  async listProducts(opts?: ProductListOpts) {
    let list = await withCategory(await loadProducts());
    list = list.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    if (opts?.featured) list = list.filter((p) => p.featured);
    if (opts?.categorySlug)
      list = list.filter((p) => p.category?.slug === opts.categorySlug);
    return list;
  },

  async getProductBySlug(slug: string) {
    const list = await withCategory(await loadProducts());
    return list.find((p) => p.slug === slug) ?? null;
  },

  async getProductById(id: string) {
    const list = await withCategory(await loadProducts());
    return list.find((p) => p.id === id) ?? null;
  },

  createProduct(input: ProductInput) {
    return serialize(async () => {
      const products = await loadProducts();
      const slug = input.slug?.trim() || slugify(input.name);
      if (products.some((p) => p.slug === slug)) {
        throw new StoreError("A product with that slug already exists", 409);
      }
      const now = new Date().toISOString();
      const product: Product = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        slug,
        description: input.description ?? null,
        price: input.price ?? null,
        category_id: input.category_id ?? null,
        dimensions: input.dimensions ?? null,
        material: input.material ?? null,
        colors: input.colors ?? [],
        in_stock: input.in_stock ?? true,
        featured: input.featured ?? false,
        images: input.images ?? [],
        details: input.details ?? null,
        created_at: now,
        updated_at: now,
      };
      await writeJson(FILES.products, [stripJoin(product), ...products]);
      return (await withCategory([product]))[0];
    });
  },

  updateProduct(id: string, input: ProductInput) {
    return serialize(async () => {
      const products = await loadProducts();
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) throw new StoreError("Product not found", 404);

      const current = products[idx];
      const slug =
        input.slug !== undefined
          ? input.slug.trim() || slugify(input.name ?? current.name)
          : current.slug;
      if (
        slug !== current.slug &&
        products.some((p) => p.slug === slug && p.id !== id)
      ) {
        throw new StoreError("A product with that slug already exists", 409);
      }

      const updated: Product = {
        ...current,
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        slug,
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.category_id !== undefined ? { category_id: input.category_id } : {}),
        ...(input.dimensions !== undefined ? { dimensions: input.dimensions } : {}),
        ...(input.material !== undefined ? { material: input.material } : {}),
        ...(input.colors !== undefined ? { colors: input.colors } : {}),
        ...(input.in_stock !== undefined ? { in_stock: input.in_stock } : {}),
        ...(input.featured !== undefined ? { featured: input.featured } : {}),
        ...(input.images !== undefined ? { images: input.images } : {}),
        ...(input.details !== undefined ? { details: input.details } : {}),
        updated_at: new Date().toISOString(),
      };
      products[idx] = stripJoin(updated);
      await writeJson(FILES.products, products);
      return (await withCategory([updated]))[0];
    });
  },

  deleteProduct(id: string) {
    return serialize(async () => {
      const products = await loadProducts();
      const target = products.find((p) => p.id === id);
      if (!target) throw new StoreError("Product not found", 404);
      await writeJson(
        FILES.products,
        products.filter((p) => p.id !== id),
      );
      return { images: (target.images ?? []) as ProductImage[] };
    });
  },

  // ---- site content ----
  async getSiteContent() {
    return readJson<SiteContent>(FILES.content, DEFAULT_SITE_CONTENT);
  },

  putSiteContent(content: SiteContent) {
    return serialize(async () => {
      await writeJson(FILES.content, content);
      return content;
    });
  },
};
