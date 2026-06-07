"use client";

import { useState } from "react";
import type { FrameFinish, Product } from "@/lib/types";
import { formatPriceExact } from "@/lib/utils";

// Fallbacks used only when a product has no managed details yet.
const FALLBACK_FINISHES: FrameFinish[] = [
  { name: "Walnut", hex: "#5A3A2E" },
  { name: "Natural Oak", hex: "#C9A87C" },
];
const FALLBACK_PERKS = [
  "White Glove Delivery (4–6 weeks)",
  "Lifetime Frame Warranty",
];
const FALLBACK_UPHOLSTERY = ["Ivory Boucle", "Charcoal Felt", "Tobacco Leather"];

export default function BuyBox({ product }: { product: Product }) {
  const d = product.details ?? {};

  const collectionLabel = d.collectionLabel || "Heritage Collection";
  const subtitle = d.subtitle ?? product.material;
  const frameFinishes =
    d.frameFinishes && d.frameFinishes.length ? d.frameFinishes : FALLBACK_FINISHES;
  const upholstery =
    d.upholstery && d.upholstery.length
      ? d.upholstery
      : product.colors?.length
        ? product.colors
        : FALLBACK_UPHOLSTERY;
  const perks = d.perks && d.perks.length ? d.perks : FALLBACK_PERKS;

  const [finish, setFinish] = useState(0);
  const [fabric, setFabric] = useState(0);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted">
        {product.category?.name ?? "Lounge Seating"} / {collectionLabel}
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-maroon sm:text-5xl">
        {product.name}
      </h1>
      {subtitle && (
        <p className="mt-3 font-serif text-lg italic text-ink/60">{subtitle}.</p>
      )}

      <p className="mt-6 font-serif text-3xl text-ink">
        {formatPriceExact(product.price)}
      </p>

      <div className="my-8 border-t border-maroon/10" />

      {/* Frame finish */}
      <div>
        <h2 className="text-xs uppercase tracking-[0.18em] text-ink">Frame Finish</h2>
        <div className="mt-3 flex gap-3">
          {frameFinishes.map((f, i) => (
            <button
              key={`${f.name}-${i}`}
              type="button"
              onClick={() => setFinish(i)}
              aria-label={f.name}
              title={f.name}
              style={{ backgroundColor: f.hex }}
              className={`h-9 w-9 rounded-md transition ${
                finish === i ? "ring-2 ring-maroon ring-offset-2 ring-offset-cream" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* Upholstery */}
      <div className="mt-6">
        <h2 className="text-xs uppercase tracking-[0.18em] text-ink">Upholstery</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {upholstery.map((opt, i) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFabric(i)}
              className={`rounded-md border px-4 py-2 text-sm transition ${
                fabric === i
                  ? "border-maroon bg-[#EADDD0] text-ink"
                  : "border-ink/20 text-ink/70 hover:border-maroon/50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Actions (non-wired — cart/wishlist come with the API phase) */}
      <button
        type="button"
        className="mt-8 w-full bg-maroon-dark py-4 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-maroon"
      >
        Add to Bag
      </button>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-ink/20 py-3 text-xs uppercase tracking-[0.18em] text-ink/80 transition-colors hover:border-maroon hover:text-maroon"
        >
          <HeartIcon /> Wishlist
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-ink/20 py-3 text-xs uppercase tracking-[0.18em] text-ink/80 transition-colors hover:border-maroon hover:text-maroon"
        >
          <ShareIcon /> Share
        </button>
      </div>

      <div className="my-8 border-t border-maroon/10" />

      <ul className="space-y-3">
        {perks.map((label, i) => (
          <li key={label} className="flex items-center gap-3 text-sm text-ink/70">
            <span className="text-maroon">{i === 0 ? <TruckIcon /> : <BadgeIcon />}</span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7" />
      <circle cx="5.5" cy="18.5" r="2" />
      <circle cx="18.5" cy="18.5" r="2" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
