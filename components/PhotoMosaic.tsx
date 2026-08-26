"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Mosaïque photos façon Paper34 : deux bandes de tuiles qui dérivent
 * automatiquement en sens opposés. Le format de chaque case suit
 * l'orientation de la photo (portrait 4/5, paysage 3/2 ou 5/4) et les
 * images restent intactes (aucun filtre).
 *
 * Prise en main : frein progressif à l'approche du pointeur (la dérive
 * décélère en douceur jusqu'à l'arrêt), ré-accélération progressive
 * quand on repart — le scroll manuel reste possible à tout moment,
 * avec une boucle sans couture.
 */

type Tile = { src: string; alt: string; ratio: string };

const ROW_A: Tile[] = [
  { src: "galerie-01-kart-adulte.jpg", alt: "Pilote adulte en pleine session", ratio: "aspect-[4/5]" },
  { src: "galerie-07-baby-kart.jpg", alt: "Enfant au volant d'un Baby Kart", ratio: "aspect-[4/5]" },
  { src: "galerie-03-drapeau-damier.jpg", alt: "Drapeau à damier en fin de course", ratio: "aspect-[3/2]" },
  { src: "galerie-15-nocturne-grande-roue.jpg", alt: "Session nocturne, grande roue illuminée", ratio: "aspect-[4/5]" },
  { src: "galerie-06-biplace.jpg", alt: "Kart biplace adulte et enfant", ratio: "aspect-[4/5]" },
  { src: "galerie-05-piste.jpg", alt: "La piste bordée de palmiers", ratio: "aspect-[4/5]" },
  { src: "galerie-12-kart-adulte.jpg", alt: "Pilote en plein virage", ratio: "aspect-[3/2]" },
];

const ROW_B: Tile[] = [
  { src: "galerie-02-kart-enfant.jpg", alt: "Jeune pilote en kart enfant", ratio: "aspect-[3/2]" },
  { src: "galerie-14-enfant-nocturne.jpg", alt: "Enfant en session du soir", ratio: "aspect-[4/5]" },
  { src: "galerie-16-jeune-pilote.jpg", alt: "Jeune pilote casqué", ratio: "aspect-[4/5]" },
  { src: "galerie-19-famille.jpg", alt: "Parent et enfant en biplace", ratio: "aspect-[4/5]" },
  { src: "galerie-22-aerien-crepuscule.jpg", alt: "Le circuit au crépuscule vu du ciel", ratio: "aspect-[4/5]" },
  { src: "galerie-17-nocturne-action.jpg", alt: "Kart en pleine action de nuit", ratio: "aspect-[5/4]" },
  { src: "galerie-20-famille.jpg", alt: "Sortie karting en famille", ratio: "aspect-[5/4]" },
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

const DRIFT_A = 0.45; // px/frame vers la gauche
const DRIFT_B = 0.55; // px/frame vers la droite
const BRAKE = 0.055; // inertie du frein/relance (lerp par frame)

export default function PhotoMosaic() {
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type RowState = {
      el: HTMLDivElement;
      dir: number;
      cruise: number; // vitesse de croisière
      speed: number; // vitesse instantanée (lerp vers target)
      target: number;
      timer: ReturnType<typeof setTimeout> | undefined;
    };
    const rows: RowState[] = [
      { el: rowARef.current!, dir: 1, cruise: DRIFT_A, speed: 0, target: DRIFT_A, timer: undefined },
      { el: rowBRef.current!, dir: -1, cruise: DRIFT_B, speed: 0, target: DRIFT_B, timer: undefined },
    ].filter((r) => r.el);

    const cleanups: (() => void)[] = [];
    rows.forEach((row) => {
      const el = row.el;
      if (row.dir === -1) el.scrollLeft = el.scrollWidth / 2;

      const brake = () => {
        row.target = 0;
        clearTimeout(row.timer);
      };
      const release = () => {
        clearTimeout(row.timer);
        row.timer = setTimeout(() => (row.target = row.cruise), 350);
      };
      // Molette / drag : frein, puis relance après une pause courte
      const brakeThenRelease = () => {
        row.target = 0;
        clearTimeout(row.timer);
        row.timer = setTimeout(() => (row.target = row.cruise), 1800);
      };

      el.addEventListener("pointerenter", brake);
      el.addEventListener("pointerleave", release);
      el.addEventListener("touchstart", brakeThenRelease, { passive: true });
      el.addEventListener("touchmove", brakeThenRelease, { passive: true });
      el.addEventListener("wheel", brakeThenRelease, { passive: true });
      cleanups.push(() => {
        clearTimeout(row.timer);
        el.removeEventListener("pointerenter", brake);
        el.removeEventListener("pointerleave", release);
        el.removeEventListener("touchstart", brakeThenRelease);
        el.removeEventListener("touchmove", brakeThenRelease);
        el.removeEventListener("wheel", brakeThenRelease);
      });
    });

    let raf: number;
    const tick = () => {
      rows.forEach((row) => {
        const el = row.el;
        const half = el.scrollWidth / 2;
        // Boucle sans couture (vaut aussi pour le scroll manuel)
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        if (el.scrollLeft <= 0) el.scrollLeft += half;
        // Frein / relance progressifs
        row.speed += (row.target - row.speed) * BRAKE;
        if (Math.abs(row.speed) > 0.002) el.scrollLeft += row.dir * row.speed;
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
    items: Tile[],
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
              className={`relative flex-shrink-0 ${r.offset} ${DEPTH_Z[r.depth]}`}
            >
              <div
                className={`relative overflow-hidden rounded-xl ring-1 ring-white/10 ${r.h} ${item.ratio} ${r.tilt} ${DEPTH_SHADOW[r.depth]}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/${item.src}`}
                  alt={i < items.length ? item.alt : ""}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-asphalt via-asphalt-2 to-asphalt-2 py-20 md:py-28">
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
