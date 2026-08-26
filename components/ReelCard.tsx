"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Réel vertical en autoplay intelligent : la lecture (muette, en
 * boucle) ne démarre que quand la carte est majoritairement visible
 * à l'écran, et se met en pause dès qu'on la quitte — zéro data
 * consommée avant d'arriver dessus (preload=none), respect de
 * prefers-reduced-motion. Le clic emmène vers la page photos/vidéos.
 */
export default function ReelCard({
  src = "reel-1",
  caption = "@karting_megakart",
}: {
  src?: string;
  caption?: string;
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
      { threshold: 0.5 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      href="/photos"
      aria-label="Voir toutes les photos et vidéos du circuit"
      className="group relative mx-auto block w-[280px] rotate-2 transition-transform duration-500 hover:rotate-0 md:w-[320px]"
    >
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl shadow-black/50">
        <video
          ref={videoRef}
          src={`/videos/${src}.mp4`}
          poster={`/images/${src}.jpg`}
          muted
          loop
          playsInline
          preload="none"
          className="aspect-[9/16] w-full object-cover"
        />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-asphalt/90 via-asphalt/35 to-transparent px-4 pb-3 pt-12 text-sm font-semibold text-chalk">
          {caption}
          <span className="link-under opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Voir plus
          </span>
        </span>
      </div>
    </Link>
  );
}
