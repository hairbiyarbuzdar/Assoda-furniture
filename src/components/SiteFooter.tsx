import Link from "next/link";

const COLUMNS = [
  {
    title: "Studio",
    links: [
      { label: "Our Story", href: "/our-story" },
      { label: "Sustainability", href: "#" },
      { label: "Journal", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & Returns", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

const SOCIALS = ["Instagram", "Pinterest", "LinkedIn"];

export default function SiteFooter() {
  return (
    <footer className="bg-blush">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:pr-6">
            <Link href="/" className="font-serif text-2xl text-maroon">
              Asooda
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60">
              Crafting timeless environments with materials that speak of the
              earth and hands that know their craft.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/70 transition-colors hover:text-maroon"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Correspondence / newsletter */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted">
              Correspondence
            </h3>
            <form className="mt-5 flex items-center gap-2 border-b border-ink/30 pb-2">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent text-sm text-ink placeholder:text-muted/80 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex-none text-maroon transition-opacity hover:opacity-60"
              >
                <ArrowIcon />
              </button>
            </form>
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.15em] text-muted">
              Join the circle for seasonal collection launches.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-maroon/10 pt-6 text-xs uppercase tracking-[0.15em] text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} Asooda Furniture. Crafted for Generations.
            <br />
            <span className="text-muted/60">Developed by Hairbiyar</span>
          </p>
          <div className="flex gap-6">
            {SOCIALS.map((s) => (
              <Link key={s} href="#" className="hover:text-maroon">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="5" y1="19" x2="19" y2="5" />
      <polyline points="8 5 19 5 19 16" />
    </svg>
  );
}
