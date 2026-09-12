/**
 * Inscription en ligne aux 100 Tours — modèle partagé entre le formulaire
 * (client) et la route d'envoi (serveur). La validation vit ici pour que
 * les deux côtés refusent exactement les mêmes choses.
 */
import { AGENDA, formatDate } from "./agenda";

export const CENT_TOURS_SLUG = "100-tours";

/** Dates ouvertes à l'inscription : celles de l'agenda, confirmées, à venir. */
export function centToursDates(today = new Date()) {
  const iso = today.toISOString().slice(0, 10);
  return AGENDA.filter(
    (a) => a.op === CENT_TOURS_SLUG && a.status === "confirme" && !a.endDate && a.date >= iso
  ).map((a) => {
    const f = formatDate(a.date);
    return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}` };
  });
}

export const EXPERIENCES = [
  "Première course pour l'équipe",
  "Quelques courses à notre actif",
  "Habitués des endurances",
] as const;

export type Inscription = {
  date: string;
  team: string;
  captain: { name: string; phone: string; email: string };
  pilots: [string, string];
  experience: string;
  message: string;
  consent: boolean;
  /** Piège à robots : doit rester vide. */
  website?: string;
};

const clean = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

/**
 * Normalise et valide une soumission. Renvoie soit les données propres,
 * soit la liste des champs en erreur (clés = noms de champs du formulaire).
 */
export function parseInscription(
  raw: unknown,
  validDates: string[]
): { ok: true; data: Inscription } | { ok: false; errors: Record<string, string> } {
  const r = (raw ?? {}) as Record<string, unknown>;
  const cap = (r.captain ?? {}) as Record<string, unknown>;
  const pilots = Array.isArray(r.pilots) ? r.pilots : [];

  const data: Inscription = {
    date: clean(r.date, 10),
    team: clean(r.team, 80),
    captain: {
      name: clean(cap.name, 80),
      phone: clean(cap.phone, 30),
      email: clean(cap.email, 120).toLowerCase(),
    },
    pilots: [clean(pilots[0], 80), clean(pilots[1], 80)],
    experience: clean(r.experience, 60),
    message: clean(r.message, 1500),
    consent: r.consent === true,
    website: clean(r.website, 200),
  };

  const errors: Record<string, string> = {};
  if (!validDates.includes(data.date)) errors.date = "Choisissez une date de course.";
  if (data.team.length < 2) errors.team = "Donnez un nom à votre équipe.";
  if (data.captain.name.length < 2) errors["captain.name"] = "Le nom du capitaine est requis.";
  if (data.captain.phone.replace(/\D/g, "").length < 9)
    errors["captain.phone"] = "Un numéro de téléphone valide est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.captain.email))
    errors["captain.email"] = "Une adresse e-mail valide est requise.";
  if (data.pilots[0].length < 2) errors["pilots.0"] = "Le nom du 2e pilote est requis.";
  if (data.pilots[1].length < 2) errors["pilots.1"] = "Le nom du 3e pilote est requis.";
  if (!data.consent) errors.consent = "Nous avons besoin de votre accord pour traiter l'inscription.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
