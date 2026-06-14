import LandingProductCard from "@/components/LandingProductCard";
import type { Product } from "@/lib/types";

export default function NewArrivals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted">Just In</p>
            <h2 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">New Arrivals</h2>
          </div>
          <a
            href="/catalog"
            className="hidden text-xs uppercase tracking-[0.18em] text-maroon transition-opacity hover:opacity-60 sm:block"
          >
            View All →
          </a>
        </div>
      </div>

      {/* Mobile: horizontal scroll — Desktop: 4-col grid */}
      <div className="mt-10 md:mx-auto md:max-w-6xl md:px-6">
        {/* Mobile strip */}
        <div className="flex gap-4 overflow-x-auto scroll-smooth px-6 pb-4 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <div key={product.id} className="w-[72vw] flex-none snap-start">
              <LandingProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden grid-cols-4 gap-x-6 gap-y-12 md:grid">
          {products.map((product) => (
            <LandingProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
