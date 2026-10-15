import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import Faq from "@/components/system/Faq";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import EmojiList from "@/components/system/EmojiList";
import DemandeEvenement from "@/components/DemandeEvenement";

export const metadata: Metadata = {
  title: "Anniversaire karting, EVG/EVJF & team building CE à Vias",
  description:
    "Anniversaires dès 7 participants, EVG/EVJF, sorties CE et team building sur le circuit MegaKart de Vias, près d'Agde et Béziers : course à son nom, chrono sur écran géant, podium, terrasse ombragée. Sur réservation.",
  alternates: { canonical: "/evenements" },
};

/* Questions des familles et des organisateurs (ex-page /anniversaires, fusionnée le 15/10). */
// 8 questions (2 × 4 sur ordinateur), courtes pour tenir sur une ligne ; les 3 formules couvertes.
const FAQ = [
  {
    q: "Dès quel âge fêter un anniversaire ?",
    a: "Dès que les enfants peuvent piloter : Baby Kart électrique dès 3 ans sur piste dédiée, biplace avec un adulte dès 5 ans, Kart Enfant 160cc dès 7 ans (1,30 m minimum). Le format s'adapte à l'âge du groupe.",
  },
  {
    q: "Peut-on apporter le gâteau ?",
    a: "Oui : la terrasse ombragée et les tables de pique-nique accueillent le gâteau et les boissons, avec les parents en tribune pendant la course.",
  },
  {
    q: "Quel format pour un EVG ou un EVJF ?",
    a: "Il se construit avec vous : sprint, endurance ou grille inversée, défis personnalisés pour le futur marié ou la future mariée, remise de prix et photo de podium. Dès 7 personnes.",
  },
  {
    q: "Peut-on privatiser le circuit pour un CE ?",
    a: "Oui : séminaires, sorties CE, fins de projet, du groupe d'une dizaine de personnes à la privatisation complète pour une soixantaine de participants, avec classements par équipe au chrono Apex Timing.",
  },
  {
    q: "Combien de participants minimum ?",
    a: "Les anniversaires et les EVG/EVJF se réservent dès 7 participants. Pour les entreprises, on construit la formule à partir d'une dizaine de personnes.",
  },
  {
    q: "Comment réserver un événement ?",
    a: "Par téléphone au 09 50 28 95 91 ou par e-mail à contact@megakart.fr : date, nombre de pilotes et format souhaité, et le circuit construit la formule avec vous.",
  },
  {
    q: "C'est possible toute l'année ?",
    a: "Oui, sur réservation : le circuit est ouvert tous les jours, de 10 h à minuit trente en saison estivale et de 14 h à 19 h le reste de l'année.",
  },
  {
    q: "Faut-il un équipement particulier ?",
    a: "Les casques sont fournis sur place. Chaussures fermées type baskets obligatoires, vêtements flottants (écharpes, foulards…) interdits.",
  },
];

const EVENTS = [
  {
    id: "anniversaire",
    kicker: "Le grand jour",
    title: "Anniversaires",
    text: [
      "Un anniversaire chez MegaKart, c'est une vraie course à son nom : grille de départ, chrono sur l'écran géant, podium — et des copains qui en parlent encore à la rentrée.",
      "Briefing pilotes, casques fournis, et chacun son kart adapté à son âge, du Baby Kart électrique au 160cc junior. Sprint ou endurance, le chrono Apex Timing s'affiche en direct sur l'écran géant, puis podium et remise de prix pour la star du jour.",
      "La terrasse ombragée et les tables de pique-nique accueillent le gâteau et les parents. Dès 7 participants, sur réservation.",
    ],
    emoji: "🎂",
    facts: [
      { emoji: "👥", text: "Dès 7 participants" },
      { emoji: "🏁", text: "Courses & défis sur mesure" },
      { emoji: "🧒", text: "Dès 3 ans en Baby Kart, 7 ans en Kart Enfant" },
      { emoji: "🏆", text: "Podium & remise de prix" },
      { emoji: "⛱️", text: "Terrasse ombragée pour le goûter" },
    ],
  },
  {
    id: "evg-evjf",
    kicker: "Avant le grand oui",
    title: "EVG & EVJF",
    text: [
      "Enterrez une vie de célibataire à pleine vitesse : défis d'équipe, course d'endurance sur mesure, remise de prix — et un futur marié ou une future mariée qu'on attend au tournant, littéralement.",
      "Le format se construit avec vous : sprint, endurance, grille inversée… Sur réservation, dès 7 personnes.",
    ],
    emoji: "🥂",
    facts: [
      { emoji: "⏱️", text: "Formats sprint ou endurance" },
      { emoji: "🎯", text: "Défis personnalisés" },
      { emoji: "📸", text: "Photo de podium garantie" },
    ],
  },
  {
    id: "entreprise",
    kicker: "Team building",
    title: "Entreprises & CE",
    text: [
      "Une activité originale pour créer du lien : sur la piste, l'organigramme disparaît — il ne reste que le chrono. Challenges ludiques pensés pour renforcer l'esprit d'équipe et les moments conviviaux.",
      "Séminaires, sorties CE, fins de projet : on construit le format avec vous, du groupe d'une dizaine de personnes à la privatisation complète du circuit pour une soixantaine de participants.",
    ],
    emoji: "🏆",
    facts: [
      { emoji: "👥", text: "Privatisation jusqu'à 60 personnes" },
      { emoji: "⏱️", text: "Classements par équipe, chrono Apex Timing" },
      { emoji: "📍", text: "À 15 min de Béziers et d'Agde" },
    ],
  },
];

export default function EvenementsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            [breadcrumbJsonLd([{ name: "Événements", path: "/evenements" }]), faqJsonLd(FAQ)]
          ),
        }}
      />

      <PageHero
        image={{ src: "/images/galerie-03-drapeau-damier.jpg", alt: "Le drapeau à damier s'abaisse en fin de course chez MegaKart", position: "object-[center_30%]" }}
        line1="Vos événements,"
        line2="départ lancé."
        subtitle="Anniversaires, enterrements de vie, sorties d'équipe : on construit le format avec vous."
      />

      {/* Les 3 formats : une section chacun, fonds alternés */}
      {EVENTS.map((e, i) => (
        <section
          key={e.id}
          id={e.id}
          className={`scroll-mt-24 py-(--section-y) ${i % 2 === 1 ? "bg-asphalt-2" : ""}`}
        >
          {/* Titre en tête, puis texte et émojis côte à côte, alignés en haut sous le titre. */}
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeader line1={e.title} />
            <div className="mt-6 grid items-start gap-(--section-gap) lg:grid-cols-[1.2fr_1fr]">
              <div>
                {e.text.map((p) => (
                  <p key={p} data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-chalk first:mt-0 md:text-lg">
                    {p}
                  </p>
                ))}
              </div>
              <div>
                <EmojiList items={e.facts} />
                {/* Pré-coche la formule dans le formulaire du bas (écouté par DemandeEvenement). */}
                <a href="#demande" data-formule={e.id} className="btn btn-race mt-8">
                  Demander une date
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}

      <Faq items={FAQ} />

      <div className="kerb" aria-hidden="true" />

      {/* Demande d'événement : un formulaire pour les 3 formules, à la place des boutons téléphone / e-mail. */}
      <section id="demande" className="relative scroll-mt-24 overflow-hidden py-(--section-y)">
        <div className="checker absolute inset-x-0 top-0 h-5 opacity-[0.07]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader
            line1="On cale"
            line2="une date ?"
            subtitle="Anniversaire, EVG/EVJF ou sortie d'entreprise : dites-nous l'essentiel, le circuit vous rappelle sous 48 heures pour construire la formule."
          />
          <div data-reveal className="mt-(--section-gap)">
            <DemandeEvenement />
          </div>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-chalk-60">
            Plutôt de vive voix ? Le{" "}
            <a href={SITE.phoneHref} className="link-under font-semibold text-chalk">
              {SITE.phone}
            </a>{" "}
            et{" "}
            <a href={`mailto:${SITE.email}`} className="link-under font-semibold text-chalk">
              {SITE.email}
            </a>{" "}
            répondent aussi.
          </p>
        </div>
      </section>
    </>
  );
}
