import Image from "next/image";
import type { ReactNode } from "react";
import SectionHeader from "./system/SectionHeader";
import RowArrows from "./RowArrows";
import { GALERIE_BASE, GALERIES, archivesVisibles } from "@/lib/souvenirs";
import { formatDate } from "@/lib/agenda";

/**
 * Frise « Les courses en photos », au même style que la frise de La piste
 * (15/10) : défilement latéral, une carte par événement posée sur une ligne
 * horizontale. Liens vers les galeries paper34.fr (téléchargement en qualité
 * originale), puis les archives du circuit quand elles existent.
 * Données : lib/souvenirs.ts.
 */
export default function Souvenirs() {
  const archives = archivesVisibles();
  const total = GALERIES.length + archives.length;
  return (
    <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
      <SectionHeader
        line1="Les courses"
        line2="en photos."
        subtitle="Vous avez roulé lors d'une course ou d'un événement ? Retrouvez vos photos et téléchargez-les en qualité originale."
        action={<RowArrows target="[data-souvenirs]" label="Courses en photos" className="flex gap-3" />}
      />

      <ol
        data-souvenirs
        className="bleed-row-mobile no-scrollbar mt-(--section-gap) grid auto-cols-[85%] grid-flow-col gap-5 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory sm:auto-cols-[45%] lg:auto-cols-[31%]"
      >
        {GALERIES.map((g, i) => {
          const f = formatDate(g.date);
          const url = g.slug ? `${GALERIE_BASE}/${g.slug}` : null;
          return (
            <Carte key={g.date + g.title} last={i === total - 1} dot="bg-race">
              <p className="display text-base text-flag">
                {f.day} {f.month} {g.date.slice(0, 4)} · {g.kicker}
              </p>
              <h3 className="display mt-1 text-2xl text-chalk">{g.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-chalk-60">{g.text}</p>
              {g.vignettes.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {g.vignettes.slice(0, 3).map((v) => (
                    <a key={v.src} href={url ?? undefined} target="_blank" rel="noopener" className="group overflow-hidden rounded-xl">
                      <Image
                        src={v.src}
                        alt={`${g.kicker} chez MegaKart — ${g.title}`}
                        width={v.width}
                        height={v.height}
                        sizes="(min-width: 1024px) 130px, 28vw"
                        className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-5">
                {url ? (
                  <a href={url} target="_blank" rel="noopener" data-track="galerie" className="btn btn-race w-full justify-center">
                    Voir les photos
                  </a>
                ) : (
                  <p className="text-base text-chalk-60">Photos en cours de tri, bientôt en ligne ici.</p>
                )}
              </div>
            </Carte>
          );
        })}

        {archives.map((a, i) => (
          <Carte key={a.periode} last={GALERIES.length + i === total - 1} dot="bg-chalk-60">
            <p className="display text-base text-flag">{a.periode} · Archives du circuit</p>
            <h3 className="display mt-1 text-2xl text-chalk">{a.title}</h3>
            {a.text && <p className="mt-2 text-base leading-relaxed text-chalk-60">{a.text}</p>}
            <div className="mt-5 grid grid-cols-2 gap-2">
              {a.photos.map((p) => (
                <Image
                  key={p.src}
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 1024px) 200px, 40vw"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </Carte>
        ))}
      </ol>
    </section>
  );
}

/** Une carte de la frise : pastille sur la ligne horizontale, puis la carte. */
function Carte({ children, last, dot }: { children: ReactNode; last: boolean; dot: string }) {
  return (
    <li className="relative flex snap-start flex-col">
      <div className="relative mb-6 flex h-6 items-center">
        <span
          aria-hidden="true"
          className={`absolute left-3 top-1/2 h-px -translate-y-1/2 ${
            last ? "w-1/2 bg-gradient-to-r from-white/25 to-transparent" : "-right-5 bg-gradient-to-r from-race to-white/20"
          }`}
        />
        <span aria-hidden="true" className={`relative h-6 w-6 rounded-full ${dot}`} />
      </div>
      <div className="card flex flex-1 flex-col p-6">{children}</div>
    </li>
  );
}
