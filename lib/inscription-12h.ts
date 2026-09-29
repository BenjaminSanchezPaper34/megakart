/**
 * Les 12 Heures (avec l'écurie Vortex) — réglages de l'épreuve et modèle
 * d'inscription partagé entre le formulaire (client) et la route (serveur).
 *
 * Toutes les valeurs affichées sur la page et dans les e-mails viennent de
 * DOUZE_H : quand le client confirme un point, on change UNE ligne ici.
 * Source : réunion Vortex + Lucas du 29/09/2026 (Pocket). Les lignes
 * marquées « À CONFIRMER » attendent la réponse de Lucas (message du 29/09).
 */

export const DOUZE_H_SLUG = "12-heures";

export const DOUZE_H = {
  /** À CONFIRMER — Lucas a émis un doute sur le 19/12 en réunion. */
  date: "2026-12-19",
  /** Réunion : « un vrai midi-minuit ». À CONFIRMER. */
  depart: "12h",
  arrivee: "minuit",
  /** À CONFIRMER — heure d'accueil des équipes le matin (null = non affichée). */
  accueil: null as string | null,
  /** À CONFIRMER — tarif repris du site actuel, non évoqué en réunion. */
  prixEquipe: 1500,
  /** Réunion : jusqu'à 6 pilotes. Minimum À CONFIRMER. */
  pilotesMin: 2,
  pilotesMax: 6,
  /** Réunion : 15 équipes max (25 karts dont 5 prêtés par Sodi). */
  placesMax: 15,
  /** Réunion : 9 équipes déjà engagées. À mettre à jour au fil des inscriptions. */
  placesPrises: 9,
  /** À CONFIRMER — repas accompagnant payant ; null = « tarif communiqué à l'inscription ». */
  repasAccompagnant: null as number | null,
  /** À CONFIRMER — modèle de kart. */
  karts: "Sodi RT10 390cc",
  /** Règlement vulgarisé, tel que décrit par Vortex en réunion. */
  arretsMin: 36,
  ravitos: 12,
} as const;

/**
 * Tarif affiché : « 1 500 € ». Espace insécable classique plutôt que
 * l'espace fine de toLocaleString, absente de la police de titre.
 */
export function prixEquipe() {
  return `${String(DOUZE_H.prixEquipe).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}\u00a0€`;
}

export function placesRestantes() {
  return Math.max(0, DOUZE_H.placesMax - DOUZE_H.placesPrises);
}

export const PROFILS = [
  "Entre amis",
  "Entreprise / fin d'année",
  "Club ou habitués de l'endurance",
] as const;

export type InscriptionDouzeH = {
  team: string;
  profil: string;
  /** Nom de la société, si l'équipe vient d'une entreprise (facturation). */
  societe: string;
  /** Pilotes au total, capitaine compris. */
  nbPilotes: number;
  captain: { name: string; phone: string; email: string };
  /** Les autres pilotes (nbPilotes - 1). Facultatifs : ils peuvent être donnés plus tard. */
  pilots: string[];
  /** Accompagnants qui souhaitent manger sur place. */
  accompagnants: number;
  message: string;
  consent: boolean;
  /** Piège à robots : doit rester vide. */
  website?: string;
};

const clean = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Normalise et valide une soumission. Les coéquipiers sont facultatifs :
 * une équipe d'entreprise ne connaît souvent pas ses pilotes deux mois
 * avant — on ne bloque pas l'inscription pour ça.
 */
export function parseInscriptionDouzeH(
  raw: unknown
): { ok: true; data: InscriptionDouzeH } | { ok: false; errors: Record<string, string> } {
  const r = (raw ?? {}) as Record<string, unknown>;
  const cap = (r.captain ?? {}) as Record<string, unknown>;
  const rawPilots = Array.isArray(r.pilots) ? r.pilots : [];
  const nbPilotes = clamp(Math.round(Number(r.nbPilotes) || DOUZE_H.pilotesMin), DOUZE_H.pilotesMin, DOUZE_H.pilotesMax);

  const data: InscriptionDouzeH = {
    team: clean(r.team, 80),
    profil: clean(r.profil, 60),
    societe: clean(r.societe, 120),
    nbPilotes,
    captain: {
      name: clean(cap.name, 80),
      phone: clean(cap.phone, 30),
      email: clean(cap.email, 120).toLowerCase(),
    },
    pilots: Array.from({ length: nbPilotes - 1 }, (_, i) => clean(rawPilots[i], 80)),
    accompagnants: clamp(Math.round(Number(r.accompagnants) || 0), 0, 30),
    message: clean(r.message, 1500),
    consent: r.consent === true,
    website: clean(r.website, 200),
  };

  const errors: Record<string, string> = {};
  if (data.team.length < 2) errors.team = "Donnez un nom à votre équipe.";
  if (data.captain.name.length < 2) errors["captain.name"] = "Le nom du capitaine est requis.";
  if (data.captain.phone.replace(/\D/g, "").length < 9)
    errors["captain.phone"] = "Un numéro de téléphone valide est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.captain.email))
    errors["captain.email"] = "Une adresse e-mail valide est requise.";
  if (data.profil === PROFILS[1] && data.societe.length < 2)
    errors.societe = "Indiquez le nom de l'entreprise (pour la facture).";
  if (!data.consent) errors.consent = "Nous avons besoin de votre accord pour traiter l'inscription.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
