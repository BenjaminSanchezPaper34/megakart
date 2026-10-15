"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AGENDA, RACES, getOperation, formatDate, lienInscription, pageCourse, type AgendaItem } from "@/lib/agenda";
import { factEmoji } from "@/components/system/tones";

/**
 * Les courses et soirées à venir — LA rangée de cartes, identique sur l'accueil et
 * l'agenda (section CoursesAVenir). Style des fiches karts (15/10) : la date en très
 * grand en haut à gauche, le kart de la course détouré qui déborde à droite sur le
 * tracé en filigrane, l'essentiel, puis prix et inscription en pied de carte.
 * Une carte PAR DATE (deux Course Enfant = deux cartes), Nocturne Halloween comprise.
 * 3 cartes sur la largeur du site, les suivantes défilent à droite.
 * Sélection côté client pour rester juste au fil des jours (pages prérendues).
 */

/** Le kart de chaque course (visuels Sodi officiels de la flotte) ; sinon un émoji. */
const VISUEL: Record<string, { kart?: { src: string; h?: number; alt: string }; emoji?: string }> = {
  "course-enfant": { kart: { src: "sodi/sodi-lr6.webp", alt: "Kart Enfant Sodi LR6" } },
  "100-tours": { kart: { src: "sodi/sodi-rt10.webp", alt: "Kart Sodi RT10 390cc" } },
  "12-heures": { kart: { src: "sodi/sodi-rt10.webp", alt: "Kart Sodi RT10 390cc" } },
  "plein-gaz": { emoji: "🏆" },
};

/** Soirées sans opération (pas d'inscription) : ce qu'on en dit sur la carte. */
const SOIREES: Record<string, { kicker: string; emoji: string; lignes: string[]; pied: string }> = {
  "Nocturne Halloween": {
    kicker: "Soirée spéciale",
    emoji: "🎃",
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
  const f = formatDate(item.date);
  const j = today ? daysUntil(item.date, today) : null;
  const complet = item.places === 0;
  const visuel = (item.op && VISUEL[item.op]) || (soiree ? { emoji: soiree.emoji } : {});
  const lignes = op?.essentiel ?? soiree?.lignes ?? [];
  const inscription = op ? lienInscription(op, item.date) : undefined;
  const page = op ? pageCourse(op) : "/agenda";
  const badge = complet
    ? { t: "Complet", c: "bg-chalk text-asphalt" }
    : item.places === 1
      ? { t: "Dernière place", c: "bg-flag text-asphalt" }
      : item.places !== undefined
        ? { t: `Plus que ${item.places} équipes`, c: "bg-flag text-asphalt" }
        : soiree
          ? { t: "Soirée", c: "bg-race text-white" }
          : null;

  return (
    <div className="relative flex snap-start pt-4">
      {badge && (
        <span className={`absolute left-1/2 top-4 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold shadow-lg ${badge.c}`}>
          {badge.t}
        </span>
      )}
      <article className="race-event-card relative flex w-full flex-col overflow-hidden border border-white/10 bg-gradient-to-br from-asphalt-2 via-asphalt-2 to-asphalt-3 p-5 sm:p-6">
        {/* Filigrane : le tracé du circuit, comme sur les fiches karts. */}
        <Image
          src="/images/TRACECIRCUIT-MEGAKART.svg"
          alt=""
          aria-hidden="true"
          width={161}
          height={104}
          className="pointer-events-none absolute -right-6 top-6 w-[60%] opacity-[0.06]"
        />
        {/* Le kart de la course (ou l'émoji de la soirée), qui déborde à droite. */}
        {visuel.kart ? (
          <Image
            src={`/images/${visuel.kart.src}`}
            alt={visuel.kart.alt}
            width={1200}
            height={720}
            sizes="(min-width: 1024px) 220px, 50vw"
            className="pointer-events-none absolute -right-[10%] top-[40%] w-[52%] object-contain drop-shadow-[0_16px_14px_rgba(0,0,0,0.55)]"
          />
        ) : visuel.emoji ? (
          <span aria-hidden="true" className="pointer-events-none absolute right-4 top-[22%] text-[5.5rem] leading-none drop-shadow-[0_12px_14px_rgba(0,0,0,0.5)] sm:right-6">
            {visuel.emoji}
          </span>
        ) : null}

        {/* La donnée clé : la date, en très grand. */}
        <div className="relative">
          <time dateTime={item.date} className="display block leading-none">
            <span className="text-5xl text-chalk sm:text-6xl">
              {f.day} {f.month}
            </span>
          </time>
          <p className="mt-2 text-base text-chalk-60">
            {f.weekday.charAt(0).toUpperCase() + f.weekday.slice(1)}
            {j === 0 ? " · aujourd'hui" : j === 1 ? " · demain" : j !== null && j > 1 ? ` · dans ${j} jours` : ""}
          </p>
          <h3 className="display mt-4 max-w-[62%] text-2xl leading-tight text-chalk">
            <Link href={page} className="hover:text-flag">
              {item.label ?? op?.name}
            </Link>
          </h3>
          <p className="mt-0.5 max-w-[60%] text-sm text-chalk-60">{op?.kicker ?? soiree?.kicker}</p>
        </div>

        {/* L'essentiel, à gauche du kart. */}
        <ul className="relative mt-5 grid max-w-[62%] gap-2">
          {lignes.map((l) => (
            <li key={l} className="flex items-start gap-2 text-sm leading-snug text-chalk">
              <span aria-hidden="true" className="w-5 shrink-0 text-center text-base leading-none">
                {factEmoji(l)}
              </span>
              <span>{l}</span>
            </li>
          ))}
        </ul>

        {/* Pied de carte : prix et inscription. */}
        <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="display text-xl text-chalk">{op?.price ?? soiree?.pied}</span>
          {op && !complet && inscription ? (
            <Link
              href={inscription}
              data-track={first ? "inscription-ouverture" : "course-accueil"}
              className="inline-flex min-h-11 items-center rounded-full bg-race px-5 text-sm font-bold text-white transition-colors hover:bg-race-deep"
            >
              {op.signupCta ?? "S’inscrire"}
            </Link>
          ) : op ? (
            <Link href={page} className="link-under text-sm font-semibold text-chalk-60">
              La course
            </Link>
          ) : null}
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
      className="bleed-row-mobile no-scrollbar mt-[calc(var(--section-gap)-1rem)] grid auto-cols-[85%] grid-flow-col gap-5 overflow-x-auto pb-4 snap-x snap-mandatory sm:auto-cols-[calc((100%-1.25rem)/2)] lg:auto-cols-[calc((100%-2.5rem)/3)]"
    >
      {items.map((item, i) => (
        <Carte key={item.date + (item.op ?? item.label)} item={item} today={today} first={i === 0} />
      ))}
    </div>
  );
}
