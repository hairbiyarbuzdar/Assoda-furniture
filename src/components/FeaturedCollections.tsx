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

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {content.items.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[3/4]"
          >
            {c.image?.url && (
              <Image
                src={c.image.url}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="font-serif text-3xl text-cream">{c.title}</h3>
              <span className="mt-2 inline-block text-xs uppercase tracking-[0.2em] text-cream/90">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
