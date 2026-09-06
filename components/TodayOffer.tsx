"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buildCalendar, getOperation, formatDate, type CalendarDay } from "@/lib/agenda";
import { SITE } from "@/lib/site";

type Highlight = {
  slug: string;
  kicker: string;
  title: string;
  detail: string;
  /** Fond du bandeau + couleur du texte. */
  tone: string;
  cta: string;
};

/** Ce qui prime quand plusieurs offres tombent le même jour. */
function highlightFor(d: CalendarDay): Highlight | null {
  if (d.event?.op) {
    const op = getOperation(d.event.op);
    return {
      slug: d.event.op,
      kicker: "Aujourd'hui sur le circuit",
      title: d.event.label,
      detail: op?.price ? `${op.summary} ${op.price}.` : (op?.summary ?? ""),
      tone: "bg-race text-white",
      cta: "Le détail de la course",
    };
  }
  if (d.aVolonte) {
    return {
      slug: "mercredi-a-volonte",
      kicker: "Aujourd'hui, mercredi",
      title: "À volonté",
      detail: "Un tarif unique, du roulage à volonté : 29€ en kart enfant, 59€ en 280cc, 69€ en 390cc.",
      tone: "bg-flag text-asphalt",
      cta: "Comment ça marche",
    };
  }
  if (d.packDecouverte) {
    return {
      slug: "pack-decouverte",
      kicker: "Aujourd'hui, dimanche",
      title: "Pack Découverte",
      detail:
        "3 sessions de 8 min — 390cc, 390cc puis RX250 — avec coaching privé offert. 49€ au lieu de 76€.",
      tone: "bg-chalk text-asphalt",
      cta: "Tout savoir sur le pack",
    };
  }
  if (d.promo) {
    return {
      slug: "2-plus-1",
      kicker: "Aujourd'hui",
      title: "2 tickets = 1 offert",
      detail: "Deux sessions achetées, la troisième offerte. Sans réservation, il suffit de passer.",
      tone: "bg-[#2e7cf6] text-white",
      cta: "Les dates de l'offre",
    };
  }
  return null;
}

/**
 * Bandeau « l'offre du jour » : ce qui se passe aujourd'hui sur le circuit
 * (course, à volonté, Pack Découverte, promo). Calculé côté client — le
 * site est prérendu, la date du visiteur fait foi. Rien aujourd'hui :
 * on annonce la prochaine offre à venir.
 */
export default function TodayOffer() {
  const months = useMemo(buildCalendar, []);
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}`
    );
  }, []);

  if (!today) return null;

  const days = months.flatMap((m) => m.days);
  const day = days.find((d) => d.iso === today);

  const highlight = day ? highlightFor(day) : null;

  // Rien aujourd'hui : on montre la prochaine occasion.
  const nextDay = highlight
    ? null
    : days.find((d) => d.iso > today && highlightFor(d) !== null);
  const nextHighlight = nextDay ? highlightFor(nextDay) : null;
  const shown = highlight ?? nextHighlight;
  if (!shown || !day) return null;

  const when = highlight ? null : formatDate(nextDay!.iso);

  return (
    <section aria-label="L'offre du jour" className={`${shown.tone} py-4`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-5 md:px-8">
        <span className="checker-sm h-5 w-10 shrink-0 opacity-30" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="display text-sm uppercase tracking-widest opacity-80">
            {highlight ? shown.kicker : `${when!.weekday} ${when!.day} ${when!.month}`}
          </p>
          <p className="display text-2xl leading-tight md:text-3xl">{shown.title}</p>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed opacity-90 md:text-base">
            {shown.detail}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link
            href={`/agenda#${shown.slug}`}
            className="display border-2 border-current px-4 py-2 text-sm transition-opacity hover:opacity-70"
          >
            {shown.cta}
          </Link>
          <a
            href={SITE.phoneHref}
            className="display px-1 text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
