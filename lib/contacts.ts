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
 */
const API = "https://api.resend.com";

const SEGMENT_TOUS = "94f6b631-f4bc-43be-8db2-c3decc03f939";

export const TOPICS = {
  "100-tours": "5cf5dd0b-b2fe-429a-a468-8e2e767428ec",
  "course-enfant": "c3299511-d7f7-49c6-97bf-527fe45e175d",
  "12-heures": "8add7156-f713-4b0d-a9ed-34c92fab6dee",
  "plein-gaz": "9186764d-ade9-4813-a8c3-6ed99135dfee",
} as const;

export type Evenement = keyof typeof TOPICS;

export async function ajouterContact(email: string, nom: string, evenement: Evenement) {
  // Clé « full access » dédiée : la clé d'envoi du site ne gère pas les contacts.
  const key = process.env.RESEND_CONTACTS_KEY;
  if (!key) return;
  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const adresse = email.trim().toLowerCase();
  const topic = { id: TOPICS[evenement], subscription: "opt_in" };

  const enc = encodeURIComponent(adresse);
  try {
    // POST /contacts sur une adresse connue écrase `unsubscribed` à false (testé le
    // 21/10/2026) : on regarde donc d'abord si le contact existe.
    const existe = (await fetch(`${API}/contacts/${enc}`, { headers })).ok;
    if (!existe) {
      await fetch(`${API}/contacts`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: adresse,
          first_name: nom,
          segments: [{ id: SEGMENT_TOUS }],
          topics: [topic],
        }),
      });
      return;
    }
    // Contact déjà connu : on ajoute seulement le segment et le topic.
    await fetch(`${API}/contacts/${enc}/segments/${SEGMENT_TOUS}`, { method: "POST", headers });
    await fetch(`${API}/contacts/${enc}/topics`, { method: "PATCH", headers, body: JSON.stringify([topic]) });
  } catch (err) {
    console.error("[contacts] ajout impossible :", err);
  }
}
