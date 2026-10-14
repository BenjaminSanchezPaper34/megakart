import type { Metadata } from "next";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import EmojiCards from "@/components/system/EmojiCards";
import Faq from "@/components/system/Faq";
import CtaFinal from "@/components/system/CtaFinal";

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
    a: "Les anniversaires se réservent à partir de 7 participants. Appelez le 09 50 28 95 91 ou écrivez à contact@megakart.fr pour construire la formule (nombre de sessions, format course ou endurance).",
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

      <PageHero
        image={{ src: "/images/racer-kid.jpg", alt: "Enfant hilare au volant d'un kart lors d'un anniversaire chez MegaKart", position: "object-[center_30%]" }}
        label="Dès 7 participants · sur réservation"
        line1="L'anniversaire"
        line2="pole position."
        subtitle="Une course à son nom, le chrono sur l'écran géant, le podium, puis le gâteau sur la terrasse."
      />

      {/* Déroulé */}
      <section className="bg-asphalt-2 py-(--section-y)">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader
            line1="Une vraie course,"
            line2="pas une animation."
            accent="outline"
            subtitle="À deux minutes de Vias-plage, à un quart d'heure d'Agde et de Béziers : circuit homologué FFSA, moniteurs diplômés au bord de la piste."
          />
          <EmojiCards
            items={[
              {
                emoji: "🏁",
                title: "La grille de départ",
                text: "Briefing pilotes, casques fournis, et chacun son kart adapté à son âge, du Baby Kart électrique au 160cc junior.",
              },
              {
                emoji: "⏱️",
                title: "La course à son nom",
                text: "Sprint ou endurance, défis sur mesure : le chrono Apex Timing affiche les temps en direct sur l'écran LED géant.",
              },
              {
                emoji: "🎂",
                title: "Podium & goûter",
                text: "Remise de prix pour la star du jour, puis gâteau sur la terrasse ombragée pendant que les parents soufflent.",
              },
            ]}
          />
        </div>
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

      <Faq items={FAQ} line1="Les questions" line2="des parents." />

      <div className="kerb" aria-hidden="true" />

      <CtaFinal
        line1="On réserve"
        line2="la date ?"
        subtitle="Un coup de fil ou un e-mail suffit : date, nombre de pilotes, format, et l'anniversaire est sur la grille."
      >
        <a href={SITE.phoneHref} className="btn btn-race">
          {SITE.phone}
        </a>
        <a href={`mailto:${SITE.email}`} className="btn btn-ghost">
          {SITE.email}
        </a>
        <Link href="/evenements" className="btn btn-ghost">
          EVG, EVJF &amp; entreprises
        </Link>
      </CtaFinal>
    </>
  );
}
