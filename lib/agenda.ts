/**
 * Agenda de fin d'année 2026 — opérations & temps forts.
 * Source : brief communication client (août 2026) + planning mural.
 * Les entrées `status: "a-confirmer"` sont affichées avec un badge
 * et EXCLUES du JSON-LD tant que le client n'a pas confirmé.
 */

export type Operation = {
  slug: string;
  kicker: string;
  name: string;
  accent: "race" | "flag" | "chalk";
  /** Une ligne pour les listes et la home. */
  summary: string;
  /** Paragraphes de la fiche détaillée. */
  details: string[];
  /** Format, conditions, à gagner… */
  facts: string[];
  price?: string;
  priceNote?: string;
  reservation: boolean;
};

/** Les courses & trophées — chacun a son univers, ancre = slug. */
export const RACES: Operation[] = [
  {
    slug: "100-tours",
    kicker: "Endurance par équipes",
    name: "Les 100 Tours",
    accent: "race",
    summary: "Endurance adulte par équipes de 3 pilotes : relais, stratégie et 100 tours au compteur.",
    details: [
      "Le format le plus long de l'année : par équipes de 3 pilotes, vous vous relayez sur 100 tours de circuit. Gestion du trafic, régularité, choix des relais — c'est une vraie course d'endurance, chronométrée au dixième par Apex Timing.",
      "20 minutes d'essais et de qualifications pour installer la grille, puis départ lancé pour 100 tours. Le classement défile en direct sur l'écran géant.",
    ],
    facts: [
      "Équipes de 3 pilotes",
      "20 min essais + qualifications",
      "Course de 100 tours en relais",
      "Classement live Apex Timing",
    ],
    price: "59€ / pilote",
    priceNote: "soit 177€ l'équipe de 3",
    reservation: true,
  },
  {
    slug: "plein-gaz",
    kicker: "Le trophée de la Toussaint",
    name: "Trophée Plein Gaz",
    accent: "flag",
    summary: "Essais, qualifs, course et finale — avec un baptême en voiture Vortex à gagner.",
    details: [
      "Le grand rendez-vous du 1er novembre : un vrai week-end de Grand Prix condensé en une journée. 8 minutes d'essais, 8 minutes de qualifications, une course de 12 tours, puis une finale de 10 minutes entre les meilleurs.",      "Et pour le vainqueur, un prix qui ne se gagne nulle part ailleurs : un baptême à bord d'une voiture Vortex.",
    ],
    facts: [
      "8 min essais + 8 min qualifications",
      "Course de 12 tours",
      "Finale de 10 minutes",
      "À gagner : un baptême en voiture Vortex",
    ],
    price: "85€ / pilote",
    reservation: true,
  },
  {
    slug: "women-cup",
    kicker: "La course 100 % pilotes",
    name: "Women Cup",
    accent: "chalk",
    summary: "L'événement réservé aux femmes : essais, qualifications et course de 14 tours.",
    details: [
      "Une course à part entière, réservée aux femmes : 6 minutes d'essais pour prendre la piste en main, 6 minutes de qualifications pour se placer, et une course de 14 tours pour tout donner.",
      "Même circuit, mêmes machines, même chrono Apex Timing que toutes les compétitions du circuit — que la meilleure gagne.",
    ],
    facts: [
      "Réservé aux femmes",
      "6 min essais + 6 min qualifications",
      "Course de 14 tours",
      "Podium & classement Apex Timing",
    ],
    price: "48€ / pilote",
    reservation: true,
  },
  {
    slug: "course-enfant",
    kicker: "La relève en piste",
    name: "Course Enfant",
    accent: "race",
    summary: "Une vraie course pour les 7-15 ans : essais, grille de départ et podium.",
    details: [
      "Le dimanche, la piste appartient à la relève : une vraie course réservée aux enfants, avec essais, grille de départ, drapeau à damier et podium — comme les grands, chrono Apex Timing compris.",
      "Format et déroulé détaillés à l'inscription, par téléphone.",
    ],
    facts: [
      "Dès 7 ans et 1,30 m — Kart Enfant 160cc",
      "Essais + course avec grille de départ",
      "Podium & remise de prix",
    ],
    reservation: true,
  },
];

/** Les bons plans récurrents. */
export const DEALS: Operation[] = [
  {
    slug: "mercredi-a-volonte",
    kicker: "Tous les mercredis",
    name: "Mercredi à volonté",
    accent: "flag",
    summary: "Un tarif unique, du roulage à volonté toute la journée.",
    details: [
      "Chaque mercredi, on ne compte plus les sessions : un seul tarif, et vous roulez à volonté selon les conditions de l'opération.",
    ],
    facts: ["29€ en kart enfant", "59€ en 280cc", "69€ en 390cc"],
    price: "dès 29€",
    priceNote: "roulage à volonté, selon conditions",
    reservation: false,
  },
  {
    slug: "2-plus-1",
    kicker: "L'offre des vacances",
    name: "2 tickets = 1 offert",
    accent: "race",
    summary: "Deux sessions achetées, la troisième offerte — simple, lisible, imbattable.",
    details: [
      "L'offre est aussi simple que son nom : 2 tickets achetés = le 3e offert. En septembre, elle roule tous les jeudis et vendredis ; pendant les vacances scolaires de la Toussaint et de Noël, elle est valable tous les jours.",
    ],
    facts: [
      "Jeudis & vendredis de septembre",
      "Vacances de la Toussaint : du 17 octobre au 1er novembre",
      "Vacances de Noël : du 19 au 31 décembre",
    ],
    reservation: false,
  },
  {
    slug: "pack-decouverte",
    kicker: "Le dimanche, avec coaching",
    name: "Pack Découverte",
    accent: "chalk",
    summary: "3 sessions + coaching privé par un moniteur : la progression 390cc → RX250.",
    details: [
      "L'expérience qui fait vraiment progresser : entre vos sessions, un moniteur vous coache en privé — trajectoires, freinage, points de corde, positionnement sur la piste — pour améliorer vos chronos, mesurables sur Apex Timing.",
      "La progression : une première session de 8 min en 390cc, une deuxième en 390cc pour appliquer les conseils, et une troisième en RX250 16 CV pour passer le cap.",
    ],
    facts: [
      "3 sessions de 8 min : 390cc → 390cc → RX250 16 CV",
      "Coaching privé offert par un moniteur",
      "Le dimanche — dates communiquées sur place",
    ],
    price: "49€",
    priceNote: "au lieu de 76€ — coaching offert",
    reservation: true,
  },
];

export const OPERATIONS: Operation[] = [...RACES, ...DEALS];

export function getOperation(slug: string): Operation | undefined {
  return OPERATIONS.find((o) => o.slug === slug);
}

export type AgendaItem = {
  /** Date ISO (début). */
  date: string;
  /** Pour les périodes (promos vacances). */
  endDate?: string;
  /** Slug d'opération pour l'ancre & le résumé (optionnel). */
  op?: string;
  /** Libellé affiché (sinon nom de l'opération). */
  label?: string;
  status: "confirme" | "a-confirmer";
  note?: string;
};

/** Les temps forts datés, ordre chronologique. */
export const AGENDA: AgendaItem[] = [
  {
    date: "2026-09-03",
    endDate: "2026-09-25",
    op: "2-plus-1",
    label: "2 tickets = 1 offert",
    status: "confirme",
    note: "Tous les jeudis et vendredis de septembre",
  },
  { date: "2026-10-04", op: "100-tours", label: "Les 100 Tours", status: "confirme" },
  { date: "2026-10-11", op: "course-enfant", label: "Course Enfant", status: "confirme" },
  {
    date: "2026-10-17",
    endDate: "2026-11-01",
    op: "2-plus-1",
    label: "2 tickets = 1 offert",
    status: "confirme",
    note: "Tous les jours pendant les vacances de la Toussaint",
  },
  { date: "2026-11-01", op: "plein-gaz", label: "Trophée Plein Gaz", status: "confirme" },
  { date: "2026-11-08", op: "course-enfant", label: "Course Enfant", status: "a-confirmer" },
  { date: "2026-11-21", op: "women-cup", label: "Women Cup", status: "confirme" },
  {
    date: "2026-12-06",
    label: "Course adulte",
    status: "a-confirmer",
    note: "Format en cours de calage",
  },
  { date: "2026-12-13", op: "course-enfant", label: "Course Enfant", status: "a-confirmer" },
  {
    date: "2026-12-19",
    endDate: "2026-12-31",
    op: "2-plus-1",
    label: "2 tickets = 1 offert",
    status: "confirme",
    note: "Tous les jours pendant les vacances de Noël",
  },
];

/**
 * Les promos datées (2 tickets = 1 offert) restent masquées tant que le
 * client n'a pas validé leur annonce publique — risque que la clientèle
 * décale sa venue vers les jours les moins chers. Passer à true après accord.
 */
export const SHOW_PROMOS = false;

const MONTHS_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const MONTHS_FULL = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

/** "2026-10-04" → { day: "4", month: "oct.", weekday: "dimanche" } — sans dépendre de l'ICU. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return {
    day: String(d),
    month: MONTHS_SHORT[m - 1],
    weekday: DAYS[date.getUTCDay()],
  };
}

/* ============================================================
   Calendrier mensuel « Le mois en piste »
   ============================================================ */

/** Vacances scolaires Zone C (Montpellier) sur la période couverte. */
const VACANCES: [string, string][] = [
  ["2026-10-17", "2026-11-01"],
  ["2026-12-19", "2026-12-31"],
];

const FERIES: Record<string, string> = {
  "2026-11-01": "Toussaint",
  "2026-11-11": "Armistice 1918",
  "2026-12-25": "Noël",
};

/** Mercredis à volonté relevés sur le planning mural du client. */
const A_VOLONTE_FROM = "2026-09-16";
const A_VOLONTE_TO = "2026-12-30";

/**
 * Jours d'ouverture hors saison — HYPOTHÈSE À VALIDER PAR LE CLIENT :
 * septembre du mercredi au dimanche, ensuite mercredi + week-end,
 * et tous les jours pendant les vacances scolaires.
 */
function isOpen(iso: string, weekdayIdx: number, vacances: boolean): boolean {
  if (vacances) return true;
  if (iso < "2026-10-01") return weekdayIdx >= 2; // mer → dim
  return weekdayIdx === 2 || weekdayIdx >= 5; // mer, sam, dim
}

export type CalendarDay = {
  iso: string;
  day: number;
  /** 0 = lundi … 6 = dimanche */
  weekdayIdx: number;
  open: boolean;
  vacances: boolean;
  aVolonte: boolean;
  promo: boolean;
  ferie?: string;
  event?: { label: string; op?: string; toConfirm: boolean };
};

export type CalendarMonth = {
  year: number;
  /** 1-12 */
  month: number;
  name: string;
  /** Cases vides avant le 1er (grille lundi → dimanche). */
  leading: number;
  days: CalendarDay[];
};

const inRange = (iso: string, [a, b]: [string, string]) => iso >= a && iso <= b;

/** Grille septembre → décembre 2026, dérivée des règles ci-dessus. */
export function buildCalendar(): CalendarMonth[] {
  const events = new Map(
    AGENDA.filter((a) => !a.endDate).map((a) => [
      a.date,
      { label: a.label ?? getOperation(a.op ?? "")?.name ?? "", op: a.op, toConfirm: a.status === "a-confirmer" },
    ])
  );
  const promoRanges = AGENDA.filter((a) => a.endDate).map(
    (a) => [a.date, a.endDate!] as [string, string]
  );

  return [9, 10, 11, 12].map((month) => {
    const year = 2026;
    const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const days: CalendarDay[] = [];
    for (let day = 1; day <= count; day++) {
      const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const weekdayIdx = (new Date(Date.UTC(year, month - 1, day)).getUTCDay() + 6) % 7;
      const vacances = VACANCES.some((r) => inRange(iso, r));
      const event = events.get(iso);
      const aVolonte = weekdayIdx === 2 && iso >= A_VOLONTE_FROM && iso <= A_VOLONTE_TO;
      days.push({
        iso,
        day,
        weekdayIdx,
        open: isOpen(iso, weekdayIdx, vacances) || Boolean(event) || aVolonte,
        vacances,
        aVolonte,
        // En septembre la promo ne court que jeudi/vendredi ; en vacances, tous les jours.
        promo:
          SHOW_PROMOS &&
          promoRanges.some((r) => inRange(iso, r)) &&
          (vacances || weekdayIdx === 3 || weekdayIdx === 4),
        ferie: FERIES[iso],
        event,
      });
    }
    return { year, month, name: MONTHS_FULL[month - 1], leading: days[0].weekdayIdx, days };
  });
}
