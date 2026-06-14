import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/lib/types";

export default function FeaturedCollections({
  content,
}: {
  content: HomeContent["featuredCollections"];
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            {content.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
            {content.title}
          </h2>
        </div>
        <Link
          href={content.viewAll.href}
          className="flex-none text-xs uppercase tracking-[0.18em] text-maroon transition-opacity hover:opacity-60"
        >
          {content.viewAll.label}
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-[3fr_2fr] md:grid-rows-[1fr_1fr] md:gap-4" style={{ minHeight: "600px" }}>
        {/* Large card — spans both rows on desktop */}
        {content.items[0] && (
          <Link
            href={content.items[0].href}
            className="group relative block aspect-[3/4] overflow-hidden md:aspect-auto md:row-span-2"
          >
            {content.items[0].image?.url && (
              <Image
                src={content.items[0].image.url}
                alt={content.items[0].title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/60">Collection</p>
              <h3 className="mt-1 font-serif text-4xl text-cream">{content.items[0].title}</h3>
              <span className="mt-3 inline-block text-xs uppercase tracking-[0.2em] text-cream/80 transition-opacity group-hover:opacity-100">
                Shop Now →
              </span>
            </div>
          </Link>
        )}

        {/* Small card */}
        {content.items[1] && (
          <Link
            href={content.items[1].href}
            className="group relative block aspect-[4/3] overflow-hidden md:aspect-auto"
          >
            {content.items[1].image?.url && (
              <Image
                src={content.items[1].image.url}
                alt={content.items[1].title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="font-serif text-2xl text-cream">{content.items[1].title}</h3>
              <span className="mt-2 inline-block text-xs uppercase tracking-[0.2em] text-cream/80">
                Shop Now →
              </span>
            </div>
          </Link>
        )}

        {/* Editorial text card */}
        <div className="flex flex-col justify-center bg-maroon p-8">
          <p className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/50">The Asooda Edit</p>
          <p className="mt-3 font-serif text-2xl leading-snug text-cream">
            Objects that outlive the moment they were made for.
          </p>
          <Link
            href="/catalog"
            className="mt-6 w-fit border border-cream/30 px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.22em] text-cream/80 transition-colors hover:border-cream hover:text-cream"
          >
            View All Pieces
          </Link>
        </div>
      </div>
    </section>
  );
}
