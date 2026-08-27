"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Réel vertical en autoplay intelligent : lecture muette en boucle
 * uniquement quand la vidéo est majoritairement visible à l'écran
 * (IntersectionObserver, pause à la sortie), preload=none, respect
 * de prefers-reduced-motion. Le clic emmène vers /photos.
 *
 * Deux rendus :
 *  - carte (défaut) : téléphone incliné, coins arrondis, ombre
 *  - flush : remplit intégralement son conteneur, bords francs —
 *    pour les mises en page split-screen
 */
export default function ReelCard({
  src = "reel-1",
  caption = "@karting_megakart",
  flush = false,
}: {
  src?: string;
  caption?: string;
  flush?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const media = (
    <>
      <video
        ref={videoRef}
        src={`/videos/${src}.mp4`}
        poster={`/images/${src}.jpg`}
        muted
        loop
        playsInline
        preload="none"
        className={
          flush
            ? "absolute inset-0 h-full w-full object-cover"
            : "aspect-[9/16] w-full object-cover"
        }
      />
      <span className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-asphalt/90 via-asphalt/35 to-transparent px-4 pb-3 pt-12 text-sm font-semibold text-chalk md:px-6">
        {caption}
        <span className="link-under opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Voir plus
        </span>
      </span>
    </>
  );

  if (flush) {
    return (
      <Link
        href="/photos"
        aria-label="Voir toutes les photos et vidéos du circuit"
        className="group absolute inset-0 block overflow-hidden"
      >
        {media}
      </Link>
    );
  }

  return (
    <Link
      href="/photos"
      aria-label="Voir toutes les photos et vidéos du circuit"
      className="group relative mx-auto block w-[280px] drop-shadow-[0_24px_22px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.02] md:w-[320px]"
    >
      <div className="clip-race relative overflow-hidden">{media}</div>
    </Link>
  );
}
