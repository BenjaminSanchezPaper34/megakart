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
    <div className="mt-8 grid auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:auto-cols-[45%] lg:mt-10 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:gap-5" data-race-bento>
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
        const cta = op?.signup ? (op.signupCta ?? "Inscrire mon équipe") : "Voir la course";

        return (
          <article
            key={item.date + item.op}
            className="race-event-card flex snap-center flex-col overflow-hidden border border-chalk/15 bg-asphalt"
          >
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
              <p className="mb-3 text-sm font-bold text-flag">
                {featured ? "Prochain départ" : "À venir"}
                {featured && (countdown === 0 ? " · Aujourd’hui" : countdown === 1 ? " · Demain" : "")}
              </p>
              <p className="text-sm font-semibold text-flag">
                {date.weekday.charAt(0).toUpperCase() + date.weekday.slice(1)} {date.day} {date.monthFull}
              </p>
              <h3 className="display mt-2 text-2xl text-chalk sm:text-3xl">
                <Link href={op?.page ?? `/agenda#${item.op}`} className="hover:text-flag">
                  {item.label}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-snug text-chalk-60">{op?.kicker}</p>
              {op?.price && <p className="mt-3 text-base font-bold text-chalk">{op.price}</p>}
              {op?.priceNote && <p className="mt-1 text-sm leading-snug text-chalk-60">{op.priceNote}</p>}
              {featured && item.places !== undefined && item.places > 0 && (
                <p className="mt-1 text-sm font-semibold text-flag">
                  {item.places === 1 ? "Dernière équipe disponible" : `Plus que ${item.places} équipes`}
                </p>
              )}
              <div className="mt-auto pt-4">
                <Link
                  href={href}
                  data-track={featured ? "inscription-ouverture" : "course-accueil"}
                  className={`btn w-full ${featured ? "btn-race" : "btn-ghost"}`}
                >
                  {cta}
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
