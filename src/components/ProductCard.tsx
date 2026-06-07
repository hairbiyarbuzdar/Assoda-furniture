import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

// Minimal card. Restyle freely.
export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images?.[0];
  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-stone-200 transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-stone-100">
        {cover ? (
          <Image
            src={cover.url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        {product.category?.name && (
          <p className="text-xs uppercase tracking-wide text-stone-400">
            {product.category.name}
          </p>
        )}
        <p className="mt-1 text-sm text-stone-700">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
