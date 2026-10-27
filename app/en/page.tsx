import type { Metadata } from "next";
import Marquee from "@/components/Marquee";
import OpenBadge from "@/components/OpenBadge";
import { KARTS } from "@/lib/karts";
import { SITE, SITE_URL } from "@/lib/site";
import SectionHeader from "@/components/system/SectionHeader";
import PageHero from "@/components/system/PageHero";
import CtaFinal from "@/components/system/CtaFinal";

export const metadata: Metadata = {
  title: "Go-Karting in Vias-Plage — 1000 m outdoor track, ages 3+",
  description:
    "MegaKart: 1000 m outdoor go-kart circuit in Vias-Plage (Hérault, South of France), next to the campsites, between Fabrikus and Europark Indoor. No booking needed, karts from age 3, open daily 10 am – 12:30 am in summer.",
  alternates: {
    canonical: "/en",
    languages: { fr: "/", en: "/en", "x-default": "/" },
  },
};

/*
 * Traductions anglaises des fiches karts (résumé commercial —
 * les données techniques restent dans lib/karts.ts).
 */
const KART_EN: Record<string, { name: string; desc: string }> = {
  "baby-kart": { name: "Baby Kart", desc: "Electric, ages 3–6, dedicated mini track" },
  "kart-enfant": { name: "Junior Kart", desc: "160cc, ages 7–15, min. height 1.30 m" },
  biplace: { name: "Two-seater", desc: "Ride together — from age 5 with an adult" },
  "280cc": { name: "280cc Kart", desc: "From age 14, min. height 1.60 m" },
  "390cc": { name: "390cc Kart", desc: "Adults — more power, more grip" },
  "250-rx-16": { name: "250 RX · 16 hp", desc: "Racing kart, adults, reference lap time required" },
  "250-rx-30": { name: "250 RX · 30 hp", desc: "Competition — lap-time conditions apply" },
};

export default function EnglishPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE_URL}/en`,
            inLanguage: "en",
            name: "Go-Karting in Vias-Plage — MegaKart",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            about: { "@id": `${SITE_URL}/#business` },
          }),
        }}
      />

      {/* Hero */}
      <PageHero
        image={{ src: "/images/hero-drone.jpg", alt: "Aerial view of the 1000 m MegaKart circuit in Vias-Plage" }}
        label="Vias-Plage · South of France, next to Fabrikus & Europark Indoor"
        line1="1000 metres,"
        line2="full throttle."
        subtitle="The outdoor go-kart circuit of Vias-Plage, FFSA-approved. From age 3, no booking needed: walk in, gear up, race."
        action={
          <>
            <a href={SITE.phoneHref} className="btn btn-race">
              {SITE.phone}
            </a>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Directions
            </a>
          </>
        }
      />

      <Marquee
        items={[
          "No booking needed",
          "From age 3",
          "Open daily in summer · 10 am – 12:30 am",
          "1000 m track",
          "FFSA approved",
          "Live lap timing",
        ]}
      />

      {/* Karts & prices */}
      <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
        <SectionHeader
          line1="Karts &"
          line2="prices."
          subtitle="8-minute sessions (5 minutes for the Baby Kart). Helmets provided. Closed shoes required. We accept cards and cash."
        />
        <div data-stagger className="mt-(--section-gap) grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KARTS.map((k) => (
            <article key={k.slug} className="card flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="display text-xl text-chalk">{KART_EN[k.slug].name}</h3>
                <p className="mt-1 text-sm leading-snug text-chalk-60">{KART_EN[k.slug].desc}</p>
              </div>
              <p className="display shrink-0 text-3xl text-chalk">
                {k.price}€
                <span className="ml-1 text-sm text-chalk-60">/ {k.session.replace("min", "min")}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Practical info */}
      <section className="bg-asphalt-2 py-(--section-y)">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader line1="Good" line2="to know." accent="flag" />
        </div>
        <div className="mx-auto mt-(--section-gap) grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-3">
          <div data-reveal>
            <span aria-hidden="true" className="text-5xl leading-none">🕑</span>
            <h3 className="display mt-4 text-3xl text-chalk">Opening hours</h3>
            <div className="mt-4"><OpenBadge withDetail en /></div>
            <p className="mt-4 text-base leading-relaxed text-chalk-60">
              Summer season: every day, 10 am to 12:30 am, non-stop.
              From 2 November: Wednesday to Sunday, 1 pm to 6 pm (closed Monday and Tuesday).
              Closed in January and February.
            </p>
          </div>
          <div data-reveal>
            <span aria-hidden="true" className="text-5xl leading-none">📍</span>
            <h3 className="display mt-4 text-3xl text-chalk">Getting here</h3>
            <address className="mt-4 text-base not-italic leading-relaxed text-chalk-60">
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city}, France
              <br />
              On the Vias-Plage road, between Fabrikus World and Europark
              Indoor — minutes from the campsites. Free parking. Ice
              creams, slushies and cold drinks at the trackside stand,
              with a shaded terrace.
            </address>
          </div>
          <div data-reveal>
            <span aria-hidden="true" className="text-5xl leading-none">🎂</span>
            <h3 className="display mt-4 text-3xl text-chalk">Groups & parties</h3>
            <p className="mt-4 text-base leading-relaxed text-chalk-60">
              Birthdays, stag &amp; hen parties, team building: private race
              formats from 7 people, booked by phone or e-mail.
            </p>
            <a href={SITE.phoneHref} className="link-under mt-3 inline-block text-base font-semibold text-chalk">
              Call {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaFinal line1="Lights out." line2="See you on the grid." subtitle="No booking, just come and race. Full website in French:">
        <a href="/" className="btn btn-ghost">
          Site en français
        </a>
      </CtaFinal>
    </>
  );
}
