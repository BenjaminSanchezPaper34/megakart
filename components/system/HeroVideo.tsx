"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vidéo de fond d'un PageHero : version paysage sur ordinateur, portrait au
 * mobile (moins lourde). Muette, en boucle, posée sur la photo du hero qui
 * sert d'affiche et de repli ; rien si prefers-reduced-motion, pause hors écran.
 */
export default function HeroVideo({ desktop, mobile }: { desktop: string; mobile: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setSrc(window.matchMedia("(min-width: 768px)").matches ? desktop : mobile);
  }, [desktop, mobile]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
      threshold: 0.1,
    });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  if (!src) return null;
  return (
    <video
      ref={ref}
      key={src}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
