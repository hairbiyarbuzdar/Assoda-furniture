"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const el = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: "power2.out" },
      );
    });
    return () => ctx.revert();
  }, [pathname]);

  return <div ref={el}>{children}</div>;
}
