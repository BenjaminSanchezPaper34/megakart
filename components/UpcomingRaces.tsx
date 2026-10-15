"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AGENDA, RACES, getOperation, formatDate, lienInscription, pageCourse, type AgendaItem } from "@/lib/agenda";
import { factEmoji } from "@/components/system/tones";

/**
 * Les courses et soirées à venir — LA rangée de cartes, identique sur l'accueil et
 * l'agenda (section CoursesAVenir) : affiche ou photo, date, l'essentiel, prix et
 * inscription directe. Disposition des fiches karts (15/10) : 3 cartes sur la largeur.
 * Une carte PAR DATE (deux Course Enfant = deux cartes), Nocturne Halloween comprise.
 * 3 cartes sur la largeur du site, les suivantes défilent à droite.
 * Sélection côté client pour rester juste au fil des jours (pages prérendues).
 */

/** Soirées sans opération (pas d'inscription) : ce qu'on en dit sur la carte. */
const SOIREES: Record<string, { kicker: string; photo: string; alt: string; lignes: string[]; pied: string }> = {
  "Nocturne Halloween": {
    kicker: "Soirée spéciale",
    photo: "/images/galerie-08-nocturne.jpg",
    alt: "Kart sous les projecteurs en session nocturne",
    lignes: ["Ouvert de 14 h à minuit", "Sessions de nuit sur le circuit éclairé", "Sans réservation"],
    pied: "Sans réservation",
  },
};

const ITEMS = AGENDA.filter(
  (a) =>
    a.status === "confirme" &&
    !a.endDate &&
    ((a.op && RACES.some((r) => r.slug === a.op)) || (a.label && SOIREES[a.label])),
);

function daysUntil(iso: string, today: string) {
  const [y1, m1, d1] = iso.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);
  return Math.round((Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86_400_000);
}

function Carte({ item, today, first }: { item: AgendaItem; today: string | null; first: boolean }) {
  const op = item.op ? getOperation(item.op) : undefined;
  const soiree = !op && item.label ? SOIREES[item.label] : undefined;
  const date = formatDate(item.date);
  const countdown = today ? daysUntil(item.date, today) : null;
  const complet = item.places === 0;
  const page = op ? pageCourse(op) : "/agenda";
  const inscription = op ? lienInscription(op, item.date) : undefined;
  const lignes = op?.essentiel ?? soiree?.lignes ?? [];
  // Affiches officielles sans date (Course Enfant, 100 Tours) : valables pour chaque édition.
  const poster = item.op === "course-enfant" || item.op === "100-tours" ? op?.affiche : undefined;
  const photo = soiree
    ? soiree.photo
    : item.op === "12-heures"
      ? "/images/galerie-24-aerien-nuit.jpg"
      : item.op === "plein-gaz"
        ? "/images/galerie-17-nocturne-action.jpg"
        : "/images/galerie-01-kart-adulte.jpg";
  const alt = poster
    ? `Affiche ${item.label}`
    : soiree
      ? soiree.alt
      : item.op === "12-heures"
        ? "Le circuit MegaKart éclairé à la nuit tombée"
        : "Kart en piste sur le circuit MegaKart";

  return (
    <div className="relative flex snap-start">
      <article className="race-event-card flex w-full flex-col overflow-hidden border border-chalk/15 bg-asphalt">
        <Link href={page} aria-label={`${item.label} : ${date.day} ${date.monthFull}`} className="relative block aspect-[4/5] w-full shrink-0 bg-asphalt-3">
          <Image src={poster?.src ?? photo} alt={alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw" className="object-cover" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
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
                <Link href={page} className="hover:text-flag">
                  {item.label ?? op?.name}
                </Link>
              </h3>
              <p className="mt-0.5 line-clamp-1 text-sm leading-snug text-chalk-60">{op?.kicker ?? soiree?.kicker}</p>
            </div>
          </div>

          {/* L'essentiel : ce qu'il faut savoir pour s'inscrire, sans ouvrir une autre page. */}
          {lignes.length > 0 && (
            <ul className="mt-4 grid gap-2 border-t border-chalk/15 pt-4">
              {lignes.map((line) => (
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
            <p className="display text-2xl leading-none text-chalk">{op?.price ?? soiree?.pied ?? "Tarif à venir"}</p>
            {op?.priceNote && <p className="mt-1 text-sm leading-snug text-chalk-60">{op.priceNote}</p>}
          </div>

          <div className="mt-auto pt-5">
            {soiree ? (
              <Link href="/agenda" className="btn btn-ghost w-full justify-center">
                Voir l&rsquo;agenda
              </Link>
            ) : complet || !inscription ? (
              <span className="btn btn-ghost w-full cursor-default justify-center opacity-70">Complet</span>
            ) : (
              <Link href={inscription} data-track={first ? "inscription-ouverture" : "course-accueil"} className="btn btn-race w-full justify-center">
                {op?.signupCta ?? "S’inscrire"}
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

export default function UpcomingRaces() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const now = new Date();
    setToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
  }, []);

  const items = (today ? ITEMS.filter((a) => a.date >= today) : ITEMS).sort((a, b) => a.date.localeCompare(b.date));
  if (items.length === 0) return null;

  return (
    <div
      data-race-bento
      className="no-scrollbar mt-[calc(var(--section-gap)-1rem)] grid auto-cols-[85%] grid-flow-col gap-5 overflow-x-auto pb-4 snap-x snap-mandatory sm:auto-cols-[60%] md:auto-cols-[44%] lg:auto-cols-[calc((min(100vw-4rem,76rem)-2.5rem)/3)]"
      // Même bande que les karts : pleine largeur de l'écran, cartes calées sur la grille du site,
      // elles glissent vers la gauche jusqu'au bord quand on fait défiler.
      style={{ paddingInline: "var(--site-gutter)", scrollPaddingInline: "var(--site-gutter)" }}
    >
      {items.map((item, i) => (
        <Carte key={item.date + (item.op ?? item.label)} item={item} today={today} first={i === 0} />
      ))}
    </div>
  );
}
