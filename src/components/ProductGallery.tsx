"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";

export default function ProductGallery({
  images,
  alt,
}: {
  images: ProductImage[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (!images?.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-stone-100 text-stone-400">
        No image
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-100">
        <Image
          src={images[active].url}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.public_id}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 overflow-hidden rounded border ${
                i === active ? "border-brand" : "border-stone-200"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
