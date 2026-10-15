"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  buildCalendar,
  getOperation,
  SHOW_PROMOS,
  type CalendarDay,
  type CalendarMonth,
} from "@/lib/agenda";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const WEEKDAYS_FULL = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/** Un seul gabarit de label ; seule la couleur change selon le type. */
const TAG_COLORS = {
  course: "bg-race text-white",
  pending: "bg-race/45 text-white",
  volonte: "bg-flag text-asphalt",
  pack: "bg-chalk text-asphalt",
  promo: "bg-promo text-white",
  ferie: "bg-asphalt-3 text-chalk-60",
} as const;
type TagKind = keyof typeof TAG_COLORS;

function Tag({ kind, children, large = false }: { kind: TagKind; children: ReactNode; large?: boolean }) {
  return (
    <span
      className={`display max-w-full truncate rounded-full leading-tight tracking-wide ${
        large ? "px-5 py-2 text-lg md:text-xl" : "px-2 py-0.5 text-xs"
      } ${TAG_COLORS[kind]}`}
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
/* Ordinateur comme mobile : la case prend la couleur de l'offre du jour (choix Benjamin 15/10). */
const OPEN_MD = "";
function cellState(d: CalendarDay) {
  if (!d.open) return "bg-black/40 text-chalk-60/40";
  if (d.event) return `${d.event.toConfirm ? "bg-race/45" : "bg-race"} text-white ${OPEN_MD}`;
  if (d.aVolonte) return `bg-flag text-asphalt ${OPEN_MD}`;
  if (d.packDecouverte) return `bg-chalk text-asphalt ${OPEN_MD}`;
  if (d.promo) return `bg-promo text-white ${OPEN_MD}`;
  return `bg-emerald-500/[0.14] text-chalk ${OPEN_MD}`;
}

type Selection = { m: CalendarMonth; d: CalendarDay } | null;

/** La grille d'un mois — utilisée dans le carrousel mobile et en mois unique sur desktop. */
function MonthGrid({
  month,
  selected,
  todayIso,
  onSelect,
  onMonth,
  hasPrev,
  hasNext,
}: {
  month: CalendarMonth;
  selected: Selection;
  todayIso: string | null;
  onSelect: (sel: Selection) => void;
  onMonth: (delta: -1 | 1) => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-asphalt-2">
      {/* Ligne d'en-tête agrandie : mois précédent / suivant, mêmes flèches que la fiche du jour. */}
      <div className="flex items-center gap-2 bg-asphalt-3/60 px-3 pt-3 text-chalk md:px-4">
        <StepButton dir={-1} onClick={() => onMonth(-1)} disabled={!hasPrev} label="Mois précédent" />
        <p className="display flex-1 text-center text-2xl capitalize leading-none md:text-3xl">{month.name}</p>
        <StepButton dir={1} onClick={() => onMonth(1)} disabled={!hasNext} label="Mois suivant" />
      </div>
      <div className="grid grid-cols-7 border-b border-white/10 bg-asphalt-3/60">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="py-3 text-center text-xs font-semibold uppercase tracking-widest text-chalk-60"
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
              className={`relative flex flex-col items-start gap-1 border-b border-r border-white/5 p-1.5 text-left transition-colors duration-200 hover:bg-white/5 md:min-h-[7.5rem] md:p-3 ${cellState(d)} ${
                todayIso && d.iso < todayIso ? "opacity-40 saturate-[0.35]" : ""
              } ${
                isSelected ? "ring-2 ring-inset ring-chalk/70" : ""
              } ${isToday ? "today-glow z-[1]" : ""}`}
            >
              <span
                className="display text-base leading-none md:text-2xl"
              >
                {d.day}
              </span>
              {/* Desktop : libellés en texte sur la case déjà colorée */}
              <span className="hidden flex-col items-start gap-0.5 text-base font-bold leading-tight md:flex lg:text-lg">
                {d.event && (
                  <span>
                    {d.event.label}
                    {d.event.toConfirm && " ?"}
                  </span>
                )}
                {d.aVolonte && <span>À volonté</span>}
                {d.packDecouverte && <span>{d.event ? "+ " : ""}Pack Découverte</span>}
                {d.promo && !d.event && !d.aVolonte && <span>2 tickets = 1 offert</span>}
                {d.ferie && <span className="font-normal opacity-80">Férié</span>}
              </span>
              {/* Horaires : compacts sur mobile (la case porte la couleur de l'offre) */}
              {d.open && d.hours && (
                <span className="whitespace-nowrap text-xs leading-none md:mt-auto md:text-base">
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
  // Tous les mois restent, septembre compris : on voit ce qui s'est déjà couru (jours passés grisés).
  const months = useMemo(buildCalendar, []);
  const [monthIdx, setMonthIdx] = useState(0);
  const [selected, setSelected] = useState<Selection>(null);
  const [todayIso, setTodayIso] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLDivElement>(null);

  // Défilement lancé par le code (ouverture, clic d'onglet) : le swipe ne doit pas
  // resynchroniser l'onglet pendant ce temps (sinon « Septembre » reste allumé sur octobre).
  const programmatic = useRef(0);
  const scrollToMonth = (idx: number, smooth: boolean) => {
    const el = scroller.current;
    if (!el) return;
    programmatic.current = Date.now() + 800;
    el.scrollTo({ left: idx * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
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

  // Jour précédent / suivant, en passant d'un mois à l'autre
  const neighbour = (delta: -1 | 1): Selection => {
    if (!selected) return null;
    const mi = months.findIndex((mm) => mm.month === selected.m.month);
    const di = months[mi].days.findIndex((dd) => dd.iso === selected.d.iso) + delta;
    if (di >= 0 && di < months[mi].days.length) return { m: months[mi], d: months[mi].days[di] };
    const m2 = months[mi + delta];
    if (!m2) return null;
    return { m: m2, d: delta > 0 ? m2.days[0] : m2.days[m2.days.length - 1] };
  };
  const step = (delta: -1 | 1) => {
    const next = neighbour(delta);
    if (!next) return;
    setSelected(next);
    const idx = months.indexOf(next.m);
    if (idx !== monthIdx) goTo(idx);
  };

  // Au doigt : la fiche est sous la grille, on l'amène à l'écran après un toucher
  const pick = (sel: Selection) => {
    setSelected(sel);
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    requestAnimationFrame(() => {
      const el = detail.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.55) {
        window.scrollTo({ top: window.scrollY + r.top - 96, behavior: "smooth" });
      }
    });
  };

  // Swipe mobile → onglet synchronisé
  const onScroll = () => {
    const el = scroller.current;
    if (!el || el.clientWidth === 0 || Date.now() < programmatic.current) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== monthIdx && idx >= 0 && idx < months.length) setMonthIdx(idx);
  };

  return (
    <div>
      {/* Onglets mois */}
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center" role="tablist" aria-label="Choisir le mois">
        {months.map((m, i) => (
          <button
            key={m.month}
            type="button"
            role="tab"
            aria-selected={i === monthIdx}
            onClick={() => goTo(i)}
            className={`display rounded-full px-6 py-3.5 text-center text-xl capitalize md:px-8 md:text-2xl transition-all duration-300 ${
              i === monthIdx
                ? "glow-race bg-race text-white"
                : "bg-asphalt-3 text-chalk-60 hover:text-chalk"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Légende, au-dessus de la grille (choix Benjamin 15/10) */}
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-lg text-chalk md:text-xl">
        <li className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-emerald-500/40" aria-hidden="true" /> Ouvert (horaires indiqués)
        </li>
        <li className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full border border-white/20 bg-black/40" aria-hidden="true" /> Fermé
        </li>
        <li><Tag large kind="course">Course</Tag></li>
        <li><Tag large kind="volonte">À volonté</Tag></li>
        <li><Tag large kind="pack">Pack Découverte</Tag></li>
        {SHOW_PROMOS && <li><Tag large kind="promo">2 tickets = 1 offert</Tag></li>}
      </ul>

      {/* Mobile : carrousel des mois, swipe gauche/droite */}
      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory overflow-x-auto md:hidden"
      >
        {months.map((m, i) => (
          <div key={m.month} className="w-full shrink-0 snap-center px-5">
            <MonthGrid
              month={m}
              selected={selected}
              todayIso={todayIso}
              onSelect={pick}
              onMonth={(delta) => goTo(i + delta)}
              hasPrev={i > 0}
              hasNext={i < months.length - 1}
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-chalk-60 md:hidden">
        Glissez vers la gauche ou la droite pour changer de mois.
      </p>

      {/* Desktop : le mois actif */}
      <div className="mt-6 hidden md:block">
        <MonthGrid
          month={months[monthIdx]}
          selected={selected}
          todayIso={todayIso}
          onSelect={pick}
          onMonth={(delta) => goTo(monthIdx + delta)}
          hasPrev={monthIdx > 0}
          hasNext={monthIdx < months.length - 1}
        />
      </div>

      {/* Détail du jour sélectionné */}
      <div ref={detail} aria-live="polite" className="mt-8">
        {selected ? (
          <DayDetail
            m={selected.m}
            d={selected.d}
            isToday={selected.d.iso === todayIso}
            isPast={!!todayIso && selected.d.iso < todayIso}
            onStep={step}
            canStep={(delta) => neighbour(delta) !== null}
          />
        ) : (
          <p className="text-center text-base text-chalk-60">
            Touchez un jour pour voir le détail.
          </p>
        )}
      </div>
    </div>
  );
}

/** Bandeau de la fiche du jour : même couleur que la case du calendrier. */
function dayHeader(d: CalendarDay): { skin: string; label: string } {
  if (d.event) return { skin: d.event.toConfirm ? "bg-race/45 text-white" : "bg-race text-white", label: "Jour de course" };
  if (d.aVolonte) return { skin: "bg-flag text-asphalt", label: "Mercredi à volonté" };
  if (d.packDecouverte) return { skin: "bg-chalk text-asphalt", label: "Pack Découverte" };
  if (d.promo) return { skin: "bg-promo text-white", label: "2 tickets = 1 offert" };
  if (d.open) return { skin: "bg-emerald-500/[0.14] text-chalk", label: "Circuit ouvert" };
  return { skin: "bg-asphalt-3 text-chalk-60", label: "Circuit fermé" };
}

function Fact({ emoji, children }: { emoji: string; children: ReactNode }) {
  return (
    <li className="flex flex-col items-center gap-3 text-center text-base leading-snug text-chalk">
      <span aria-hidden="true" className="text-5xl leading-none">
        {emoji}
      </span>
      <span className="max-w-xs">{children}</span>
    </li>
  );
}

function StepButton({
  dir,
  onClick,
  disabled,
  label,
}: {
  dir: -1 | 1;
  onClick: () => void;
  disabled: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label ?? (dir < 0 ? "Jour précédent" : "Jour suivant")}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-current/30 text-2xl leading-none transition-colors duration-200 hover:bg-black/10 disabled:opacity-30"
    >
      <span aria-hidden="true">{dir < 0 ? "‹" : "›"}</span>
    </button>
  );
}

function DayDetail({
  m,
  d,
  isToday,
  isPast,
  onStep,
  canStep,
}: {
  m: CalendarMonth;
  d: CalendarDay;
  isToday: boolean;
  isPast: boolean;
  onStep: (delta: -1 | 1) => void;
  canStep: (delta: -1 | 1) => boolean;
}) {
  const op = d.event?.op ? getOperation(d.event.op) : undefined;
  const weekday = WEEKDAYS_FULL[d.weekdayIdx];
  const { skin, label } = dayHeader(d);

  return (
    <div className="card overflow-hidden p-0">
      {/* Bandeau à la couleur de la case */}
      <div className={`flex items-center gap-2 px-4 py-4 md:px-6 ${skin}`}>
        <StepButton dir={-1} onClick={() => onStep(-1)} disabled={!canStep(-1)} />
        <div className="min-w-0 flex-1 text-center">
          <p className="text-sm font-bold uppercase tracking-wide opacity-80">
            {isToday ? "Aujourd'hui" : label}
          </p>
          <p className="display mt-1 text-3xl leading-none capitalize md:text-4xl">
            {weekday} {d.day} {m.name}
          </p>
        </div>
        <StepButton dir={1} onClick={() => onStep(1)} disabled={!canStep(1)} />
      </div>

      <div className="p-5 md:p-6">
        {d.event && (
          <div className="mb-5 text-center">
            <p className="display text-[clamp(2rem,5vw,3rem)] leading-none text-chalk">{d.event.label}</p>
            {(d.event.full || isPast) && (
              <span className="display mt-3 inline-block rounded-full bg-race px-3 py-1 text-sm tracking-wide text-white">
                {isPast ? "Course terminée" : "Complet"}
              </span>
            )}
            {d.event.toConfirm && (
              <span className="mt-3 inline-block rounded-full bg-flag px-3 py-1 text-sm font-bold text-asphalt">
                Date à confirmer
              </span>
            )}
            {op && <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-chalk-60">{op.summary}</p>}
          </div>
        )}

        {/* 3 colonnes : émoji, texte centré dessous. */}
        <ul className="grid gap-6 sm:grid-cols-3">
          {d.open && d.hours && (
            <Fact emoji="⏰">
              {d.event ? "Circuit ouvert " : "Ouvert "}
              <strong>{d.hours}</strong>
              {d.vacances ? " · vacances scolaires" : ""}
            </Fact>
          )}
          {!d.open && !d.event && <Fact emoji="🚧">Circuit fermé ce jour-là{d.ferie ? ` (${d.ferie})` : ""}.</Fact>}
          {d.ferie && d.open && <Fact emoji="🎉">Jour férié : {d.ferie}</Fact>}
          {op?.price && (
            <Fact emoji="💶">
              <strong>{op.price}</strong>
              {op.priceNote ? ` · ${op.priceNote}` : ""}
            </Fact>
          )}
          {d.event?.note && <Fact emoji="📝">{d.event.note}</Fact>}
          {d.aVolonte && (
            <Fact emoji="🔁">
              Roulage à volonté : <strong>29€</strong> enfant · <strong>59€</strong> 280cc · <strong>69€</strong> 390cc
            </Fact>
          )}
          {d.packDecouverte && (
            <Fact emoji="🎓">
              Pack Découverte {op?.endsAt ? `après la course (fin ${op.endsAt})` : ""} : 3 sessions + coaching,{" "}
              <strong>49€</strong> au lieu de 76€
            </Fact>
          )}
          {d.promo && (
            <Fact emoji="🎁">
              <strong>2 tickets achetés = 1 offert</strong>
            </Fact>
          )}
          {d.open && !d.event && <Fact emoji="🏁">Sessions sans réservation, venez directement.</Fact>}
        </ul>
      </div>
    </div>
  );
}
