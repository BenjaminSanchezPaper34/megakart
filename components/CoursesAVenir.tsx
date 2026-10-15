import Link from "next/link";
import RowArrows from "./RowArrows";
import UpcomingRaces from "./UpcomingRaces";

/**
 * Section « Cet automne, on court » — identique sur l'accueil et l'agenda (15/10) :
 * même titre, même rangée de cartes (UpcomingRaces), mêmes flèches.
 * `lienAgenda` : le bouton « Voir tout l'agenda », inutile sur l'agenda lui-même.
 */
export default function CoursesAVenir({ lienAgenda = true, id }: { lienAgenda?: boolean; id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 bg-asphalt-2 py-(--section-y)">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
          Cet automne,
          <br />
          <span className="text-race">on court.</span>
        </h2>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-xl text-base leading-relaxed text-chalk md:text-xl">
            Courses, trophées, soirées : une carte par date, l&rsquo;inscription en un clic.
          </p>
          <div className="flex w-full items-center justify-between gap-3 md:w-auto">
            {lienAgenda && (
              <Link href="/agenda" className="btn btn-ghost">
                Voir tout l&rsquo;agenda
              </Link>
            )}
            <RowArrows target="[data-race-bento]" label="Courses" className="flex gap-3" />
          </div>
        </div>
      </div>
      {/* Hors du conteneur : la bande court d'un bord à l'autre de l'écran, comme celle des karts. */}
      <UpcomingRaces />
    </section>
  );
}
