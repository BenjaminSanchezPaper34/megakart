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
      {/* Le prochain rendez-vous */}
      <Link
        href={`/agenda#${next.op}`}
        className="card group relative mt-12 block overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8"
      >
        <span aria-hidden="true" className="absolute left-0 top-0 h-full w-1 bg-race" />
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <div className="[filter:drop-shadow(0_12px_12px_rgb(0_0_0/0.4))]">
            <div className="clip-race flex h-20 w-28 shrink-0 flex-col items-center justify-center bg-race text-white md:h-24 md:w-32">
              <span className="display text-4xl leading-none md:text-5xl">{nextDate.day}</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-widest">
                {nextDate.month}
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="display text-base text-flag">
              Prochain rendez-vous
              {countdown !== null && countdown > 0 && (
                <span className="text-chalk-60">
                  {" · "}
                  {countdown === 1 ? "demain" : `dans ${countdown} jours`}
                </span>
              )}
              {countdown === 0 && <span className="text-chalk-60"> · aujourd&rsquo;hui</span>}
            </p>
            <h3 className="display mt-1 text-[clamp(1.8rem,3.5vw,2.6rem)] leading-none text-chalk transition-colors duration-300 group-hover:text-race">
              {next.label}
            </h3>
          </div>
          {nextOp?.price && (
            <p className="display shrink-0 text-3xl text-chalk">{nextOp.price}</p>
          )}
        </div>
        {nextOp && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-chalk-60">
            {nextOp.summary}
          </p>
        )}
      </Link>

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
