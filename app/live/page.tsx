import type { Metadata } from "next";
import Link from "next/link";
import LiveTiming from "@/components/LiveTiming";
import Marquee from "@/components/Marquee";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Chrono en direct — classement live Apex Timing",
  description:
    "Suivez le chronométrage en direct du circuit MegaKart à Vias : classement live, meilleur tour, temps par secteur. Le chrono Apex Timing du circuit, accessible depuis chez vous.",
  alternates: { canonical: "/live" },
};

export default function LivePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: "Chrono en direct", path: "/live" }])),
        }}
      />

      {/* Hero court */}
      <section className="relative overflow-hidden pb-12 pt-40 md:pb-16 md:pt-48">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="display mb-3 text-lg text-flag">Chronométrage Apex Timing</p>
          <h1 className="display text-[clamp(2.8rem,7vw,6rem)] text-chalk">
            Le chrono,
            <br />
            <span className="text-race">en direct.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk-60">
            Le même classement que sur l&rsquo;écran LED du circuit : chaque
            tour mesuré au dixième, les positions qui bougent, le meilleur
            tour de la session. À suivre depuis la terrasse — ou de chez vous
            les jours de course.
          </p>
        </div>
      </section>

      {/* Le live */}
      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
        <LiveTiming />
        <p className="mt-4 text-sm text-chalk-60">
          Le classement n&rsquo;apparaît que pendant les sessions : hors
          ouverture, l&rsquo;écran reste vide. Horaires et jours de course
          dans l&rsquo;{" "}
          <Link href="/agenda" className="link-under font-semibold text-chalk">
            agenda
          </Link>
          .
        </p>
      </section>

      <Marquee
        items={[
          "Mesure au dixième",
          "Classement live",
          "Meilleur tour de session",
          "Temps par secteur",
          "Écran LED géant au bord de piste",
        ]}
      />

      {/* Comment ça marche */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <h2 data-reveal className="display text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
          Comment lire <span className="text-flag">votre chrono</span>
        </h2>
        <div data-stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Votre numéro de kart",
              text: "Chaque kart porte un transpondeur : votre numéro apparaît au classement dès le premier passage sur la ligne.",
            },
            {
              step: "02",
              title: "Le tour de référence",
              text: "Le meilleur tour de la session s'affiche à côté du cumul. C'est lui qui compte pour l'accès aux 250 RX et pour les qualifications des courses.",
            },
            {
              step: "03",
              title: "Les secteurs",
              text: "Le tracé est découpé en secteurs : comparez-les d'un tour à l'autre pour voir où vous perdez — les esses, l'épingle ou la relance.",
            },
          ].map((s) => (
            <article key={s.step} className="card p-7">
              <p className="display text-4xl text-race">{s.step}</p>
              <h3 className="display mt-3 text-2xl text-chalk">{s.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-chalk-60">{s.text}</p>
            </article>
          ))}
        </div>
        <div data-reveal className="mt-10 flex flex-wrap gap-4">
          <Link href="/agenda" className="btn btn-race">
            Les courses à venir
          </Link>
          <Link href="/la-piste" className="btn btn-ghost">
            Découvrir la piste
          </Link>
          <a href={SITE.phoneHref} className="btn btn-ghost">
            {SITE.phone}
          </a>
        </div>
      </section>
    </>
  );
}
