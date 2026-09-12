"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const upcoming: AgendaItem[] = (today ? DATED.filter((a) => a.date >= today) : DATED).slice(0, 4);
  if (upcoming.length === 0) return null;

  const [next, ...rest] = upcoming;
  const nextOp = getOperation(next.op!);
  const nextDate = formatDate(next.date);
  const countdown = today ? daysUntil(next.date, today) : null;

  return (
    <>
      {/* Le prochain rendez-vous — pensé pour le pouce d'abord : une ligne
          d'en-tête, la date en toutes lettres, le titre pleine largeur, un
          bouton pleine largeur. La tuile rouge et le prix en colonne ne
          reviennent qu'à partir de la tablette, où la place existe. */}
      <article className="card relative mt-10 overflow-hidden p-5 sm:p-6 md:mt-12 md:p-8">
        <span aria-hidden="true" className="absolute left-0 top-0 h-full w-1 bg-race" />

        <div className="flex items-center justify-between gap-3">
          <p className="display text-sm text-flag sm:text-base">Prochain rendez-vous</p>
          {countdown !== null && countdown >= 0 && (
            <p className="display shrink-0 border border-white/20 px-2 py-0.5 text-xs uppercase tracking-wide text-chalk-60 sm:text-sm">
              {countdown === 0 ? "Aujourd\u2019hui" : countdown === 1 ? "Demain" : `Dans ${countdown} jours`}
            </p>
          )}
        </div>

        <div className="mt-4 md:flex md:items-center md:gap-8">
          {/* Tuile date : tablette et plus */}
          <div className="hidden md:block md:[filter:drop-shadow(0_12px_12px_rgb(0_0_0/0.4))]">
            <div className="clip-race flex h-24 w-32 shrink-0 flex-col items-center justify-center bg-race text-white">
              <span className="display text-5xl leading-none">{nextDate.day}</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-widest">{nextDate.month}</span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            {/* Date en toutes lettres : mobile seulement */}
            <p className="display text-xl text-race md:hidden">
              {nextDate.weekday.charAt(0).toUpperCase() + nextDate.weekday.slice(1)} {nextDate.day} {nextDate.month}
            </p>
            <h3 className="display mt-1 text-[clamp(2.1rem,9vw,2.8rem)] leading-none text-chalk md:mt-0">
              <Link
                href={`/agenda#${next.op}`}
                data-track="prochain-rendez-vous"
                className="transition-colors duration-300 hover:text-race"
              >
                {next.label}
              </Link>
            </h3>
            {nextOp?.price && (
              <p className="display mt-2 text-xl text-chalk md:hidden">
                {nextOp.price}
                {nextOp.priceNote && <span className="text-chalk-60"> · {nextOp.priceNote}</span>}
              </p>
            )}
            {nextOp && (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-chalk-60">{nextOp.summary}</p>
            )}
          </div>

          {nextOp?.price && (
            <p className="display hidden shrink-0 text-right text-3xl text-chalk md:block">
              {nextOp.price}
              {nextOp.priceNote && (
                <span className="mt-1 block text-sm font-normal text-chalk-60">{nextOp.priceNote}</span>
              )}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          {nextOp?.signup ? (
            <Link
              href={nextOp.signup}
              data-track="inscription-ouverture"
              className="btn btn-race glow-race w-full justify-center sm:w-auto"
            >
              Inscrire mon équipe
            </Link>
          ) : (
            <Link href={`/agenda#${next.op}`} className="btn btn-race w-full justify-center sm:w-auto">
              Voir la course
            </Link>
          )}
          <Link href={`/agenda#${next.op}`} className="link-under self-start text-base font-semibold text-chalk">
            Le détail dans l&rsquo;agenda
          </Link>
        </div>
      </article>

      {/* Les suivants */}
      {rest.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {rest.map((item) => {
            const f = formatDate(item.date);
            const op = getOperation(item.op!);
            return (
              <Link
                key={item.date + item.label}
                href={`/agenda#${item.op}`}
                className="card group flex items-center gap-5 p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="[filter:drop-shadow(0_10px_10px_rgb(0_0_0/0.35))]">
                  <div className="clip-race flex h-16 w-24 shrink-0 flex-col items-center justify-center bg-asphalt-3 text-chalk">
                    <span className="display text-3xl leading-none">{f.day}</span>
                    <span className="mt-0.5 text-xs font-semibold uppercase tracking-widest">
                      {f.month}
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="display text-xl text-chalk transition-colors duration-300 group-hover:text-race">
                    {item.label}
                  </h3>
                  {op?.price && <p className="mt-0.5 text-sm text-chalk-60">{op.price}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
