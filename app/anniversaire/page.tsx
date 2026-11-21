import type { Metadata } from "next";
import Link from "next/link";
import PageFormule, { type FormuleData } from "@/components/PageFormule";

/**
 * Page dédiée « anniversaire karting » (21/11/2026) : la requête « karting
 * anniversaire vias » ne trouvait que /evenements (trois sujets sur une page,
 * position 60 à 80). Faits repris de /evenements et de lib/karts.ts ; aucun
 * tarif de formule annoncé (devis au cas par cas).
 */
export const metadata: Metadata = {
  title: "Anniversaire karting à Vias, enfant et adulte, près d'Agde et Béziers",
  description:
    "Fêter un anniversaire au karting MegaKart de Vias-plage : course à son nom dès 3 ans, chrono sur écran géant, podium et terrasse pour le gâteau. Dès 7 participants, à 10 min d'Agde et 20 min de Béziers. Devis sous 48 h.",
  alternates: { canonical: "/anniversaire" },
};

const DATA: FormuleData = {
  formule: "anniversaire",
  path: "/anniversaire",
  crumb: "Anniversaire",
  hero: {
    image: { src: "/images/galerie-16-jeune-pilote.jpg", alt: "Jeune pilote casqué au volant d'un kart chez MegaKart", position: "object-[center_35%]" },
    label: "Anniversaire",
    line1: "Anniversaire karting",
    line2: "à Vias.",
    subtitle: "Une course à son nom dès 3 ans, le podium et le gâteau en terrasse. Dès 7 participants, à 10 min d'Agde et 20 min de Béziers.",
  },
  sections: [
    {
      id: "enfant",
      title: "Pour les enfants",
      text: [
        "Une vraie course à son nom : briefing pilotes, grille de départ, chrono qui défile sur l'écran géant, puis le podium et la remise de prix pour la star du jour.",
        "Chacun son kart selon son âge. Les plus petits roulent en Baby Kart électrique sur une piste à eux, les grands et les copains en Kart Enfant 160cc sur le circuit de 1000 m.",
      ],
      facts: [
        { emoji: "🧸", text: "Baby Kart électrique de 3 à 6 ans" },
        { emoji: "👨‍👧", text: "Kart Biplace avec un adulte dès 5 ans" },
        { emoji: "🏎️", text: "Kart Enfant 160cc de 7 à 15 ans" },
        { emoji: "🏆", text: "Podium et remise de prix" },
      ],
    },
    {
      id: "adulte",
      title: "Pour les ados et les adultes",
      text: [
        "Trente ans, quarante ans, ou les dix-huit ans du petit dernier : on monte une course entre amis sur les Sodi 280cc et 390cc, en sprint ou en endurance par équipes.",
        "Le classement s'affiche en direct, au dixième, et le podium tranche les débats. La terrasse prend le relais pour trinquer.",
      ],
      facts: [
        { emoji: "🏁", text: "Kart 280cc dès 14 ans, 390cc adultes" },
        { emoji: "⏱️", text: "Chrono Apex Timing sur écran géant" },
        { emoji: "👥", text: "Sprint ou endurance par équipes" },
        { emoji: "⛱️", text: "Terrasse ombragée pour le gâteau" },
      ],
    },
  ],
  deroule: {
    line1: "Le déroulé",
    line2: "du grand jour.",
    subtitle: "Le format se construit avec vous : nombre de manches, sprint ou endurance, défis pour la star du jour.",
    items: [
      { emoji: "🪖", text: "Accueil, casques et briefing pilotes" },
      { emoji: "⏱️", text: "Essais, puis la course au chrono" },
      { emoji: "🥇", text: "Podium, photo et remise de prix" },
      { emoji: "🎂", text: "Gâteau et boissons en terrasse" },
    ],
  },
  faq: [
    {
      q: "Dès quel âge fêter un anniversaire au karting ?",
      a: "Dès 3 ans : Baby Kart électrique de 3 à 6 ans sur piste dédiée, Kart Biplace avec un adulte dès 5 ans, Kart Enfant 160cc de 7 à 15 ans (1,30 m minimum). Le format s'adapte à l'âge du groupe.",
    },
    {
      q: "Et pour un anniversaire d'ado ou d'adulte ?",
      a: "Le Kart 280cc se pilote dès 14 ans (1,60 m minimum), le 390cc pour les adultes. Course sprint ou endurance par équipes, chrono Apex Timing et podium, comme une vraie course.",
    },
    {
      q: "Combien de participants faut-il ?",
      a: "Un anniversaire se réserve dès 7 participants. Pour un grand groupe, le circuit peut aller jusqu'à la privatisation complète.",
    },
    {
      q: "Peut-on apporter le gâteau ?",
      a: "Oui : la terrasse ombragée et les tables de pique-nique accueillent le gâteau et les boissons, avec les parents en tribune pendant la course.",
    },
    {
      q: "Combien coûte un anniversaire au karting ?",
      a: "Le prix dépend du nombre de pilotes, des karts et du format : le circuit vous envoie un devis après votre demande. Pour se faire une idée, une session de Kart Enfant est à 13 € et un Baby Kart à 5 €.",
    },
    {
      q: "Comment réserver ?",
      a: "Avec le formulaire de cette page, par téléphone au 09 50 28 95 91 ou par e-mail à contact@megakart.fr. Le circuit rappelle sous 48 heures pour construire la formule.",
    },
    {
      q: "C'est possible en hiver ?",
      a: "Oui, sur réservation, toute l'année : en ce moment le circuit est ouvert le mercredi, le samedi et le dimanche de 14 h à 18 h ; en saison estivale, tous les jours de 10 h à minuit trente.",
    },
    {
      q: "Faut-il un équipement particulier ?",
      a: "Les casques sont fournis sur place. Chaussures fermées type baskets obligatoires, vêtements flottants (écharpes, foulards…) interdits.",
    },
  ],
  demande: {
    line1: "On cale",
    line2: "la date ?",
    subtitle: "Date, nombre d'invités, âge : le circuit vous rappelle sous 48 heures avec une formule et un devis.",
  },
  service: {
    name: "Anniversaire karting à Vias",
    serviceType: "Anniversaire karting enfant et adulte",
    description:
      "Anniversaire au circuit de karting outdoor MegaKart de Vias-plage : course dès 3 ans, chrono Apex Timing sur écran géant, podium, terrasse pour le gâteau. Dès 7 participants, sur réservation.",
  },
  autres: (
    <>
      EVG, EVJF ou sortie d&rsquo;entreprise ? Voir{" "}
      <Link href="/evg-evjf" className="link-under font-semibold text-chalk">EVG et EVJF</Link> et{" "}
      <Link href="/team-building" className="link-under font-semibold text-chalk">Entreprises et CE</Link>.
    </>
  ),
};

export default function AnniversairePage() {
  return <PageFormule data={DATA} />;
}
