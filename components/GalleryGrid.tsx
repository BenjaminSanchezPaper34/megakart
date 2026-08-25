"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";

export type GalleryPhoto = { src: string; alt: string };

/**
 * Grille masonry + lightbox plein écran : clic (ou Entrée) pour ouvrir,
 * flèches / molette de navigation, Échap ou clic sur le fond pour fermer.
 */
export default function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [current, setCurrent] = useState<number | null>(null);

  const close = useCallback(() => setCurrent(null), []);
  const step = useCallback(
    (delta: number) => {
      setCurrent((c) =>
        c === null ? c : (c + delta + photos.length) % photos.length
      );
    },
    [photos.length]
  );

  // Clavier + verrouillage du scroll pendant la lightbox
  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [current, close, step]);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Afficher en plein écran : ${p.alt}`}
            className="card block w-full cursor-zoom-in overflow-hidden !p-0 text-left"
          >
            <Image
              src={`/images/${p.src}`}
              alt={p.alt}
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={i < 3}
              className="h-auto w-full transition-transform duration-700 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox plein écran */}
      {current !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[current].alt}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-asphalt/[0.97]"
          onClick={close}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${photos[current].src}`}
            alt={photos[current].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88svh] max-w-[94vw] object-contain shadow-2xl shadow-black/60"
          />

          {/* Légende + compteur */}
          <div
            className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-asphalt/90 to-transparent px-5 pb-4 pt-10 md:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-chalk-60">{photos[current].alt}</p>
            <p className="display shrink-0 text-base text-chalk">
              {current + 1} / {photos.length}
            </p>
          </div>

          {/* Commandes */}
          <button
            type="button"
            aria-label="Fermer le plein écran"
            onClick={close}
            className="display absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-chalk transition-colors hover:bg-race"
          >
            ✕
          </button>
          <button
            type="button"
            aria-label="Photo précédente"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="display absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-chalk transition-colors hover:bg-race md:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Photo suivante"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="display absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-chalk transition-colors hover:bg-race md:right-6"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
