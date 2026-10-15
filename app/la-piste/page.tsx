import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import TrackMap from "@/components/TrackMap";
import Marquee from "@/components/Marquee";
import Histoire from "@/components/Histoire";
import RowArrows from "@/components/RowArrows";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import EmojiList from "@/components/system/EmojiList";

export const metadata: Metadata = {
  title: "La piste — 1000 m homologués FFSA à Vias",
  description:
    "1000 m de long, 8,5 m de large, protections Tecpro comme en F1, chronométrage Apex Timing : découvrez le circuit outdoor MegaKart à Vias-plage, homologué FFSA depuis 2012 pour la compétition.",
  alternates: { canonical: "/la-piste" },
};

const SPECS = [
  { emoji: "📏", value: "1000 m", label: "de longueur" },
  { emoji: "↔️", value: "8,5 m", label: "de largeur" },
  { emoji: "🏁", value: "Cat. 1.1", label: "location & compétition" },
  { emoji: "🛡️", value: "Tecpro", label: "protections type F1" },
];

export default function PistePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: "La piste", path: "/la-piste" }])),
        }}
      />

      <PageHero
        image={{ src: "/images/piste-drone.jpg", alt: "Vol de drone au ras de la piste du circuit MegaKart, kart en pleine courbe" }}
        video={{ desktop: "/videos/piste-drone.mp4", mobile: "/videos/piste-drone-mobile.mp4" }}
        line1="La piste."
        line2="1000 m de pilotage."
        subtitle="Esses, épingles, relances et vraies lignes droites, sur un tracé large de 8,5 m."
      />

      {/* Specs */}
      <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
        <SectionHeader
          line1="La fiche"
          line2="technique."
          accent="flag"
          subtitle="Un circuit de catégorie 1.1, homologué pour la location comme pour la compétition."
        />
        <dl data-stagger className="mt-(--section-gap) grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {SPECS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span aria-hidden="true" className="text-5xl leading-none">{s.emoji}</span>
              <dd className="display mt-4 text-4xl text-chalk md:text-5xl">{s.value}</dd>
              <dt className="mt-2 text-base text-chalk-60">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Tracé animé */}
      <section className="bg-asphalt-2 py-(--section-y)">
        <div className="mx-auto grid max-w-7xl items-center gap-(--section-gap) px-5 md:px-8 lg:grid-cols-2">
          <div>
            <SectionHeader
              line1="Un tracé"
              line2="qui se mérite."
              subtitle="Enchaînements d'esses, épingles serrées, relances et vraies lignes droites : 1000 mètres dessinés pour apprendre les trajectoires, et les soigner. La largeur de 8,5 m laisse toujours la place de tenter un dépassement proprement."
            />
            <p data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-chalk md:text-lg">
              Le soir en été, la piste s&rsquo;éclaire et le circuit roule jusqu&rsquo;à minuit trente : les sessions
              nocturnes sont une autre expérience.
            </p>
          </div>
          <TrackMap className="w-full" />
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Sécurité : texte + émojis à gauche, l'ancienne photo du hero (le circuit de nuit) à droite. */}
      <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
        {/* Titre pleine largeur (« Sécurité type » sur une ligne), puis émojis et photo côte à côte. */}
        <SectionHeader
          line1="Sécurité type"
          line2="Formule 1."
          subtitle="Les sensations, sans les mauvaises surprises : la même technologie de protection que sur les circuits de Formule 1, et une équipe qualifiée en permanence au bord de la piste."
        />
        <div className="mt-(--section-gap) grid items-center gap-(--section-gap) lg:grid-cols-[1.1fr_1fr]">
          <div>
            <EmojiList
              items={[
                { emoji: "🛡️", text: "Protections Tecpro dernière génération, comme en F1" },
                { emoji: "✅", text: "Homologations régulières FFSA et Préfecture" },
                { emoji: "🧑‍🏫", text: "Moniteurs diplômés au bord de la piste" },
                { emoji: "⛑️", text: "Casques fournis à chaque pilote" },
              ]}
            />
          </div>
          <div data-reveal className="race-event-card relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/galerie-23-aerien-nuit.jpg"
              alt="Le circuit MegaKart illuminé de nuit, vu du ciel au cœur de la zone de loisirs de Vias-plage"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Chrono */}
      <section className="bg-asphalt-2 py-(--section-y)">
        <div className="mx-auto grid max-w-7xl items-center gap-(--section-gap) px-5 md:px-8 lg:grid-cols-[1.1fr_1fr]">
          <SectionHeader
            line1="Le chrono,"
            line2="juge de paix."
            accent="flag"
            subtitle="Chronométrage professionnel Apex Timing : chaque tour est mesuré, le classement s'affiche en direct. On repart toujours avec un temps à battre."
            action={
              <Link href="/live" className="btn btn-ghost">
                Voir le chrono en direct
              </Link>
            }
          />
          <EmojiList
            items={[
              { emoji: "⏱️", text: "Chaque tour mesuré au dixième" },
              { emoji: "📺", text: "Classement en direct sur l'écran LED géant" },
              { emoji: "📱", text: "Le même classement en direct sur le site" },
              { emoji: "🏁", text: "Un temps à battre à chaque session" },
            ]}
          />
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Histoire — frise + archives familiales */}
      <section id="histoire" className="scroll-mt-28 py-(--section-y)">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader
            line1="Depuis 1992"
            line2={
              <>
                et toujours
                <br />
                plus vite.
              </>
            }
            accent="outline"
            subtitle="Le circuit a vu passer trois décennies de pilotes, des premiers tours de roue en famille aux chronos de compétition. Voici son histoire, année après année."
            action={<RowArrows target="[data-histoire]" label="Histoire" className="flex gap-3" />}
          />

          <Histoire />

          <div data-reveal className="mt-14 flex flex-wrap gap-4">
            <Link href="/#flotte" className="btn btn-race">
              Voir les karts
            </Link>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "Homologué FFSA",
          "Protections Tecpro",
          "Apex Timing",
          "Créneaux compétition",
          "Piste éclairée en nocturne",
        ]}
      />
    </>
  );
}
