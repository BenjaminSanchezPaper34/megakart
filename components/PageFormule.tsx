import Link from "next/link";
import type { ReactNode } from "react";
import { SITE, SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import type { FormuleId } from "@/lib/demande-evenement";
import Faq from "@/components/system/Faq";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import EmojiList, { type EmojiItem } from "@/components/system/EmojiList";
import DemandeEvenement from "@/components/DemandeEvenement";

/**
 * Gabarit des pages dédiées à une formule privée (anniversaire, EVG/EVJF,
 * entreprises & CE), créé le 21/11/2026 pour le référencement : une page par
 * intention de recherche au lieu des trois sections de /evenements.
 * Hero, sections texte + émojis en fonds alternés, déroulé, FAQ, formulaire
 * de devis avec la formule cochée. JSON-LD : fil d'Ariane, Service, FAQ.
 */
export type FormuleSection = { id: string; title: string; text: string[]; facts: EmojiItem[] };

export type FormuleData = {
  formule: FormuleId;
  path: string;
  /** Nom court pour le fil d'Ariane. */
  crumb: string;
  hero: { image: { src: string; alt: string; position?: string }; label: string; line1: string; line2: string; subtitle: string };
  sections: FormuleSection[];
  deroule: { line1: string; line2: string; subtitle: string; items: EmojiItem[] };
  faq: { q: string; a: string }[];
  demande: { line1: string; line2: string; subtitle: string };
  service: { name: string; serviceType: string; description: string };
  /** Renvoi vers les autres formules, en fin de page. */
  autres: ReactNode;
};

const AREA = ["Vias", "Agde", "Béziers", "Sérignan", "Portiragnes", "Pézenas", "Sète", "Hérault"];

export default function PageFormule({ data }: { data: FormuleData }) {
  const { hero, sections, deroule, faq, demande } = data;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    ...data.service,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: AREA,
    url: `${SITE_URL}${data.path}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Événements", path: "/evenements" },
              { name: data.crumb, path: data.path },
            ]),
            service,
            faqJsonLd(faq),
          ]),
        }}
      />

      <PageHero
        image={hero.image}
        label={hero.label}
        line1={hero.line1}
        line2={hero.line2}
        subtitle={hero.subtitle}
        action={
          <a href="#demande" className="btn btn-race">
            Demander un devis
          </a>
        }
      />

      {sections.map((s, i) => (
        <section key={s.id} id={s.id} className={`scroll-mt-24 py-(--section-y) ${i % 2 === 0 ? "bg-asphalt-2" : ""}`}>
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeader line1={s.title} />
            <div className="mt-6 grid items-start gap-(--section-gap) lg:grid-cols-[1.2fr_1fr]">
              <div>
                {s.text.map((t) => (
                  <p key={t} data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-chalk first:mt-0 md:text-lg">
                    {t}
                  </p>
                ))}
              </div>
              <EmojiList items={s.facts} />
            </div>
          </div>
        </section>
      ))}

      <section id="deroule" className={`scroll-mt-24 py-(--section-y) ${sections.length % 2 === 0 ? "bg-asphalt-2" : ""}`}>
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader line1={deroule.line1} line2={deroule.line2} subtitle={deroule.subtitle} />
          <EmojiList items={deroule.items} layout="row" className="mt-(--section-gap)" />
          <p data-reveal className="mt-(--section-gap) max-w-3xl text-base leading-relaxed text-chalk-60">
            Les karts, les âges et les tarifs à la session sont sur{" "}
            <Link href="/#flotte" className="link-under font-semibold text-chalk">
              la page d&rsquo;accueil
            </Link>
            , le tracé et le circuit sur{" "}
            <Link href="/la-piste" className="link-under font-semibold text-chalk">
              La piste
            </Link>
            .
          </p>
        </div>
      </section>

      <Faq items={faq} />

      <div className="kerb" aria-hidden="true" />

      <section id="demande" className="relative scroll-mt-24 overflow-hidden py-(--section-y)">
        <div className="checker absolute inset-x-0 top-0 h-5 opacity-[0.07]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader line1={demande.line1} line2={demande.line2} subtitle={demande.subtitle} />
          <div data-reveal className="mt-(--section-gap)">
            <DemandeEvenement formuleInitiale={data.formule} />
          </div>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-chalk-60">
            Plutôt de vive voix ? Le{" "}
            <a href={SITE.phoneHref} className="link-under font-semibold text-chalk">
              {SITE.phone}
            </a>{" "}
            et{" "}
            <a href={`mailto:${SITE.email}`} className="link-under font-semibold text-chalk">
              {SITE.email}
            </a>{" "}
            répondent aussi. {data.autres}
          </p>
        </div>
      </section>
    </>
  );
}
