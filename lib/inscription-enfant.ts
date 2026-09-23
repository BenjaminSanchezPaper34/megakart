/**
 * Inscription en ligne à la Course Enfant — modèle partagé client/serveur.
 * Un parent inscrit un ou plusieurs enfants dans le même envoi (frères et
 * sœurs) ; les conditions d'accès sont celles du client (23/09/2026) :
 * 8 à 14 ans le jour de la course, 1,40 m minimum, 32 € par enfant.
 */
import { AGENDA, formatDate } from "./agenda";

export const COURSE_ENFANT_SLUG = "course-enfant";
export const ENFANT = { ageMin: 8, ageMax: 14, tailleMin: 140, prix: 32, debut: "14h" } as const;
export const MAX_ENFANTS = 4;

export function courseEnfantDates(today = new Date()) {
  const iso = today.toISOString().slice(0, 10);
  return AGENDA.filter(
    (a) => a.op === COURSE_ENFANT_SLUG && a.status === "confirme" && !a.endDate && a.date >= iso
  ).map((a) => {
    const f = formatDate(a.date);
    return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}` };
  });
}

export type Enfant = {
  prenom: string;
  nom: string;
  /** AAAA-MM-JJ */
  naissance: string;
  /** en centimètres */
  taille: number;
  /** A déjà roulé chez MegaKart. */
  habitue: boolean;
};

export type InscriptionEnfant = {
  date: string;
  enfants: Enfant[];
  parent: { name: string; phone: string; email: string };
  message: string;
  /** Autorisation parentale : le signataire est le responsable légal. */
  autorisation: boolean;
  consent: boolean;
  website?: string;
};

const clean = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

/** Âge révolu à une date donnée. */
export function ageAu(naissance: string, jour: string): number | null {
  const n = new Date(naissance), j = new Date(jour);
  if (Number.isNaN(n.getTime()) || Number.isNaN(j.getTime())) return null;
  let age = j.getFullYear() - n.getFullYear();
  const m = j.getMonth() - n.getMonth();
  if (m < 0 || (m === 0 && j.getDate() < n.getDate())) age--;
  return age;
}

export function parseInscriptionEnfant(
  raw: unknown,
  validDates: string[]
): { ok: true; data: InscriptionEnfant } | { ok: false; errors: Record<string, string> } {
  const r = (raw ?? {}) as Record<string, unknown>;
  const par = (r.parent ?? {}) as Record<string, unknown>;
  const rawEnfants = (Array.isArray(r.enfants) ? r.enfants : []).slice(0, MAX_ENFANTS) as Record<string, unknown>[];

  const data: InscriptionEnfant = {
    date: clean(r.date, 10),
    enfants: rawEnfants.map((e) => ({
      prenom: clean(e.prenom, 60),
      nom: clean(e.nom, 60),
      naissance: clean(e.naissance, 10),
      taille: Number(e.taille) || 0,
      habitue: e.habitue === true,
    })),
    parent: {
      name: clean(par.name, 80),
      phone: clean(par.phone, 30),
      email: clean(par.email, 120).toLowerCase(),
    },
    message: clean(r.message, 1500),
    autorisation: r.autorisation === true,
    consent: r.consent === true,
    website: clean(r.website, 200),
  };

  const errors: Record<string, string> = {};
  if (!validDates.includes(data.date)) errors.date = "Choisissez une date de course.";
  if (data.enfants.length === 0) errors.enfants = "Inscrivez au moins un enfant.";
  data.enfants.forEach((e, i) => {
    const k = `enfants.${i}.`;
    if (e.prenom.length < 2) errors[k + "prenom"] = "Le prénom est requis.";
    if (e.nom.length < 2) errors[k + "nom"] = "Le nom est requis.";
    const age = data.date ? ageAu(e.naissance, data.date) : null;
    if (age === null) errors[k + "naissance"] = "Date de naissance requise.";
    else if (age < ENFANT.ageMin || age > ENFANT.ageMax)
      errors[k + "naissance"] = `La course est ouverte de ${ENFANT.ageMin} à ${ENFANT.ageMax} ans le jour de la course (${age} ans ici).`;
    if (e.taille < ENFANT.tailleMin)
      errors[k + "taille"] = e.taille ? `1,40 m minimum pour atteindre les pédales (${e.taille} cm ici).` : "La taille est requise.";
    if (e.taille > 220) errors[k + "taille"] = "Taille en centimètres, par exemple 145.";
  });
  if (data.parent.name.length < 2) errors["parent.name"] = "Le nom du parent est requis.";
  if (data.parent.phone.replace(/\D/g, "").length < 9) errors["parent.phone"] = "Un numéro de téléphone valide est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.parent.email)) errors["parent.email"] = "Une adresse e-mail valide est requise.";
  if (!data.autorisation) errors.autorisation = "L'autorisation du responsable légal est indispensable pour un mineur.";
  if (!data.consent) errors.consent = "Nous avons besoin de votre accord pour traiter l'inscription.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
