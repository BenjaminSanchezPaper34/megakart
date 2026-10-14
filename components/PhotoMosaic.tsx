"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Mosaïque photos : une bande bord à bord qui défile en continu de droite à
 * gauche, pause au survol, et qu'on peut faire glisser au doigt, à la souris
 * ou au trackpad (elle repart seule ensuite).
 * Le format de chaque case suit l'orientation de la photo (4/5, 3/2, 5/4).
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


const CRUISE = 40; // px/s, de droite à gauche
const EASE = 4; // réactivité du frein / de la relance (par seconde)

export default function PhotoMosaic() {
  const items = [...ROW_A, ...ROW_B];
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Position flottante appliquée en translate3d : sous-pixel fluide, y compris
    // Safari (le défilement par scrollLeft y vibrait, il arrondit au pixel).
    let x = 0;
    let speed = 0;
    let target = reduced ? 0 : CRUISE;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let moved = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let last = performance.now();
    let raf = 0;

    const resume = (delay: number) => {
      clearTimeout(timer);
      if (!reduced) timer = setTimeout(() => (target = CRUISE), delay);
    };
    const wrap = () => {
      const half = track.scrollWidth / 2;
      if (half > 0) x = ((x % half) + half) % half;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging) {
        speed += (target - speed) * Math.min(1, EASE * dt);
        x += speed * dt;
      }
      wrap();
      track.style.transform = `translate3d(${-x}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Glisser (doigt ou souris) : la bande suit, puis repart d'elle-même.
    const down = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startOffset = x;
      target = 0;
      speed = 0;
      clearTimeout(timer);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 4 && !row.hasPointerCapture(e.pointerId)) row.setPointerCapture(e.pointerId);
      x = startOffset - dx;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (row.hasPointerCapture(e.pointerId)) row.releasePointerCapture(e.pointerId);
      resume(e.pointerType === "mouse" ? 600 : 1500);
    };
    // Souris : pause au survol, relance à la sortie.
    const enter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        target = 0;
        clearTimeout(timer);
      }
    };
    const leave = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !dragging) resume(300);
    };
    // Trackpad / molette horizontale.
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      x += e.deltaX;
      target = 0;
      resume(1200);
    };

    row.addEventListener("pointerdown", down);
    row.addEventListener("pointermove", move);
    row.addEventListener("pointerup", up);
    row.addEventListener("pointercancel", up);
    row.addEventListener("pointerenter", enter);
    row.addEventListener("pointerleave", leave);
    row.addEventListener("wheel", wheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      row.removeEventListener("pointerdown", down);
      row.removeEventListener("pointermove", move);
      row.removeEventListener("pointerup", up);
      row.removeEventListener("pointercancel", up);
      row.removeEventListener("pointerenter", enter);
      row.removeEventListener("pointerleave", leave);
      row.removeEventListener("wheel", wheel);
    };
  }, []);

  const renderRow = () => (
    <div
      ref={rowRef}
      className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
      aria-label="Photos du circuit — défilement automatique, à faire glisser"
    >
      {/* Deux copies de la bande : la position boucle sans couture sur la moitié. */}
      <div ref={trackRef} className="flex w-max items-center will-change-transform">
        {[...items, ...items].map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            aria-hidden={i >= items.length}
            className={`relative flex-shrink-0 overflow-hidden ${TILE_H} ${item.ratio}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/${item.src}`}
              alt={i < items.length ? item.alt : ""}
              loading="lazy"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-asphalt-2 pt-(--section-y)">
      {/* Même système que les autres sections : grand titre, sous-titre + lien sur une ligne. */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <h2 data-reveal className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
          Sur la piste,
          <br />
          <span className="text-flag">jour et nuit.</span>
        </h2>
        <div className="mb-(--section-gap) mt-5 flex flex-wrap items-end justify-between gap-4">
          <p data-reveal className="max-w-xl text-base leading-relaxed text-chalk md:text-xl">
            Sessions au soleil, nocturnes sous les projecteurs, premiers tours en Baby Kart : le circuit en vrai.
          </p>
          <Link href="/photos" className="btn btn-ghost">
            Toutes les photos
          </Link>
        </div>
      </div>

      {/* Une seule bande, dérive de droite à gauche (choix Benjamin, 14/10) */}
      <div className="relative">
        {renderRow()}
      </div>
    </section>
  );
}
