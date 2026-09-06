"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { buildCalendar, getOperation, type CalendarDay, type CalendarMonth } from "@/lib/agenda";
import { SITE } from "@/lib/site";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const WEEKDAYS_FULL = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/** Un seul gabarit de label ; seule la couleur change selon le type. */
const TAG_COLORS = {
  course: "bg-race text-white",
  pending: "bg-race/45 text-white",
  volonte: "bg-flag text-asphalt",
  pack: "bg-chalk text-asphalt",
  promo: "bg-[#2e7cf6] text-white",
  ferie: "bg-asphalt-3 text-chalk-60",
} as const;
type TagKind = keyof typeof TAG_COLORS;

function Tag({ kind, children }: { kind: TagKind; children: ReactNode }) {
  return (
    <span
      className={`display max-w-full truncate px-1.5 py-0.5 text-xs leading-tight tracking-wide ${TAG_COLORS[kind]}`}
    >
      {children}
    </span>
  );
}

/** « 14h – 19h » → « 14–19 », « 14h – minuit » → « 14–00 » (cases mobiles, une ligne). */
function compactHours(hours: string) {
  return hours.replace("minuit", "00").replace(/h\s*–\s*/, "–").replace(/h$/, "");
}

/** Couleur de case : mobile = couleur de l'offre ; desktop = vert « ouvert » + labels. */
const OPEN_MD =
  "md:bg-emerald-500/[0.14] md:text-chalk md:shadow-[inset_0_0_0_1px_rgb(52_211_153/0.18)]";
function cellState(d: CalendarDay) {
  if (!d.open) return "bg-black/40 text-chalk-60/40";
  if (d.event) return `${d.event.toConfirm ? "bg-race/45" : "bg-race"} text-white ${OPEN_MD}`;
  if (d.aVolonte) return `bg-flag text-asphalt ${OPEN_MD}`;
  if (d.packDecouverte) return `bg-chalk text-asphalt ${OPEN_MD}`;
  if (d.promo) return `bg-[#2e7cf6] text-white ${OPEN_MD}`;
  return `bg-emerald-500/[0.14] text-chalk ${OPEN_MD}`;
}

type Selection = { m: CalendarMonth; d: CalendarDay } | null;

/** La grille d'un mois — utilisée dans le carrousel mobile et en mois unique sur desktop. */
function MonthGrid({
  month,
  selected,
  todayIso,
  onSelect,
}: {
  month: CalendarMonth;
  selected: Selection;
  todayIso: string | null;
  onSelect: (sel: Selection) => void;
}) {
  return (
    <div className="card overflow-hidden !p-0">
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
          return (
            <button
              key={d.iso}
              type="button"
              onClick={() => onSelect({ m: month, d })}
              aria-pressed={isSelected}
              aria-label={`${WEEKDAYS_FULL[d.weekdayIdx]} ${d.day} ${month.name}`}
              className={`relative flex flex-col items-start gap-1 border-b border-r border-white/5 p-1.5 text-left transition-colors duration-200 hover:bg-white/5 md:min-h-[5.5rem] md:p-2 ${cellState(d)} ${
                isSelected ? "ring-2 ring-inset ring-chalk/70" : ""
              }`}
            >
              <span
                className={`display text-base leading-none ${
                  isToday ? "bg-flag px-1.5 py-0.5 text-asphalt md:ring-1 md:ring-asphalt/40" : ""
                }`}
              >
                {d.day}
              </span>
              {/* Desktop : labels en chips (la case est verte) */}
              <span className="hidden flex-col items-start gap-1 md:flex">
                {d.event && (
                  <Tag kind={d.event.toConfirm ? "pending" : "course"}>
                    {d.event.label}
                    {d.event.toConfirm && " ?"}
                  </Tag>
                )}
                {d.aVolonte && <Tag kind="volonte">À volonté</Tag>}
                {d.packDecouverte && !d.event && <Tag kind="pack">Pack Découverte</Tag>}
                {d.promo && !d.event && !d.aVolonte && <Tag kind="promo">2 tickets = 1 offert</Tag>}
                {d.ferie && <Tag kind="ferie">Férié</Tag>}
              </span>
              {/* Horaires : compacts sur mobile (la case porte la couleur de l'offre) */}
              {d.open && d.hours && (
                <span className="whitespace-nowrap text-xs leading-none md:mt-auto">
                  <span className="md:hidden">{compactHours(d.hours)}</span>
                  <span className="hidden md:inline">{d.hours}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * « Le mois en piste » — planning mensuel interactif : la transposition
 * du planning mural du circuit. Sur mobile, les mois défilent au swipe
 * (carrousel à snap) ; sur desktop, onglets + mois unique. Le détail du
 * jour sélectionné s'affiche sous la grille.
 */
export default function MonthPlanner() {
  const months = useMemo(buildCalendar, []);
  const [monthIdx, setMonthIdx] = useState(0);
  const [selected, setSelected] = useState<Selection>(null);
  const [todayIso, setTodayIso] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const scrollToMonth = (idx: number, smooth: boolean) => {
    const el = scroller.current;
    if (el) el.scrollTo({ left: idx * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  // Après montage (pas de mismatch SSR) : ouvre le mois du jour et le sélectionne.
  useEffect(() => {
    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setTodayIso(iso);
    const idx = months.findIndex((m) => m.days.some((d) => d.iso === iso));
    if (idx >= 0) {
      setMonthIdx(idx);
      scrollToMonth(idx, false);
      const day = months[idx].days.find((d) => d.iso === iso)!;
      setSelected({ m: months[idx], d: day });
    }
  }, [months]);

  const goTo = (idx: number) => {
    setMonthIdx(idx);
    scrollToMonth(idx, true);
  };

  // Swipe mobile → onglet synchronisé
  const onScroll = () => {
    const el = scroller.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== monthIdx && idx >= 0 && idx < months.length) setMonthIdx(idx);
  };

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
            onClick={() => goTo(i)}
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

      {/* Mobile : carrousel des mois, swipe gauche/droite */}
      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory overflow-x-auto md:hidden"
      >
        {months.map((m) => (
          <div key={m.month} className="w-full shrink-0 snap-center px-5">
            <MonthGrid month={m} selected={selected} todayIso={todayIso} onSelect={setSelected} />
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-chalk-60 md:hidden">
        Glissez vers la gauche ou la droite pour changer de mois.
      </p>

      {/* Desktop : le mois actif */}
      <div className="mt-6 hidden md:block">
        <MonthGrid
          month={months[monthIdx]}
          selected={selected}
          todayIso={todayIso}
          onSelect={setSelected}
        />
      </div>

      {/* Légende */}
      <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-chalk-60">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 bg-emerald-500/40" aria-hidden="true" /> Ouvert (horaires indiqués)
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 border border-white/10 bg-black/40" aria-hidden="true" /> Fermé
        </li>
        <li><Tag kind="course">Course</Tag></li>
        <li><Tag kind="volonte">À volonté</Tag></li>
        <li><Tag kind="pack">Pack Découverte</Tag></li>
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
          {d.event.note && <p className="mt-2 text-sm leading-relaxed text-chalk-60">{d.event.note}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {op?.price && <span className="display text-2xl text-chalk">{op.price}</span>}
            {op && (
              <a href={`#${op.slug}`} className="link-under text-sm font-semibold text-chalk">
                Voir la fiche complète
              </a>
            )}
            {op && (
              <a href={SITE.phoneHref} className="link-under text-sm font-semibold text-chalk">
                Réserver · {SITE.phone}
              </a>
            )}
            {op && SITE.email && (
              <a href={`mailto:${SITE.email}`} className="link-under text-sm font-semibold text-chalk">
                Réserver par e-mail
              </a>
            )}
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
          Circuit ouvert {d.hours}{d.vacances ? " (vacances scolaires)" : ""} —
          sessions sans réservation. Une question ?{" "}
          <a href={SITE.phoneHref} className="link-under font-semibold text-chalk">
            {SITE.phone}
          </a>
          .
        </p>
      ) : (
        <p className="mt-2 text-base leading-relaxed text-chalk-60">
          Circuit fermé ce jour-là.
        </p>
      )}
      {d.packDecouverte && (
        <p className="mt-3 text-sm leading-relaxed text-chalk-60">
          <span className="display text-chalk">Pack Découverte</span> ce dimanche : 3 sessions
          + coaching privé offert, 49€ au lieu de 76€ —{" "}
          <a href="#pack-decouverte" className="link-under font-semibold text-chalk">
            la fiche
          </a>
          .
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
