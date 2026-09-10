import Image from "next/image";
import { JALONS, type Jalon } from "@/lib/histoire";

/**
 * Frise chronologique du circuit. Chaque jalon peut porter une ou
 * plusieurs photos d'archives ; sans photo, il s'affiche en texte seul
 * sans laisser de trou. Les archives gardent le gabarit du site
 * (parallélogramme + ombre portée) : aucun filtre, aucune rotation,
 * les tirages d'époque parlent d'eux-mêmes.
 */
export default function Histoire() {
  return (
    <ol className="relative mt-14 flex flex-col gap-14 md:gap-20">
      {/* Ligne de la frise, filante à gauche */}
      <span
        aria-hidden="true"
        className="absolute bottom-4 left-[11px] top-4 w-px bg-gradient-to-b from-race via-white/20 to-transparent md:left-1/2"
      />
      {JALONS.map((jalon) => (
        <JalonRow key={jalon.year} jalon={jalon} />
      ))}
    </ol>
  );
}

function JalonRow({ jalon }: { jalon: Jalon }) {
  const photos = jalon.photos ?? [];

  return (
    <li data-reveal className="relative grid gap-6 pl-10 md:grid-cols-2 md:gap-12 md:pl-0">
      {/* Pastille sur la frise */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-2 h-6 w-6 shrink-0 md:left-1/2 md:-translate-x-1/2 ${
          jalon.highlight ? "bg-race" : "bg-asphalt-3 ring-1 ring-inset ring-white/25"
        } clip-race`}
      />

      {/* Texte */}
      <div className="md:pr-10 md:text-right">
        <p
          className={`display text-[clamp(2.4rem,5vw,3.6rem)] leading-none ${
            jalon.highlight ? "text-race" : "text-chalk"
          }`}
        >
          {jalon.year}
        </p>
        <h3 className="display mt-2 text-2xl text-chalk">{jalon.title}</h3>
        {jalon.text.map((p) => (
          <p key={p} className="mt-3 text-base leading-relaxed text-chalk-60">
            {p}
          </p>
        ))}
      </div>

      {/* Archives */}
      {photos.length > 0 && (
        <div
          className={`flex flex-col gap-4 md:pl-10 ${
            photos.length > 1 ? "sm:grid sm:grid-cols-2 sm:gap-4" : ""
          }`}
        >
          {photos.map((photo) => (
            <figure key={photo.src} className="[filter:drop-shadow(0_18px_20px_rgb(0_0_0/0.45))]">
              <div className="clip-race relative aspect-[4/3] overflow-hidden bg-asphalt-3">
                <Image
                  src={`/images/${photo.src}`}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
              {photo.caption && (
                <figcaption className="mt-2 text-sm leading-snug text-chalk-60">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </li>
  );
}
