import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

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
    facts: ["Dès 7 participants", "Courses & défis sur mesure", "Terrasse ombragée pour le goûter"],
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
    facts: ["Formats sprint ou endurance", "Défis personnalisés", "Photo de podium garantie"],
  },
  {
    id: "entreprise",
    kicker: "Team building",
    title: "Entreprises & CE",
    text: [
      "Une activité originale pour créer du lien : sur la piste, l'organigramme disparaît — il ne reste que le chrono. Challenges ludiques pensés pour renforcer l'esprit d'équipe et les moments conviviaux.",
      "Séminaires, sorties CE, fins de projet : on construit le format avec vous, avec privatisation possible du circuit.",
    ],
    facts: ["Privatisation possible", "Classements par équipe", "À 15 min de Béziers et d'Agde"],
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

      {/* Hero */}
      <section className="relative flex min-h-[72svh] items-end overflow-hidden">
        <div data-hero-bg className="absolute inset-0">
          <Image
            src="/images/racer-adult.jpg"
            alt="Pilote en course sur le circuit MegaKart lors d'un événement"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-asphalt/65 via-asphalt/35 to-asphalt" />
        </div>
        <div data-hero-content className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-44 md:px-8">
          <p className="display mb-3 text-lg text-flag">Uniquement sur réservation</p>
          <h1 className="display text-[clamp(2.8rem,7vw,6rem)] text-chalk">
            Vos événements,
            <br />
            <span className="text-race">départ lancé.</span>
          </h1>
        </div>
      </section>

      {/* Les 3 formats */}
      <section className="mx-auto flex max-w-7xl flex-col gap-20 px-5 py-20 md:px-8 md:py-28">
        {EVENTS.map((e, i) => (
          <article
            key={e.id}
            id={e.id}
            className={`grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <p data-reveal className="display text-lg text-flag">
                {e.kicker}
              </p>
              <h2 data-reveal className="display mt-1 text-[clamp(2.2rem,5vw,4rem)] text-chalk">
                {e.title}
              </h2>
              {e.text.map((p) => (
                <p key={p} data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-chalk-60">
                  {p}
                </p>
              ))}
              {"cta" in e && e.cta && (
                <Link href={e.cta.href} data-reveal className="btn btn-ghost mt-7">
                  {e.cta.label}
                </Link>
              )}
            </div>
            <ul data-stagger className="flex flex-col gap-4">
              {e.facts.map((f) => (
                <li key={f} className="card flex items-center gap-4 p-5">
                  <span className="checker-sm h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
                  <span className="text-base font-medium text-chalk">{f}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* CTA réservation */}
      <section className="bg-asphalt-2 py-20 text-center md:py-28">
        <div className="mx-auto max-w-2xl px-5">
          <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
            On cale une date ?
          </h2>
          <p data-reveal className="mt-5 text-lg leading-relaxed text-chalk-60">
            Les événements se préparent par téléphone : nombre de pilotes,
            format de course, date — en cinq minutes, c'est réglé.
          </p>
          <div data-reveal className="mt-9">
            <a href={SITE.phoneHref} className="btn btn-race glow-race text-lg">
              {SITE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
