"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AGENDA,
  RACES,
  getOperation,
  formatDate,
  lienInscription,
  pageCourse,
  type AgendaItem,
} from "@/lib/agenda";
import { factEmoji } from "@/components/system/tones";

/** Dates de course confirmées, à date unique — ordre chronologique. */
const DATED = AGENDA.filter(
  (a) => a.status === "confirme" && !a.endDate && a.op && RACES.some((r) => r.slug === a.op),
);

function daysUntil(iso: string, today: string) {
  const [y1, m1, d1] = iso.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);
  return Math.round((Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86_400_000);
}

/**
 * Les cartes courses — LA présentation d'une course, identique sur l'accueil et
 * l'agenda (15/10) : affiche, date, l'essentiel en 3 lignes, prix, et un bouton
 * qui ouvre directement le formulaire avec la date cochée. Une carte par course,
 * sur sa prochaine date encore ouverte (sinon la prochaine date, marquée complet).
 * Sélection côté client pour rester juste au fil des jours (pages prérendues).
 */
export default function UpcomingRaces() {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
    );
  }, []);

  const candidates = today ? DATED.filter((a) => a.date >= today) : DATED;
  const cards = RACES.map((race) => {
    const dates = candidates.filter((a) => a.op === race.slug);
    const item = dates.find((a) => a.places !== 0) ?? dates[0];
    return item ? { item, autres: dates.filter((a) => a !== item) } : null;
  })
    .filter((c): c is { item: AgendaItem; autres: AgendaItem[] } => c !== null)
    .sort((a, b) => a.item.date.localeCompare(b.item.date));
  if (cards.length === 0) return null;

  return (
    <div
      className="bleed-row-mobile no-scrollbar mt-[calc(var(--section-gap)-1.25rem)] grid auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto pb-4 pt-5 snap-x snap-mandatory sm:auto-cols-[45%] lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:gap-5"
      data-race-bento
    >
      {cards.map(({ item, autres }, index) => {
        const op = getOperation(item.op!)!;
        const date = formatDate(item.date);
        const countdown = today ? daysUntil(item.date, today) : null;
        const complet = item.places === 0;
        const page = pageCourse(op);
        const inscription = lienInscription(op, item.date);
        // Affiches officielles sans date (Course Enfant, 100 Tours) : valables pour chaque édition.
        const poster = item.op === "course-enfant" || item.op === "100-tours" ? op.affiche : undefined;
        const photo =
          item.op === "12-heures"
            ? "/images/galerie-24-aerien-nuit.jpg"
            : item.op === "plein-gaz"
              ? "/images/galerie-17-nocturne-action.jpg"
              : "/images/galerie-01-kart-adulte.jpg";

        return (
          <div key={item.date + item.op} className="relative flex snap-start">
            {/* Rareté : label à cheval sur le haut de la carte. */}
            {item.places !== undefined && (
              <span
                className={`absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold shadow-lg ${complet ? "bg-chalk text-asphalt" : "bg-flag text-asphalt"}`}
              >
                {complet ? "Complet" : item.places === 1 ? "Dernières inscriptions" : `Plus que ${item.places} équipes`}
              </span>
            )}
            <article className="race-event-card flex w-full flex-col overflow-hidden border border-chalk/15 bg-asphalt">
              <Link
                href={page}
                aria-label={`${item.label} : la course du ${date.day} ${date.monthFull}`}
                className="relative block aspect-[4/5] w-full shrink-0 bg-asphalt-3"
              >
                <Image
                  src={poster?.src ?? photo}
                  alt={
                    poster
                      ? `Affiche ${item.label}`
                      : item.op === "12-heures"
                        ? "Le circuit MegaKart éclairé à la nuit tombée"
                        : "Kart en piste sur le circuit MegaKart"
                  }
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 85vw"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                <div className="flex items-stretch gap-3">
                  <time dateTime={item.date} className="shrink-0 border-r border-chalk/25 pr-3 text-flag">
                    <span className="display block whitespace-nowrap text-2xl leading-tight">
                      {date.day} {date.month}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug">
                      {countdown === 0
                        ? "Aujourd’hui"
                        : countdown === 1
                          ? "Demain"
                          : date.weekday.charAt(0).toUpperCase() + date.weekday.slice(1)}
                    </span>
                  </time>
                  <div className="min-w-0">
                    <h3 className="display line-clamp-2 min-h-[2lh] text-2xl leading-tight text-chalk">
                      <Link href={page} className="hover:text-flag">
                        {item.label}
                      </Link>
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-sm leading-snug text-chalk-60">{op.kicker}</p>
                  </div>
                </div>

                {/* L'essentiel : ce qu'il faut savoir pour s'inscrire, sans ouvrir une autre page. */}
                {op.essentiel && (
                  <ul className="mt-4 grid gap-2 border-t border-chalk/15 pt-4">
                    {op.essentiel.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-sm leading-snug text-chalk">
                        <span aria-hidden="true" className="w-6 shrink-0 text-center text-xl leading-none">
                          {factEmoji(line)}
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 border-t border-chalk/15 pt-4">
                  <p className="display text-2xl leading-none text-chalk">{op.price ?? "Tarif à venir"}</p>
                  {op.priceNote && <p className="mt-1 text-sm leading-snug text-chalk-60">{op.priceNote}</p>}
                  {autres.length > 0 && (
                    <p className="mt-2 text-sm leading-snug text-chalk-60">
                      Aussi le{" "}
                      {autres
                        .map((a) => {
                          const f = formatDate(a.date);
                          return `${f.day} ${f.month}${a.places === 0 ? " (complet)" : ""}`;
                        })
                        .join(", ")}
                    </p>
                  )}
                </div>

                <div className="mt-auto pt-5">
                  {complet || !inscription ? (
                    <span className="btn btn-ghost w-full cursor-default justify-center opacity-70">Complet</span>
                  ) : (
                    <Link
                      href={inscription}
                      data-track={index === 0 ? "inscription-ouverture" : "course-accueil"}
                      className="btn btn-race w-full justify-center"
                    >
                      {op.signupCta ?? "S’inscrire"}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
