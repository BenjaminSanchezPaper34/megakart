export type OpenStatus = {
  open: boolean;
  season: "summer" | "offseason" | "winter";
  label: string;
  detail: string;
};

/**
 * Deux régimes, alignés sur la fiche Google et le site historique :
 *  - saison estivale (mi-juin → fin août) : tous les jours, 10 h – minuit trente
 *    (le site actuel annonce le 20 juin et « 1 h » sur une page, « minuit
 *    trente » sur l'autre — bornes à confirmer par le client)
 *  - hors saison : tous les jours, 14 h – 19 h (horaires déclarés sur Google)
 *  - fermeture annuelle : janvier et février, réouverture le 1er mars
 *    (décision du gérant, réunion du 03/09/2026)
 */
const SUMMER_DETAIL = "En saison : tous les jours, 10 h – minuit trente, non-stop.";

/** Ouvertures exceptionnelles hors saison (closes = 24 pour minuit). */
const EXCEPTIONS: Record<string, { opens: number; closes: number; label: string }> = {
  "2026-10-31": { opens: 14, closes: 24, label: "Nocturne Halloween" },
};
const OFFSEASON_DETAIL = "Hors saison : tous les jours, 14 h – 19 h.";

/**
 * Fermeture hebdomadaire lundi + mardi en octobre, hors vacances de la
 * Toussaint (décision du gérant, 05/10/2026) : du 5 au 16 octobre, soit
 * les 5, 6, 12 et 13. Pendant les vacances (dès le 17), ouvert tous les jours.
 */
const FERME_LUNDI_MARDI: [string, string] = ["2026-10-05", "2026-10-16"];
const FERME_DETAIL = "En octobre hors vacances : fermé le lundi et le mardi, ouvert du mercredi au dimanche, 14 h – 19 h.";

/** Lundi ou mardi fermé (iso AAAA-MM-JJ, jour JS 0 = dimanche). */
export function isFermetureHebdo(iso: string, jsDay: number): boolean {
  return (jsDay === 1 || jsDay === 2) && iso >= FERME_LUNDI_MARDI[0] && iso <= FERME_LUNDI_MARDI[1];
}

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

  if (isFermetureHebdo(iso, now.getDay())) {
    return {
      open: false,
      season: "offseason",
      label: now.getDay() === 1 ? "Fermé · ouvre mercredi 14 h" : "Fermé · ouvre demain 14 h",
      detail: FERME_DETAIL,
    };
  }

  const inFermePeriod = iso >= FERME_LUNDI_MARDI[0] && iso <= FERME_LUNDI_MARDI[1];
  const open = h >= 14 && h < 19;
  // Le dimanche soir de la période, « demain » serait un lundi fermé.
  const reopen = inFermePeriod && now.getDay() === 0 ? "Fermé · ouvre mercredi 14 h" : "Fermé · ouvre demain 14 h";
  return {
    open,
    season: "offseason",
    label: open ? "Ouvert actuellement" : h < 14 ? "Ouvre à 14 h" : reopen,
    detail: inFermePeriod ? FERME_DETAIL : OFFSEASON_DETAIL,
  };
}
