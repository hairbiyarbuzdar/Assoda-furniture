"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import QuickViewModal from "./QuickViewModal";

export default function QuickViewTrigger({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Overlay bar — shown on parent group-hover via CSS */}
      <div className="absolute inset-x-0 bottom-0 flex translate-y-1 items-center bg-ink/80 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          className="flex-1 py-3.5 text-center text-[0.62rem] uppercase tracking-[0.22em] text-cream transition-colors hover:text-cream/70"
        >
          Quick view
        </button>
      </div>

      {open && (
        <QuickViewModal product={product} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
