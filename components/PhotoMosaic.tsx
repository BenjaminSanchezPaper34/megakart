"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Mosaïque photos façon Paper34 (section réseaux sociaux) :
 * deux bandes de tuiles inégales qui dérivent automatiquement en sens
 * opposés, scroll manuel possible (la dérive se met en pause dès que
 * le visiteur interagit, reprise après 6 s). Profondeur de champ :
 * premier plan grand et net, arrière-plan plus petit, flouté, ombré.
 */

const ROW_A = [
  { src: "galerie-01-kart-adulte.jpg", alt: "Pilote adulte en pleine session" },
  { src: "galerie-07-baby-kart.jpg", alt: "Enfant au volant d'un Baby Kart" },
  { src: "galerie-03-drapeau-damier.jpg", alt: "Drapeau à damier en fin de course" },
  { src: "galerie-15-nocturne-grande-roue.jpg", alt: "Session nocturne, grande roue illuminée" },
  { src: "galerie-06-biplace.jpg", alt: "Kart biplace adulte et enfant" },
  { src: "galerie-05-piste.jpg", alt: "La piste bordée de palmiers" },
  { src: "galerie-12-kart-adulte.jpg", alt: "Pilote en plein virage" },
];

const ROW_B = [
  { src: "galerie-02-kart-enfant.jpg", alt: "Jeune pilote en kart enfant" },
  { src: "galerie-14-enfant-nocturne.jpg", alt: "Enfant en session du soir" },
  { src: "galerie-16-jeune-pilote.jpg", alt: "Jeune pilote casqué" },
  { src: "galerie-19-famille.jpg", alt: "Parent et enfant en biplace" },
  { src: "galerie-22-aerien-crepuscule.jpg", alt: "Le circuit au crépuscule vu du ciel" },
  { src: "galerie-17-nocturne-action.jpg", alt: "Kart en pleine action de nuit" },
  { src: "galerie-20-famille.jpg", alt: "Sortie karting en famille" },
];

/* Rythme des tuiles : hauteur, décalage, inclinaison, plan (0=premier). */
const RHYTHM = [
  { h: "h-52 md:h-72", offset: "mt-0", tilt: "-rotate-1", depth: 1 },
  { h: "h-40 md:h-56", offset: "mt-8 md:mt-14", tilt: "rotate-1", depth: 2 },
  { h: "h-60 md:h-80", offset: "mt-1 md:mt-3", tilt: "rotate-0", depth: 0 },
  { h: "h-44 md:h-60", offset: "mt-10 md:mt-16", tilt: "-rotate-2", depth: 2 },
  { h: "h-48 md:h-64", offset: "mt-4 md:mt-7", tilt: "rotate-2", depth: 1 },
  { h: "h-56 md:h-72", offset: "mt-0", tilt: "-rotate-1", depth: 0 },
  { h: "h-40 md:h-52", offset: "mt-9 md:mt-14", tilt: "rotate-1", depth: 2 },
];

const DEPTH_SHADOW = ["shadow-2xl shadow-black/50", "shadow-lg shadow-black/25", ""];
const DEPTH_Z = ["z-20", "z-10", "z-0"];
const DEPTH_FILTER = [
  "",
  "",
  "scale-[1.06] blur-[1.5px] brightness-[0.8] saturate-[0.85] group-hover:blur-none group-hover:brightness-100 group-hover:saturate-100 transition-[filter] duration-500",
];

const DRIFT_A = 0.45; // px/frame vers la gauche
const DRIFT_B = 0.55; // px/frame vers la droite

export default function PhotoMosaic() {
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rows = [
      { el: rowARef.current, dir: 1, speed: DRIFT_A, paused: false, timer: 0 as ReturnType<typeof setTimeout> | 0 },
      { el: rowBRef.current, dir: -1, speed: DRIFT_B, paused: false, timer: 0 as ReturnType<typeof setTimeout> | 0 },
    ].filter((r) => r.el);

    // Le contenu est dupliqué ×2 : on boucle sur la moitié de la largeur.
    const cleanups: (() => void)[] = [];
    rows.forEach((row) => {
      const el = row.el!;
      const half = () => el.scrollWidth / 2;
      if (row.dir === -1) el.scrollLeft = half();

      const pause = () => {
        row.paused = true;
        clearTimeout(row.timer);
        row.timer = setTimeout(() => (row.paused = false), 6000);
      };
      el.addEventListener("pointerenter", pause);
      el.addEventListener("pointerdown", pause);
      el.addEventListener("touchstart", pause, { passive: true });
      el.addEventListener("wheel", pause, { passive: true });
      cleanups.push(() => {
        clearTimeout(row.timer);
        el.removeEventListener("pointerenter", pause);
        el.removeEventListener("pointerdown", pause);
        el.removeEventListener("touchstart", pause);
        el.removeEventListener("wheel", pause);
      });
    });

    let raf: number;
    const tick = () => {
      rows.forEach((row) => {
        const el = row.el!;
        const half = el.scrollWidth / 2;
        // Boucle sans couture (vaut aussi pour le scroll manuel)
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        if (el.scrollLeft <= 0) el.scrollLeft += half;
        if (!row.paused) el.scrollLeft += row.dir * row.speed;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const renderRow = (
    items: typeof ROW_A,
    ref: React.RefObject<HTMLDivElement | null>,
    offsetIndex: number
  ) => (
    <div
      ref={ref}
      className="no-scrollbar overflow-x-auto"
      aria-label="Photos du circuit — défilement horizontal"
    >
      <div className="flex w-max items-start gap-4 px-5 md:gap-6 md:px-8">
        {[...items, ...items].map((item, i) => {
          const r = RHYTHM[(i + offsetIndex) % RHYTHM.length];
          return (
            <div
              key={`${item.src}-${i}`}
              aria-hidden={i >= items.length}
              className={`group relative flex-shrink-0 ${r.offset} ${DEPTH_Z[r.depth]}`}
            >
              <div
                className={`relative overflow-hidden rounded-xl ring-1 ring-white/10 ${r.h} aspect-[4/5] ${r.tilt} ${DEPTH_SHADOW[r.depth]}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/${item.src}`}
                  alt={i < items.length ? item.alt : ""}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover ${DEPTH_FILTER[r.depth]}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Halo d'ambiance */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] max-h-[52rem] w-[70vw] max-w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-race/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
            Sur la piste,
            <br />
            <span className="text-flag">jour et nuit.</span>
          </h2>
          <Link href="/photos" data-reveal className="btn btn-ghost">
            Toutes les photos
          </Link>
        </div>
      </div>

      {/* Deux bandes en dérive opposée */}
      <div className="relative space-y-4 md:space-y-8">
        {renderRow(ROW_A, rowARef, 0)}
        {renderRow(ROW_B, rowBRef, 3)}
      </div>
    </section>
  );
}
