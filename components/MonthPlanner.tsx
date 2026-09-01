"use client";

import { useEffect, useMemo, useState } from "react";
import { buildCalendar, getOperation, type CalendarDay, type CalendarMonth } from "@/lib/agenda";
import { SITE } from "@/lib/site";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const WEEKDAYS_FULL = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/**
 * « Le mois en piste » — planning mensuel interactif : la transposition
 * du planning mural du circuit. Ouvert / fermé / à volonté / course en
 * un coup d'œil ; le détail du jour sélectionné s'affiche sous la grille
 * (les cases sont trop petites pour porter du texte sur mobile).
 */
export default function MonthPlanner() {
  const months = useMemo(buildCalendar, []);
  const [monthIdx, setMonthIdx] = useState(0);
  const [selected, setSelected] = useState<{ m: CalendarMonth; d: CalendarDay } | null>(null);
  const [todayIso, setTodayIso] = useState<string | null>(null);

  // Après montage (pas de mismatch SSR) : ouvre le mois du jour et le sélectionne.
  useEffect(() => {
    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setTodayIso(iso);
    const idx = months.findIndex((m) => m.days.some((d) => d.iso === iso));
    if (idx >= 0) {
      setMonthIdx(idx);
      const day = months[idx].days.find((d) => d.iso === iso)!;
      setSelected({ m: months[idx], d: day });
    }
  }, [months]);

  const month = months[monthIdx];

  return (
    <div>
      {/* Onglets mois */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choisir le mois">
        {months.map((m, i) => (
          <button
            key={m.month}
            type="button"
            role="tab"
            aria-selected={i === monthIdx}
            onClick={() => setMonthIdx(i)}
            className={`display px-4 py-2.5 text-base capitalize transition-all duration-300 ${
              i === monthIdx
                ? "glow-race bg-race text-white"
                : "bg-asphalt-3 text-chalk-60 hover:text-chalk"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Grille */}
      <div className="card mt-6 overflow-hidden !p-0">
        <div className="grid grid-cols-7 border-b border-white/10 bg-asphalt-3/60">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="py-2 text-center text-xs font-semibold uppercase tracking-widest text-chalk-60"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: month.leading }, (_, i) => (
            <div key={`v-${i}`} className="border-b border-r border-white/5" aria-hidden="true" />
          ))}
          {month.days.map((d) => {
            const isSelected = selected?.d.iso === d.iso;
            const isToday = d.iso === todayIso;
            const state = d.event
              ? d.event.toConfirm
                ? "border border-dashed border-race/60 bg-race/10"
                : "bg-race/20"
              : d.aVolonte
                ? "bg-flag/15"
                : d.open
                  ? "bg-asphalt-3/40"
                  : "opacity-30";
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => setSelected({ m: month, d })}
                aria-pressed={isSelected}
                aria-label={`${WEEKDAYS_FULL[d.weekdayIdx]} ${d.day} ${month.name}`}
                className={`relative flex min-h-16 flex-col items-start gap-1 border-b border-r border-white/5 p-1.5 text-left transition-colors duration-200 hover:bg-white/5 md:min-h-[5.5rem] md:p-2 ${state} ${
                  isSelected ? "ring-2 ring-inset ring-chalk/70" : ""
                }`}
              >
                <span
                  className={`display text-base leading-none ${
                    isToday
                      ? "bg-flag px-1.5 py-0.5 text-asphalt"
                      : d.event
                        ? "text-chalk"
                        : "text-chalk-60"
                  }`}
                >
                  {d.day}
                </span>
                {/* Libellés : masqués sur mobile (pastilles à la place) */}
                {d.event && (
                  <span className="display hidden text-xs leading-tight text-race md:block">
                    {d.event.label}
                    {d.event.toConfirm && " ?"}
                  </span>
                )}
                {!d.event && d.aVolonte && (
                  <span className="display hidden text-xs leading-tight text-flag md:block">
                    À volonté
                  </span>
                )}
                {d.promo && !d.event && !d.aVolonte && (
                  <span className="hidden text-xs leading-tight text-chalk-60 md:block">2+1</span>
                )}
                {d.ferie && (
                  <span className="hidden text-xs leading-tight text-chalk-60 md:block">Férié</span>
                )}
                {/* Pastilles mobile */}
                <span className="flex gap-1 md:hidden" aria-hidden="true">
                  {d.event && <span className="h-1.5 w-1.5 rounded-full bg-race" />}
                  {d.aVolonte && <span className="h-1.5 w-1.5 rounded-full bg-flag" />}
                  {d.promo && <span className="h-1.5 w-1.5 rounded-full bg-chalk/50" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-chalk-60">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 bg-race/60" aria-hidden="true" /> Course
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 bg-flag/60" aria-hidden="true" /> À volonté
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 bg-asphalt-3" aria-hidden="true" /> Ouvert
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 border border-white/15 opacity-40" aria-hidden="true" /> Fermé
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 border border-dashed border-race/70" aria-hidden="true" /> À confirmer
        </li>
      </ul>

      {/* Détail du jour sélectionné */}
      <div aria-live="polite" className="mt-6">
        {selected ? <DayDetail m={selected.m} d={selected.d} /> : (
          <p className="text-sm text-chalk-60">
            Touchez un jour pour voir le détail.
          </p>
        )}
      </div>
    </div>
  );
}

function DayDetail({ m, d }: { m: CalendarMonth; d: CalendarDay }) {
  const op = d.event?.op ? getOperation(d.event.op) : undefined;
  const weekday = WEEKDAYS_FULL[d.weekdayIdx];
  const dateLabel = `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${d.day} ${m.name}`;
  return (
    <div className="card relative overflow-hidden p-5 md:p-6">
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 h-full w-1 ${
          d.event ? "bg-race" : d.aVolonte ? "bg-flag" : d.open ? "bg-chalk/30" : "bg-white/10"
        }`}
      />
      <p className="display text-xl text-chalk">
        {dateLabel}
        {d.ferie && <span className="ml-2 text-base text-chalk-60">· férié ({d.ferie})</span>}
      </p>

      {d.event ? (
        <>
          <p className="mt-2 text-base leading-relaxed text-chalk">
            <span className="display text-race">{d.event.label}</span>
            {d.event.toConfirm && (
              <span className="display ml-2 border border-flag/60 px-2 py-0.5 text-xs tracking-wider text-flag">
                Date à confirmer
              </span>
            )}
          </p>
          {op && <p className="mt-2 text-sm leading-relaxed text-chalk-60">{op.summary}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {op?.price && <span className="display text-2xl text-chalk">{op.price}</span>}
            {op && (
              <a href={`#${op.slug}`} className="link-under text-sm font-semibold text-chalk">
                Voir la fiche complète
              </a>
            )}
            <a href={SITE.phoneHref} className="link-under text-sm font-semibold text-chalk">
              Réserver · {SITE.phone}
            </a>
          </div>
        </>
      ) : d.aVolonte ? (
        <>
          <p className="mt-2 text-base leading-relaxed text-chalk">
            <span className="display text-flag">Mercredi à volonté</span> — un tarif unique,
            du roulage à volonté toute la journée.
          </p>
          <p className="mt-2 text-sm text-chalk-60">
            29€ en kart enfant · 59€ en 280cc · 69€ en 390cc — sans réservation.
          </p>
        </>
      ) : d.open ? (
        <p className="mt-2 text-base leading-relaxed text-chalk-60">
          Circuit ouvert{d.vacances ? " (vacances scolaires)" : ""} — sessions sans
          réservation. Horaires du jour au{" "}
          <a href={SITE.phoneHref} className="link-under font-semibold text-chalk">
            {SITE.phone}
          </a>
          .
        </p>
      ) : (
        <p className="mt-2 text-base leading-relaxed text-chalk-60">
          Circuit fermé ce jour-là — rendez-vous mercredi ou le week-end, et tous
          les jours pendant les vacances scolaires.
        </p>
      )}
      {d.promo && (
        <p className="mt-3 text-sm text-chalk-60">
          Promo du jour : 2 tickets achetés = 1 offert.
        </p>
      )}
    </div>
  );
}
