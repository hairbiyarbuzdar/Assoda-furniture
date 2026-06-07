import CategoryManager from "@/components/admin/CategoryManager";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch {
    // store unavailable
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Categories</h1>
      <p className="mt-1 text-sm text-zinc-500">
        These power the catalog&rsquo;s Room Type filters.
      </p>
      <div className="mt-8">
        <CategoryManager initial={categories} />
      </div>
    </div>
  );
}
