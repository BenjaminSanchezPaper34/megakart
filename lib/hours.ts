export type OpenStatus = {
  open: boolean;
  season: "summer" | "offseason";
  label: string;
  detail: string;
};

/**
 * Deux régimes, alignés sur la fiche Google et le site historique :
 *  - saison estivale (mi-juin → fin août) : tous les jours, 10 h – minuit trente
 *    (le site actuel annonce le 20 juin et « 1 h » sur une page, « minuit
 *    trente » sur l'autre — bornes à confirmer par le client)
 *  - hors saison : tous les jours, 14 h – 19 h (horaires déclarés sur Google)
 */
const SUMMER_DETAIL = "En saison : tous les jours, 10 h – minuit trente, non-stop.";

/** Ouvertures exceptionnelles hors saison (closes = 24 pour minuit). */
const EXCEPTIONS: Record<string, { opens: number; closes: number; label: string }> = {
  "2026-10-31": { opens: 14, closes: 24, label: "Nocturne Halloween" },
};
const OFFSEASON_DETAIL = "Hors saison : tous les jours, 14 h – 19 h.";

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

  const open = h >= 14 && h < 19;
  return {
    open,
    season: "offseason",
    label: open ? "Ouvert actuellement" : h < 14 ? "Ouvre à 14 h" : "Fermé · ouvre demain 14 h",
    detail: OFFSEASON_DETAIL,
  };
}
