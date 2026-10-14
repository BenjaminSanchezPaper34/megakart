import type { Metadata } from "next";
import Link from "next/link";
import LiveTiming from "@/components/LiveTiming";
import Marquee from "@/components/Marquee";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import EmojiCards from "@/components/system/EmojiCards";
import CtaFinal from "@/components/system/CtaFinal";

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

      <PageHero
        short
        image={{ src: "/images/galerie-12-kart-adulte.jpg", alt: "Pilote en plein virage sur le circuit MegaKart", position: "object-[center_45%]" }}
        label="Chronométrage Apex Timing"
        line1="Le chrono,"
        line2="en direct."
        subtitle="Le même classement que sur l'écran LED du circuit : chaque tour mesuré au dixième, à suivre depuis la terrasse ou de chez vous les jours de course."
      />

      {/* Le live */}
      <section className="mx-auto max-w-7xl px-5 pb-(--section-y) md:px-8">
        <LiveTiming />
        <p className="mt-4 text-sm text-chalk-60">
          Le classement n&rsquo;apparaît que pendant les sessions : hors ouverture, l&rsquo;écran reste vide. Horaires
          et jours de course dans l&rsquo;{" "}
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
      <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
        <SectionHeader line1="Comment lire" line2="votre chrono." accent="flag" />
        <EmojiCards
          items={[
            {
              emoji: "🔢",
              title: "Votre numéro de kart",
              text: "Chaque kart porte un transpondeur : votre numéro apparaît au classement dès le premier passage sur la ligne.",
            },
            {
              emoji: "🏆",
              title: "Le tour de référence",
              text: "Le meilleur tour de la session s'affiche à côté du cumul. C'est lui qui compte pour l'accès aux 250 RX et pour les qualifications des courses.",
            },
            {
              emoji: "🧭",
              title: "Les secteurs",
              text: "Le tracé est découpé en secteurs : comparez-les d'un tour à l'autre pour voir où vous perdez, dans les esses, l'épingle ou la relance.",
            },
          ]}
        />
      </section>

      <CtaFinal line1="Un temps" line2="à battre ?">
        <Link href="/agenda" className="btn btn-race">
          Les courses à venir
        </Link>
        <Link href="/la-piste" className="btn btn-ghost">
          Découvrir la piste
        </Link>
        <a href={SITE.phoneHref} className="btn btn-ghost">
          {SITE.phone}
        </a>
      </CtaFinal>
    </>
  );
}
