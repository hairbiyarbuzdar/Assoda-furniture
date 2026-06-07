import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CatalogFilters from "@/components/CatalogFilters";
import CatalogProductCard from "@/components/CatalogProductCard";
import Pagination from "@/components/Pagination";
import StaggerGrid from "@/components/animations/StaggerGrid";
import { getCategories, getProducts } from "@/lib/queries";
import {
  CATALOG_PAGE_SIZE,
  MATERIAL_FILTERS,
  filterProducts,
  parseListParam,
} from "@/lib/catalog";
import type { Category, Product } from "@/lib/types";

export const revalidate = 60;

type SearchParams = Promise<{
  category?: string;
  material?: string;
  page?: string;
}>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const selected = {
    categories: parseListParam(sp.category),
    materials: parseListParam(sp.material),
  };

  let categories: Category[] = [];
  let products: Product[] = [];
  try {
    [categories, products] = await Promise.all([getCategories(), getProducts()]);
  } catch {
    // DB not configured — sample data fallback handles this.
  }

  const filtered = filterProducts(products, selected);
  const totalPages = Math.max(1, Math.ceil(filtered.length / CATALOG_PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(sp.page) || 1), totalPages);
  const pageItems = filtered.slice(
    (page - 1) * CATALOG_PAGE_SIZE,
    page * CATALOG_PAGE_SIZE,
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Page heading */}
        <header className="max-w-2xl">
          <h1 className="font-serif text-5xl leading-tight text-maroon sm:text-6xl">
            Curation of Living
          </h1>
          <p className="mt-6 leading-relaxed text-ink/70">
            At Assoda, we believe that the home is a living testament to time.
            Our latest catalog emphasizes material integrity—sourced
            responsibly, crafted by hand, and designed to age with a grace that
            only natural wood, stone, and textile can provide.
          </p>
        </header>

        {/* Filters + grid */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[200px_1fr]">
          <CatalogFilters categories={categories} materials={MATERIAL_FILTERS} />

          <div>
            {pageItems.length === 0 ? (
              <p className="py-20 text-center text-muted">
                No pieces match these filters.
              </p>
            ) : (
              <StaggerGrid className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
                {pageItems.map((p) => (
                  <CatalogProductCard key={p.id} product={p} />
                ))}
              </StaggerGrid>
            )}

            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
