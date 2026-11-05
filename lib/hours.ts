export type OpenStatus = {
  open: boolean;
  season: "summer" | "offseason" | "winter";
  label: string;
  detail: string;
  /** Texte anglais imposé (fermeture exceptionnelle), sinon les libellés de OpenBadge. */
  en?: { label: string; detail: string };
};

/**
 * Deux régimes, alignés sur la fiche Google et le site historique :
 *  - saison estivale (mi-juin → fin août) : tous les jours, 10 h – minuit trente
 *    (le site actuel annonce le 20 juin et « 1 h » sur une page, « minuit
 *    trente » sur l'autre — bornes à confirmer par le client)
 *  - hors saison : tous les jours, 14 h – 19 h (horaires déclarés sur Google)
 *  - fermeture annuelle : janvier et février, réouverture le 1er mars
 *    (décision du gérant, réunion du 03/09/2026)
 *  - régime d'hiver (dès le 2/11/2026) : mercredi, samedi et dimanche,
 *    14 h – 18 h (Chantal, vu avec Lucas, groupe WhatsApp du 05/11, annule
 *    le « mercredi → dimanche, 13 h – 18 h » du 27/10).
 */
const SUMMER_DETAIL = "En saison : tous les jours, 10 h – minuit trente, non-stop.";

/** Ouvertures exceptionnelles hors saison (closes = 24 pour minuit). */
const EXCEPTIONS: Record<string, { opens: number; closes: number; label: string }> = {
  "2026-10-31": { opens: 14, closes: 24, label: "Nocturne Halloween" },
};
/**
 * Fermetures exceptionnelles (météo, etc.) : badge, bandeau de l'accueil et calendrier.
 * Forme d'une entrée : "2026-11-04": { titre, detail, en: { label, detail } } (dernier usage : pluie du 4/11).
 */
const FERMETURES: Record<string, { titre: string; detail: string; en: { label: string; detail: string } }> = {};

export function fermetureDu(iso: string) {
  return FERMETURES[iso];
}

const OFFSEASON_DETAIL = "Hors saison : tous les jours, 14 h – 19 h.";

/** Régime d'hiver, du 2/11 au 31/12/2026 (vacances de Noël comprises, faute d'autre consigne). */
const HIVER: [string, string] = ["2026-11-02", "2026-12-31"];
const HIVER_DETAIL = "Mercredi, samedi et dimanche, 14 h – 18 h.";

/** Horaires d'ouverture ordinaires d'un jour (hors exceptions datées), heures pleines. */
export function horairesDu(iso: string): { opens: number; closes: number } {
  return iso >= HIVER[0] && iso <= HIVER[1] ? { opens: 14, closes: 18 } : { opens: 14, closes: 19 };
}

/**
 * Fermeture hebdomadaire lundi + mardi en octobre, hors vacances de la
 * Toussaint (décision du gérant, 05/10/2026) : du 5 au 16 octobre, soit
 * les 5, 6, 12 et 13. Pendant les vacances (dès le 17), ouvert tous les jours.
 */
const FERME_LUNDI_MARDI: [string, string] = ["2026-10-05", "2026-10-16"];
const FERME_DETAIL = "En octobre hors vacances : fermé le lundi et le mardi, ouvert du mercredi au dimanche, 14 h – 19 h.";

/** Lundi ou mardi fermé (iso AAAA-MM-JJ, jour JS 0 = dimanche). */
export function isFermetureHebdo(iso: string, jsDay: number): boolean {
  if (iso >= HIVER[0] && iso <= HIVER[1]) return ![0, 3, 6].includes(jsDay);
  if (jsDay !== 1 && jsDay !== 2) return false;
  return iso >= FERME_LUNDI_MARDI[0] && iso <= FERME_LUNDI_MARDI[1];
}

/** Régime d'hiver : prochain jour ouvert, vu d'un jour donné (jour JS 0 = dimanche). */
const PROCHAINE_OUVERTURE_HIVER: Record<number, string> = {
  0: "mercredi", 1: "mercredi", 2: "demain", 3: "samedi", 4: "samedi", 5: "demain", 6: "demain",
};

export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const month = now.getMonth(); // 0-11
  const day = now.getDate();
  const h = now.getHours();
  const m = now.getMinutes();
  const inSummer =
    (month === 5 && day >= 15) || month === 6 || month === 7; // 15 juin → 31 août

  if (inSummer) {
    const open = h >= 10 || (h === 0 && m <= 30);
    return {
      open,
      season: "summer",
      label: open ? "Ouvert actuellement" : "Ouvre à 10 h",
      detail: SUMMER_DETAIL,
    };
  }

  if (month === 0 || month === 1) {
    return {
      open: false,
      season: "winter",
      label: "Fermeture annuelle",
      detail: "Fermé en janvier et février — réouverture le 1er mars.",
    };
  }

  const iso = `${now.getFullYear()}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const fermeture = fermetureDu(iso);
  if (fermeture) {
    return { open: false, season: "offseason", label: fermeture.titre, detail: fermeture.detail, en: fermeture.en };
  }

  const exc = EXCEPTIONS[iso];
  if (exc) {
    const open = h >= exc.opens && h < exc.closes;
    return {
      open,
      season: "offseason",
      label: open ? "Ouvert actuellement" : `Ouvre à ${exc.opens} h`,
      detail: `${exc.label} : ouvert de ${exc.opens} h à ${exc.closes === 24 ? "minuit" : `${exc.closes} h`}.`,
    };
  }

  const hiver = iso >= HIVER[0] && iso <= HIVER[1];
  const { opens, closes } = horairesDu(iso);
  const detailFerme = hiver ? HIVER_DETAIL : FERME_DETAIL;

  if (isFermetureHebdo(iso, now.getDay())) {
    const suite = hiver
      ? PROCHAINE_OUVERTURE_HIVER[now.getDay()]
      : now.getDay() === 1 ? "mercredi" : "demain";
    return {
      open: false,
      season: "offseason",
      label: `Fermé · ouvre ${suite} ${opens} h`,
      detail: detailFerme,
    };
  }

  const inFermePeriod = hiver || (iso >= FERME_LUNDI_MARDI[0] && iso <= FERME_LUNDI_MARDI[1]);
  const open = h >= opens && h < closes;
  // Après la fermeture du soir : le prochain jour ouvert n'est pas toujours demain.
  const reopen = hiver
    ? `Fermé · ouvre ${PROCHAINE_OUVERTURE_HIVER[now.getDay()]} ${opens} h`
    : inFermePeriod && now.getDay() === 0
      ? `Fermé · ouvre mercredi ${opens} h`
      : `Fermé · ouvre demain ${opens} h`;
  return {
    open,
    season: "offseason",
    label: open ? "Ouvert actuellement" : h < opens ? `Ouvre à ${opens} h` : reopen,
    detail: inFermePeriod ? detailFerme : OFFSEASON_DETAIL,
  };
}
