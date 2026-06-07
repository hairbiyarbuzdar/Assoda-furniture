import Link from "next/link";
import { getCategories, getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    [products, categories] = await Promise.all([getProducts(), getCategories()]);
  } catch {
    // store unavailable — show zeros
  }

  const featured = products.filter((p) => p.featured).length;
  const outOfStock = products.filter((p) => !p.in_stock).length;

  const stats = [
    { label: "Products", value: products.length, href: "/dashboard/products" },
    { label: "Categories", value: categories.length, href: "/dashboard/categories" },
    { label: "Featured", value: featured, href: "/dashboard/products" },
    { label: "Out of stock", value: outOfStock, href: "/dashboard/products" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Manage your catalog and site content.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300"
          >
            <p className="text-3xl font-semibold tabular-nums">{s.value}</p>
            <p className="mt-1 text-sm text-zinc-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <QuickLink href="/dashboard/products/new" title="Add a product" desc="Create a new catalog piece." />
        <QuickLink href="/dashboard/categories" title="Manage categories" desc="Edit catalog room types." />
        <QuickLink href="/dashboard/content" title="Edit site content" desc="Homepage & Our Story." />
      </div>

      <p className="mt-8 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
        Running on the local dev store — changes save to <code>data/*.json</code>{" "}
        and reset on deploy. Connect Supabase + Cloudinary to persist in
        production.
      </p>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{desc}</p>
    </Link>
  );
}
