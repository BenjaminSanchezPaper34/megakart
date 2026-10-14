"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Flèches précédent / suivant pour une rangée qui défile (cartes de courses,
 * bons plans). Elles n'apparaissent QUE si la rangée dépasse de l'écran :
 * sur ordinateur, quand toutes les cartes tiennent, rien ne s'affiche.
 * `target` : sélecteur CSS de la rangée (élément overflow-x-auto).
 */
export default function RowArrows({ target, label }: { target: string; label: string }) {
  const [state, setState] = useState({ overflow: false, start: true, end: false });

  const measure = useCallback(() => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    setState({
      overflow: el.scrollWidth > el.clientWidth + 4,
      start: el.scrollLeft < 8,
      end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8,
    });
  }, [target]);

  useEffect(() => {
    // La rangée peut apparaître après coup (cartes calculées côté client) :
    // on l'attend quelques images, puis on suit ses changements de taille.
    let el: HTMLElement | null = null;
    let ro: ResizeObserver | null = null;
    let raf = 0;
    let tries = 0;
    const attach = () => {
      el = document.querySelector<HTMLElement>(target);
      if (!el) {
        if (tries++ < 120) raf = requestAnimationFrame(attach);
        return;
      }
      measure();
      el.addEventListener("scroll", measure, { passive: true });
      ro = new ResizeObserver(measure);
      ro.observe(el);
    };
    attach();
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener("scroll", measure);
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [target, measure]);

  if (!state.overflow) return null;

  const go = (dir: 1 | -1) => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 16;
    el.scrollBy({ left: dir * (card ? card.offsetWidth + gap : el.clientWidth * 0.8), behavior: "smooth" });
  };

  const arrow = (dir: 1 | -1, disabled: boolean) => (
    <button
      type="button"
      onClick={() => go(dir)}
      disabled={disabled}
      aria-label={`${label} ${dir === 1 ? "suivants" : "précédents"}`}
      className="grid h-11 w-11 place-items-center rounded-full border-2 border-chalk/60 text-chalk transition-colors hover:border-chalk hover:bg-chalk hover:text-asphalt disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path d={dir === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  return (
    <div className="mt-6 flex justify-end gap-3">
      {arrow(-1, state.start)}
      {arrow(1, state.end)}
    </div>
  );
}
