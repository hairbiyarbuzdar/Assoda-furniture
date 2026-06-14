"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/lib/types";

export default function Hero({ content }: { content: HomeContent["hero"] }) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Background: subtle zoom-out on load
      gsap.fromTo(
        ".hero-bg",
        { scale: 1.07 },
        { scale: 1, duration: 1.9, ease: "power2.out" },
      );

      // Text cascade: eyebrow → title → subtitle → cta
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 44 },
          { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
          "-=0.52",
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" },
          "-=0.62",
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" },
          "-=0.55",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] w-full overflow-hidden"
    >
      {content.image?.url && (
        <Image
          src={content.image.url}
          alt={content.title}
          fill
          priority
          sizes="100vw"
          className="hero-bg object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-cream/85 via-cream/40 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
        <div className="max-w-xl">
          {content.eyebrow && (
            <p
              className="hero-eyebrow mb-4 text-xs uppercase tracking-[0.22em] text-muted"
              style={{ opacity: 0 }}
            >
              {content.eyebrow}
            </p>
          )}
          <h1
            className="hero-title font-serif text-5xl leading-[1.05] text-maroon sm:text-6xl lg:text-7xl"
            style={{ opacity: 0 }}
          >
            {content.title}
          </h1>
          <p
            className="hero-subtitle mt-6 max-w-md text-base leading-relaxed text-ink/70"
            style={{ opacity: 0 }}
          >
            {content.subtitle}
          </p>
          <Link
            href={content.cta.href}
            className="hero-cta mt-8 inline-block bg-maroon-dark px-9 py-4 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-maroon"
            style={{ opacity: 0 }}
          >
            {content.cta.label}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[0.6rem] uppercase tracking-[0.3em] text-ink/40">Scroll</span>
        <div className="h-10 w-px overflow-hidden bg-ink/15">
          <div className="h-full w-full animate-[scrollLine_1.6s_ease-in-out_infinite] bg-maroon" />
        </div>
      </div>
    </section>
  );
}
