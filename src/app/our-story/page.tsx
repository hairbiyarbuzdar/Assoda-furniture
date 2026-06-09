import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getSiteContent } from "@/lib/queries";
import { DEFAULT_SITE_CONTENT } from "@/lib/sample-data";
import type { OurStoryContent } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Story — Asooda",
  description:
    "Established in 1924. Crafted for generations — the philosophy, journey, and sustainable practice behind Asooda furniture.",
};

export default async function OurStoryPage() {
  let content: OurStoryContent = DEFAULT_SITE_CONTENT.ourStory;
  try {
    content = (await getSiteContent()).ourStory;
  } catch {
    // store unavailable — use defaults
  }

  return (
    <>
      <SiteHeader />
      <main>
        <Hero content={content.hero} />
        <Philosophy content={content.philosophy} />
        <Journey content={content.journey} />
        <Sustainability content={content.sustainability} />
        <ClosingCta content={content.closingCta} />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero({ content }: { content: OurStoryContent["hero"] }) {
  return (
    <section className="relative flex h-[70vh] min-h-[460px] items-center justify-center overflow-hidden">
      {content.image?.url && (
        <Image
          src={content.image.url}
          alt={content.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-ink/30" />
      <div className="relative text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
          {content.eyebrow}
        </p>
        <h1 className="mt-6 font-serif text-5xl text-cream sm:text-6xl">
          {content.title}
        </h1>
        <span className="mx-auto mt-8 block h-px w-16 bg-cream/50" />
      </div>
    </section>
  );
}

function Philosophy({ content }: { content: OurStoryContent["philosophy"] }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">
        {content.eyebrow}
      </p>
      <h2 className="mt-5 font-serif text-4xl italic text-ink sm:text-5xl">
        {content.title}
      </h2>
      {content.body.map((p, i) => (
        <p key={i} className="mt-8 leading-relaxed text-ink/70 first:mt-8">
          {p}
        </p>
      ))}
    </section>
  );
}

function Journey({ content }: { content: OurStoryContent["journey"] }) {
  return (
    <section className="bg-blush">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-maroon">
              {content.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
              {content.title}
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink/60 md:text-right">
            {content.intro}
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {content.steps.map((step) => (
            <div key={step.label}>
              <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                {step.image?.url && (
                  <Image
                    src={step.image.url}
                    alt={step.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                )}
              </div>
              <h3 className="mt-5 text-xs uppercase tracking-[0.18em] text-maroon">
                {step.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sustainability({
  content,
}: {
  content: OurStoryContent["sustainability"];
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid overflow-hidden bg-maroon-dark text-cream md:grid-cols-2">
        <div className="p-10 sm:p-14">
          <p className="text-xs uppercase tracking-[0.22em] text-cream/60">
            {content.eyebrow}
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-tight text-cream sm:text-5xl">
            {content.title}
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-cream/70">
            {content.body}
          </p>

          <div className="mt-10 flex gap-10">
            {content.stats.map((s, i) => (
              <div key={s.label} className="flex gap-10">
                {i > 0 && <span className="w-px bg-cream/20" />}
                <div>
                  <p className="font-serif text-3xl text-cream">{s.value}</p>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-cream/60">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[280px]">
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
      </div>
    </section>
  );
}

function ClosingCta({ content }: { content: OurStoryContent["closingCta"] }) {
  return (
    <section className="px-6 py-24 text-center">
      <h2 className="font-serif text-3xl text-ink sm:text-4xl">{content.title}</h2>
      <Link
        href={content.cta.href}
        className="mt-8 inline-block bg-maroon-dark px-9 py-4 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-maroon"
      >
        {content.cta.label}
      </Link>
      <div className="mt-8">
        <Link
          href={content.secondary.href}
          className="text-xs uppercase tracking-[0.18em] text-maroon underline underline-offset-4 hover:opacity-70"
        >
          {content.secondary.label}
        </Link>
      </div>
    </section>
  );
}
