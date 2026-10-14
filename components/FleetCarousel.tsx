"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import KartWidget from "./KartWidget";
import { recommend, type Kart } from "@/lib/karts";

/* Butées alignées sur la grille du site (max-w-7xl + marges). */
const GUTTER = "var(--site-gutter)";

/**
 * Toute la flotte en défilement latéral, avec flèches précédent / suivant
 * (utiles à la souris, le doigt et le trackpad défilent directement).
 */
/* Sélecteur minimaliste : un profil type par tranche (âge, taille représentatifs). */
const PROFILES = [
  { id: "3-6", label: "3–6 ans", age: 5, height: 110 },
  { id: "7-13", label: "7–13 ans", age: 10, height: 140 },
  { id: "14-17", label: "14–17 ans", age: 15, height: 165 },
  { id: "adulte", label: "Adulte", age: 25, height: 175 },
] as const;

export default function FleetCarousel({ karts }: { karts: Kart[] }) {
  const row = useRef<HTMLDivElement>(null);
  const [finder, setFinder] = useState(false);
  const [profile, setProfile] = useState<(typeof PROFILES)[number] | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const reco = profile ? recommend(profile.age, profile.height, confirmed) : null;

  // Le kart recommandé vient se caler sur la butée gauche de la rangée.
  useEffect(() => {
    if (!reco) return;
    const el = row.current?.querySelector<HTMLElement>(`[data-kart="${reco.primary.slug}"]`);
    const r = row.current;
    if (!el || !r) return;
    const left = r.scrollLeft + el.getBoundingClientRect().left - r.getBoundingClientRect().left - parseFloat(getComputedStyle(r).paddingLeft);
    r.scrollTo({ left, behavior: "smooth" });
  }, [reco?.primary.slug]); // eslint-disable-line react-hooks/exhaustive-deps
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
          <div
            key={k.slug}
            data-kart={k.slug}
            className={`w-[85%] shrink-0 snap-start rounded-[calc(var(--cta-height)/2+1.25rem)] transition-opacity duration-300 sm:w-[60%] md:w-[44%] lg:w-[calc((min(100vw-4rem,76rem)-2.5rem)/3)] ${
              reco && reco.primary.slug !== k.slug && !reco.alternatives.some((a) => a.slug === k.slug) ? "opacity-35" : ""
            }`}
          >
            <KartWidget kart={k} />
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Le CTA s'efface au profit du choix d'âge, sur la même ligne : pas de
            panneau qui s'ouvre en dessous. La croix referme et remet la flotte à plat. */}
        {!finder ? (
          <button
            type="button"
            onClick={() => setFinder(true)}
            aria-expanded={false}
            aria-controls="kart-finder"
            className="btn btn-race mt-6"
          >
            Trouve ton kart en 10 s
          </button>
        ) : (
          <div id="kart-finder" className="mt-6">
            {/* Mobile : « Qui pilote ? » et la croix sur une ligne, les 4 âges dessous
                sur une seule rangée. Ordinateur : tout sur la même ligne. */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
              <p className="order-1 mr-1 text-base font-semibold text-chalk">Qui pilote ?</p>
              <div className="no-scrollbar order-3 -mx-5 flex w-[calc(100%+2.5rem)] gap-1.5 overflow-x-auto px-5 sm:order-2 sm:gap-2 sm:mx-0 sm:w-auto sm:px-0">
                {PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={profile?.id === p.id}
                    onClick={() => setProfile(p)}
                    className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-3.5 text-sm font-semibold transition-colors sm:px-5 sm:text-base ${
                      profile?.id === p.id ? "border-chalk bg-chalk text-asphalt" : "border-white/25 text-chalk hover:border-chalk"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {profile?.id === "adulte" && (
                <label className="order-4 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-chalk sm:order-3 sm:ml-1">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="h-5 w-5 accent-[var(--color-race)]" />
                  Pilote confirmé
                </label>
              )}
              <button
                type="button"
                onClick={() => {
                  setFinder(false);
                  setProfile(null);
                  setConfirmed(false);
                }}
                aria-label="Fermer le sélecteur"
                className="order-2 ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-chalk/60 text-chalk transition-colors hover:border-chalk hover:bg-chalk hover:text-asphalt sm:order-last"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {reco && (
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-chalk-60" aria-live="polite">
                <span className="display text-lg text-flag">{reco.primary.name} · {reco.primary.price} €</span>{" "}
                — {reco.message}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
