"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Vidéo drone du hero — chargée uniquement sur desktop et si l'usager
 * n'a pas demandé de réduire les animations. La photo reste le fond
 * (SSR + mobile) ; la vidéo apparaît en fondu quand elle est prête.
 */
export default function HeroVideo() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (desktop && !reduced) setEnabled(true);
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
