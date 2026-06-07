"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  function share() {
    const url = `${window.location.origin}/catalog/${product.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  const images = product.images ?? [];
  const activeImage = images[activeIdx];

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 grid w-full max-w-3xl grid-cols-1 bg-cream shadow-2xl sm:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center text-ink/50 transition-colors hover:text-maroon"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Left: images */}
        <div className="flex flex-col gap-3 bg-blush p-4">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            {activeImage ? (
              <Image
                src={activeImage.url}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                No image
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.public_id}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`relative h-14 w-14 flex-none overflow-hidden border-2 transition-colors ${
                    i === activeIdx ? "border-maroon" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: details */}
        <div className="flex flex-col justify-between p-8">
          <div>
            {product.category?.name && (
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                {product.category.name}
              </p>
            )}
            <h2 className="mt-2 font-serif text-2xl leading-snug text-maroon">
              {product.name}
            </h2>
            {product.details?.subtitle && (
              <p className="mt-1 text-sm italic text-ink/60">
                {product.details.subtitle}
              </p>
            )}
            <p className="mt-3 text-lg text-ink/80">
              {formatPrice(product.price)}
            </p>

            {product.description && (
              <p className="mt-5 text-sm leading-relaxed text-ink/70">
                {product.description}
              </p>
            )}

            {product.material && (
              <p className="mt-4 text-xs text-ink/50">
                <span className="uppercase tracking-[0.15em]">Material</span>{" "}
                — {product.material}
              </p>
            )}

            {product.dimensions && (
              <p className="mt-1 text-xs text-ink/50">
                <span className="uppercase tracking-[0.15em]">Dimensions</span>{" "}
                — {product.dimensions}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={`/catalog/${product.slug}`}
              onClick={onClose}
              className="block w-full bg-maroon py-3.5 text-center text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-maroon-dark"
            >
              View Full Details
            </Link>
            <button
              type="button"
              onClick={share}
              className="flex w-full items-center justify-center gap-2 border border-maroon/30 py-3 text-xs uppercase tracking-[0.2em] text-maroon/70 transition-colors hover:border-maroon hover:text-maroon"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {copied ? "Link copied!" : "Share"}
            </button>
            <p className="text-center text-[0.6rem] uppercase tracking-[0.15em] text-muted">
              {product.in_stock ? "In stock" : "Out of stock"}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
