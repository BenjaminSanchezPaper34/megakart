import type { Operation } from "@/lib/agenda";
import { dealSkin } from "./tones";

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
      <h3 className="display mt-4 text-4xl leading-none md:text-[2.75rem]">{deal.name}</h3>
      <p className={`mt-3 line-clamp-2 min-h-[2lh] text-base leading-snug ${skin.soft}`}>{deal.summary}</p>
      <div className={`mt-auto flex w-full flex-col items-center gap-1 border-t pt-4 ${skin.rule}`}>
        <p className="display text-3xl leading-none">{deal.price ?? "3e offerte"}</p>
        <p className={`text-sm leading-snug ${skin.soft}`}>
          {deal.priceNote ?? "2 sessions achetées, la 3e pour nous"}
        </p>
      </div>
      {expandable && (
        <details className={`group mt-4 w-full border-t pt-3 text-left ${skin.rule}`}>
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 text-sm font-bold [&::-webkit-details-marker]:hidden">
            Les conditions
            <span aria-hidden="true" className="display text-lg transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          {deal.details.map((p) => (
            <p key={p} className={`mt-3 text-sm leading-relaxed ${skin.soft}`}>
              {p}
            </p>
          ))}
          <ul className={`mt-3 border-t text-sm ${skin.rule}`}>
            {deal.facts.map((fact) => (
              <li key={fact} className={`border-b py-2 last:border-b-0 ${skin.rule}`}>
                {fact}
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}
