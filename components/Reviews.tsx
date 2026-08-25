import { SITE } from "@/lib/site";

/*
 * Avis réels relevés sur les plateformes publiques (ne jamais inventer).
 * NOTE : à enrichir avec des avis Google récents fournis par Benjamin
 * (qui gère la fiche) — remplacer simplement les entrées ci-dessous.
 */
const QUOTES = [
  {
    text: "Équipe très accueillante, les karts sont vraiment performants et la piste est belle, grande et sécurisée.",
    author: "Karin",
    source: "Avis publié sur Koifaire",
  },
];

const PLATFORMS = [
  { label: "5/5 · 51 avis", name: "Mappy", href: "https://fr.mappy.com/poi/59c42c3c0351d15f9fdf8a21" },
  { label: "Lire les avis", name: "TripAdvisor", href: SITE.social.tripadvisor },
  { label: "Voir la fiche", name: "Google", href: SITE.mapsUrl },
];

export default function Reviews() {
  return (
    <section className="bg-asphalt-2 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
          Ils ont roulé <span className="text-flag">ici.</span>
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {QUOTES.map((q) => (
            <figure key={q.author} data-reveal className="card relative p-8 md:p-10">
              <span aria-hidden="true" className="display absolute -top-1 left-6 text-7xl text-race">
                “
              </span>
              <blockquote className="pt-6 text-xl leading-relaxed text-chalk md:text-2xl">
                {q.text}
              </blockquote>
              <figcaption className="mt-5 text-sm text-chalk-60">
                {q.author} · {q.source}
              </figcaption>
            </figure>
          ))}

          <div data-stagger className="flex flex-col gap-4">
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex items-center justify-between gap-4 p-5"
              >
                <span className="display text-xl text-chalk transition-colors group-hover:text-race">
                  {p.name}
                </span>
                <span className="text-sm font-medium text-chalk-60">{p.label}</span>
              </a>
            ))}
            <p className="text-sm leading-relaxed text-chalk-60">
              Les avis sont publiés sur des plateformes indépendantes —
              cliquez pour les lire à la source.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
