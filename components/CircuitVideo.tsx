"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vidéo de fond plein cadre de la section « Un vrai circuit ».
 * Mobile : le réel vertical (format natif). Ordinateur : recadrage paysage
 * du même plan (circuit-paysage.mp4, tiré de l'original 1080×1920).
 * Lecture muette seulement quand la section est visible, rien si
 * prefers-reduced-motion (le poster reste affiché).
 */
export default function CircuitVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<{ video: string; poster: string } | null>(null);

  useEffect(() => {
    const large = window.matchMedia("(min-width: 1024px)").matches;
    setSrc(
      large
        ? { video: "/videos/circuit-paysage.mp4", poster: "/images/circuit-paysage.jpg" }
        : { video: "/videos/reel-4.mp4", poster: "/images/reel-4.jpg" }
    );
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  if (!src) return null;
  return (
    <video
      ref={ref}
      key={src.video}
      src={src.video}
      poster={src.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
