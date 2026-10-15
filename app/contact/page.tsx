import type { Metadata } from "next";
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
const INFO_CARD = "card relative flex flex-col gap-4 p-6 pt-12 sm:p-7 sm:pt-12";
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
        <div className="mt-(--section-gap) grid gap-x-5 gap-y-12 pt-6 lg:grid-cols-3">
          {/* Téléphone */}
          <div data-reveal className={INFO_CARD}>
            <span aria-hidden="true" className={INFO_EMOJI}>📞</span>
            <h2 className="display text-center text-3xl text-chalk">Téléphone &amp; e-mail</h2>
            <a href={SITE.phoneHref} className="display text-center text-4xl text-race transition-colors hover:text-chalk">
              {SITE.phone}
            </a>
            <p className="text-base leading-relaxed text-chalk-60">
              Horaires du jour, événements, créneaux compétition : on répond pendant les heures d&rsquo;ouverture.
            </p>
            <a href={`mailto:${SITE.email}`} className="link-under w-fit text-base font-semibold text-chalk">
              {SITE.email}
            </a>
            <p className="text-base leading-relaxed text-chalk-60">
              Réservation des courses et du Pack Découverte par téléphone ou par e-mail.
            </p>
          </div>

          {/* Horaires */}
          <div data-reveal className={INFO_CARD}>
            <span aria-hidden="true" className={INFO_EMOJI}>🕑</span>
            <h2 className="display text-center text-3xl text-chalk">Horaires</h2>
            <OpenBadge withDetail />
            <p className="text-base leading-relaxed text-chalk-60">
              Hors saison : tous les jours de 14 h à 19 h (en octobre hors vacances : fermé lundi et mardi),
              fermeture annuelle en janvier et février. Courses et journées spéciales annoncées dans l&rsquo;agenda
              et sur nos réseaux.
            </p>
          </div>

          {/* Adresse */}
          <div data-reveal className={INFO_CARD}>
            <span aria-hidden="true" className={INFO_EMOJI}>📍</span>
            <h2 className="display text-center text-3xl text-chalk">Adresse</h2>
            <address className="text-base not-italic leading-relaxed text-chalk">
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city} · {SITE.address.dept}
            </address>
            <p className="text-base leading-relaxed text-chalk-60">{SITE.landmark}. Parking gratuit sur place.</p>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-under w-fit text-base font-semibold text-chalk"
            >
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
