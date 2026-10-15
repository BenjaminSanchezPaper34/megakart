/**
 * Inscription en ligne au Trophée Plein Gaz — modèle partagé client/serveur.
 * Inscription individuelle : un responsable (le contact du circuit) inscrit
 * de 1 à 4 pilotes dans le même envoi, chacun paie sa place. Le tarif est
 * celui de l'opération dans lib/agenda.ts, jamais recopié ailleurs.
 * Aucune condition d'âge ou de taille n'est appliquée ici : le circuit ne
 * nous en a pas communiqué pour ce trophée.
 */
import { datesOuvertes, formatDate, getOperation } from "./agenda";

export const PLEIN_GAZ_SLUG = "plein-gaz";
export const PLEIN_GAZ = { prix: getOperation(PLEIN_GAZ_SLUG)?.priceValue ?? 0 } as const;
export const MAX_PILOTES = 4;

/** Dates ouvertes à l'inscription : celles de l'agenda, confirmées, à venir. */
export function pleinGazDates(today = new Date()) {
  return datesOuvertes(PLEIN_GAZ_SLUG, today).map((a) => {
    const f = formatDate(a.date);
    return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}` };
  });
}

export type PilotePleinGaz = {
  prenom: string;
  nom: string;
  /** A déjà roulé chez MegaKart. */
  habitue: boolean;
};

export type InscriptionPleinGaz = {
  date: string;
  pilotes: PilotePleinGaz[];
  responsable: { name: string; phone: string; email: string };
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
export function parseInscriptionPleinGaz(
  raw: unknown,
  validDates: string[]
): { ok: true; data: InscriptionPleinGaz } | { ok: false; errors: Record<string, string> } {
  const r = (raw ?? {}) as Record<string, unknown>;
  const resp = (r.responsable ?? {}) as Record<string, unknown>;
  const rawPilotes = (Array.isArray(r.pilotes) ? r.pilotes : []).slice(0, MAX_PILOTES) as Record<string, unknown>[];

  const data: InscriptionPleinGaz = {
    date: clean(r.date, 10),
    pilotes: rawPilotes.map((p) => ({
      prenom: clean(p.prenom, 60),
      nom: clean(p.nom, 60),
      habitue: p.habitue === true,
    })),
    responsable: {
      name: clean(resp.name, 80),
      phone: clean(resp.phone, 30),
      email: clean(resp.email, 120).toLowerCase(),
    },
    message: clean(r.message, 1500),
    consent: r.consent === true,
    website: clean(r.website, 200),
  };

  const errors: Record<string, string> = {};
  if (!validDates.includes(data.date)) errors.date = "Choisissez une date de course.";
  if (data.pilotes.length === 0) errors.pilotes = "Inscrivez au moins un pilote.";
  data.pilotes.forEach((p, i) => {
    const k = `pilotes.${i}.`;
    if (p.prenom.length < 2) errors[k + "prenom"] = "Le prénom est requis.";
    if (p.nom.length < 2) errors[k + "nom"] = "Le nom est requis.";
  });
  if (data.responsable.name.length < 2) errors["responsable.name"] = "Votre nom est requis.";
  if (data.responsable.phone.replace(/\D/g, "").length < 9)
    errors["responsable.phone"] = "Un numéro de téléphone valide est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.responsable.email))
    errors["responsable.email"] = "Une adresse e-mail valide est requise.";
  if (!data.consent) errors.consent = "Nous avons besoin de votre accord pour traiter l'inscription.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
