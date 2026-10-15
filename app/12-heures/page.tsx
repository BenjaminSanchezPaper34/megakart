import type { Metadata } from "next";
import Image from "next/image";
import InscriptionDouzeHeures from "@/components/InscriptionDouzeHeures";
import { SITE, SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { formatDate, getOperation } from "@/lib/agenda";
import PageCourse from "@/components/system/PageCourse";
import SectionHeader from "@/components/system/SectionHeader";
import EmojiCards from "@/components/system/EmojiCards";
import EmojiList from "@/components/system/EmojiList";
import { DOUZE_H, placesRestantes, prixEquipe } from "@/lib/inscription-12h";

/*
 * Toutes les valeurs de l'épreuve (date, horaires, tarif, pilotes, places)
 * viennent de lib/inscription-12h.ts — ne rien écrire en dur ici.
 */
const f = formatDate(DOUZE_H.date);
const DATE_LABEL = `${f.weekday} ${f.day} ${f.monthFull}`;
const PRIX = prixEquipe();
const RESTANTES = placesRestantes();
const OP = getOperation("12-heures")!;

export const metadata: Metadata = {
  title: `Les 12 Heures — endurance par équipes avec Vortex, ${DATE_LABEL}`,
  description: `Douze heures d'endurance par équipes de ${DOUZE_H.pilotesMin} à ${DOUZE_H.pilotesMax} pilotes au circuit MegaKart de Vias, avec l'écurie Vortex. ${DATE_LABEL}, de ${DOUZE_H.depart} à ${DOUZE_H.arrivee}. ${DOUZE_H.placesMax} équipes maximum.`,
  alternates: { canonical: "/12-heures" },
};

const EVENT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Les 12 Heures de MegaKart — endurance par équipes avec l'écurie Vortex",
  startDate: `${DOUZE_H.date}T12:00:00+01:00`,
  endDate: `${DOUZE_H.date}T23:59:00+01:00`,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  url: `${SITE_URL}/12-heures`,
  image: [`${SITE_URL}/images/galerie-17-nocturne-action.jpg`, `${SITE_URL}/images/og.jpg`],
  description: `Course d'endurance de 12 heures par équipes sur le circuit outdoor de 1000 m de MegaKart à Vias-plage, coorganisée avec l'écurie Vortex. Un ravitaillement par heure, changement de kart à chaque ravitaillement, espace chauffé par équipe, repas compris, chronométrage Apex Timing en direct. ${DOUZE_H.placesMax} équipes maximum.`,
  // Search Console (09/10) : chaque organisateur doit avoir une URL, et un
  // « performer » est attendu. Vortex n'a pas d'URL connue : nommé dans la
  // description, pas en organisateur. Performer = le circuit, comme l'agenda.
  organizer: { "@type": "Organization", "@id": `${SITE_URL}/#business`, name: SITE.name, url: SITE_URL },
  performer: { "@type": "Organization", "@id": `${SITE_URL}/#business`, name: SITE.name, url: SITE_URL },
  location: {
    "@type": "Place",
    name: SITE.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
  },
  offers: {
    "@type": "Offer",
    name: "Inscription par équipe",
    price: DOUZE_H.prixEquipe,
    priceCurrency: "EUR",
    availability: RESTANTES > 0 ? "https://schema.org/LimitedAvailability" : "https://schema.org/SoldOut",
    url: `${SITE_URL}/12-heures#formulaire`,
  },
};

/* Le déroulé, vulgarisé depuis le règlement présenté par Vortex (réunion du 29/09/2026). */
const FORMAT = [
  {
    emoji: "🕛",
    title: `De ${DOUZE_H.depart} à ${DOUZE_H.arrivee}`,
    text: `Accueil des équipes à ${DOUZE_H.accueil}, essais et qualifications à ${DOUZE_H.essais}, puis départ en plein jour et arrivée sous les projecteurs : douze heures de relais sur les 1000 m du circuit.`,
  },
  {
    emoji: "⛽",
    title: "Un ravitaillement par heure",
    text: `${DOUZE_H.ravitos} ravitaillements imposés, un par heure, annoncés au gyrophare, et ${DOUZE_H.arretsMin} arrêts au minimum sur la course. Le reste, c'est votre stratégie : qui roule, quand, combien de temps.`,
  },
  {
    emoji: "🔄",
    title: "Un nouveau kart à chaque ravito",
    text: "À chaque ravitaillement, l'équipe repart sur un autre kart : personne ne garde « le bon » toute la journée. Votre numéro vous suit sur le transpondeur, pas sur la machine.",
  },
  {
    emoji: "⏱️",
    title: "Le chrono en direct",
    text: "Chronométrage Apex Timing en continu, classement sur l'écran géant et sur la page chrono du site pour ceux qui suivent la course de loin.",
  },
];

const ACCUEIL = [
  { emoji: "🔥", text: "Un grand hangar chauffé, un espace réservé à chaque équipe" },
  { emoji: "📺", text: "Écran de suivi de course et restauration sur place" },
  { emoji: "🍽️", text: "Pilotes nourris toute la journée : petit-déjeuner, déjeuner, goûter et dîner" },
  { emoji: "🥤", text: "Boissons en libre-service pour tous" },
  { emoji: "⛑️", text: "Équipement non fourni : casque et combinaison disponibles sur place" },
  { emoji: "🏆", text: "Trophée, podium et lots RSS en fin de course" },
];

const PUBLICS = [
  {
    emoji: "🤝",
    title: "Entre amis",
    text: "Pas besoin d'être licencié : si vous avez déjà roulé en loisir, vous avez votre place. C'est la tête et la régularité qui gagnent une endurance.",
  },
  {
    emoji: "💼",
    title: "En entreprise",
    text: "Une fin d'année qui change du restaurant : une équipe, un objectif, douze heures pour se serrer les coudes. Facture au nom de l'entreprise.",
  },
  {
    emoji: "🏎️",
    title: "Habitués et équipages Vortex",
    text: "Les pilotes de la communauté Vortex et les habitués du circuit seront sur la grille. De quoi se mesurer aux meilleurs, dans une ambiance qui reste celle du loisir.",
  },
];

export default function DouzeHeuresPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd([{ name: "Les 12 Heures", path: "/12-heures" }]), EVENT_JSONLD]),
        }}
      />

      <PageCourse
        op={OP}
        ouvert={RESTANTES > 0}
        image={{ src: "/images/galerie-17-nocturne-action.jpg", alt: "Karts en action sur le circuit MegaKart éclairé de nuit", position: "object-[center_45%]" }}
        label={<>{OP.name} · {DATE_LABEL} · {DOUZE_H.depart} → {DOUZE_H.arrivee}</>}
        line1="Inscrivez"
        line2="votre équipe."
        subtitle={`Douze heures d'endurance avec l'écurie Vortex, de ${DOUZE_H.pilotesMin} à ${DOUZE_H.pilotesMax} pilotes, dès ${DOUZE_H.ageMin} ans. ${PRIX} l'équipe, repas compris.`}
        badges={
          <span className="rounded-full bg-race px-4 py-2 text-base font-bold text-white">
            {RESTANTES > 0 ? `Plus que ${RESTANTES} places sur ${DOUZE_H.placesMax}` : "Complet, liste d'attente par téléphone"}
          </span>
        }
        intro="Pas d'acompte : tout se règle sur place. Le circuit vous rappelle pour confirmer l'inscription de l'équipe."
        form={<InscriptionDouzeHeures dateLabel={DATE_LABEL} />}
        priceNote="repas compris, réglé sur place"
      >
        {/* Le format */}
        <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
          <SectionHeader
            line1="Douze heures,"
            line2="une seule équipe."
            accent="outline"
            subtitle={`L'épreuve est coorganisée avec l'écurie Vortex, pour que la journée tienne du vrai meeting d'endurance. Les karts sont les ${DOUZE_H.karts} du circuit, préparés pour l'épreuve.`}
          />
          <EmojiCards items={FORMAT} cols={4} />
        </section>

        {/* L'accueil des équipes */}
        <section className="bg-asphalt-2 py-(--section-y)">
          <div className="mx-auto grid max-w-7xl items-center gap-(--section-gap) px-5 md:px-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="mb-5 inline-flex rounded-full bg-flag px-4 py-1.5 text-sm font-bold text-asphalt">
                Votre camp de base
              </p>
              <SectionHeader
                line1="Au chaud"
                line2="entre deux relais."
                accent="flag"
                subtitle={`Pilotes et accompagnants se retrouvent dans un grand hangar chauffé, avec un espace par équipe pour se reposer, manger et suivre la course${DOUZE_H.repasAccompagnant ? ` (repas accompagnant : environ ${DOUZE_H.repasAccompagnant} €, matin, midi et soir)` : ""}.`}
              />
              <EmojiList items={ACCUEIL} className="mt-(--section-gap)" />
            </div>
            <div data-reveal className="race-event-card overflow-hidden">
              <Image
                src="/images/galerie-23-aerien-nuit.jpg"
                alt="Vue aérienne du circuit MegaKart éclairé la nuit"
                width={1200}
                height={800}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Pour qui */}
        <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
          <SectionHeader line1="Ouvert à tous" line2="les équipages." />
          <EmojiCards items={PUBLICS} />
        </section>

      </PageCourse>
    </>
  );
}
