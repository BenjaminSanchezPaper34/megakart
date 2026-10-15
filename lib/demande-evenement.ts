/**
 * Demande d'événement privé (anniversaire, EVG/EVJF, entreprise & CE) —
 * modèle partagé client/serveur. Ce n'est pas une réservation : le circuit
 * rappelle pour construire la formule. Les champs propres à chaque formule
 * (âge de l'enfant, nom de l'entreprise) ne sont demandés que pour elle.
 */
export const EVENEMENT_SLUG = "evenement";
export const PARTICIPANTS_MIN = 7;
export const PARTICIPANTS_MAX = 60;

export const FORMULES = [
  { id: "anniversaire", label: "Anniversaire", emoji: "🎂" },
  { id: "evg-evjf", label: "EVG · EVJF", emoji: "🥂" },
  { id: "entreprise", label: "Entreprise & CE", emoji: "🏆" },
] as const;
export type FormuleId = (typeof FORMULES)[number]["id"];

export type DemandeEvenement = {
  formule: FormuleId;
  /** Date souhaitée (AAAA-MM-JJ). */
  date: string;
  /** Dates souples : le circuit peut proposer autre chose. */
  flexible: boolean;
  participants: number;
  /** Anniversaire : âge fêté. */
  age?: number;
  /** Entreprise & CE : nom de la société ou du CE. */
  societe?: string;
  contact: { name: string; phone: string; email: string };
  message: string;
  consent: boolean;
  /** Piège à robots : doit rester vide. */
  website?: string;
};

const clean = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

export function parseDemandeEvenement(
  raw: unknown,
  today = new Date().toISOString().slice(0, 10)
): { ok: true; data: DemandeEvenement } | { ok: false; errors: Record<string, string> } {
  const r = (raw ?? {}) as Record<string, unknown>;
  const c = (r.contact ?? {}) as Record<string, unknown>;
  const formule = clean(r.formule, 20) as FormuleId;
  const data: DemandeEvenement = {
    formule,
    date: clean(r.date, 10),
    flexible: r.flexible === true,
    participants: Math.round(Number(r.participants) || 0),
    age: formule === "anniversaire" && r.age !== "" && r.age != null ? Math.round(Number(r.age) || 0) : undefined,
    societe: formule === "entreprise" ? clean(r.societe, 100) : undefined,
    contact: {
      name: clean(c.name, 80),
      phone: clean(c.phone, 30),
      email: clean(c.email, 120).toLowerCase(),
    },
    message: clean(r.message, 1500),
    consent: r.consent === true,
    website: clean(r.website, 200),
  };

  const errors: Record<string, string> = {};
  if (!FORMULES.some((f) => f.id === data.formule)) errors.formule = "Choisissez le type d'événement.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || data.date < today) errors.date = "Choisissez une date à venir.";
  if (data.participants < PARTICIPANTS_MIN || data.participants > PARTICIPANTS_MAX)
    errors.participants = `Entre ${PARTICIPANTS_MIN} et ${PARTICIPANTS_MAX} participants.`;
  if (data.age !== undefined && (data.age < 3 || data.age > 99)) errors.age = "Indiquez un âge entre 3 et 99 ans.";
  if (data.contact.name.length < 2) errors["contact.name"] = "Votre nom est requis.";
  if (data.contact.phone.replace(/\D/g, "").length < 9) errors["contact.phone"] = "Un numéro de téléphone valide est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.contact.email)) errors["contact.email"] = "Une adresse e-mail valide est requise.";
  if (!data.consent) errors.consent = "Nous avons besoin de votre accord pour traiter la demande.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
