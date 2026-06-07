import LandingProductCard from "@/components/LandingProductCard";
import type { Product } from "@/lib/types";

export default function NewArrivals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-center font-serif text-4xl text-ink sm:text-5xl">
        New Arrivals
      </h2>
      <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
        {products.map((product) => (
          <LandingProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
