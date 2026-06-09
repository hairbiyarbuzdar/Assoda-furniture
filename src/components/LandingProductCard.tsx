import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import QuickViewTrigger from "./QuickViewTrigger";

export default function LandingProductCard({ product }: { product: Product }) {
  const cover = product.images?.[0];
  const second = product.images?.[1];
  const eyebrow =
    product.material?.split(/[\s,]+/)[0] || product.category?.name || "Asooda";

  return (
    <Link href={`/catalog/${product.slug}`} className="group block transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-blush">
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

      <p className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] text-muted">
        {eyebrow}
      </p>
      <h3 className="mt-1 font-serif text-lg text-ink">{product.name}</h3>
      <p className="mt-1 text-sm text-ink/70">{formatPrice(product.price)}</p>
    </Link>
  );
}
