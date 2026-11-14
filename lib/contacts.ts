/**
 * Base contacts MegaKart (Resend) : chaque inscription en ligne ajoute la
 * personne au segment « MegaKart · Tous les participants » et l'abonne au
 * topic de l'événement. Les relances d'une nouvelle édition visent ce
 * segment, filtré sur le topic (ex. Courses Enfants). Le compte Resend est
 * partagé avec UPOST et le forfait gratuit plafonne à 3 segments : d'où un
 * seul segment + un topic par événement.
 *
 * Jamais bloquant : une erreur ici est journalisée, l'inscription part quand
 * même. Un contact déjà désinscrit le reste (on ne touche pas à `unsubscribed`).
 * Le formulaire newsletter (/api/newsletter) passe par ici aussi, mais range ses
 * inscrits à part : « Tous les participants » = ceux qui ont déjà couru,
 * « Newsletter (site) » = les intéressés (Benjamin, 14/11). Un intéressé qui
 * s'inscrit ensuite à une course passe chez les participants.
 */
const API = "https://api.resend.com";

const SEGMENT_TOUS = "94f6b631-f4bc-43be-8db2-c3decc03f939";
/** Segment « MegaKart · Newsletter (site) ». À créer quand une place se libère (plafond de
 *  3 segments) ; en attendant, les intéressés restent chez les participants. */
const SEGMENT_INTERESSES: string | null = null;

export const TOPICS = {
  "100-tours": "5cf5dd0b-b2fe-429a-a468-8e2e767428ec",
  "course-enfant": "c3299511-d7f7-49c6-97bf-527fe45e175d",
  "12-heures": "8add7156-f713-4b0d-a9ed-34c92fab6dee",
  "plein-gaz": "9186764d-ade9-4813-a8c3-6ed99135dfee",
} as const;

export type Evenement = keyof typeof TOPICS;

/** Renvoie false si Resend a refusé (utile au formulaire newsletter, qui l'affiche). */
export async function ajouterContact(
  email: string,
  nom: string,
  evenements: Evenement | Evenement[],
  /** « interesses » pour le formulaire newsletter, sinon participant à une course. */
  liste: "participants" | "interesses" = "participants"
): Promise<boolean> {
  // Clé « full access » dédiée : la clé d'envoi du site ne gère pas les contacts.
  const key = process.env.RESEND_CONTACTS_KEY;
  if (!key) return false;
  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const adresse = email.trim().toLowerCase();
  const topics = [evenements].flat().map((e) => ({ id: TOPICS[e], subscription: "opt_in" }));

  const enc = encodeURIComponent(adresse);
  const segment = liste === "interesses" && SEGMENT_INTERESSES ? SEGMENT_INTERESSES : SEGMENT_TOUS;
  try {
    // POST /contacts sur une adresse connue écrase `unsubscribed` à false (testé le
    // 21/10/2026) : on regarde donc d'abord si le contact existe.
    const existe = (await fetch(`${API}/contacts/${enc}`, { headers })).ok;
    if (!existe) {
      const res = await fetch(`${API}/contacts`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: adresse,
          first_name: nom,
          segments: [{ id: segment }],
          topics,
        }),
      });
      return res.ok;
    }
    // Contact déjà connu : on ajoute seulement le segment et le topic. Un intéressé
    // qui court devient participant : il quitte la liste newsletter.
    await fetch(`${API}/contacts/${enc}/segments/${segment}`, { method: "POST", headers });
    if (segment === SEGMENT_TOUS && SEGMENT_INTERESSES)
      await fetch(`${API}/contacts/${enc}/segments/${SEGMENT_INTERESSES}`, { method: "DELETE", headers });
    const res = await fetch(`${API}/contacts/${enc}/topics`, { method: "PATCH", headers, body: JSON.stringify(topics) });
    return res.ok;
  } catch (err) {
    console.error("[contacts] ajout impossible :", err);
    return false;
  }
}
