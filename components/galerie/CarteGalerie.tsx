import Image from "next/image";
import Link from "next/link";
import type { Galerie } from "@/lib/galeries";
import { formatDate } from "@/lib/agenda";

/** Carte d'une galerie (page /galeries et page Photos) : couverture, étiquette, titre, date, nombre. */
export default function CarteGalerie({ g }: { g: Galerie }) {
  const f = formatDate(g.date);
  return (
    <Link
      href={`/galerie/${g.path}`}
      className="race-event-card group relative block aspect-[4/5] overflow-hidden bg-asphalt-3"
    >
      <Image
        src={g.couverture}
        alt={`${g.kicker} chez MegaKart — ${g.titre}`}
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="display text-base text-flag">
          {f.day} {f.month} {g.date.slice(0, 4)} · {g.kicker}
        </p>
        <h3 className="display mt-1 text-3xl leading-tight text-chalk">{g.titre}</h3>
        <p className="mt-2 text-base text-chalk-60">{g.count} photos à télécharger</p>
      </div>
    </Link>
  );
}
