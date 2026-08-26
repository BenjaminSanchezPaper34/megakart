"use client";

import { useRef } from "react";
import { SITE } from "@/lib/site";

/**
 * Bande de réels verticaux (9:16) façon stories : poster affiché par
 * défaut, lecture muette en boucle au survol (desktop) ou au tap
 * (mobile), retour au poster à la sortie. preload="none" : aucun
 * octet de vidéo n'est chargé tant qu'on ne lance pas la lecture.
 */

const REELS = [
  { src: "reel-1", label: "Réel du 14 août" },
  { src: "reel-2", label: "Réel du 30 juillet" },
  { src: "reel-3", label: "Réel du 6 juillet" },
  { src: "reel-4", label: "Réel du 26 juin" },
  { src: "reel-5", label: "Réel du 8 juin" },
];

export default function ReelsRow() {
  const playing = useRef<HTMLVideoElement | null>(null);

  const play = (v: HTMLVideoElement) => {
    if (playing.current && playing.current !== v) {
      playing.current.pause();
      playing.current.currentTime = 0;
    }
    playing.current = v;
    v.play().catch(() => {});
  };

  const stop = (v: HTMLVideoElement) => {
    v.pause();
    v.currentTime = 0;
    if (playing.current === v) playing.current = null;
  };

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="flex w-max items-stretch gap-4 px-5 md:gap-5 md:px-8">
        {REELS.map((r) => (
          <div
            key={r.src}
            className="card group relative w-[220px] shrink-0 overflow-hidden !p-0 md:w-[250px]"
          >
            <video
              src={`/videos/${r.src}.mp4`}
              poster={`/images/${r.src}.jpg`}
              muted
              loop
              playsInline
              preload="none"
              aria-label={`${r.label} — lecture au survol ou au toucher`}
              className="aspect-[9/16] w-full cursor-pointer object-cover"
              onMouseEnter={(e) => play(e.currentTarget)}
              onMouseLeave={(e) => stop(e.currentTarget)}
              onClick={(e) => {
                const v = e.currentTarget;
                if (v.paused) play(v);
                else stop(v);
              }}
            />

            {/* Pastille lecture (masquée pendant la lecture au survol) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-asphalt/60 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-chalk)">
                <polygon points="6 3 21 12 6 21 6 3" />
              </svg>
            </span>

            {/* Lien vers le compte, révélé en bas de carte */}
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-asphalt/90 via-asphalt/40 to-transparent px-4 pb-3 pt-10 text-sm font-semibold text-chalk opacity-0 transition-opacity duration-300 hover:underline group-hover:opacity-100"
            >
              @karting_megakart
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
