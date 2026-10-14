"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Mosaïque photos : deux bandes de tuiles qui dérivent automatiquement en
 * sens opposés. Tuiles alignées, même hauteur, arrondi concentrique des cartes ;
 * le format de chaque case suit l'orientation de la photo (4/5, 3/2, 5/4).
 *
 * Prise en main : frein progressif à l'approche du pointeur (la dérive
 * décélère en douceur jusqu'à l'arrêt), ré-accélération progressive
 * quand on repart — le scroll manuel reste possible à tout moment,
 * avec une boucle sans couture.
 */

type Tile = { src: string; alt: string; ratio: string };

const ROW_A: Tile[] = [
  { src: "galerie-26-pilote-rx250.jpg", alt: "Pilote en RX250 en pleine courbe", ratio: "aspect-[3/2]" },
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
  { src: "galerie-25-casques.jpg", alt: "Les casques alignés au stand", ratio: "aspect-[3/2]" },
  { src: "galerie-16-jeune-pilote.jpg", alt: "Jeune pilote casqué", ratio: "aspect-[4/5]" },
  { src: "galerie-19-famille.jpg", alt: "Parent et enfant en biplace", ratio: "aspect-[4/5]" },
  { src: "galerie-22-aerien-crepuscule.jpg", alt: "Le circuit au crépuscule vu du ciel", ratio: "aspect-[4/5]" },
  { src: "galerie-17-nocturne-action.jpg", alt: "Kart en pleine action de nuit", ratio: "aspect-[5/4]" },
  { src: "galerie-20-famille.jpg", alt: "Sortie karting en famille", ratio: "aspect-[5/4]" },
];

/* Tuiles bord à bord, même hauteur par bande, sans arrondi ni espace ; la section
   suivante démarre directement sous les photos (choix Benjamin, 14/10). */
const TILE_H = "h-56 md:h-80";
const TILE_RADIUS = "";

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
  ) => (
    <div
      ref={ref}
      className="no-scrollbar overflow-x-auto"
      aria-label="Photos du circuit — défilement horizontal"
    >
      <div className="flex w-max items-center">
        {[...items, ...items].map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            aria-hidden={i >= items.length}
            className={`relative flex-shrink-0 overflow-hidden ${TILE_RADIUS} ${TILE_H} ${item.ratio}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/${item.src}`}
              alt={i < items.length ? item.alt : ""}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-asphalt-2 pt-14 md:pt-20">
      {/* Même système que les autres sections : grand titre, sous-titre + lien sur une ligne. */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <h2 data-reveal className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
          Sur la piste,
          <br />
          <span className="text-flag">jour et nuit.</span>
        </h2>
        <div className="mt-5 mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-12">
          <p data-reveal className="max-w-xl text-base leading-relaxed text-chalk md:text-xl">
            Sessions au soleil, nocturnes sous les projecteurs, premiers tours en Baby Kart : le circuit en vrai.
          </p>
          <Link href="/photos" className="btn btn-ghost">
            Toutes les photos
          </Link>
        </div>
      </div>

      {/* Deux bandes en dérive opposée */}
      <div className="relative">
        {renderRow(ROW_A, rowARef)}
        {renderRow(ROW_B, rowBRef)}
      </div>
    </section>
  );
}
