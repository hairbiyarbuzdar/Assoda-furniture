import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import DeleteProductButton from "@/components/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let loadError = "";
  try {
    products = await getProducts();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load products";
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + New product
        </Link>
      </div>

      {loadError && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          {loadError}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  No products yet. Create your first one.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-zinc-100">
                      {p.images?.[0] && (
                        <Image
                          src={p.images[0].url}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {p.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {p.featured && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                        Featured
                      </span>
                    )}
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        p.in_stock
                          ? "bg-green-100 text-green-800"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {p.in_stock ? "In stock" : "Out"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/dashboard/products/${p.id}`}
                      className="text-sm font-medium text-zinc-900 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
