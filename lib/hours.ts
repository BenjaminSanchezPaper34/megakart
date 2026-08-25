export type OpenStatus = {
  open: boolean | null; // null = période hors calcul fiable (hors saison)
  label: string;
  detail: string;
};

/**
 * Saison estivale (mi-juin → fin août) : ouvert tous les jours
 * de 10 h à minuit trente, non-stop.
 * Hors saison : week-ends et vacances scolaires, horaires variables
 * → on n'affirme rien, on renvoie vers le téléphone.
 */
export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const month = now.getMonth(); // 0-11
  const day = now.getDate();
  const inSummer =
    (month === 5 && day >= 15) || month === 6 || month === 7; // 15 juin → 31 août

  if (inSummer) {
    const h = now.getHours();
    const m = now.getMinutes();
    const open = h >= 10 || h === 0 && m <= 30 || h < 0;
    if (open) {
      return {
        open: true,
        label: "Ouvert actuellement",
        detail: "En saison : tous les jours, 10 h – minuit trente, non-stop.",
      };
    }
    return {
      open: false,
      label: "Ouvre à 10 h",
      detail: "En saison : tous les jours, 10 h – minuit trente, non-stop.",
    };
  }

  return {
    open: null,
    label: "Ouvert week-ends & vacances",
    detail:
      "Hors saison : ouvert les week-ends et vacances scolaires. Appelez-nous pour les horaires du jour.",
  };
}
