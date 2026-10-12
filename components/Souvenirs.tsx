import Image from "next/image";
import { GALERIE_BASE, GALERIES, archivesVisibles } from "@/lib/souvenirs";
import { formatDate } from "@/lib/agenda";

/**
 * Frise « Les courses en photos » : événements photographiés (liens vers
 * les galeries paper34.fr, téléchargement en qualité originale), puis les
 * archives du circuit quand elles existent. Données : lib/souvenirs.ts.
 */
export default function Souvenirs() {
  const archives = archivesVisibles();
  return (
    <section className="mx-auto max-w-5xl px-5 pb-20 md:px-8">
      <h2 data-reveal className="display text-[clamp(1.8rem,4vw,2.8rem)] text-chalk">
        Les courses <span className="text-race">en photos</span>
      </h2>
      <p data-reveal className="mt-3 max-w-2xl text-base leading-relaxed text-chalk-60">
        Vous avez roulé lors d&rsquo;une course ou d&rsquo;un événement ? Retrouvez vos photos et téléchargez-les
        en qualité originale.
      </p>

      <ol className="relative mt-10 border-l border-white/15 pl-6 md:pl-10">
        {GALERIES.map((g) => {
          const f = formatDate(g.date);
          const url = g.slug ? `${GALERIE_BASE}/${g.slug}` : null;
          return (
            <li key={g.date + g.title} data-reveal className="relative pb-12 last:pb-0">
              <span
                className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-race md:-left-[47px]"
                aria-hidden="true"
              />
              <p className="display text-base text-flag">
                {f.weekday} {f.day} {f.monthFull} {g.date.slice(0, 4)} · {g.kicker}
              </p>
              <h3 className="display mt-1 text-2xl text-chalk md:text-3xl">{g.title}</h3>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-chalk-60">{g.text}</p>

              {g.vignettes.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-2 md:gap-3">
                  {g.vignettes.slice(0, 3).map((v) => (
                    <a
                      key={v.src}
                      href={url ?? undefined}
                      target="_blank"
                      rel="noopener"
                      className="group overflow-hidden rounded-sm"
                    >
                      <Image
                        src={v.src}
                        alt={`${g.kicker} chez MegaKart — ${g.title}`}
                        width={v.width}
                        height={v.height}
                        sizes="(min-width: 768px) 300px, 33vw"
                        className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              )}

              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener"
                  data-track="galerie"
                  className="btn btn-race mt-5"
                >
                  Voir les photos
                </a>
              ) : (
                <p className="mt-4 inline-block border border-white/15 px-4 py-2 text-sm text-chalk-60">
                  Photos en cours de tri — bientôt en ligne ici
                </p>
              )}
            </li>
          );
        })}

        {archives.map((a) => (
          <li key={a.periode} data-reveal className="relative pb-12 last:pb-0">
            <span
              className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-chalk-60 md:-left-[47px]"
              aria-hidden="true"
            />
            <p className="display text-base text-flag">{a.periode} · Archives du circuit</p>
            <h3 className="display mt-1 text-2xl text-chalk md:text-3xl">{a.title}</h3>
            {a.text && <p className="mt-2 max-w-2xl text-base leading-relaxed text-chalk-60">{a.text}</p>}
            <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
              {a.photos.map((p) => (
                <Image
                  key={p.src}
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 768px) 300px, 50vw"
                  className="aspect-[4/3] w-full rounded-sm object-cover"
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
