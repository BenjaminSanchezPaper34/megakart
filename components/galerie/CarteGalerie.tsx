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
      {/* La date en pastille, comme une page de calendrier : on retrouve sa course d'un coup d'œil (Benjamin, 22/10). */}
      <time
        dateTime={g.date}
        className="absolute left-4 top-4 flex min-w-16 flex-col items-center bg-race px-3 pb-2 pt-2.5 text-white shadow-[0_8px_24px_-8px_rgb(0_0_0/0.6)] sm:left-5 sm:top-5"
      >
        <span className="display text-4xl leading-none">{f.day}</span>
        <span className="display mt-1 text-sm leading-none">{f.month}</span>
        <span className="mt-1 text-xs font-semibold leading-none opacity-80">{g.date.slice(0, 4)}</span>
      </time>
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="display text-base text-flag">{g.kicker}</p>
        <h3 className="display mt-1 text-3xl leading-tight text-chalk">{g.titre}</h3>
        <p className="mt-2 text-base text-chalk-60">{g.count} photos à télécharger</p>
      </div>
    </Link>
  );
}
