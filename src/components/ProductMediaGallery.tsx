"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";

// Product page gallery: large active image + a grid of thumbnails beneath.
export default function ProductMediaGallery({
  images,
  alt,
}: {
  images: ProductImage[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (!images?.length) {
    return (
      <div className="flex aspect-square items-center justify-center bg-blush text-muted">
        No image
      </div>
    );
  }

  const thumbs = images.slice(1, 5); // up to four secondary shots

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden bg-blush">
        <Image
          src={images[active].url}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* include the cover as the first selectable thumb */}
          {[images[0], ...thumbs].map((img, i) => (
            <button
              key={img.public_id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-[4/3] overflow-hidden bg-blush transition ${
                active === i ? "ring-2 ring-maroon ring-offset-2 ring-offset-cream" : ""
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
