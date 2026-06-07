import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { productMaterials } from "@/lib/catalog";
import QuickViewTrigger from "./QuickViewTrigger";

export default function CatalogProductCard({ product }: { product: Product }) {
  const cover = product.images?.[0];
  const second = product.images?.[1];
  const pills = productMaterials(product);

  return (
    <Link href={`/catalog/${product.slug}`} className="group block transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-blush">
        {cover ? (
          <>
            {/* Primary image */}
            <Image
              src={cover.url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-500 ${second ? "group-hover:opacity-0" : ""}`}
            />
            {/* Secondary image — swaps in on hover */}
            {second && (
              <Image
                src={second.url}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image
          </div>
        )}

        <QuickViewTrigger product={product} />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="font-serif text-lg leading-snug text-ink">
          {product.name}
        </h3>
        <span className="mt-0.5 flex-none text-sm text-ink/70">
          {formatPrice(product.price)}
        </span>
      </div>

      {pills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pills.map((p) => (
            <span
              key={p}
              className="rounded-sm bg-[#EADDD0] px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-ink/60"
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
