import type { Metadata } from "next";
import Link from "next/link";
import GalleryGrid from "@/components/GalleryGrid";
import ReelsRow from "@/components/ReelsRow";
import { SITE, SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getGaleries } from "@/lib/galeries";
import CarteGalerie from "@/components/galerie/CarteGalerie";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import CtaFinal from "@/components/system/CtaFinal";

export const metadata: Metadata = {
  title: "Photos & vidéos — le circuit en plein jour et en nocturne",
  description:
    "Le circuit MegaKart en images et en vidéo : réels du circuit, sessions de jour et nocturnes, Baby Kart, biplace, drapeau à damier et vues aériennes du 1000 m de Vias-plage.",
  alternates: { canonical: "/photos" },
};

/* Galerie : photos officielles du circuit (shooting client). */
const PHOTOS: { src: string; alt: string }[] = [
  { src: "galerie-23-aerien-nuit.jpg", alt: "Le circuit MegaKart illuminé de nuit, vu du ciel" },
  { src: "galerie-01-kart-adulte.jpg", alt: "Pilote adulte en pleine session sur le circuit" },
  { src: "galerie-26-pilote-rx250.jpg", alt: "Pilote casqué en pleine courbe au volant d'un kart Sodi RX250" },
  { src: "galerie-07-baby-kart.jpg", alt: "Enfant au volant d'un Baby Kart électrique" },
  { src: "galerie-03-drapeau-damier.jpg", alt: "Le drapeau à damier agité en fin de course" },
  { src: "galerie-06-biplace.jpg", alt: "Kart biplace : un adulte et un enfant partagent la session" },
  { src: "galerie-15-nocturne-grande-roue.jpg", alt: "Session nocturne avec la grande roue illuminée en arrière-plan" },
  { src: "galerie-05-piste.jpg", alt: "La piste bordée de palmiers sous le soleil de Vias" },
  { src: "galerie-02-kart-enfant.jpg", alt: "Jeune pilote en kart enfant 160cc" },
  { src: "galerie-09-terrasse.jpg", alt: "La terrasse et le stand du circuit" },
  { src: "galerie-08-nocturne.jpg", alt: "Kart sous les projecteurs en session nocturne" },
  { src: "galerie-19-famille.jpg", alt: "Moment en famille sur le circuit" },
  { src: "galerie-04-paddock.jpg", alt: "La grille de karts alignés au paddock" },
  { src: "galerie-25-casques.jpg", alt: "Les casques du circuit alignés sur les étagères du stand" },
  { src: "galerie-16-jeune-pilote.jpg", alt: "Jeune pilote casqué prêt à s'élancer" },
  { src: "galerie-22-aerien-crepuscule.jpg", alt: "Vue aérienne du circuit au crépuscule" },
  { src: "galerie-12-kart-adulte.jpg", alt: "Pilote en plein virage" },
  { src: "galerie-14-enfant-nocturne.jpg", alt: "Enfant en kart lors d'une session du soir" },
  { src: "galerie-11-kart-parc.jpg", alt: "Kart devant les attractions du parc de loisirs" },
  { src: "galerie-20-famille.jpg", alt: "Parent et enfant en biplace" },
  { src: "galerie-10-nocturne.jpg", alt: "Session nocturne sur le circuit éclairé" },
  { src: "galerie-18-equipe.jpg", alt: "L'équipe MegaKart accompagne un jeune pilote" },
  { src: "galerie-17-nocturne-action.jpg", alt: "Kart en pleine action de nuit" },
  { src: "galerie-21-famille.jpg", alt: "Sortie karting en famille" },
  { src: "galerie-13-nocturne.jpg", alt: "Ambiance nocturne sur la piste" },
  { src: "galerie-24-aerien-nuit.jpg", alt: "Le circuit et le parc de loisirs illuminés, vus du ciel" },
];

export default function PhotosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Photos", path: "/photos" }]),
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "@id": `${SITE_URL}/photos`,
              name: "Photos du circuit MegaKart",
              isPartOf: { "@id": `${SITE_URL}/#website` },
              about: { "@id": `${SITE_URL}/#business` },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: PHOTOS.map((p, i) => ({
                  "@type": "ImageObject",
                  position: i + 1,
                  contentUrl: `${SITE_URL}/images/${p.src}`,
                  description: p.alt,
                })),
              },
            },
          ]),
        }}
      />

      <PageHero
        image={{ src: "/images/galerie-15-nocturne-grande-roue.jpg", alt: "Session nocturne sur le circuit MegaKart, grande roue illuminée en arrière-plan", position: "object-[center_45%]" }}
        line1="Le circuit"
        line2="en images."
        subtitle="Sessions de jour, nocturnes sous les projecteurs, premiers tours en Baby Kart et vues du ciel, avec un photographe sur place pour repartir avec vos souvenirs."
      />

      {/* Les galeries des événements (photos à télécharger) : elles ont leur page, /galeries. */}
      <section id="galeries" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-(--section-y) md:px-8">
        <SectionHeader
          line1="Vous avez roulé"
          line2="chez nous ?"
          subtitle="Courses, sorties d'entreprise, sessions : retrouvez-vous dans les galeries et téléchargez vos photos en qualité originale."
        />
        <div data-stagger className="mt-(--section-gap) grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Toutes les galeries ici : pas de page d'index séparée (choix Benjamin 15/10). */}
          {getGaleries().map((g) => (
            <CarteGalerie key={g.slug} g={g} />
          ))}
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Le circuit en images, sans titre : 3 réels en colonnes, puis la galerie dans le même alignement. */}
      <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
        <ReelsRow grid limit={3} />
        <div className="mt-4">
          <GalleryGrid photos={PHOTOS} />
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      <CtaFinal line1="À votre tour" line2="de rouler." subtitle="Sans réservation : on arrive, on s'équipe, on roule.">
        <a href={SITE.phoneHref} className="btn btn-race">
          Venir rouler · {SITE.phone}
        </a>
        <Link href="/la-piste" className="btn btn-ghost">
          Découvrir la piste
        </Link>
      </CtaFinal>
    </>
  );
}
