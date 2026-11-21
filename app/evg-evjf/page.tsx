import type { Metadata } from "next";
import Link from "next/link";
import PageFormule, { type FormuleData } from "@/components/PageFormule";

/**
 * Page dédiée EVG / EVJF (21/11/2026) : « karting evg » et « evg béziers »
 * tombaient sur /evenements en position 60+. Faits repris de /evenements.
 */
export const metadata: Metadata = {
  title: "EVG et EVJF karting près de Béziers et Agde, à Vias",
  description:
    "Enterrement de vie de garçon ou de jeune fille au karting MegaKart de Vias-plage : course sur mesure, défis pour le futur marié ou la future mariée, chrono sur écran géant, podium. Dès 7 personnes, à 20 min de Béziers.",
  alternates: { canonical: "/evg-evjf" },
};

const DATA: FormuleData = {
  formule: "evg-evjf",
  path: "/evg-evjf",
  crumb: "EVG et EVJF",
  hero: {
    image: { src: "/images/galerie-17-nocturne-action.jpg", alt: "Karts en pleine course sur le circuit MegaKart éclairé", position: "object-[center_40%]" },
    label: "EVG · EVJF",
    line1: "EVG et EVJF",
    line2: "au karting.",
    subtitle: "Avant le grand oui, un grand prix : course sur mesure, défis et podium. Dès 7 personnes, à 20 min de Béziers et 10 min d'Agde.",
  },
  sections: [
    {
      id: "course",
      title: "Une course à sa mesure",
      text: [
        "Le futur marié ou la future mariée prend la grille avec sa bande, sur le circuit outdoor de 1000 m homologué FFSA. Le chrono Apex Timing tourne en direct sur l'écran géant : impossible de tricher, impossible de nier.",
        "Le format se construit avec vous : sprint, endurance par équipes, grille inversée pour mettre la star du jour en fond de peloton, défis personnalisés entre les manches.",
      ],
      facts: [
        { emoji: "⏱️", text: "Sprint, endurance ou grille inversée" },
        { emoji: "🎯", text: "Défis personnalisés pour la star du jour" },
        { emoji: "🏎️", text: "Sodi 280cc et 390cc, RX250 pour les confirmés" },
        { emoji: "📸", text: "Photo de podium garantie" },
      ],
    },
    {
      id: "pratique",
      title: "Côté pratique",
      text: [
        "Dès 7 personnes, sur réservation. Casques fournis, briefing avant de rouler, il suffit de venir en baskets.",
        "Vias-plage est à 10 minutes d'Agde et 20 minutes de Béziers : le karting se cale facilement avant la plage, le restaurant ou la soirée. La terrasse ombragée accueille la bande entre deux manches.",
      ],
      facts: [
        { emoji: "👥", text: "Dès 7 personnes" },
        { emoji: "🪖", text: "Casques fournis, baskets obligatoires" },
        { emoji: "📍", text: "À 10 min d'Agde, 20 min de Béziers" },
        { emoji: "⛱️", text: "Terrasse ombragée" },
      ],
    },
  ],
  deroule: {
    line1: "Le déroulé",
    line2: "de l'enterrement.",
    subtitle: "Un exemple, tout se module : nombre de manches, karts, défis.",
    items: [
      { emoji: "🪖", text: "Accueil, casques et briefing" },
      { emoji: "⏱️", text: "Essais et qualifications" },
      { emoji: "🏁", text: "La course, défis compris" },
      { emoji: "🥂", text: "Podium, photo et remise de prix" },
    ],
  },
  faq: [
    {
      q: "Quel format pour un EVG ou un EVJF ?",
      a: "Il se construit avec vous : sprint, endurance par équipes ou grille inversée, défis personnalisés pour le futur marié ou la future mariée, remise de prix et photo de podium.",
    },
    {
      q: "Combien faut-il être ?",
      a: "Un EVG ou un EVJF se réserve dès 7 personnes. Pour un grand groupe, le circuit peut aller jusqu'à la privatisation.",
    },
    {
      q: "Faut-il savoir piloter ?",
      a: "Non : un briefing est fait avant de rouler et le Kart 280cc se prend en main tout de suite. Les pilotes réguliers peuvent passer sur les 390cc ou les RX250.",
    },
    {
      q: "Combien ça coûte ?",
      a: "Le prix dépend du nombre de pilotes, des karts et du nombre de manches : le circuit envoie un devis après votre demande. Pour repère, une session de 8 minutes est à 17 € en 280cc et 22 € en 390cc.",
    },
    {
      q: "Peut-on venir déguisés ?",
      a: "Oui pour la photo et la terrasse ; pour rouler, pas de vêtement flottant (écharpe, voile, cape) et des chaussures fermées, pour la sécurité de tous.",
    },
    {
      q: "Où se trouve le circuit ?",
      a: "À Vias-plage, dans l'Hérault : 10 minutes d'Agde, 20 minutes de Béziers, une demi-heure de Pézenas et de Sète.",
    },
    {
      q: "C'est possible toute l'année ?",
      a: "Oui, sur réservation : en ce moment le circuit est ouvert le mercredi, le samedi et le dimanche de 14 h à 18 h ; en saison estivale, tous les jours de 10 h à minuit trente.",
    },
    {
      q: "Comment réserver ?",
      a: "Avec le formulaire de cette page, par téléphone au 09 50 28 95 91 ou par e-mail à contact@megakart.fr. Le circuit rappelle sous 48 heures.",
    },
  ],
  demande: {
    line1: "On cale",
    line2: "la date ?",
    subtitle: "Date, nombre de personnes, ce que vous avez en tête : le circuit vous rappelle sous 48 heures avec une formule et un devis.",
  },
  service: {
    name: "EVG et EVJF au karting à Vias",
    serviceType: "Enterrement de vie de garçon et de jeune fille au karting",
    description:
      "Enterrement de vie de garçon ou de jeune fille au circuit de karting outdoor MegaKart de Vias-plage : course sur mesure, défis, chrono Apex Timing sur écran géant, podium. Dès 7 personnes, sur réservation.",
  },
  autres: (
    <>
      Un anniversaire ou une sortie d&rsquo;entreprise ? Voir{" "}
      <Link href="/anniversaire" className="link-under font-semibold text-chalk">Anniversaire</Link> et{" "}
      <Link href="/team-building" className="link-under font-semibold text-chalk">Entreprises et CE</Link>.
    </>
  ),
};

export default function EvgEvjfPage() {
  return <PageFormule data={DATA} />;
}
