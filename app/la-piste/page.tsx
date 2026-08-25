import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TrackMap from "@/components/TrackMap";
import Marquee from "@/components/Marquee";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "La piste — 1000 m homologués FFSA à Vias",
  description:
    "1000 m de long, 8,5 m de large, protections Tecpro comme en F1, chronométrage Apex Timing : découvrez le circuit outdoor MegaKart à Vias-plage, homologué FFSA depuis 2012 pour la compétition.",
  alternates: { canonical: "/la-piste" },
};

const SPECS = [
  { value: "1000 m", label: "de longueur" },
  { value: "8,5 m", label: "de largeur" },
  { value: "Cat. 1.1", label: "location & compétition" },
  { value: "Tecpro", label: "protections type F1" },
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

      {/* Hero photo aérienne */}
      <section className="relative flex min-h-[72svh] items-end overflow-hidden">
        <div data-hero-bg className="absolute inset-0">
          <Image
            src="/images/galerie-23-aerien-nuit.jpg"
            alt="Le circuit MegaKart illuminé de nuit, vu du ciel au cœur de la zone de loisirs de Vias-plage"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-asphalt/55 via-asphalt/25 to-asphalt" />
        </div>
        <div data-hero-content className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-44 md:px-8">
          <p className="display mb-3 text-lg text-flag">Homologué FFSA &amp; Préfecture · éclairé en nocturne</p>
          <h1 className="display text-[clamp(2.8rem,7vw,6rem)] text-chalk">
            La piste.
          </h1>
        </div>
      </section>

      {/* Specs */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <dl data-stagger className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {SPECS.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="display text-4xl text-chalk md:text-5xl">{s.value}</dd>
              <dt className="mt-2 text-sm text-chalk-60">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Tracé animé */}
      <section className="bg-asphalt-2 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
          <TrackMap className="order-2 w-full lg:order-1" />
          <div className="order-1 lg:order-2">
            <h2 data-reveal className="display text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
              Un tracé qui se
              <br />
              <span className="text-race">mérite.</span>
            </h2>
            <p data-reveal className="mt-6 text-base leading-relaxed text-chalk-60">
              Enchaînements d'esses, épingles serrées, relances et vraies
              lignes droites : 1000 mètres dessinés pour apprendre les
              trajectoires — et les soigner. La largeur de 8,5 m laisse
              toujours la place de tenter un dépassement proprement.
            </p>
            <p data-reveal className="mt-4 text-base leading-relaxed text-chalk-60">
              Le soir en été, la piste s'éclaire et le circuit roule
              jusqu'à minuit trente : les sessions nocturnes sont une
              autre expérience.
            </p>
          </div>
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Sécurité + chrono */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div data-stagger className="grid gap-6 md:grid-cols-2">
          <article className="card p-8">
            <span className="checker-sm mb-5 block h-5 w-10 opacity-60" aria-hidden="true" />
            <h2 className="display text-3xl text-chalk">Sécurité type Formule 1</h2>
            <p className="mt-4 text-base leading-relaxed text-chalk-60">
              Le circuit est équipé des protections Tecpro dernière
              génération — la même technologie que sur les circuits de
              Formule 1. Homologations régulières FFSA et Préfecture,
              moniteurs diplômés et personnel qualifié en permanence au
              bord de la piste : les sensations, sans les mauvaises surprises.
            </p>
          </article>
          <article className="card p-8">
            <span className="checker-sm mb-5 block h-5 w-10 opacity-60" aria-hidden="true" />
            <h2 className="display text-3xl text-chalk">Le chrono, juge de paix</h2>
            <p className="mt-4 text-base leading-relaxed text-chalk-60">
              Chronométrage professionnel Apex Timing : chaque tour est
              mesuré au dixième et le classement s'affiche en direct sur
              l'écran LED géant. On repart toujours avec un temps à battre —
              le vôtre, ou celui de la table d'à côté.
            </p>
          </article>
        </div>
      </section>

      {/* Histoire + compétition */}
      <section className="bg-asphalt-2 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 data-reveal className="display text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
              Depuis 1992,
              <br />
              <span className="display-outline">et toujours plus vite.</span>
            </h2>
            <p data-reveal className="mt-6 text-base leading-relaxed text-chalk-60">
              Né en 1992 comme circuit de location, MegaKart s'est
              considérablement agrandi en 2012 pour passer en catégorie 1.1 :
              le circuit accueille désormais la compétition, avec des créneaux
              dédiés aux pilotes licenciés et à leurs karts personnels.
            </p>
            <p data-reveal className="mt-4 text-base leading-relaxed text-chalk-60">
              Amateurs d'un soir ou chasseurs de chronos, tout le monde
              partage le même asphalte — chacun sur son créneau.
            </p>
            <div data-reveal className="mt-8 flex flex-wrap gap-4">
              <Link href="/tarifs" className="btn btn-race">
                Voir les karts
              </Link>
              <a href={SITE.phoneHref} className="btn btn-ghost">
                Créneaux compétition
              </a>
            </div>
          </div>
          <div data-reveal className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/images/piste-aerial.jpg"
              alt="Vue aérienne complète du circuit MegaKart et de la zone de loisirs de Vias-plage"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
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
