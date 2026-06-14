"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { numeric: 100,  suffix: "+", label: "Handcrafted Pieces", duration: 3200 },
  { numeric: 1924, suffix: "",  label: "Established",        duration: 4000 },
  { numeric: 100,  suffix: "%", label: "FSC Certified",      duration: 3500 },
  { numeric: null, symbol: "∞", label: "Lifetime Warranty",  duration: 0    },
];

function useScrambleCount(target: number, triggered: boolean, duration: number) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!triggered || target == null) return;

    const start = performance.now();
    // Start from a value close to the target so the roll-in is short
    const from = Math.max(0, Math.floor(target * 0.15));

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      // Ease-out quart — starts fast, decelerates heavily toward the end
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(from + eased * (target - from)));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [triggered, target, duration]);

  return display;
}

function StatItem({
  numeric,
  suffix,
  symbol,
  label,
  duration,
  triggered,
  hasDivider,
}: {
  numeric?: number | null;
  suffix?: string;
  symbol?: string;
  label: string;
  duration: number;
  triggered: boolean;
  hasDivider: boolean;
}) {
  const count = useScrambleCount(numeric ?? 0, triggered && numeric != null, duration);

  return (
    <div className="relative text-center">
      {hasDivider && (
        <span className="absolute left-0 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-cream/10 md:block" />
      )}
      <p className="tabular-nums font-serif text-4xl text-cream sm:text-5xl">
        {symbol ? (
          <span
            className={`inline-block transition-all duration-700 ${
              triggered ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            {symbol}
          </span>
        ) : (
          <>
            {count}
            {suffix}
          </>
        )}
      </p>
      <p className="mt-2 text-[0.6rem] uppercase tracking-[0.25em] text-cream/45">
        {label}
      </p>
    </div>
  );
}

export default function StatsBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-maroon-dark py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <StatItem
              key={s.label}
              numeric={s.numeric}
              suffix={s.suffix}
              symbol={s.symbol}
              label={s.label}
              duration={s.duration}
              triggered={triggered}
              hasDivider={i > 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
