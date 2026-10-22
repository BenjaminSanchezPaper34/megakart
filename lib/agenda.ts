import { isFermetureHebdo } from "./hours";
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
  /**
   * L'essentiel pour choisir en un coup d'œil (carte course, accueil et agenda) :
   * 3 lignes courtes — horaire, public, format. Ne rien y mettre qui ne soit confirmé.
   */
  essentiel?: string[];
  /** Coupe du nom sur mobile (cartes bons plans) : une entrée par ligne. */
  nameLines?: string[];
  price?: string;
  /** Heure de fin annoncée, quand elle est connue (ex. « 15h30 »). */
  endsAt?: string;
  /** Prix numérique pour le JSON-LD (Offer). */
  priceValue?: number;
  /** Page dédiée (quand l'opération en a une). */
  page?: string;
  priceNote?: string;
  reservation: boolean;
  /** Formulaire d'inscription en ligne (quand l'opération en a un). */
  signup?: string;
  /** Libellé du bouton — « Inscrire mon équipe » par défaut. */
  signupCta?: string;
  /**
   * Affiche officielle de l'épreuve (le post réseau social, format portrait),
   * montrée sur la fiche agenda et la page d'inscription quand elle existe.
   */
  affiche?: { src: string; width: number; height: number };
};

/** Les courses & trophées — chacun a son univers, ancre = slug. */
export const RACES: Operation[] = [
  {
    slug: "100-tours",
    // Affiche sans date (date du 18/10 effacée le 15/10) : valable pour toutes les éditions.
    affiche: { src: "/images/popup/100-tours-sans-date.jpg", width: 1440, height: 1920 },
    kicker: "Endurance par équipes",
    name: "Les 100 Tours",
    accent: "race",
    summary: "Endurance adulte en relais sur les nouveaux Sodi RT10 390cc : équipes de 2 ou 3 pilotes, 100 tours au compteur.",
    details: [
      "Le format le plus long de l'année, et il se court sur les nouveaux Sodi RT10 390cc : vous montez une équipe de deux ou trois pilotes et vous vous relayez sur 100 tours de circuit. Gestion du trafic, régularité, choix des relais — une vraie course d'endurance, chronométrée au dixième par Apex Timing.",
      "Rendez-vous à 10h, premiers tours de roue à 10h15 : 20 minutes d'essais et de qualifications pour installer la grille, puis départ lancé pour 100 tours. Le classement défile en direct sur l'écran géant.",
      "Le tarif suit l'équipe, pas le nombre de pilotes : 177€ à trois, soit 59€ chacun ; 176€ à deux, soit 88€ chacun. À deux, on partage la même course en deux relais plus longs.",
      "La course est terminée à 15h30 : l'après-midi reste ouvert. Hors vacances scolaires, le Pack Découverte du dimanche s'enchaîne pour ceux qui veulent prolonger avec un moniteur.",
    ],
    facts: [
      "Rendez-vous à 10h, roulage dès 10h15",
      "Sur les nouveaux Sodi RT10 390cc",
      "Équipes de 2 ou 3 pilotes",
      "20 min essais + qualifications",
      "Course de 100 tours en relais",
      "Terminé à 15h30 — l'après-midi reste ouvert",
      "Classement live Apex Timing",
    ],
    price: "59€ / pilote",
    endsAt: "15h30",
    priceValue: 59,
    priceNote: "en équipe de 3 — 88€ en équipe de 2",
    reservation: true,
    signup: "/inscription/100-tours",
    essentiel: ["Rendez-vous à 10h, départ à 10h15", "Équipes de 2 ou 3 pilotes", "100 tours en relais, Sodi RT10 390cc"],
  },
  {
    slug: "plein-gaz",
    kicker: "Le grand trophée d'automne",
    name: "Trophée Plein Gaz",
    accent: "flag",
    summary: "Essais, qualifs, course et finale — avec un baptême en voiture Vortex à gagner.",
    details: [
      "Le grand rendez-vous du 15 novembre : un vrai week-end de Grand Prix condensé en une journée. 8 minutes d'essais, 8 minutes de qualifications, une course de 12 tours, puis une finale de 10 minutes entre les meilleurs.",      "Et pour le vainqueur, un prix qui ne se gagne nulle part ailleurs : un baptême à bord d'une voiture Vortex. Rendez-vous à 14h, ouvert dès 15 ans.",
    ],
    facts: [
      "8 min essais + 8 min qualifications",
      "Course de 12 tours",
      "Finale de 10 minutes",
      "À gagner : un baptême en voiture Vortex",
      "Début à 14h · dès 15 ans",
    ],
    price: "85€ / pilote",
    priceValue: 85,
    reservation: true,
    signup: "/inscription/plein-gaz",
    essentiel: ["Rendez-vous à 14h, dès 15 ans", "Essais, qualifs et course de 12 tours", "À gagner : un baptême en voiture Vortex"],
    signupCta: "Inscrire mes pilotes",
  },
  {
    slug: "course-enfant",
    affiche: { src: "/images/popup/course-enfant-sans-date.jpg", width: 2250, height: 3000 },
    kicker: "La relève en piste",
    // Renommée « Journée des enfants » le 22/10 (Lucas et Emma, groupe WhatsApp du 21/10 ; affiche du 8/11).
    name: "Journée des enfants",
    accent: "race",
    summary: "Une journée rien que pour les 8-14 ans en Kart Enfant : chronos, manches et podium.",
    details: [
      "Le dimanche, la piste appartient à la relève : une journée rien qu'aux enfants, avec essais, grille de départ, drapeau à damier et podium — comme les grands, chrono Apex Timing compris.",
      "Trois manches de 8 minutes en Kart Enfant 160cc — pas d'endurance, du rythme et des départs. Rendez-vous à 14h, casque fourni, baskets obligatoires.",
      "Ouvert de 8 à 14 ans, à partir de 1,40 m : c'est la taille qui permet d'atteindre les pédales du Kart Enfant en toute sécurité.",
    ],
    facts: [
      "De 8 à 14 ans, 1,40 m minimum",
      "Kart Enfant 160cc",
      "3 manches de 8 minutes",
      "Début à 14h",
      "Podium & remise de prix",
    ],
    price: "32€ / enfant",
    priceValue: 32,
    reservation: true,
    signup: "/inscription/course-enfant",
    essentiel: ["De 8 à 14 ans, 1,40 m minimum", "Rendez-vous à 14h", "3 manches de 8 min en Kart Enfant 160cc"],
    signupCta: "Inscrire mon enfant",
  },

  {
    slug: "12-heures",
    kicker: "L'endurance de fin d'année, avec Vortex",
    name: "Les 12 Heures",
    accent: "flag",
    affiche: { src: "/images/popup/12-heures.jpg", width: 1500, height: 2000 },
    summary: "Douze heures d'endurance par équipes, de midi à minuit, coorganisées avec l'écurie Vortex. 15 équipes maximum.",
    details: [
      "Le plus grand format jamais couru sur le circuit : douze heures de relais par équipes de 2 à 6 pilotes, de midi à minuit, sur les 1000 m de Vias-plage. L'écurie Vortex et son équipe technique coorganisent l'épreuve avec l'équipe MegaKart.",
      "Un ravitaillement imposé par heure, et à chaque ravitaillement l'équipe repart sur un autre kart : personne ne garde « le bon » toute la journée. Accueil à 10h, essais et qualifications à 10h30 ; un grand hangar chauffé avec écran et restauration, un espace par équipe, repas des pilotes compris. Ouvert dès 14 ans, tout se règle sur place.",
      "Pour l'équipe gagnante, une énorme coupe et un baptême en voiture Vortex ; d'autres lots sont à gagner.",
    ],
    facts: [
      "12 heures, de midi à minuit",
      "Équipes de 2 à 6 pilotes",
      "Changement de kart à chaque ravitaillement",
      "Repas pilotes compris, espace chauffé par équipe",
      "Dès 14 ans, règlement sur place",
      "15 équipes maximum",
      "À gagner : une énorme coupe et un baptême en Vortex",
    ],
    price: "1 500€ / équipe",
    priceValue: 1500,
    page: "/12-heures",
    signup: "/12-heures#formulaire",
    essentiel: ["De midi à minuit", "Équipes de 2 à 6 pilotes, dès 14 ans", "Repas pilotes compris, 15 équipes max"],
    reservation: true,
  },
];

/** Les bons plans récurrents. */
export const DEALS: Operation[] = [
  {
    slug: "mercredi-a-volonte",
    kicker: "Les mercredis hors vacances",
    name: "Mercredi à volonté",
    nameLines: ["Mercredi", "à volonté"],
    accent: "flag",
    summary: "Un tarif unique, du roulage à volonté toute la journée.",
    details: [
      "Chaque mercredi hors vacances scolaires, jusqu'en décembre, on ne compte plus les sessions : un seul tarif, et vous roulez à volonté selon les conditions de l'opération.",
      "Pendant les vacances de la Toussaint et de Noël, c'est l'offre 2 tickets = 1 offert qui prend le relais, tous les jours.",
    ],
    facts: [
      "29€ en kart enfant",
      "59€ en 280cc",
      "69€ en 390cc",
      "Hors vacances scolaires",
    ],
    price: "dès 29€",
    priceNote: "roulage à volonté, selon conditions",
    reservation: false,
  },
  {
    slug: "2-plus-1",
    kicker: "Jeudis, vendredis & vacances",
    name: "2 tickets = 1 offert",
    nameLines: ["2 tickets", "= 1 offert"],
    accent: "race",
    summary: "Deux sessions achetées, la troisième offerte, de quoi s'entraîner.",
    // Conditions calées sur le gabarit du mercredi : 2 paragraphes courts + 4 faits.
    details: [
      "Deux tickets achetés, le troisième offert : de quoi enchaîner les sessions et faire tomber le chrono, sans réservation.",
      "Tous les jeudis et vendredis jusqu'au 31 décembre, et tous les jours pendant les vacances scolaires, mercredis compris.",
    ],
    facts: [
      "Jeudis et vendredis",
      "Tous les jours en vacances",
      "Toussaint : 17–31 octobre",
      "Noël : 19–31 décembre",
    ],
    reservation: false,
  },
  {
    slug: "pack-decouverte",
    kicker: "Le dimanche, avec coaching",
    name: "Pack Découverte",
    nameLines: ["Pack", "Découverte"],
    accent: "chalk",
    summary: "3 sessions + coaching privé par un moniteur : la progression 390cc → RX250.",
    details: [
      "Trois sessions de 8 min et, entre chacune, un moniteur qui vous coache en privé : trajectoires, freinage, points de corde, chronos Apex à l'appui.",
      "Les dimanches hors vacances scolaires, jusqu'en décembre. Pendant les vacances, l'offre 2 tickets = 1 offert prend le relais.",
    ],
    facts: [
      "2 sessions en 390cc",
      "1 session en RX250 16 CV",
      "Coaching privé offert",
      "Hors vacances scolaires",
    ],
    price: "49€",
    priceValue: 49,
    priceNote: "au lieu de 76€ — coaching offert",
    reservation: true,
  },
];

export const OPERATIONS: Operation[] = [...RACES, ...DEALS];

/**
 * Affiche à montrer pour une opération : celle de la date donnée si elle en a
 * une (visuel daté), sinon celle de la prochaine date qui en a une, sinon
 * l'affiche générale de l'opération.
 */
export function afficheDe(op: Operation, date?: string, today = new Date().toISOString().slice(0, 10)) {
  const dates = AGENDA.filter((a) => a.op === op.slug && a.affiche);
  const exacte = date ? dates.find((a) => a.date === date) : undefined;
  if (date) return exacte?.affiche ?? op.affiche;
  const prochaine = dates.filter((a) => a.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
  return prochaine?.affiche ?? op.affiche;
}

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
  /** Places (équipages) encore libres, affiché « plus que N équipes » quand renseigné ; 0 = complet. */
  places?: number;
  /** Annonce courte affichée sur la date (agenda, page d'inscription). */
  badge?: string;
  /** Affiche propre à cette date (visuel daté) ; sinon celle de l'opération. */
  affiche?: { src: string; width: number; height: number };
};

/** Les temps forts datés, ordre chronologique. */
export const AGENDA: AgendaItem[] = [
  {
    date: "2026-09-17",
    endDate: "2026-12-31",
    op: "2-plus-1",
    label: "2 tickets = 1 offert",
    status: "confirme",
    note: "Tous les jeudis et vendredis jusqu'au 31 décembre, et tous les jours pendant les vacances scolaires",
  },
  { date: "2026-10-11", op: "course-enfant", label: "Course Enfants", status: "confirme" },
  // Reportée du 4 au 18 octobre (client, 15/09/2026) — donc pendant les
  // vacances de la Toussaint : ce jour-là le Pack Découverte ne court pas.
  { date: "2026-10-18", op: "100-tours", label: "Les 100 Tours", status: "confirme", places: 0 }, // Emma, 14/10 : complet
  {
    date: "2026-10-31",
    label: "Nocturne Halloween",
    status: "confirme",
    note: "Ouvert de 14 h à minuit — sessions sans réservation",
  },
  {
    date: "2026-11-08",
    op: "course-enfant",
    label: "Journée des enfants",
    status: "confirme",
    affiche: { src: "/images/popup/journee-enfants-2026-11-08-v2.jpg", width: 1500, height: 2000 },
  },
  { date: "2026-11-15", op: "plein-gaz", label: "Trophée Plein Gaz", status: "confirme" }, // reporté du 1/11 (Benjamin, 14/10)
  { date: "2026-12-06", op: "100-tours", label: "Les 100 Tours", status: "confirme" },
  {
    date: "2026-12-13",
    op: "course-enfant",
    label: "Journée des enfants",
    status: "confirme",
    affiche: { src: "/images/popup/journee-enfants-2026-12-13.jpg", width: 1500, height: 2000 },
  },
  { date: "2026-12-19", op: "12-heures", label: "Les 12 Heures", status: "confirme" },
];

/**
 * Dates encore ouvertes à l'inscription pour une épreuve : confirmées, à venir,
 * pas complètes (`places: 0`). Source unique pour les formulaires, la route API,
 * les boutons de l'agenda et de l'accueil : complet ou passé = plus de formulaire.
 */
export function datesOuvertes(slug: string, today = new Date()): AgendaItem[] {
  const iso = today.toISOString().slice(0, 10);
  return AGENDA.filter(
    (a) => a.op === slug && a.status === "confirme" && !a.endDate && a.date >= iso && a.places !== 0
  );
}

/** Page d'une course : sa page dédiée, sinon sa page d'inscription (qui la présente). */
export function pageCourse(op: Operation): string {
  return op.page ?? op.signup?.split("#")[0] ?? `/agenda#${op.slug}`;
}

/** Lien direct vers le formulaire, date déjà cochée quand le formulaire la propose. */
export function lienInscription(op: Operation, iso?: string): string | undefined {
  if (!op.signup) return undefined;
  const [path] = op.signup.split("#");
  return iso && path.startsWith("/inscription/") ? `${path}?date=${iso}#formulaire` : `${path}#formulaire`;
}

export function inscriptionOuverte(slug: string, today = new Date()): boolean {
  return datesOuvertes(slug, today).length > 0;
}

/**
 * Affichage des promos datées (2 tickets = 1 offert). Activé le 06/09/2026
 * après la réunion client du 03/09 (le gérant veut les mettre en avant).
 * Repasser à false pour tout masquer d'un coup si besoin.
 */
export const SHOW_PROMOS = true;

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
    monthFull: MONTHS_FULL[m - 1],
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

/** Horaires hors saison (fiche Google) et exceptions datées. */
const DEFAULT_HOURS = "14h – 19h";
const SPECIAL_HOURS: Record<string, string> = {
  "2026-10-31": "14h – minuit",
};

/**
 * Mercredis à volonté relevés sur le planning mural du client.
 * Le planning annonçait le 9 septembre, mais l'opération n'a pas été tenue
 * ce jour-là (ni le 2+1 des 10 et 11) : le calendrier part du premier
 * mercredi réellement couru. Confirmé par le client le 12/09/2026.
 */
const A_VOLONTE_FROM = "2026-09-16";
const A_VOLONTE_TO = "2026-12-30";
/**
 * Une seule opération par jour : pendant les vacances scolaires, le 2+1
 * couvre tous les jours et le mercredi à volonté s'efface (règle Benjamin,
 * 12/09/2026). Idem pour le Pack Découverte du dimanche, plus bas.
 */

/** Pack Découverte : les dimanches hors vacances scolaires, jusqu'en décembre. */
const PACK_FROM = "2026-09-06";
const PACK_TO = "2026-12-27";

/**
 * Jours d'ouverture hors saison : tous les jours, 14 h – 19 h, sauf la
 * fermeture lundi + mardi d'octobre hors vacances (règle dans lib/hours.ts).
 */
function isOpen(iso: string, weekdayIdx: number): boolean {
  return !isFermetureHebdo(iso, (weekdayIdx + 1) % 7);
}

export type CalendarDay = {
  iso: string;
  day: number;
  /** 0 = lundi … 6 = dimanche */
  weekdayIdx: number;
  open: boolean;
  /** Horaires du jour, affichés dans la case (ex. « 14h – 19h »). */
  hours?: string;
  vacances: boolean;
  aVolonte: boolean;
  promo: boolean;
  ferie?: string;
  event?: { label: string; op?: string; toConfirm: boolean; full: boolean; note?: string };
  /** Pack Découverte (coaching) proposé ce jour — tous les dimanches jusqu'en décembre. */
  packDecouverte: boolean;
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
      {
        label: a.label ?? getOperation(a.op ?? "")?.name ?? "",
        op: a.op,
        toConfirm: a.status === "a-confirmer",
        full: a.places === 0,
        note: a.note,
      },
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
      const aVolonte =
        weekdayIdx === 2 && !vacances && iso >= A_VOLONTE_FROM && iso <= A_VOLONTE_TO;
      const open = isOpen(iso, weekdayIdx) || Boolean(event) || aVolonte;
      days.push({
        iso,
        day,
        weekdayIdx,
        open,
        hours: open ? (SPECIAL_HOURS[iso] ?? DEFAULT_HOURS) : undefined,
        vacances,
        aVolonte,
        // Hors vacances, la promo ne court que jeudi/vendredi ; en vacances, tous les jours.
        promo:
          SHOW_PROMOS &&
          !event &&
          promoRanges.some((r) => inRange(iso, r)) &&
          (vacances || weekdayIdx === 3 || weekdayIdx === 4),
        ferie: FERIES[iso],
        event,
        // Le dimanche, hors vacances scolaires : pendant les vacances, c'est le 2+1 qui court.
        packDecouverte:
          weekdayIdx === 6 && !vacances && iso >= PACK_FROM && iso <= PACK_TO,
      });
    }
    return { year, month, name: MONTHS_FULL[month - 1], leading: days[0].weekdayIdx, days };
  });
}
