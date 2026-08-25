"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";

/*
 * Avis Google authentiques, relevés sur la fiche Google Maps de MegaKart
 * le 25/08/2026 (note fiche : 4,5/5 · 1 227 avis). Ne jamais inventer
 * d'avis — pour en ajouter, les copier depuis la fiche avec auteur et
 * date, du plus récent au plus ancien. Les textes tronqués par Google
 * sont coupés à la dernière phrase complète.
 */
const GOOGLE_RATING = { score: "4,5", count: "1 227" };

const REVIEWS = [
  {
    author: "Amira B.",
    when: "août 2026",
    text: "Super moment en famille avec les kartings ! Merci au photographe d'avoir immortalisé ce moment avec de belles photos à moindre coût. On reviendra.",
  },
  {
    author: "Damien D.",
    when: "août 2026",
    text: "J'ai très bien aimé la possibilité de pouvoir louer plusieurs types de kart allant du 13 jusqu'au 30 chevaux, car très peu de pistes le font. La piste est technique et demande un pilotage minutieux pour optimiser un tour chrono ou pour doubler d'autres pilotes.",
  },
  {
    author: "Jean-Philippe",
    when: "août 2026",
    text: "Un super moment passé, un accueil chaleureux et souriant. Un circuit qui fait monter l'adrénaline. Que du bonheur !",
  },
  {
    author: "Omar M.",
    when: "août 2026",
    text: "Superbe équipe très réactive et qui gère très bien les adultes et les enfants. Le patron aussi est vraiment sympa.",
  },
  {
    author: "Angelo D.",
    when: "juillet 2026",
    text: "Super expérience ! Le personnel est très accueillant et professionnel. Un grand merci à la personne qui a réalisé les images avec le drone : très sympathique, serviable et agréable à discuter.",
  },
  {
    author: "Dimitri Vincent",
    when: "juin 2026",
    text: "Nous avons passé un super moment en famille ! Les kartings sont vraiment adaptés à tout le monde, peu importe le niveau, ce qui permet à chacun de s'amuser pleinement.",
  },
];

const AUTO_ADVANCE_MS = 4500;

export default function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // Avance automatique carte par carte ; pause dès que le visiteur
  // interagit (survol, toucher, scroll manuel), reprise après 8 s.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let resumeTimer: ReturnType<typeof setTimeout>;
    const pause = () => {
      pausedRef.current = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        pausedRef.current = false;
      }, 8000);
    };
    track.addEventListener("pointerenter", pause);
    track.addEventListener("pointerdown", pause);
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("wheel", pause, { passive: true });

    const id = setInterval(() => {
      if (pausedRef.current) return;
      const card = track.querySelector<HTMLElement>("[data-review-card]");
      if (!card) return;
      const step = card.offsetWidth + 24; // gap-6
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - step / 2;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step, behavior: "smooth" });
    }, AUTO_ADVANCE_MS);

    return () => {
      clearInterval(id);
      clearTimeout(resumeTimer);
      track.removeEventListener("pointerenter", pause);
      track.removeEventListener("pointerdown", pause);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("wheel", pause);
    };
  }, []);

  return (
    <section className="overflow-hidden bg-asphalt-2 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
            Ils ont roulé <span className="text-flag">ici.</span>
          </h2>
          <div data-reveal className="flex items-baseline gap-3">
            <p className="display text-5xl text-chalk">{GOOGLE_RATING.score}/5</p>
            <p className="text-sm leading-tight text-chalk-60">
              {GOOGLE_RATING.count} avis
              <br />
              sur Google
            </p>
          </div>
        </div>
      </div>

      {/* Carrousel : scroll horizontal libre + avance auto */}
      <div
        ref={trackRef}
        data-reveal
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 md:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        aria-label="Avis Google des visiteurs — défilement horizontal"
      >
        {REVIEWS.map((r) => (
          <figure
            key={r.author}
            data-review-card
            className="card flex w-[85vw] max-w-[420px] shrink-0 snap-start flex-col p-6 md:p-7"
          >
            <span className="checker-sm block h-4 w-8 opacity-50" aria-hidden="true" />
            <blockquote className="mt-4 flex-1 text-base leading-relaxed text-chalk">
              « {r.text} »
            </blockquote>
            <figcaption className="mt-4 text-sm text-chalk-60">
              {r.author} · avis Google · {r.when}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-5 md:px-8">
        <a
          href={SITE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          Lire les {GOOGLE_RATING.count} avis sur Google
        </a>
      </div>
    </section>
  );
}
