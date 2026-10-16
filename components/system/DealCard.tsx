"use client";

import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  return (
    // Enveloppe = l'élément animé par la cascade GSAP (data-stagger) ; le survol se joue sur la
    // carte dedans, sinon le transform posé par GSAP annule le soulèvement.
    <div className="snap-start">
    <article
      id={expandable ? deal.slug : undefined}
      // Toute la carte déplie « Les conditions » (le bouton reste là pour le clavier) ;
      // au survol, elle se soulève légèrement.
      onClick={expandable ? () => setOpen((o) => !o) : undefined}
      className={`race-event-card flex h-full scroll-mt-28 flex-col items-center gap-0 p-5 text-center transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-6 ${
        expandable ? "cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-16px_rgb(0_0_0/0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0" : ""
      } ${skin.card}`}
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
        <DealConditions
          details={deal.details}
          facts={deal.facts}
          rule={skin.rule}
          soft={skin.soft}
          open={open}
          onToggle={() => setOpen((o) => !o)}
        />
      )}
    </article>
    </div>
  );
}
