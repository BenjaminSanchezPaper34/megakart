import type { Metadata } from "next";
import Link from "next/link";
import TrackMap from "@/components/TrackMap";
import Marquee from "@/components/Marquee";
import Histoire from "@/components/Histoire";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";

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
        image={{ src: "/images/galerie-23-aerien-nuit.jpg", alt: "Le circuit MegaKart illuminé de nuit, vu du ciel au cœur de la zone de loisirs de Vias-plage" }}
        label="Homologué FFSA & Préfecture · éclairé en nocturne"
        line1="La piste."
        line2="1000 m de pilotage."
        subtitle="Esses, épingles, relances et vraies lignes droites, sur un tracé large de 8,5 m."
      />

      {/* Specs */}
      <section className="mx-auto max-w-7xl px-5 pb-(--section-y) md:px-8">
        <dl data-stagger className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
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
              line1="Un tracé qui se"
              line2="mérite."
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

      {/* Sécurité + chrono */}
      <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
        <SectionHeader line1="Sensations," line2="sans les surprises." accent="outline" />
        <div data-stagger className="mt-(--section-gap) grid gap-x-5 gap-y-12 pt-6 md:grid-cols-2">
          <article className="card relative p-6 pt-12 sm:p-8 sm:pt-12">
            <span aria-hidden="true" className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-5xl leading-none drop-shadow-[0_6px_10px_rgb(0_0_0/0.5)]">🛡️</span>
            <h2 className="display text-center text-3xl text-chalk">Sécurité type Formule 1</h2>
            <p className="mt-4 text-base leading-relaxed text-chalk-60">
              Le circuit est équipé des protections Tecpro dernière génération, la même technologie que sur les
              circuits de Formule 1. Homologations régulières FFSA et Préfecture, moniteurs diplômés et personnel
              qualifié en permanence au bord de la piste.
            </p>
          </article>
          <article className="card relative p-6 pt-12 sm:p-8 sm:pt-12">
            <span aria-hidden="true" className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-5xl leading-none drop-shadow-[0_6px_10px_rgb(0_0_0/0.5)]">⏱️</span>
            <h2 className="display text-center text-3xl text-chalk">Le chrono, juge de paix</h2>
            <p className="mt-4 text-base leading-relaxed text-chalk-60">
              Chronométrage professionnel Apex Timing : chaque tour est mesuré au dixième et le classement
              s&rsquo;affiche en direct sur l&rsquo;écran LED géant. On repart toujours avec un temps à battre.
            </p>
            <Link href="/live" className="link-under mt-4 inline-block text-base font-semibold text-chalk">
              Voir le chrono en direct
            </Link>
          </article>
        </div>
      </section>

      {/* Histoire — frise + archives familiales */}
      <section id="histoire" className="scroll-mt-28 bg-asphalt-2 py-(--section-y)">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="mb-5 inline-flex rounded-full bg-flag px-4 py-1.5 text-sm font-bold text-asphalt">
            Trente-quatre ans de piste
          </p>
          <SectionHeader
            line1="Depuis 1992,"
            line2="et toujours plus vite."
            accent="outline"
            subtitle="Le circuit a vu passer trois décennies de pilotes, des premiers tours de roue en famille aux chronos de compétition. Voici son histoire, année après année."
          />

          <Histoire />

          <div data-reveal className="mt-14 flex flex-wrap gap-4">
            <Link href="/#flotte" className="btn btn-race">
              Voir les karts
            </Link>
            <a href={SITE.phoneHref} className="btn btn-ghost">
              Créneaux compétition
            </a>
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
