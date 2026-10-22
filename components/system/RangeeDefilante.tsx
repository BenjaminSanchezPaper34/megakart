import type { ReactNode } from "react";
import RowArrows from "@/components/RowArrows";

/**
 * Rangée de cartes à faire défiler (galeries de la page Photos, 22/10) : même
 * bande que « Cet automne, on court » sur l'accueil (UpcomingRaces) — elle
 * court d'un bord à l'autre de l'écran, les cartes calées sur la grille du
 * site (trois sur ordinateur), et continue autant qu'il y a de cartes.
 * Flèches RowArrows, visibles seulement quand la bande dépasse.
 * À poser dans un conteneur centré (max-w-7xl) : la bande en sort par ses marges.
 */
export default function RangeeDefilante({ children, label, id }: { children: ReactNode; label: string; id: string }) {
  return (
    <div>
      <RowArrows target={`[data-rangee="${id}"]`} label={label} className="mb-4 hidden justify-end gap-3 sm:flex" />
      <div
        data-rangee={id}
        className="no-scrollbar grid auto-cols-[85%] grid-flow-col gap-5 overflow-x-auto pb-4 snap-x snap-mandatory sm:auto-cols-[60%] md:auto-cols-[44%] lg:auto-cols-[calc((min(100vw-4rem,76rem)-2.5rem)/3)] [&>*]:snap-start"
        style={{
          marginInline: "calc(50% - 50vw)",
          paddingInline: "var(--site-gutter)",
          scrollPaddingInline: "var(--site-gutter)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
