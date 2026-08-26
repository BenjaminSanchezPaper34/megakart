"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Vidéo drone du hero — desktop et mobile (fichier léger, ~4,4 Mo),
 * sauf si l'usager a demandé de réduire les animations. La photo reste
 * le fond (SSR + fallback) ; la vidéo apparaît en fondu quand elle est
 * prête. Si l'autoplay est bloqué (mode économie d'énergie iOS), la
 * première image s'affiche par-dessus la photo — sans casse.
 */
export default function HeroVideo() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) setEnabled(true);
  }, []);

  if (!enabled) return null;

  return (
    <video
      ref={videoRef}
      src="/videos/hero.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
