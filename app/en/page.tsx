import type { Metadata } from "next";
import Image from "next/image";
import Marquee from "@/components/Marquee";
import OpenBadge from "@/components/OpenBadge";
import { KARTS } from "@/lib/karts";
import { SITE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Go-Karting in Vias-Plage — 1000 m outdoor track, ages 3+",
  description:
    "MegaKart: 1000 m outdoor go-kart circuit in Vias-Plage (Hérault, South of France), next to the campsites, between Fabrikus and Europark Indoor. No booking needed, karts from age 3, open daily 10 am – 12:30 am in summer.",
  alternates: {
    canonical: "/en",
    languages: { fr: "/", en: "/en" },
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
            isPartOf: { "@id": `${SITE_URL}/#business` },
          }),
        }}
      />

      {/* Hero */}
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
        <div data-hero-bg className="absolute inset-0">
          <Image
            src="/images/hero-drone.jpg"
            alt="Aerial view of the 1000 m MegaKart circuit in Vias-Plage"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-asphalt/70 via-asphalt/35 to-asphalt" />
        </div>
        <div data-hero-content className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-40 md:px-8">
          <p className="display mb-4 text-lg text-flag md:text-xl">
            Vias-Plage · South of France — next to Fabrikus &amp; Europark Indoor
          </p>
          <h1 className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
            1000 metres,
            <br />
            <span className="text-race">full throttle.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk md:text-xl">
            The outdoor go-kart circuit of Vias-Plage, FFSA-approved.
            From age 3, no booking needed: walk in, gear up, race.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href={SITE.phoneHref} className="btn btn-race glow-race">
              {SITE.phone}
            </a>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Directions
            </a>
          </div>
        </div>
      </section>

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
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
          Karts &amp; <span className="text-race">prices.</span>
        </h2>
        <p data-reveal className="mt-4 max-w-xl text-base leading-relaxed text-chalk-60">
          8-minute sessions (5 minutes for the Baby Kart). Helmets provided.
          Closed shoes required. We accept cards and cash.
        </p>
        <div data-stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      <section className="bg-asphalt-2 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-3">
          <div data-reveal>
            <h2 className="display text-3xl text-chalk">Opening hours</h2>
            <div className="mt-4"><OpenBadge withDetail en /></div>
            <p className="mt-4 text-base leading-relaxed text-chalk-60">
              Summer season: every day, 10 am to 12:30 am, non-stop.
              Rest of the year: weekends and French school holidays.
            </p>
          </div>
          <div data-reveal>
            <h2 className="display text-3xl text-chalk">Getting here</h2>
            <address className="mt-4 text-base not-italic leading-relaxed text-chalk-60">
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city}, France
              <br />
              On the Vias-Plage road, between Fabrikus World and Europark
              Indoor — minutes from the campsites. Free parking.
            </address>
          </div>
          <div data-reveal>
            <h2 className="display text-3xl text-chalk">Groups & parties</h2>
            <p className="mt-4 text-base leading-relaxed text-chalk-60">
              Birthdays, stag &amp; hen parties, team building: private race
              formats from 7 people, by phone reservation only.
            </p>
            <a href={SITE.phoneHref} className="link-under mt-3 inline-block text-base font-semibold text-chalk">
              Call {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl px-5">
          <h2 data-reveal className="display text-[clamp(2.6rem,7vw,5rem)] text-chalk">
            Lights out.
            <br />
            <span className="text-race">See you on the grid.</span>
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-md text-lg text-chalk-60">
            No booking — just come and race. Full website in French:
          </p>
          <div data-reveal className="mt-8">
            <a href="/" className="btn btn-ghost text-lg">
              Site en français
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
