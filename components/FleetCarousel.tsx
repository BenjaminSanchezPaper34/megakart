"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import KartWidget from "./KartWidget";
import type { Kart } from "@/lib/karts";

/* Butées alignées sur la grille du site (max-w-7xl + marges). */
const GUTTER = "max(1.25rem, calc((100vw - 80rem) / 2 + 2rem))";

/**
 * Toute la flotte en défilement latéral, avec flèches précédent / suivant
 * (utiles à la souris, le doigt et le trackpad défilent directement).
 */
export default function FleetCarousel({ karts }: { karts: Kart[] }) {
  const row = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = row.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrow = (dir: 1 | -1, disabled: boolean) => (
    <button
      type="button"
      onClick={() => go(dir)}
      disabled={disabled}
      aria-label={dir === 1 ? "Karts suivants" : "Karts précédents"}
      className="grid h-11 w-11 place-items-center rounded-full border-2 border-chalk/60 text-chalk transition-colors hover:border-chalk hover:bg-chalk hover:text-asphalt disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path d={dir === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  return (
    <>
      <div className="mx-auto mt-8 flex max-w-7xl justify-end gap-3 px-5 md:px-8">
        {arrow(-1, edges.start)}
        {arrow(1, edges.end)}
      </div>
      <div
        ref={row}
        onScroll={update}
        className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
        style={{ paddingInline: GUTTER, scrollPaddingInline: GUTTER }}
      >
        {karts.map((k) => (
          <div key={k.slug} className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-[44%] lg:w-[38rem]">
            <KartWidget kart={k} />
          </div>
        ))}
      </div>
    </>
  );
}
