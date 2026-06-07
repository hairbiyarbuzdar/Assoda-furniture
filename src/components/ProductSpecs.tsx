import Link from "next/link";
import type { Product } from "@/lib/types";
import { parseDimensions } from "@/lib/utils";

const FALLBACK_CARE = [
  "Dust woodwork weekly with a soft, lint-free cloth. Every 6 months, apply a thin coat of our proprietary Wood Nurture Oil.",
  "For upholstery, vacuum with a soft brush attachment. Professional dry cleaning recommended for spills.",
];

export default function ProductSpecs({ product }: { product: Product }) {
  const dims = parseDimensions(product.dimensions);
  const care =
    product.details?.care && product.details.care.length
      ? product.details.care
      : FALLBACK_CARE;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 border-t border-maroon/10 pt-14 md:grid-cols-3">
        {/* Dimensions */}
        <div>
          <h2 className="font-serif text-3xl text-ink">Dimensions</h2>
          <dl className="mt-6 divide-y divide-maroon/10">
            {dims.length > 0 ? (
              dims.map((di) => (
                <div key={di.label} className="flex justify-between py-3 text-sm">
                  <dt className="text-ink/60">{di.label}</dt>
                  <dd className="text-ink">{di.value}</dd>
                </div>
              ))
            ) : (
              <p className="py-3 text-sm text-muted">Dimensions on request.</p>
            )}
          </dl>
        </div>

        {/* Materials */}
        <div>
          <h2 className="font-serif text-3xl text-ink">Materials</h2>
          <div className="mt-6 space-y-5">
            <div>
              <h3 className="text-xs uppercase tracking-[0.18em] text-muted">
                Construction
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {product.material ?? "Solid hardwood, hand-finished."}
              </p>
            </div>
            {product.colors?.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted">
                  Available Upholstery
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {product.colors.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Care */}
        <div>
          <h2 className="font-serif text-3xl text-ink">Care</h2>
          <div className="mt-6 space-y-4">
            {care.map((c, i) => (
              <p key={i} className="text-sm leading-relaxed text-ink/70">
                {c}
              </p>
            ))}
            <Link
              href="#"
              className="inline-block text-xs uppercase tracking-[0.18em] text-maroon underline underline-offset-4 hover:opacity-70"
            >
              Full Care Guide →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
