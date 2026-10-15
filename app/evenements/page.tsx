import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import EmojiList from "@/components/system/EmojiList";
import CtaFinal from "@/components/system/CtaFinal";

export const metadata: Metadata = {
  title: "Anniversaires, EVG/EVJF & team building sur circuit",
  description:
    "Privatisez le circuit MegaKart à Vias : anniversaires dès 7 participants, EVG/EVJF, séminaires et team building d'entreprise. Courses d'endurance sur mesure, terrasse ombragée. Sur réservation.",
  alternates: { canonical: "/evenements" },
};

const EVENTS = [
  {
    id: "anniversaire",
    kicker: "Le grand jour",
    title: "Anniversaires",
    text: [
      "Un anniversaire chez MegaKart, c'est une vraie course à son nom : grille de départ, chrono sur l'écran géant, podium — et des copains qui en parlent encore à la rentrée.",
      "La terrasse ombragée et les tables de pique-nique accueillent le gâteau et les parents. Dès 7 participants, sur réservation.",
    ],
    emoji: "🎂",
    facts: [
      { emoji: "👥", text: "Dès 7 participants" },
      { emoji: "🏁", text: "Courses & défis sur mesure" },
      { emoji: "⛱️", text: "Terrasse ombragée pour le goûter" },
    ],
    cta: { href: "/anniversaires", label: "Tout sur les anniversaires" },
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
            breadcrumbJsonLd([{ name: "Événements", path: "/evenements" }])
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
          <div className="mx-auto grid max-w-7xl items-center gap-(--section-gap) px-5 md:px-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <SectionHeader line1={e.title} />
              {e.text.map((p) => (
                <p key={p} data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-chalk md:text-lg">
                  {p}
                </p>
              ))}
              {"cta" in e && e.cta && (
                <Link href={e.cta.href} data-reveal className="btn btn-ghost mt-8">
                  {e.cta.label}
                </Link>
              )}
            </div>
            <EmojiList items={e.facts} />
          </div>
        </section>
      ))}

      <div className="kerb" aria-hidden="true" />

      <CtaFinal
        line1="On cale"
        line2="une date ?"
        subtitle="Les événements se préparent par téléphone ou par e-mail : nombre de pilotes, format de course, date. En cinq minutes, c'est réglé."
      >
        <a href={SITE.phoneHref} className="btn btn-race">
          {SITE.phone}
        </a>
        <a href={`mailto:${SITE.email}`} className="btn btn-ghost">
          {SITE.email}
        </a>
      </CtaFinal>
    </>
  );
}
