"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";

/*
 * Avis Google authentiques, relevés sur la fiche Google de MegaKart
 * (premier relevé 25/08/2026, complété le 11/09/2026 — note fiche :
 * 4,5/5 · 1 237 avis). Ne jamais inventer
 * d'avis — pour en ajouter, les copier depuis la fiche avec auteur et
 * date, du plus récent au plus ancien. Les textes tronqués par Google
 * sont coupés à la dernière phrase complète.
 */
const GOOGLE_RATING = { score: "4,5", count: "1 237" };

const REVIEWS = [
  {
    author: "Loann",
    when: "septembre 2026",
    text: "Piste top avec de bons virages et lignes droites, sessions vraiment agréables. Le personnel est adorable, prend le temps d'expliquer et nous a même offert des boissons. Accueil au top, je recommande sans hésiter !",
  },
  {
    author: "Marius D.",
    when: "septembre 2026",
    text: "Tout a répondu à mes attentes, excellent équipement de sécurité avec un harnais de casque spécial, du jamais vu en location de karting !",
  },
  {
    author: "E.",
    when: "août 2026",
    text: "Nous avons emmené les enfants faire du karting et nous en avons été ravis. Les karts pour enfants sont vraiment bon marché : seulement 13 € pour 8 minutes de pilotage.",
  },
  {
    author: "Amira B.",
    when: "août 2026",
    text: "Super moment en famille avec les kartings ! Merci au photographe d'avoir immortalisé ce moment avec de belles photos à moindre coût. On reviendra.",
  },
  {
    author: "Damien D.",
    when: "août 2026",
    text: "J'ai très bien aimé la possibilité de pouvoir louer plusieurs types de kart allant du 13 jusqu'au 30 chevaux, car très peu de pistes le font. La piste est technique et demande un pilotage minutieux pour optimiser un tour chrono ou pour doubler d'autres pilotes. Le personnel est très accueillant, dont le gérant qui est ultra passionné !",
  },
  {
    author: "Jean-Philippe",
    when: "août 2026",
    text: "Un super moment passé, un accueil chaleureux et souriant. Un circuit qui fait monter l'adrénaline. Que du bonheur !",
  },
  {
    author: "Mehdi E.",
    when: "août 2026",
    text: "La piste est incroyable, les karts sont vraiment trop bien. Si t'es en vacances et que tu te demandes si ce karting est bien, je te conseille vraiment d'y aller.",
  },
  {
    author: "Jérôme L.",
    when: "août 2026",
    text: "Karting double : enfant + adulte, c'est génial. Tout le monde peut en profiter.",
  },
  {
    author: "Ophélie S.",
    when: "août 2026",
    text: "Super soirée, photos souvenir à la fin, photographe très agréable. Je vous recommande.",
  },
  {
    author: "Moina DS",
    when: "août 2026",
    text: "Super expérience. Tout est très bien organisé et l'équipe est accueillante. La piste est géniale. On espère avoir le temps d'y retourner avant notre départ. Je recommande sans hésiter !",
  },
  {
    author: "Ismaël B.",
    when: "août 2026",
    text: "La demoiselle au snack est très accueillante et a la joie de vivre, merci à elle pour son service et son accueil.",
  },
  {
    author: "Calli",
    when: "août 2026",
    text: "Une jeune femme adorable au snack. Merci beaucoup Rania pour ton service et ta joie de vivre.",
  },
  {
    author: "Max F.",
    when: "août 2026",
    text: "Accueil super, tous pros, on reviendra !",
  },
  {
    author: "Céline D.",
    when: "août 2026",
    text: "De supers photos pour de magnifiques souvenirs. Merci !",
  },
  {
    author: "Alexandre V.",
    when: "août 2026",
    text: "Excellente expérience et personnes adorables. Merci à Théo et Vincent pour leur bienveillance : ils ont su s'adapter et m'ont permis d'avoir des sensations et de la vitesse, en faisant un tour de karting malgré mon handicap.",
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
      const step = card.offsetWidth + 20; // gap-5
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
    <section className="overflow-hidden bg-asphalt-2 py-(--section-y)">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Même système que les autres sections : grand titre, puis note + lien sur une ligne. */}
        <h2 data-reveal className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
          Ils ont roulé
          <br />
          <span className="text-flag">ici.</span>
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          {/* Note et nombre d'avis alignés sur le même axe vertical. */}
          <div data-reveal className="flex items-center gap-3">
            <p className="display text-5xl leading-none text-chalk">{GOOGLE_RATING.score}/5</p>
            <p className="text-base leading-tight text-chalk md:text-lg">
              {GOOGLE_RATING.count} avis
              <br />
              <span className="text-chalk-60">sur Google</span>
            </p>
          </div>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Lire les avis sur Google
          </a>
        </div>
      </div>

      {/* Carrousel : scroll horizontal libre + avance auto. Butées alignées sur la
          grille du site (padding + scroll-padding), le premier avis ne colle plus au bord. */}
      <div
        ref={trackRef}
        data-reveal
        className="no-scrollbar mt-(--section-gap) flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth"
        style={{ paddingInline: "var(--site-gutter)", scrollPaddingInline: "var(--site-gutter)" }}
        aria-label="Avis Google des visiteurs — défilement horizontal"
      >
        {REVIEWS.map((r) => (
          <figure
            key={r.author}
            data-review-card
            className="flex w-[85vw] max-w-[420px] shrink-0 snap-start flex-col rounded-[calc(var(--cta-height)/2+1rem)] border border-chalk/10 bg-asphalt p-6 md:p-7"
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
    </section>
  );
}
