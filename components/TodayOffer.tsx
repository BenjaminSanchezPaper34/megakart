"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buildCalendar, getOperation, formatDate, type CalendarDay } from "@/lib/agenda";

type Highlight = {
  slug: string;
  title: string;
  /** Accroche courte, seule visible sur petit écran. */
  short: string;
  /** Phrase complète, réservée au desktop. */
  detail: string;
  /** Fond du bandeau + couleur du texte. */
  tone: string;
  cta: string;
};

/** Ce qui prime quand plusieurs offres tombent le même jour. */
function highlightFor(d: CalendarDay): Highlight | null {
  if (d.event?.op) {
    const op = getOperation(d.event.op);
    const alsoPack =
      d.packDecouverte && op?.endsAt
        ? ` Course terminée à ${op.endsAt} : le Pack Découverte prend le relais l'après-midi.`
        : "";
    return {
      slug: d.event.op,
      title: d.event.label,
      short: op?.price ?? "Course du jour",
      detail: `${op?.summary ?? ""}${alsoPack}`,
      tone: "bg-race text-white",
      cta: "Le détail de la course",
    };
  }
  if (d.aVolonte) {
    return {
      slug: "mercredi-a-volonte",
      title: "À volonté",
      short: "Dès 29€, roulage illimité",
      detail: "Un tarif unique, du roulage à volonté : 29€ en kart enfant, 59€ en 280cc, 69€ en 390cc.",
      tone: "bg-flag text-asphalt",
      cta: "Comment ça marche",
    };
  }
  if (d.packDecouverte) {
    return {
      slug: "pack-decouverte",
      title: "Pack Découverte",
      short: "49€ au lieu de 76€, coaching offert",
      detail:
        "3 sessions de 8 min — 390cc, 390cc puis RX250 — avec coaching privé offert par un moniteur.",
      tone: "bg-chalk text-asphalt",
      cta: "Tout savoir sur le pack",
    };
  }
  if (d.promo) {
    return {
      slug: "2-plus-1",
      title: "2 tickets = 1 offert",
      short: "La 3e session offerte",
      detail: "Deux sessions achetées, la troisième offerte. Sans réservation, il suffit de passer.",
      tone: "bg-[#2e7cf6] text-white",
      cta: "Les dates de l'offre",
    };
  }
  return null;
}

/**
 * Bandeau « l'offre du jour » : ce qui se passe aujourd'hui sur le circuit.
 * Calculé côté client (le site est prérendu, la date du visiteur fait foi).
 * Le bandeau entier est cliquable et mène à la fiche de l'offre : sur petit
 * écran on ne garde donc que le titre et une accroche, le détail vit là-bas.
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
  if (!day) return null;

  const todays = highlightFor(day);
  const nextDay = todays ? null : days.find((d) => d.iso > today && highlightFor(d) !== null);
  const shown = todays ?? (nextDay ? highlightFor(nextDay) : null);
  if (!shown) return null;

  const when = todays ? "Aujourd'hui" : (() => {
    const f = formatDate(nextDay!.iso);
    return `${f.weekday.charAt(0).toUpperCase()}${f.weekday.slice(1)} ${f.day} ${f.month}`;
  })();

  return (
    <Link
      href={`/agenda#${shown.slug}`}
      aria-label={`${when} : ${shown.title}. Voir le détail`}
      data-track="offre-du-jour"
      className={`group block ${shown.tone}`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 md:gap-6 md:px-8 md:py-4">
        <span className="checker-sm hidden h-5 w-10 shrink-0 opacity-30 sm:block" aria-hidden="true" />

        <div className="min-w-0 flex-1">
          {/* La date en étiquette pleine : c'est l'info qui décide si on vient. */}
          <p className="mb-1.5">
            <span className="display inline-block border-2 border-current px-2.5 py-0.5 text-sm uppercase tracking-wide md:text-base">
              {when}
            </span>
          </p>
          <p className="display truncate text-xl leading-tight md:text-2xl lg:text-3xl">
            {shown.title}
          </p>
          {/* Accroche courte jusqu'à la tablette, phrase complète au-delà */}
          <p className="mt-0.5 text-sm leading-snug opacity-90 lg:hidden">{shown.short}</p>
          <p className="mt-1 hidden max-w-3xl text-base leading-relaxed opacity-90 lg:block">
            {shown.detail}
          </p>
        </div>

        <span className="display hidden shrink-0 border-2 border-current px-4 py-2 text-sm transition-opacity group-hover:opacity-70 lg:inline-block">
          {shown.cta}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 lg:hidden"
        >
          <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
        </svg>
      </div>
    </Link>
  );
}
