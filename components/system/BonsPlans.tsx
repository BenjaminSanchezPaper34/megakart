import Link from "next/link";
import RowArrows from "@/components/RowArrows";
import { DEALS, SHOW_PROMOS } from "@/lib/agenda";
import DealCard from "./DealCard";
import SectionHeader from "./SectionHeader";

/* Les promos datées attendent le feu vert du client (voir SHOW_PROMOS). */
const VISIBLE_DEALS = DEALS.filter((d) => SHOW_PROMOS || d.slug !== "2-plus-1");

/**
 * Section « Les bons plans » — identique sur l'accueil et l'agenda (validée sur
 * l'agenda le 15/10) : trois cartes aux couleurs du calendrier (mercredi jaune,
 * 2+1 bleu, dimanche blanc), chacune avec « Les conditions » dépliables.
 */
export default function BonsPlans() {
  return (
    <section id="bons-plans" className="scroll-mt-24 bg-asphalt-2 py-(--section-y)">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          line1="Les bons plans"
          line2="qui reviennent."
          accent="flag"
          subtitle="Sans réservation pour la plupart : choisissez votre jour, on s'occupe du reste."
          action={
            <div className="flex w-full items-center justify-between gap-3 md:w-auto">
              {/* Les jours de chaque offre sont colorés dans le calendrier de l'agenda. */}
              <Link href="/agenda#calendrier" className="btn btn-ghost">
                Les jours dans le calendrier
              </Link>
              <RowArrows target="[data-deals-row]" label="Bons plans" className="flex gap-3" />
            </div>
          }
        />
        <div
          data-stagger
          data-deals-row
          className="bleed-row-mobile no-scrollbar mt-(--section-gap) grid auto-cols-[85%] grid-flow-col items-start gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:auto-cols-[45%] md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0"
        >
          {VISIBLE_DEALS.map((deal) => (
            <DealCard key={deal.slug} deal={deal} expandable />
          ))}
        </div>
      </div>
    </section>
  );
}
