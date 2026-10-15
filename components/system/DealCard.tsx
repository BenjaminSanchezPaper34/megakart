import type { Operation } from "@/lib/agenda";
import { dealSkin } from "./tones";
import DealConditions from "./DealConditions";

/**
 * Carte « bon plan » commune à l'accueil et à l'agenda (même gabarit partout) :
 * label du jour, nom, résumé, prix. `expandable` (agenda) ajoute « Les conditions »,
 * qui déplie le détail et les faits de l'offre sous le prix.
 */
export default function DealCard({ deal, expandable = false }: { deal: Operation; expandable?: boolean }) {
  const skin = dealSkin(deal);
  return (
    <article
      id={expandable ? deal.slug : undefined}
      className={`race-event-card flex scroll-mt-28 snap-start flex-col items-center gap-0 p-5 text-center sm:p-6 ${skin.card}`}
    >
      <span className={`rounded-full px-3 py-1 text-sm font-bold ${skin.label}`}>{deal.kicker}</span>
      <h3 className="display mt-4 text-4xl leading-none md:text-[2.75rem]">
        {/* Mobile : coupe fixe (« Mercredi / à volonté ») ; ordinateur : sur une ligne. */}
        {deal.nameLines
          ? deal.nameLines.map((line, i) => (
              <span key={line} className="block md:inline">
                {i > 0 && <span className="hidden md:inline"> </span>}
                {line}
              </span>
            ))
          : deal.name}
      </h3>
      <p className={`mt-3 line-clamp-2 min-h-[2lh] text-base leading-snug ${skin.soft}`}>{deal.summary}</p>
      <div className={`mt-auto flex w-full flex-col items-center gap-1 border-t pt-4 ${skin.rule}`}>
        <p className="display text-3xl leading-none">{deal.price ?? "3e offerte"}</p>
        <p className={`text-sm leading-snug ${skin.soft}`}>
          {deal.priceNote ?? "2 sessions achetées, la 3e pour nous"}
        </p>
      </div>
      {expandable && (
        <DealConditions details={deal.details} facts={deal.facts} rule={skin.rule} soft={skin.soft} />
      )}
    </article>
  );
}
