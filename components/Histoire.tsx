import Image from "next/image";
import { JALONS, type Jalon } from "@/lib/histoire";

/**
 * Frise chronologique du circuit, en défilement latéral (15/10) : une carte par
 * jalon, posée sur une ligne horizontale avec sa pastille. Swipe au doigt,
 * flèches (RowArrows, cible [data-histoire]) à la souris. Les photos d'archives,
 * quand elles seront scannées, s'affichent en tête de carte, angles arrondis.
 */
export default function Histoire() {
  return (
    <ol
      data-histoire
      className="bleed-row-mobile no-scrollbar mt-(--section-gap) grid auto-cols-[85%] grid-flow-col gap-5 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory sm:auto-cols-[45%] lg:auto-cols-[31%]"
    >
      {JALONS.map((jalon, i) => (
        <JalonCard key={jalon.year} jalon={jalon} last={i === JALONS.length - 1} />
      ))}
    </ol>
  );
}

function JalonCard({ jalon, last }: { jalon: Jalon; last: boolean }) {
  const photos = jalon.photos ?? [];
  return (
    <li className="relative flex snap-start flex-col">
      {/* La ligne de la frise : elle file vers le jalon suivant. */}
      <div className="relative mb-6 flex h-6 items-center">
        <span
          aria-hidden="true"
          className={`absolute left-3 top-1/2 h-px -translate-y-1/2 ${
            last ? "w-1/2 bg-gradient-to-r from-white/25 to-transparent" : "-right-5 bg-gradient-to-r from-race to-white/20"
          }`}
        />
        <span
          aria-hidden="true"
          className={`relative h-6 w-6 rounded-full ${jalon.highlight ? "bg-race" : "bg-asphalt-3 ring-1 ring-inset ring-white/25"}`}
        />
      </div>

      <div className="card flex flex-1 flex-col p-6">
        {photos.length > 0 && (
          <div className={`mb-5 grid gap-3 ${photos.length > 1 ? "grid-cols-2" : ""}`}>
            {photos.map((photo) => (
              <figure key={photo.src}>
                <div className="race-event-card relative aspect-[4/3] overflow-hidden bg-asphalt-3">
                  <Image src={`/images/${photo.src}`} alt={photo.alt} fill sizes="(min-width: 1024px) 25vw, 80vw" className="object-cover" />
                </div>
                {photo.caption && <figcaption className="mt-2 text-sm leading-snug text-chalk-60">{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
        <p className={`display text-[clamp(2.4rem,5vw,3.6rem)] leading-none ${jalon.highlight ? "text-race" : "text-chalk"}`}>
          {jalon.year}
        </p>
        <h3 className="display mt-2 text-2xl text-chalk">{jalon.title}</h3>
        {jalon.text.map((p) => (
          <p key={p} className="mt-3 text-base leading-relaxed text-chalk-60">
            {p}
          </p>
        ))}
      </div>
    </li>
  );
}
