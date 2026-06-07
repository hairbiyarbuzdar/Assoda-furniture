"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { MATERIAL_FILTERS } from "@/lib/catalog";

const ESSENTIALS = [
  { label: "New Arrivals", href: "/catalog" },
  { label: "Featured Pieces", href: "/catalog?featured=true" },
  { label: "All Pieces", href: "/catalog" },
  { label: "Our Story", href: "/our-story" },
];

const STATIC_LINKS = [
  { label: "Our Story", href: "/our-story" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteHeaderClient({
  categories,
}: {
  categories: Category[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="relative sticky top-0 z-50 bg-cream/95 backdrop-blur"
      onMouseLeave={() => setCatalogOpen(false)}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Left: mobile hamburger / desktop wordmark */}
        <div className="flex flex-1 items-center">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="text-maroon md:hidden"
          >
            <MenuIcon />
          </button>
          <Link
            href="/"
            className="hidden font-serif text-2xl tracking-[0.25em] text-maroon md:block"
          >
            ASOODA
          </Link>
        </div>

        {/* Center: wordmark (mobile) / nav links (desktop) */}
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.25em] text-maroon md:hidden"
        >
          ASOODA
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {/* Catalog: triggers full-width mega-menu */}
          <div onMouseEnter={() => setCatalogOpen(true)}>
            <Link
              href="/catalog"
              className="group relative block text-xs uppercase tracking-[0.18em] text-ink/80 transition-colors hover:text-maroon"
            >
              Catalog
              <span
                className={`absolute -bottom-1 left-0 h-px bg-maroon transition-all duration-300 ${
                  catalogOpen ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          </div>

          {STATIC_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative text-xs uppercase tracking-[0.18em] text-ink/80 transition-colors hover:text-maroon"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-maroon transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right spacer */}
        <div className="flex-1" />
      </div>

      {/* Full-width mega-menu */}
      {catalogOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-maroon/10 bg-cream shadow-xl shadow-maroon/5">
          <div className="mx-auto grid max-w-6xl grid-cols-4 gap-0 px-6 py-10">
            {/* Column 1: Shop by Room */}
            <div className="pr-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
                Shop by Room
              </p>
              <ul className="mt-5 space-y-3">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/catalog?category=${c.slug}`}
                      onClick={() => setCatalogOpen(false)}
                      className="text-sm text-ink/80 transition-colors hover:text-maroon"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: By Material */}
            <div className="border-l border-maroon/10 px-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
                By Material
              </p>
              <ul className="mt-5 space-y-3">
                {MATERIAL_FILTERS.map((m) => (
                  <li key={m}>
                    <Link
                      href={`/catalog?material=${m}`}
                      onClick={() => setCatalogOpen(false)}
                      className="text-sm text-ink/80 transition-colors hover:text-maroon"
                    >
                      {m}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Essentials */}
            <div className="border-l border-maroon/10 px-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
                Essentials
              </p>
              <ul className="mt-5 space-y-3">
                {ESSENTIALS.map((e) => (
                  <li key={e.label}>
                    <Link
                      href={e.href}
                      onClick={() => setCatalogOpen(false)}
                      className="text-sm text-ink/80 transition-colors hover:text-maroon"
                    >
                      {e.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Collections CTA */}
            <div className="flex flex-col justify-between border-l border-maroon/10 pl-10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
                  Collections
                </p>
                <p className="mt-4 font-serif text-3xl leading-snug text-maroon">
                  Crafted to<br />last a lifetime.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">
                  Every piece is made by hand from natural materials — built to age with grace.
                </p>
              </div>
              <Link
                href="/catalog"
                onClick={() => setCatalogOpen(false)}
                className="mt-6 inline-block border border-maroon px-6 py-3 text-xs uppercase tracking-[0.18em] text-maroon transition-colors hover:bg-maroon hover:text-cream"
              >
                View All Pieces
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-maroon/10">
        <div
          className="h-full bg-maroon transition-[width] duration-75 ease-linear"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <nav className="border-t border-maroon/10 bg-cream md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-2">
            <Link
              href="/catalog"
              onClick={() => setMobileOpen(false)}
              className="border-b border-maroon/5 py-3 text-sm uppercase tracking-[0.18em] text-ink/80 hover:text-maroon"
            >
              Catalog
            </Link>
            {STATIC_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-maroon/5 py-3 text-sm uppercase tracking-[0.18em] text-ink/80 last:border-0 hover:text-maroon"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
