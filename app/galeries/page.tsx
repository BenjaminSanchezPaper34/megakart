import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getGaleries } from "@/lib/galeries";
import { SITE } from "@/lib/site";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import CarteGalerie from "@/components/galerie/CarteGalerie";

export const metadata: Metadata = {
  title: "Vos photos — galeries des courses et événements",
  description:
    "Les photos des courses et des événements du circuit MegaKart à Vias : retrouvez-vous et téléchargez vos photos en qualité originale, une par une ou toutes d'un coup.",
  alternates: { canonical: "/galeries" },
};

export default function GaleriesPage() {
  const galeries = getGaleries();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Vos photos", path: "/galeries" }])) }}
      />

      <PageHero
        image={galeries[0] ? { src: galeries[0].couverture, alt: galeries[0].titre } : { src: "/images/galerie-03-drapeau-damier.jpg", alt: "Drapeau à damier" }}
        line1="Vos photos,"
        line2="en qualité originale."
        subtitle="Vous avez roulé lors d'une course ou d'un événement ? Retrouvez-vous et téléchargez vos photos, une par une ou toutes d'un coup."
      />

      <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
        <SectionHeader line1="Les" line2="galeries." accent="flag" subtitle="De la plus récente à la plus ancienne." />
        <div data-stagger className="mt-(--section-gap) grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galeries.map((g) => (
            <CarteGalerie key={g.slug} g={g} />
          ))}
        </div>
        <p className="mt-(--section-gap) max-w-3xl text-base leading-relaxed text-chalk-60">
          Vous apparaissez sur une photo et souhaitez qu&rsquo;elle soit retirée ? Écrivez à{" "}
          <a href={`mailto:${SITE.email}?subject=Retrait%20d%27une%20photo`} className="link-under font-semibold text-chalk">
            {SITE.email}
          </a>{" "}
          en indiquant la galerie et la photo : elle est retirée rapidement.
        </p>
      </section>
    </>
  );
}
