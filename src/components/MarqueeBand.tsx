const ITEMS = [
  "Slow Crafted",
  "Since 1924",
  "FSC Certified",
  "Handmade",
  "White Glove Delivery",
  "Lifetime Warranty",
  "Sustainably Sourced",
  "Artisanal Precision",
];

export default function MarqueeBand() {
  // Quadruple so the strip is always wider than any viewport before looping
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="marquee-wrapper overflow-hidden border-y border-maroon/10 bg-blush py-3">
      <div className="animate-marquee flex whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-[0.65rem] uppercase tracking-[0.28em] text-ink/60">
              {item}
            </span>
            <span className="mx-8 text-maroon/40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
