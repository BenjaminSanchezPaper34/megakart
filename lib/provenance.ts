/**
 * Provenance d'une visite, lue dans l'URL d'arrivée (paramètres UTM).
 *
 * Vercel Web Analytics n'enregistre pas les UTM sur notre offre : les liens de
 * pub, de boost et de posts arrivent tous en « not set ». On les relit donc
 * nous-mêmes et on les joint aux événements (`arrivee`, `inscription`).
 * Rien n'est stocké (ni cookie ni localStorage) : la provenance n'existe que
 * tant que le visiteur reste sur la page d'arrivée — c'est le cas des pubs,
 * qui pointent directement sur les pages d'inscription.
 */
export type Provenance = { source: string; medium: string; campagne: string };

export function provenance(): Provenance | null {
  if (typeof window === "undefined") return null;
  const q = new URLSearchParams(window.location.search);
  const source = q.get("utm_source");
  if (source) {
    return {
      source,
      medium: q.get("utm_medium") ?? "",
      campagne: q.get("utm_campaign") ?? "",
    };
  }
  // Lien Meta sans UTM (boost depuis la Page, post organique) : Meta ajoute fbclid.
  if (q.has("fbclid")) return { source: "meta", medium: "sans-utm", campagne: "" };
  return null;
}
