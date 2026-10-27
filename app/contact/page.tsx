import type { Metadata } from "next";
import Link from "next/link";
import MapEmbed from "@/components/MapEmbed";
import OpenBadge from "@/components/OpenBadge";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";

export const metadata: Metadata = {
  title: "Contact & accès — Vias-plage, entre Fabrikus et Europark",
  description:
    "MegaKart, 301 Voie Communale du Tricot et des Tots, 34450 Vias — entre Fabrikus World et Europark Indoor. Tél : 09 50 28 95 91. Ouvert 7j/7 en été de 10h à minuit trente.",
  alternates: { canonical: "/contact" },
};


/* Carte d'info à émoji à cheval sur le haut (même motif que « Les grands jours »). */
const INFO_CARD = "card relative flex flex-col items-center gap-4 p-6 pt-12 text-center sm:p-7 sm:pt-12";
const INFO_TITLE = "display text-3xl text-chalk";
const INFO_MAIN = "display text-3xl leading-tight";
const INFO_TEXT = "text-base leading-relaxed text-chalk-60";
const INFO_LINK = "link-under mt-auto w-fit text-base font-semibold text-chalk";
const INFO_EMOJI =
  "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-5xl leading-none drop-shadow-[0_6px_10px_rgb(0_0_0/0.5)]";

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])),
        }}
      />

      <PageHero
        image={{ src: "/images/galerie-05-piste.jpg", alt: "La piste du circuit MegaKart bordée de palmiers", position: "object-[center_55%]" }}
        line1="On se retrouve"
        line2="sur la grille."
        subtitle="Sans réservation pour rouler : le plus simple est de passer. Pour les courses, les événements et les questions, un coup de fil ou un e-mail."
      />

      {/* Même gabarit que les autres pages : hero plein, puis sections à grand titre. */}
      <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
        <SectionHeader
          line1="Infos"
          line2="pratiques."
          accent="flag"
          subtitle="Téléphone, horaires, adresse et itinéraire : tout ce qu'il faut pour venir rouler."
        />
        {/* Trois cartes au même gabarit : titre, l'info principale en display, une phrase, un lien. */}
        <div className="mt-(--section-gap) grid gap-x-5 gap-y-12 pt-6 lg:grid-cols-3">
          {/* Téléphone */}
          <div data-reveal className={INFO_CARD}>
            <span aria-hidden="true" className={INFO_EMOJI}>📞</span>
            <h2 className={INFO_TITLE}>Téléphone</h2>
            <a href={SITE.phoneHref} className={`${INFO_MAIN} text-race transition-colors hover:text-chalk`}>
              {SITE.phone}
            </a>
            <p className={INFO_TEXT}>
              Horaires du jour, événements, courses : on répond pendant les heures d&rsquo;ouverture.
            </p>
            <a href={`mailto:${SITE.email}`} className={INFO_LINK}>
              {SITE.email}
            </a>
          </div>

          {/* Horaires */}
          <div data-reveal className={INFO_CARD}>
            <span aria-hidden="true" className={INFO_EMOJI}>🕑</span>
            <h2 className={INFO_TITLE}>Horaires</h2>
            <OpenBadge withDetail large />
            <p className={INFO_TEXT}>
              À partir du 2 novembre : du mercredi au dimanche, de 13 h à 18 h (fermé lundi et mardi).
              Fermeture annuelle en janvier et février.
            </p>
            <Link href="/agenda" className={INFO_LINK}>
              Le calendrier jour par jour
            </Link>
          </div>

          {/* Adresse */}
          <div data-reveal className={INFO_CARD}>
            <span aria-hidden="true" className={INFO_EMOJI}>📍</span>
            <h2 className={INFO_TITLE}>Adresse</h2>
            <address className={`${INFO_MAIN} not-italic text-chalk`}>
              {SITE.address.zip} {SITE.address.city}
            </address>
            <p className={INFO_TEXT}>
              {SITE.address.street}. {SITE.landmark}. Parking gratuit sur place.
            </p>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className={INFO_LINK}>
              Itinéraire Google Maps
            </a>
          </div>
        </div>

        {/* Carte (consentement bloquant) */}
        <div data-reveal className="race-event-card mt-(--section-gap) overflow-hidden">
          <MapEmbed />
        </div>
      </section>

    </>
  );
}
