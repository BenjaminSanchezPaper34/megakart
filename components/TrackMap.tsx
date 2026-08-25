"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Tracé stylisé du circuit (boucle fermée, esses + épingles)
const TRACK_PATH =
  "M150 470 C70 470 40 400 80 350 C110 315 180 320 210 280 C240 240 200 200 150 190 C90 178 80 110 150 95 C260 70 300 160 380 150 C450 142 470 80 560 80 C650 80 680 140 640 190 C610 227 540 210 510 260 C485 300 520 330 580 330 C660 330 700 280 760 300 C830 323 840 420 760 445 C680 470 620 420 540 440 C480 455 460 500 380 500 C300 500 290 470 150 470 Z";

/**
 * Tracé du circuit dessiné au scroll, avec un kart (point rouge)
 * qui parcourt la piste en scrub.
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
      viewBox="0 0 900 560"
      className={className}
      role="img"
      aria-label="Tracé stylisé du circuit MegaKart : 1000 mètres d'esses, d'épingles et de lignes droites"
    >
      <defs>
        <filter id="track-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Piste (fond) */}
      <path
        d={TRACK_PATH}
        fill="none"
        stroke="color-mix(in srgb, var(--color-chalk) 12%, transparent)"
        strokeWidth="26"
        strokeLinecap="round"
      />
      {/* Ligne de course dessinée au scroll */}
      <path
        data-track-line
        d={TRACK_PATH}
        fill="none"
        stroke="var(--color-race)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Ligne départ/arrivée (damier) */}
      <g transform="translate(138 456) rotate(90)">
        <rect x="0" y="0" width="7" height="7" fill="var(--color-chalk)" />
        <rect x="7" y="7" width="7" height="7" fill="var(--color-chalk)" />
        <rect x="14" y="0" width="7" height="7" fill="var(--color-chalk)" />
        <rect x="7" y="-7" width="7" height="7" fill="var(--color-chalk)" opacity="0.4" />
        <rect x="0" y="14" width="7" height="7" fill="var(--color-chalk)" opacity="0.4" />
      </g>

      {/* Kart */}
      <g data-track-kart transform="translate(150 470)" filter="url(#track-glow)">
        <circle r="9" fill="var(--color-race)" />
        <circle r="4" fill="#fff" />
      </g>
    </svg>
  );
}
