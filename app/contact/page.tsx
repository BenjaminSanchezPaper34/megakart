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

const SOCIALS = [
  { label: "Instagram", href: SITE.social.instagram, handle: "@karting_megakart", emoji: "📸" },
  { label: "Facebook", href: SITE.social.facebook, handle: "megakart.karting", emoji: "👍" },
  { label: "TikTok", href: SITE.social.tiktok, handle: "@megakart34", emoji: "🎵" },
  { label: "YouTube", href: SITE.social.youtube, handle: "MegaKart", emoji: "▶️" },
  { label: "TripAdvisor", href: SITE.social.tripadvisor, handle: "Avis voyageurs", emoji: "⭐" },
].filter((s) => s.href);

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
        short
        image={{ src: "/images/galerie-05-piste.jpg", alt: "La piste du circuit MegaKart bordée de palmiers", position: "object-[center_55%]" }}
        label="Sans réservation pour rouler"
        line1="On se retrouve"
        line2="sur la grille."
        subtitle="Le plus simple est de passer. Pour les courses, les événements et les questions : un coup de fil ou un e-mail."
      />

      <section className="mx-auto max-w-7xl px-5 pb-(--section-y) md:px-8">
        <div className="grid gap-x-5 gap-y-12 pt-6 lg:grid-cols-3">
          {/* Téléphone */}
          <div data-reveal className={INFO_CARD}>
            <span aria-hidden="true" className={INFO_EMOJI}>📞</span>
            <h2 className="display text-center text-3xl text-chalk">Téléphone &amp; e-mail</h2>
            <a href={SITE.phoneHref} className="display text-center text-4xl text-race transition-colors hover:text-chalk">
              {SITE.phone}
            </a>
            <p className="text-sm leading-relaxed text-chalk-60">
              Horaires du jour, événements, créneaux compétition : on répond pendant les heures d&rsquo;ouverture.
            </p>
            <a href={`mailto:${SITE.email}`} className="link-under w-fit text-base font-semibold text-chalk">
              {SITE.email}
            </a>
            <p className="text-sm leading-relaxed text-chalk-60">
              Réservation des courses et du Pack Découverte par téléphone ou par e-mail.
            </p>
          </div>

          {/* Horaires */}
          <div data-reveal className={INFO_CARD}>
            <span aria-hidden="true" className={INFO_EMOJI}>🕑</span>
            <h2 className="display text-center text-3xl text-chalk">Horaires</h2>
            <OpenBadge withDetail />
            <p className="text-sm leading-relaxed text-chalk-60">
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
            <p className="text-sm leading-relaxed text-chalk-60">{SITE.landmark}. Parking gratuit sur place.</p>
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

      <div className="kerb" aria-hidden="true" />

      {/* Réseaux */}
      <section className="bg-asphalt-2 py-(--section-y)">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader line1="La course continue" line2="en ligne." accent="flag" />
          <div data-stagger className="mt-(--section-gap) grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex items-center gap-4 p-5"
              >
                <span aria-hidden="true" className="text-4xl leading-none">{s.emoji}</span>
                <span>
                  <span className="display block text-xl text-chalk transition-colors group-hover:text-race">{s.label}</span>
                  <span className="block text-sm text-chalk-60">{s.handle}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
