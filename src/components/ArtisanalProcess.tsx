import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&q=80";

export default function ArtisanalProcess({ product }: { product: Product }) {
  const story = product.details?.story ?? {};
  const eyebrow = story.eyebrow || "The Artisanal Process";
  const title = story.title || "Sculpted from a single vision of rest.";
  const body =
    story.body && story.body.length
      ? story.body
      : [
          `The ${product.name} is the result of months of ergonomic study and craftsmanship, hand-shaped from sustainably harvested timber using traditional joinery.`,
        ];
  const quote =
    story.quote ||
    "We don't build furniture to fit a home; we build furniture to ground a life.";
  const author = story.author || "Elias Thorne, Master Joiner";
  const image = story.image?.url || FALLBACK_IMAGE;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Copy */}
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {title}
          </h2>
          {body.map((p, i) => (
            <p key={i} className="mt-6 leading-relaxed text-ink/70 first:mt-6">
              {p}
            </p>
          ))}
          <Link
            href="#"
            className="mt-8 inline-block text-xs uppercase tracking-[0.18em] text-maroon underline underline-offset-4 hover:opacity-70"
          >
            Explore Our Craftsmanship
          </Link>
        </div>

        {/* Image + quote */}
        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={image}
              alt="An artisan at work in the workshop"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <figure className="absolute -bottom-8 left-0 max-w-sm bg-cream p-7 shadow-sm sm:left-8">
            <blockquote className="font-serif text-base italic leading-relaxed text-ink/80">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
              — {author}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
