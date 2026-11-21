import type { Metadata } from "next";
import Link from "next/link";
import PageFormule, { type FormuleData } from "@/components/PageFormule";

/**
 * Page dédiée entreprises, CE et team building (21/11/2026), priorité de
 * Benjamin. Faits repris de /evenements : privatisation jusqu'à 60 personnes,
 * dès une dizaine, classements par équipe Apex Timing. Rien d'inventé sur la
 * restauration, les salles ou la facturation : à confirmer avec le circuit.
 */
export const metadata: Metadata = {
  title: "Team building karting et sortie CE près de Béziers, Montpellier et Agde",
  description:
    "Team building, sortie CE ou séminaire au karting MegaKart de Vias-plage : challenges par équipes au chrono Apex Timing, privatisation du circuit jusqu'à 60 personnes, dès une dizaine de participants. À 20 min de Béziers, devis sous 48 h.",
  alternates: { canonical: "/team-building" },
};

const DATA: FormuleData = {
  formule: "entreprise",
  path: "/team-building",
  crumb: "Entreprises et CE",
  hero: {
    image: { src: "/images/galerie-18-equipe.jpg", alt: "Groupe de pilotes réunis sur le circuit MegaKart", position: "object-[center_40%]" },
    label: "Entreprises & CE",
    line1: "Team building",
    line2: "et sorties CE.",
    subtitle: "Sur la piste, l'organigramme disparaît : il ne reste que le chrono. Dès une dizaine de personnes, jusqu'à la privatisation pour 60.",
  },
  sections: [
    {
      id: "team-building",
      title: "Le team building au chrono",
      text: [
        "Mêmes karts, même piste, un seul classement : le karting met tout le monde au même niveau, du stagiaire à la direction. Les équipes se relaient, se coachent et se chambrent, et le chrono Apex Timing tranche en direct sur l'écran géant.",
        "On construit le format avec vous : challenge par équipes, endurance en relais, manches de qualification puis finale, remise de prix. Un circuit outdoor de 1000 m homologué FFSA, des Sodi 280cc et 390cc récents.",
      ],
      facts: [
        { emoji: "👥", text: "Classements par équipe, chrono Apex Timing" },
        { emoji: "🔁", text: "Endurance en relais ou sprint" },
        { emoji: "🏆", text: "Podium et remise de prix" },
        { emoji: "🏎️", text: "Sodi 280cc et 390cc, piste de 1000 m" },
      ],
    },
    {
      id: "ce",
      title: "Sorties CE et séminaires",
      text: [
        "Sortie de CSE, fin de projet, journée de séminaire, soirée d'équipe : le circuit accueille les groupes d'une dizaine de personnes jusqu'à la privatisation complète pour une soixantaine de participants.",
        "Vias-plage est à 20 minutes de Béziers, 10 minutes d'Agde et moins d'une heure de Montpellier par l'A9. Le karting se cale en demi-journée, avant un repas ou une soirée.",
      ],
      facts: [
        { emoji: "🔒", text: "Privatisation jusqu'à 60 personnes" },
        { emoji: "🗓️", text: "Toute l'année, sur réservation" },
        { emoji: "📍", text: "20 min de Béziers, 10 min d'Agde" },
        { emoji: "📝", text: "Devis sur mesure sous 48 h" },
      ],
    },
  ],
  deroule: {
    line1: "Une demi-journée",
    line2: "type.",
    subtitle: "Un exemple, tout se module selon votre groupe et votre planning.",
    items: [
      { emoji: "🪖", text: "Accueil, casques et briefing sécurité" },
      { emoji: "⏱️", text: "Essais et qualifications par équipe" },
      { emoji: "🏁", text: "Course d'endurance en relais" },
      { emoji: "🏆", text: "Podium, photo de groupe et remise de prix" },
    ],
  },
  faq: [
    {
      q: "Peut-on privatiser le circuit pour un CE ?",
      a: "Oui : sorties CE ou CSE, séminaires, fins de projet, du groupe d'une dizaine de personnes à la privatisation complète du circuit pour une soixantaine de participants.",
    },
    {
      q: "Quel format pour un team building ?",
      a: "Challenge par équipes avec classement au chrono Apex Timing, endurance en relais, ou manches de qualification puis finale, avec podium et remise de prix. On le construit avec vous.",
    },
    {
      q: "Faut-il savoir piloter ?",
      a: "Non : briefing sécurité avant de rouler, karts faciles à prendre en main. Les écarts de niveau se gomment avec les relais par équipe.",
    },
    {
      q: "À partir de combien de personnes ?",
      a: "Une formule entreprise se construit à partir d'une dizaine de personnes, jusqu'à la privatisation pour une soixantaine.",
    },
    {
      q: "Combien coûte une sortie d'entreprise ?",
      a: "Le prix dépend du nombre de participants, des karts, de la durée et de la privatisation : le circuit envoie un devis sur mesure sous 48 heures après votre demande.",
    },
    {
      q: "Où se trouve le circuit ?",
      a: "À Vias-plage, dans l'Hérault : 10 minutes d'Agde, 20 minutes de Béziers, moins d'une heure de Montpellier par l'A9.",
    },
    {
      q: "C'est possible en semaine ?",
      a: "Sur réservation, oui : en dehors des jours d'ouverture au public (en ce moment le mercredi, le samedi et le dimanche de 14 h à 18 h), le circuit étudie chaque demande de groupe. Indiquez vos dates dans le formulaire.",
    },
    {
      q: "Comment demander un devis ?",
      a: "Avec le formulaire de cette page, par téléphone au 09 50 28 95 91 ou par e-mail à contact@megakart.fr : date, nombre de participants, format souhaité.",
    },
  ],
  demande: {
    line1: "Votre devis",
    line2: "sous 48 h.",
    subtitle: "Entreprise, date, nombre de participants : le circuit vous rappelle pour construire la formule et vous envoie le devis.",
  },
  service: {
    name: "Team building et sorties CE au karting à Vias",
    serviceType: "Team building, sortie CE et séminaire d'entreprise au karting",
    description:
      "Team building, sortie CE ou séminaire au circuit de karting outdoor MegaKart de Vias-plage : challenges par équipes au chrono Apex Timing, privatisation jusqu'à 60 personnes, dès une dizaine de participants. Sur devis.",
  },
  autres: (
    <>
      Un anniversaire ou un EVG ? Voir{" "}
      <Link href="/anniversaire" className="link-under font-semibold text-chalk">Anniversaire</Link> et{" "}
      <Link href="/evg-evjf" className="link-under font-semibold text-chalk">EVG et EVJF</Link>.
    </>
  ),
};

export default function TeamBuildingPage() {
  return <PageFormule data={DATA} />;
}
