"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

// Builds a compact page list with ellipses, e.g. 1 2 3 … 12
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const params = useSearchParams();

  if (totalPages <= 1) return null;

  function hrefFor(page: number) {
    const next = new URLSearchParams(params.toString());
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <nav className="mt-16 flex items-center justify-between text-xs uppercase tracking-[0.15em] text-ink/70">
      {currentPage > 1 ? (
        <Link href={hrefFor(currentPage - 1)} className="flex items-center gap-2 hover:text-maroon">
          <span aria-hidden>←</span> Previous
        </Link>
      ) : (
        <span className="flex items-center gap-2 opacity-30">
          <span aria-hidden>←</span> Previous
        </span>
      )}

      <div className="flex items-center gap-4">
        {pageList(currentPage, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="text-muted">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={hrefFor(p)}
              className={
                p === currentPage
                  ? "text-maroon underline underline-offset-4"
                  : "hover:text-maroon"
              }
            >
              {pad(p)}
            </Link>
          ),
        )}
      </div>

      {currentPage < totalPages ? (
        <Link href={hrefFor(currentPage + 1)} className="flex items-center gap-2 hover:text-maroon">
          Next <span aria-hidden>→</span>
        </Link>
      ) : (
        <span className="flex items-center gap-2 opacity-30">
          Next <span aria-hidden>→</span>
        </span>
      )}
    </nav>
  );
}
