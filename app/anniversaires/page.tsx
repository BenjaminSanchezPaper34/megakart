import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Anniversaire karting à Vias — dès 7 ans, près d'Agde et Béziers",
  description:
    "Fêtez un anniversaire sur un vrai circuit de karting à Vias-plage : course à son nom, chrono sur écran géant, podium et terrasse ombragée pour le gâteau. Dès 7 participants, sur réservation au 09 50 28 95 91.",
  alternates: { canonical: "/anniversaires" },
};

const FAQ = [
  {
    q: "À partir de quel âge peut-on fêter un anniversaire chez MegaKart ?",
    a: "Dès que les enfants peuvent piloter : Baby Kart électrique dès 3 ans sur piste dédiée, Kart Enfant 160cc dès 7 ans (1,30 m minimum), et biplace avec un adulte dès 5 ans. Le format s'adapte à l'âge du groupe.",
  },
  {
    q: "Combien d'enfants minimum pour un anniversaire karting ?",
    a: "Les anniversaires se réservent à partir de 7 participants. Appelez le 09 50 28 95 91 pour construire la formule (nombre de sessions, format course ou endurance).",
  },
  {
    q: "Peut-on apporter le gâteau et les boissons ?",
    a: "Oui : la terrasse ombragée et les tables de pique-nique accueillent le goûter d'anniversaire, avec les parents en tribune.",
  },
  {
    q: "L'anniversaire est-il possible toute l'année ?",
    a: "Oui, sur réservation : le circuit est ouvert tous les jours, de 10 h à minuit trente en saison estivale et de 14 h à 19 h le reste de l'année.",
  },
];

export default function AnniversairesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Anniversaires", path: "/anniversaires" }]),
            faqJsonLd(FAQ),
          ]),
        }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[72svh] items-end overflow-hidden">
        <div data-hero-bg className="absolute inset-0">
          <Image
            src="/images/racer-kid.jpg"
            alt="Enfant hilare au volant d'un kart lors d'un anniversaire chez MegaKart"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-asphalt/65 via-asphalt/35 to-asphalt" />
        </div>
        <div data-hero-content className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-44 md:px-8">
          <p className="display mb-3 text-lg text-flag">Dès 7 participants · sur réservation</p>
          <h1 className="display text-[clamp(2.8rem,7vw,6rem)] text-chalk">
            L'anniversaire
            <br />
            <span className="text-race">pole position.</span>
          </h1>
        </div>
      </section>

      {/* Déroulé */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <h2 data-reveal className="display max-w-3xl text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
          Une vraie course, <span className="display-outline">pas une animation.</span>
        </h2>
        <div data-stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "La grille de départ",
              text: "Briefing pilotes, casques fournis, et chacun son kart adapté à son âge — du Baby Kart électrique au 160cc junior.",
            },
            {
              step: "02",
              title: "La course à son nom",
              text: "Sprint ou endurance, défis sur mesure : le chrono Apex Timing affiche les temps en direct sur l'écran LED géant.",
            },
            {
              step: "03",
              title: "Podium & goûter",
              text: "Remise de prix pour la star du jour, puis gâteau sur la terrasse ombragée pendant que les parents soufflent.",
            },
          ].map((s) => (
            <article key={s.step} className="card p-7">
              <p className="display text-4xl text-race">{s.step}</p>
              <h3 className="display mt-3 text-2xl text-chalk">{s.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-chalk-60">{s.text}</p>
            </article>
          ))}
        </div>
        <p data-reveal className="mt-10 max-w-2xl text-base leading-relaxed text-chalk-60">
          À deux minutes de Vias-plage, entre Fabrikus World et Europark
          Indoor — et à un quart d'heure d'Agde et de Béziers. Le circuit
          est homologué FFSA, avec moniteurs diplômés au bord de la piste.
        </p>
      </section>

      <Marquee
        items={[
          "Dès 7 participants",
          "Casques fournis",
          "Terrasse ombragée pour le gâteau",
          "Podium & remise de prix",
          "Dès 3 ans en Baby Kart",
        ]}
      />

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <h2 data-reveal className="display text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
          Les questions des parents
        </h2>
        <div data-stagger className="mt-10 flex flex-col gap-4">
          {FAQ.map((f) => (
            <details key={f.q} className="card group p-6 open:border-white/25">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-chalk [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="display shrink-0 text-2xl text-race transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-base leading-relaxed text-chalk-60">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-asphalt-2 py-20 text-center md:py-28">
        <div className="mx-auto max-w-2xl px-5">
          <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
            On réserve la date ?
          </h2>
          <p data-reveal className="mt-5 text-lg leading-relaxed text-chalk-60">
            Un coup de fil suffit : date, nombre de pilotes, format —
            et l'anniversaire est sur la grille.
          </p>
          <div data-reveal className="mt-9 flex flex-wrap justify-center gap-4">
            <a href={SITE.phoneHref} className="btn btn-race glow-race text-lg">
              {SITE.phone}
            </a>
            <Link href="/evenements" className="btn btn-ghost text-lg">
              EVG, EVJF &amp; entreprises
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
