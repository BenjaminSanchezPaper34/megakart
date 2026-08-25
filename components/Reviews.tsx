import { SITE } from "@/lib/site";

/*
 * Avis Google authentiques, relevés sur la fiche Google Maps de MegaKart
 * le 25/08/2026 (note fiche : 4,5/5 · 1 227 avis). Ne jamais inventer
 * d'avis — pour en ajouter, les copier depuis la fiche avec auteur et date.
 * Les textes tronqués par Google sont coupés à la dernière phrase complète.
 */
const GOOGLE_RATING = { score: "4,5", count: "1 227" };

const REVIEWS = [
  {
    author: "Dimitri Vincent",
    when: "juin 2026",
    text: "Nous avons passé un super moment en famille ! Les kartings sont vraiment adaptés à tout le monde, peu importe le niveau, ce qui permet à chacun de s'amuser pleinement.",
  },
  {
    author: "Angelo D.",
    when: "juillet 2026",
    text: "Super expérience ! Le personnel est très accueillant et professionnel. Un grand merci à la personne qui a réalisé les images avec le drone : très sympathique, serviable et agréable à discuter.",
  },
  {
    author: "Omar M.",
    when: "août 2026",
    text: "Superbe équipe très réactive et qui gère très bien les adultes et les enfants. Le patron aussi est vraiment sympa.",
  },
];

function Stars() {
  return (
    <span className="text-flag" aria-label="5 étoiles sur 5">
      ★★★★★
    </span>
  );
}

export default function Reviews() {
  const loop = [...REVIEWS, ...REVIEWS];
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

      {/* Carrousel défilant (pause au survol) */}
      <div data-reveal className="marquee-pausable relative mt-12" aria-label="Avis Google des visiteurs">
        <div className="marquee-track marquee-reviews items-stretch gap-6 pr-6">
          {loop.map((r, i) => (
            <figure
              key={i}
              aria-hidden={i >= REVIEWS.length}
              className="card flex w-[340px] shrink-0 flex-col p-6 md:w-[420px] md:p-7"
            >
              <Stars />
              <blockquote className="mt-3 flex-1 text-base leading-relaxed text-chalk">
                « {r.text} »
              </blockquote>
              <figcaption className="mt-4 text-sm text-chalk-60">
                {r.author} · avis Google · {r.when}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-5 md:px-8">
        <a
          href={SITE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          Lire les 1 227 avis sur Google
        </a>
      </div>
    </section>
  );
}
