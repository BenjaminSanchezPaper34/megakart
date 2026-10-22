"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Rangée de cartes à faire défiler latéralement (galeries de la page Photos,
 * 22/10) : glisser au doigt sur mobile, flèches rondes dès 640 px — même
 * dessin que celles de FleetCarousel. Les flèches disparaissent quand tout
 * tient à l'écran. Largeur des cartes : 78 % sur mobile (la suivante dépasse),
 * deux par ligne en tablette, trois sur ordinateur.
 */
export default function RangeeDefilante({ children, label }: { children: ReactNode; label: string }) {
  const row = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

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
      aria-label={dir === 1 ? `${label} suivantes` : `${label} précédentes`}
      className="grid h-11 w-11 place-items-center rounded-full border-2 border-chalk/60 text-chalk transition-colors hover:border-chalk hover:bg-chalk hover:text-asphalt disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path d={dir === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  return (
    <div>
      {!(edges.start && edges.end) && (
        <div className="mb-4 hidden justify-end gap-3 sm:flex">
          {arrow(-1, edges.start)}
          {arrow(1, edges.end)}
        </div>
      )}
      <div
        ref={row}
        onScroll={update}
        className="no-scrollbar -mx-5 grid auto-cols-[78%] grid-flow-col gap-3 overflow-x-auto px-5 scroll-px-5 snap-x snap-mandatory sm:mx-0 sm:auto-cols-[calc((100%-1.25rem)/2)] sm:gap-5 sm:px-0 sm:scroll-px-0 lg:auto-cols-[calc((100%-2.5rem)/3)] [&>*]:snap-start"
      >
        {children}
      </div>
    </div>
  );
}
