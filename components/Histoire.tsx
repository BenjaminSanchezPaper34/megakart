import Image from "next/image";
import { JALONS, type Jalon } from "@/lib/histoire";

/**
 * Frise chronologique du circuit. La ligne court à gauche à toutes les
 * tailles : le jalon garde la même allure avec ou sans photo, et rien
 * ne laisse de colonne vide tant que les archives ne sont pas scannées.
 * Les photos gardent le gabarit du site (parallélogramme + ombre) :
 * aucun filtre, aucune rotation, les tirages d'époque parlent d'eux-mêmes.
 */
export default function Histoire() {
  return (
    <ol className="relative mt-12 flex flex-col gap-12 md:gap-16">
      {/* Ligne de la frise */}
      <span
        aria-hidden="true"
        className="absolute bottom-6 left-[11px] top-3 w-px bg-gradient-to-b from-race via-white/20 to-transparent"
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
    <li data-reveal className="relative pl-10 md:pl-14">
      {/* Pastille sur la frise */}
      <span
        aria-hidden="true"
        className={`clip-race absolute left-0 top-2 h-6 w-6 ${
          jalon.highlight ? "bg-race" : "bg-asphalt-3 ring-1 ring-inset ring-white/25"
        }`}
      />

      <p
        className={`display text-[clamp(2.4rem,5vw,3.6rem)] leading-none ${
          jalon.highlight ? "text-race" : "text-chalk"
        }`}
      >
        {jalon.year}
      </p>
      <h3 className="display mt-2 text-2xl text-chalk">{jalon.title}</h3>
      {jalon.text.map((p) => (
        <p key={p} className="mt-3 max-w-2xl text-base leading-relaxed text-chalk-60">
          {p}
        </p>
      ))}

      {/* Archives du jalon */}
      {photos.length > 0 && (
        <div
          className={`mt-6 grid gap-4 ${
            photos.length === 1 ? "max-w-xl" : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {photos.map((photo) => (
            <figure key={photo.src} className="[filter:drop-shadow(0_18px_20px_rgb(0_0_0/0.45))]">
              <div className="clip-race relative aspect-[4/3] overflow-hidden bg-asphalt-3">
                <Image
                  src={`/images/${photo.src}`}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
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
