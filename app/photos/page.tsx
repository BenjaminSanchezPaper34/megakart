import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE, SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Photos — le circuit en plein jour et en nocturne",
  description:
    "Le circuit MegaKart en images : sessions de jour et nocturnes, Baby Kart, biplace, drapeau à damier, terrasse et vues aériennes du 1000 m de Vias-plage.",
  alternates: { canonical: "/photos" },
};

/* Galerie : photos officielles du circuit (shooting client). */
const PHOTOS: { src: string; alt: string }[] = [
  { src: "galerie-23-aerien-nuit.jpg", alt: "Le circuit MegaKart illuminé de nuit, vu du ciel" },
  { src: "galerie-01-kart-adulte.jpg", alt: "Pilote adulte en pleine session sur le circuit" },
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
              isPartOf: { "@id": `${SITE_URL}/#business` },
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

      <section className="mx-auto max-w-7xl px-5 pb-10 pt-40 md:px-8 md:pt-48">
        <p className="display mb-3 text-lg text-flag">Jour &amp; nocturne</p>
        <h1 className="display text-[clamp(2.8rem,7vw,6rem)] text-chalk">
          Le circuit
          <br />
          <span className="text-race">en images.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk-60">
          Sessions de jour, nocturnes sous les projecteurs, premiers tours
          en Baby Kart et vues du ciel — et un photographe sur place pour
          repartir avec vos propres souvenirs.
        </p>
      </section>

      {/* Grille masonry (colonnes CSS) */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {PHOTOS.map((p, i) => (
            <div key={p.src} className="card overflow-hidden !p-0">
              <Image
                src={`/images/${p.src}`}
                alt={p.alt}
                width={1200}
                height={800}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={i < 3}
                className="h-auto w-full transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a href={SITE.phoneHref} className="btn btn-race">
            Venir rouler · {SITE.phone}
          </a>
          <Link href="/la-piste" className="btn btn-ghost">
            Découvrir la piste
          </Link>
        </div>
      </section>
    </>
  );
}
