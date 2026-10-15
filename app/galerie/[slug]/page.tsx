import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getGalerie, getGaleries } from "@/lib/galeries";
import { formatDate } from "@/lib/agenda";
import { SITE, SITE_URL } from "@/lib/site";
import PageHero from "@/components/system/PageHero";
import ClientGallery from "@/components/galerie/ClientGallery";
import GalleryIntro from "@/components/galerie/GalleryIntro";
import CopyLinkButton from "@/components/galerie/CopyLinkButton";
import CarteGalerie from "@/components/galerie/CarteGalerie";

/* Une page statique par galerie ; adresse inconnue = 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getGaleries().map((g) => ({ slug: g.path }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const g = getGalerie((await params).slug);
  if (!g) return {};
  const f = formatDate(g.date);
  return {
    title: `${g.titre} — photos ${g.kicker}, ${f.day} ${f.monthFull} ${g.date.slice(0, 4)}`,
    description: `${g.accroche} ${g.count} photos à télécharger en qualité originale.`,
    alternates: { canonical: `/galerie/${g.path}` },
    openGraph: { images: [{ url: g.couverture }] },
  };
}

export default async function GaleriePage({ params }: Params) {
  const g = getGalerie((await params).slug);
  if (!g) notFound();
  const f = formatDate(g.date);
  const autres = getGaleries().filter((x) => x.slug !== g.slug).slice(0, 3);
  const url = `${SITE_URL}/galerie/${g.path}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Vos photos", path: "/galeries" },
              { name: g.titre, path: `/galerie/${g.path}` },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              name: g.titre,
              url,
              datePublished: g.date,
              about: { "@id": `${SITE_URL}/#business` },
              image: g.photos.slice(0, 10).map((p) => p.display),
            },
          ]),
        }}
      />

      <PageHero
        short
        image={{ src: g.couverture, alt: `${g.kicker} chez MegaKart — ${g.titre}` }}
        line1={g.titre}
        subtitle={`${f.weekday.charAt(0).toUpperCase()}${f.weekday.slice(1)} ${f.day} ${f.monthFull} ${g.date.slice(0, 4)} · ${g.kicker} · ${g.count} photos. ${g.accroche}`}
        action={<CopyLinkButton url={url} />}
      />

      {g.intro && (
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <GalleryIntro text={g.intro} />
        </div>
      )}

      <div className="mt-(--section-gap)">
        <ClientGallery gallery={g} />
      </div>

      <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
        <p className="max-w-3xl text-base leading-relaxed text-chalk-60">
          Vous apparaissez sur une photo et souhaitez qu&rsquo;elle soit retirée ? Écrivez à{" "}
          <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Retrait d'une photo · ${g.titre}`)}`} className="link-under font-semibold text-chalk">
            {SITE.email}
          </a>{" "}
          en indiquant la photo : elle est retirée rapidement.
        </p>
        {autres.length > 0 && (
          <>
            <h2 className="display mt-(--section-gap) text-[clamp(2.6rem,6vw,4.75rem)] leading-none text-chalk">
              Les autres galeries
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {autres.map((x) => (
                <CarteGalerie key={x.slug} g={x} />
              ))}
            </div>
          </>
        )}
        <Link href="/galeries" className="btn btn-ghost mt-10">
          Toutes les galeries
        </Link>
      </section>
    </>
  );
}
