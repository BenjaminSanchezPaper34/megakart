"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { TRACK_VIEWBOX, TRACK_OUTLINE, TRACK_CENTERLINE } from "@/lib/track";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * Tracé officiel du circuit (dessin client) : la piste en fond,
 * la ligne de course dessinée au scroll et un kart qui la parcourt.
 */
export default function TrackMap({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const line = svg.querySelector<SVGPathElement>("[data-track-line]");
    const kart = svg.querySelector<SVGGElement>("[data-track-kart]");
    if (!line || !kart) return;

    const length = line.getTotalLength();
    line.style.strokeDasharray = `${length}`;

    if (reduced) {
      line.style.strokeDashoffset = "0";
      return;
    }

    line.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      const st = {
        trigger: svg,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1.2,
      };
      gsap.to(line, { strokeDashoffset: 0, ease: "none", scrollTrigger: st });
      gsap.to(kart, {
        motionPath: { path: line, align: line, alignOrigin: [0.5, 0.5] },
        ease: "none",
        scrollTrigger: st,
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
      aria-label="Tracé officiel du circuit MegaKart : 1000 mètres d'esses, d'épingles et de lignes droites"
    >
      {/* Piste : le dessin officiel, en asphalte clair sur fond sombre */}
      <path
        d={TRACK_OUTLINE}
        fill="color-mix(in srgb, var(--color-chalk) 13%, transparent)"
      />

      {/* Ligne de course dessinée au scroll */}
      <path
        data-track-line
        d={TRACK_CENTERLINE}
        fill="none"
        stroke="var(--color-race)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ligne départ/arrivée (petit damier au point de départ) */}
      <g transform="translate(156.1 60.6) rotate(78)">
        <rect x="-3.4" y="-1.7" width="1.7" height="1.7" fill="var(--color-chalk)" />
        <rect x="-1.7" y="0" width="1.7" height="1.7" fill="var(--color-chalk)" />
        <rect x="0" y="-1.7" width="1.7" height="1.7" fill="var(--color-chalk)" />
        <rect x="1.7" y="0" width="1.7" height="1.7" fill="var(--color-chalk)" />
      </g>

      {/* Kart — halo en cercles superposés (pas de filtre SVG, trop coûteux) */}
      <g data-track-kart transform="translate(156.1 60.6)">
        <circle r="4.6" fill="var(--color-race)" opacity="0.15" />
        <circle r="3.2" fill="var(--color-race)" opacity="0.35" />
        <circle r="2.3" fill="var(--color-race)" />
        <circle r="1" fill="#fff" />
      </g>
    </svg>
  );
}
