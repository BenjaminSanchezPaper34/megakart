import type { Metadata } from "next";
import MapEmbed from "@/components/MapEmbed";
import OpenBadge from "@/components/OpenBadge";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Contact & accès — Vias-plage, entre Fabrikus et Europark",
  description:
    "MegaKart, Voie Communale du Tricot et des Tots, 34450 Vias — entre Fabrikus World et Europark Indoor. Tél : 09 50 28 95 91. Ouvert 7j/7 en été de 10h à minuit trente.",
  alternates: { canonical: "/contact" },
};

const SOCIALS = [
  { label: "Instagram", href: SITE.social.instagram, handle: "@karting_megakart" },
  { label: "Facebook", href: SITE.social.facebook, handle: "megakart.karting" },
  { label: "YouTube", href: SITE.social.youtube, handle: "MegaKart" },
  { label: "TripAdvisor", href: SITE.social.tripadvisor, handle: "Avis voyageurs" },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])),
        }}
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-40 md:px-8 md:pb-24 md:pt-48">
        <h1 className="display text-[clamp(2.8rem,7vw,6rem)] text-chalk">
          On se retrouve
          <br />
          <span className="text-race">sur la grille.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk-60">
          Pas de réservation pour rouler : le plus simple est de passer.
          Pour les événements et les questions, un coup de fil suffit.
        </p>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Téléphone */}
          <div data-reveal className="card flex flex-col gap-4 p-7">
            <h2 className="display text-2xl text-chalk">Par téléphone</h2>
            <a
              href={SITE.phoneHref}
              className="display text-4xl text-race transition-colors hover:text-chalk"
            >
              {SITE.phone}
            </a>
            <p className="text-sm leading-relaxed text-chalk-60">
              Horaires du jour, événements, créneaux compétition :
              on répond pendant les heures d'ouverture.
            </p>
          </div>

          {/* Horaires */}
          <div data-reveal className="card flex flex-col gap-4 p-7">
            <h2 className="display text-2xl text-chalk">Horaires</h2>
            <OpenBadge withDetail />
            <p className="text-sm leading-relaxed text-chalk-60">
              Hors saison : week-ends et vacances scolaires, horaires
              annoncés sur nos réseaux.
            </p>
          </div>

          {/* Adresse */}
          <div data-reveal className="card flex flex-col gap-4 p-7">
            <h2 className="display text-2xl text-chalk">Adresse</h2>
            <address className="text-base not-italic leading-relaxed text-chalk">
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city} · {SITE.address.dept}
            </address>
            <p className="text-sm leading-relaxed text-chalk-60">
              {SITE.landmark}. Parking gratuit sur place.
            </p>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-under text-base font-semibold text-chalk"
            >
              Itinéraire Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Carte (consentement bloquant) */}
      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
        <div data-reveal>
          <MapEmbed />
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Réseaux */}
      <section className="bg-asphalt-2 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2 data-reveal className="display text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
            La course continue <span className="text-flag">en ligne</span>
          </h2>
          <div data-stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card group p-6"
              >
                <p className="display text-xl text-chalk transition-colors group-hover:text-race">
                  {s.label}
                </p>
                <p className="mt-1 text-sm text-chalk-60">{s.handle}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
