import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

// "Complete the Sanctuary" — one large feature card + two stacked thumbs.
// Uses real sibling products; falls back to nothing if none available.
export default function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  const [feature, ...rest] = products;
  const side = rest.slice(0, 2);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Curated Pairing
          </p>
          <h2 className="mt-3 font-serif text-4xl text-maroon sm:text-5xl">
            Complete the Sanctuary
          </h2>
        </div>
        <Link
          href="/catalog"
          className="flex-none text-xs uppercase tracking-[0.18em] text-maroon transition-opacity hover:opacity-60"
        >
          View Full Collection
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* Feature card */}
        <Link
          href={`/catalog/${feature.slug}`}
          className="group relative block aspect-square overflow-hidden bg-blush"
        >
          {feature.images?.[0] && (
            <Image
              src={feature.images[0].url}
              alt={feature.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-7 text-cream">
            <p className="text-xs uppercase tracking-[0.18em] text-cream/80">
              {feature.category?.name ?? "Collection"}
            </p>
            <h3 className="mt-1 font-serif text-2xl">{feature.name}</h3>
            <p className="mt-1 text-sm text-cream/90">
              {formatPrice(feature.price)}
            </p>
          </div>
        </Link>

        {/* Two stacked thumbnails */}
        <div className="grid grid-rows-2 gap-6">
          {side.map((p) => (
            <Link
              key={p.id}
              href={`/catalog/${p.slug}`}
              className="group relative block overflow-hidden bg-blush"
            >
              {p.images?.[0] && (
                <Image
                  src={p.images[0].url}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
