import type { Operation } from "@/lib/agenda";

/**
 * Couleurs des bons plans, alignées sur le calendrier de l'agenda :
 * mercredi à volonté = jaune, 2 tickets = 1 offert = bleu, dimanche = blanc.
 */
export function dealSkin(deal: Operation) {
  if (deal.slug === "2-plus-1")
    return { card: "bg-promo text-white", soft: "text-white/80", rule: "border-white/30", label: "bg-white text-promo" };
  if (deal.accent === "flag")
    return { card: "bg-flag text-asphalt", soft: "text-asphalt/75", rule: "border-asphalt/20", label: "bg-asphalt text-flag" };
  return { card: "bg-chalk text-asphalt", soft: "text-asphalt/70", rule: "border-asphalt/15", label: "bg-asphalt text-chalk" };
}

/** Pastille de label d'une opération (courses), selon son accent. */
export const LABEL_TONE: Record<Operation["accent"], string> = {
  race: "bg-race text-white",
  flag: "bg-flag text-asphalt",
  chalk: "bg-chalk text-asphalt",
};

/**
 * Émoji d'un « fait » d'opération (lib/agenda.ts) : les données restent du texte
 * simple, l'émoji se déduit des mots clés (ordre = priorité).
 */
const RULES: [RegExp, string][] = [
  [/rendez-vous|accueil des|de midi/i, "⏰"],
  [/€/, "💶"],
  [/podium|prix|gagner|baptême|troph/i, "🏆"],
  [/repas|chauff/i, "🍽️"],
  [/coaching|moniteur/i, "🧑‍🏫"],
  [/équipe|pilote/i, "👥"],
  [/sodi|kart|\dcc\b|rx250/i, "🏎️"],
  [/enfant|\bans\b|1,\d0 m/i, "🧒"],
  [/jeudi|vendredi|dimanche|vacances|jours|décembre|octobre/i, "📅"],
  [/course|finale|manche|relais|tours/i, "🏁"],
  [/essai|qualif|min\b|minute|heure|chrono|apex|\d+h/i, "⏱️"],
];

export function factEmoji(text: string) {
  return RULES.find(([re]) => re.test(text))?.[1] ?? "🏁";
}
