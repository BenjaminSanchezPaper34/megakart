"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AGENDA, getOperation, formatDate, type AgendaItem } from "@/lib/agenda";

/** Temps forts datés, confirmés, à date unique — ordre chronologique. */
const DATED = AGENDA.filter((a) => a.status === "confirme" && !a.endDate && a.op);

function daysUntil(iso: string, today: string) {
  const [y1, m1, d1] = iso.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);
  const a = Date.UTC(y1, m1 - 1, d1);
  const b = Date.UTC(y2, m2 - 1, d2);
  return Math.round((a - b) / 86_400_000);
}

/**
 * « Cet automne, on court » : le prochain rendez-vous mis en avant,
 * puis les suivants. La sélection se fait côté client pour rester juste
 * au fil des semaines (le site est prérendu une fois pour toutes).
 */
export default function UpcomingRaces() {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}`
    );
  }, []);

  // Premier rendu (serveur et client) : les premiers de la liste, pour un
  // balisage identique ; une fois monté, on filtre sur la date du jour.
  // Une carte par épreuve : les autres dates restent disponibles dans l'agenda.
  const candidates = today ? DATED.filter((a) => a.date >= today) : DATED;
  const upcoming: AgendaItem[] = candidates
    .filter((item, index, all) => all.findIndex((other) => other.op === item.op) === index)
    .slice(0, 4);
  if (upcoming.length === 0) return null;

  return (
    <div className="bleed-row-mobile no-scrollbar mt-4 grid auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto pb-4 pt-5 snap-x snap-mandatory sm:auto-cols-[45%] lg:mt-10 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:gap-5" data-race-bento>
      {upcoming.map((item, index) => {
        const op = getOperation(item.op!);
        const date = formatDate(item.date);
        const featured = index === 0;
        const countdown = today ? daysUntil(item.date, today) : null;
        // L'affiche 100 Tours porte le 18 octobre : ne jamais la réutiliser pour décembre.
        const poster = item.op === "course-enfant" ||
          (item.op === "100-tours" && item.date === "2026-10-18") ? op?.affiche : undefined;
        const photo = item.op === "12-heures"
          ? "/images/galerie-24-aerien-nuit.jpg"
          : item.op === "plein-gaz"
            ? "/images/galerie-17-nocturne-action.jpg"
            : "/images/galerie-01-kart-adulte.jpg";
        const href = op?.signup ?? op?.page ?? `/agenda#${item.op}`;

        return (
          <div key={item.date + item.op} className="relative flex snap-start">
          {/* Rareté : label jaune à cheval sur le haut de la carte (comme la croix du pop-up). */}
          {item.places !== undefined && (
            <span className={`absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold shadow-lg ${item.places === 0 ? "bg-chalk text-asphalt" : "bg-flag text-asphalt"}`}>
              {item.places === 0 ? "Complet" : item.places === 1 ? "Dernières inscriptions" : `Plus que ${item.places} équipes`}
            </span>
          )}
          <article className="race-event-card flex w-full flex-col overflow-hidden border border-chalk/15 bg-asphalt">
            <Link
              href={op?.page ?? `/agenda#${item.op}`}
              aria-label={`${item.label} : découvrir la course du ${date.day} ${date.monthFull}`}
              className="relative block aspect-[3/4] w-full shrink-0 bg-asphalt-3"
            >
              <Image
                src={poster?.src ?? photo}
                alt={poster ? `Affiche ${item.label}` : item.op === "12-heures" ? "Le circuit MegaKart éclairé à la nuit tombée" : "Kart en piste sur le circuit MegaKart"}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 85vw"
                className="object-cover"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
              {/* Date présentée comme dans le bandeau promo : jour + mois en display, jour de semaine dessous. */}
              <div className="flex items-stretch gap-3">
                <time dateTime={item.date} className="shrink-0 border-r border-chalk/25 pr-3 text-flag">
                  <span className="display block whitespace-nowrap text-2xl leading-tight">
                    {date.day} {date.month}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug">
                    {countdown === 0 ? "Aujourd’hui" : countdown === 1 ? "Demain" : date.weekday.charAt(0).toUpperCase() + date.weekday.slice(1)}
                  </span>
                </time>
                <div className="min-w-0">
                  <h3 className="display line-clamp-2 min-h-[2lh] text-2xl leading-tight text-chalk">
                    <Link href={op?.page ?? `/agenda#${item.op}`} className="hover:text-flag">
                      {item.label}
                    </Link>
                  </h3>
                  <p className="mt-0.5 line-clamp-2 min-h-[2lh] text-sm leading-snug text-chalk-60">{op?.kicker}</p>
                </div>
              </div>
              {/* Toujours au même endroit : tarif, puis une ligne d'accompagnement (2 lignes réservées). */}
              <p className="mt-4 text-base font-bold text-chalk">{op?.price ?? "Tarif à venir"}</p>
              <p className="mt-1 line-clamp-2 min-h-[2lh] text-sm leading-snug text-chalk-60">{op?.priceNote ?? op?.facts?.[0] ?? ""}</p>
              <div className="mt-auto pt-4">
                {item.places === 0 ? (
                  <Link href={op?.page ?? `/agenda#${item.op}`} className="btn btn-ghost w-full">
                    Complet · voir la course
                  </Link>
                ) : (
                  <Link
                    href={href}
                    data-track={featured ? "inscription-ouverture" : "course-accueil"}
                    className="btn btn-race w-full"
                  >
                    S&rsquo;inscrire
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
