import Image from "next/image";
import type { HomeContent } from "@/lib/types";

export default function CraftBand({
  content,
}: {
  content: HomeContent["craftBand"];
}) {
  return (
    <section className="bg-blush">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:gap-16">
        {/* Left: copy */}
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {content.title}
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-ink/70">
            {content.body}
          </p>

          <div className="mt-10 space-y-6">
            {content.features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-cream text-maroon">
                  <LeafIcon />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.18em] text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/65">
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: photo with overlapping quote box */}
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            {content.image?.url && (
              <Image
                src={content.image.url}
                alt={content.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
          <figure className="absolute bottom-0 left-0 max-w-xs bg-maroon-dark p-8 text-cream sm:-left-8">
            <blockquote className="font-serif text-2xl italic leading-snug">
              &ldquo;{content.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-[0.2em] text-cream/70">
              — {content.quoteAuthor}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 8-4 14-9 16Z" />
      <path d="M4 20c3-4 6-7 12-9" />
    </svg>
  );
}
