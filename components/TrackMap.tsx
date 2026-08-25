"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { TRACK_VIEWBOX, TRACK_OUTLINE, TRACK_CENTERLINE } from "@/lib/track";

gsap.registerPlugin(MotionPathPlugin);

/**
 * La grille : 5 karts aux couleurs différentes, chacun son rythme de
 * tour et sa position de départ — les dépassements arrivent tout seuls.
 */
const RACERS = [
  { color: "#e3051b", lap: 15.2, start: 0.0, size: 1 },     // rouge — le leader
  { color: "#fbba00", lap: 15.8, start: 0.96, size: 0.88 }, // jaune
  { color: "#2e7cf6", lap: 16.4, start: 0.92, size: 0.88 }, // bleu
  { color: "#2ec27e", lap: 17.1, start: 0.88, size: 0.88 }, // vert
  { color: "#a855f7", lap: 17.8, start: 0.84, size: 0.88 }, // violet
];

/**
 * Tracé officiel du circuit (dessin client) : ligne de course complète,
 * course de 5 karts en boucle continue (indépendant du scroll).
 */
export default function TrackMap({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const line = svg.querySelector<SVGPathElement>("[data-track-line]");
    if (!line) return;

    const ctx = gsap.context(() => {
      svg.querySelectorAll<SVGGElement>("[data-track-kart]").forEach((kart, i) => {
        const racer = RACERS[i];
        const tween = gsap.to(kart, {
          motionPath: { path: line, align: line, alignOrigin: [0.5, 0.5] },
          duration: racer.lap,
          repeat: -1,
          ease: "none",
        });
        // Position de départ échelonnée sur la grille
        tween.progress(racer.start);
      });
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={TRACK_VIEWBOX}
      className={className}
      role="img"
      aria-label="Tracé officiel du circuit MegaKart avec une course de cinq karts en miniature"
    >
      {/* Piste : le dessin officiel, en asphalte clair sur fond sombre */}
      <path
        d={TRACK_OUTLINE}
        fill="color-mix(in srgb, var(--color-chalk) 13%, transparent)"
      />

      {/* Ligne de course, entièrement tracée */}
      <path
        data-track-line
        d={TRACK_CENTERLINE}
        fill="none"
        stroke="var(--color-race)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* Ligne départ/arrivée (petit damier au point de départ) */}
      <g transform="translate(156.1 60.6) rotate(78)">
        <rect x="-3.4" y="-1.7" width="1.7" height="1.7" fill="var(--color-chalk)" />
        <rect x="-1.7" y="0" width="1.7" height="1.7" fill="var(--color-chalk)" />
        <rect x="0" y="-1.7" width="1.7" height="1.7" fill="var(--color-chalk)" />
        <rect x="1.7" y="0" width="1.7" height="1.7" fill="var(--color-chalk)" />
      </g>

      {/* La grille — halos en cercles superposés (pas de filtre SVG) */}
      {RACERS.map((r, i) => (
        <g key={i} data-track-kart transform="translate(156.1 60.6)">
          <circle r={4.4 * r.size} fill={r.color} opacity="0.14" />
          <circle r={3 * r.size} fill={r.color} opacity="0.32" />
          <circle r={2.2 * r.size} fill={r.color} />
          <circle r={0.9 * r.size} fill="#fff" />
        </g>
      ))}
    </svg>
  );
}
