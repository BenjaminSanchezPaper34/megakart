import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import { SITE, SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Les 12 Heures — endurance par équipes, samedi 19 décembre",
  description:
    "Douze heures d'endurance par équipes sur le circuit MegaKart à Vias, organisées avec l'écurie Vortex. Samedi 19 décembre 2026, 1 500 € l'équipe, paddock aménagé et chrono Apex Timing. Sur inscription.",
  alternates: { canonical: "/12-heures" },
};

const EVENT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Les 12 Heures de MegaKart — endurance par équipes",
  startDate: "2026-12-19",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  url: `${SITE_URL}/12-heures`,
  description:
    "Course d'endurance de 12 heures par équipes sur le circuit outdoor de 1000 m de MegaKart à Vias-plage, organisée avec l'écurie Vortex. Paddock aménagé par équipe, restauration sur place, chronométrage Apex Timing en continu.",
  organizer: { "@id": `${SITE_URL}/#business` },
  location: {
    "@type": "Place",
    name: SITE.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
  },
  offers: {
    "@type": "Offer",
    name: "Inscription par équipe",
    price: 1500,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/12-heures`,
  },
};

const FORMAT = [
  {
    step: "01",
    title: "Une équipe, douze heures",
    text: "Vous constituez votre équipe et vous vous relayez au volant pendant douze heures. Gestion des relais, régularité, fraîcheur des pilotes : l'endurance récompense la tête autant que le pied droit.",
  },
  {
    step: "02",
    title: "Votre paddock",
    text: "Chaque équipe dispose de son espace aménagé au bord de la piste : tables, écran de suivi de course et de quoi souffler entre deux relais. Restauration et boissons sur place toute la journée.",
  },
  {
    step: "03",
    title: "Le chrono ne dort jamais",
    text: "Chronométrage Apex Timing en continu, classement en direct sur l'écran LED géant — et sur la page chrono du site, pour ceux qui suivent la course de loin.",
  },
];

export default function DouzeHeuresPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Les 12 Heures", path: "/12-heures" }]),
            EVENT_JSONLD,
          ]),
        }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[78svh] items-end overflow-hidden">
        <div data-hero-bg className="absolute inset-0">
          <Image
            src="/images/galerie-17-nocturne-action.jpg"
            alt="Karts en action sur le circuit MegaKart éclairé de nuit"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_45%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-asphalt/70 via-asphalt/40 to-asphalt" />
        </div>
        <div data-hero-content className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-44 md:px-8">
          <p className="display mb-3 text-lg text-flag">
            Samedi 19 décembre · avec l&rsquo;écurie Vortex
          </p>
          <h1 className="display text-[clamp(2.8rem,8vw,6.5rem)] text-chalk">
            Les 12 Heures
            <br />
            <span className="text-race">de MegaKart.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk">
            Le plus grand format jamais couru sur le circuit : douze heures
            d&rsquo;endurance par équipes, du jour à la nuit, sur les 1000 m
            de Vias-plage.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href={SITE.phoneHref} className="btn btn-race glow-race">
              Inscrire mon équipe · {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="btn btn-ghost">
              {SITE.email}
            </a>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "Samedi 19 décembre",
          "Endurance 12 heures",
          "Par équipes",
          "1 500 € l'équipe",
          "Paddock aménagé",
          "Chrono Apex Timing",
        ]}
      />

      {/* Le format */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <h2 data-reveal className="display max-w-3xl text-[clamp(2.2rem,5vw,4rem)] text-chalk">
          Douze heures,
          <br />
          <span className="display-outline">une seule équipe.</span>
        </h2>
        <p data-reveal className="mt-6 max-w-2xl text-base leading-relaxed text-chalk-60">
          L&rsquo;épreuve est organisée main dans la main avec l&rsquo;écurie
          Vortex : leur équipe technique travaille aux côtés de celle du
          circuit pour que la journée tienne du vrai meeting d&rsquo;endurance.
          Les premières équipes sont déjà inscrites — les places sont
          limitées par le nombre de karts.
        </p>
        <div data-stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {FORMAT.map((f) => (
            <article key={f.step} className="card p-7">
              <p className="display text-4xl text-race">{f.step}</p>
              <h3 className="display mt-3 text-2xl text-chalk">{f.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-chalk-60">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Inscription */}
      <section className="bg-asphalt-2 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p data-reveal className="display text-lg text-flag">
              Inscription
            </p>
            <h2 data-reveal className="display mt-1 text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
              1 500 € <span className="text-chalk-60">l&rsquo;équipe</span>
            </h2>
            <p data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-chalk-60">
              Le tarif couvre l&rsquo;engagement de l&rsquo;équipe pour les
              douze heures de course, les karts et le paddock aménagé.
              Composition de l&rsquo;équipe, horaires détaillés et règlement
              vous sont communiqués à l&rsquo;inscription.
            </p>
            <ul data-stagger className="mt-8 flex flex-col gap-3">
              {[
                "Ouvert à tous : équipes d'habitués comme de débutants",
                "Karts du circuit, préparés pour l'épreuve",
                "Restauration et boissons sur place",
                "Classement et podium en fin de course",
              ].map((item) => (
                <li key={item} className="card flex items-center gap-4 p-4">
                  <span className="checker-sm h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
                  <span className="text-base text-chalk">{item}</span>
                </li>
              ))}
            </ul>
            <div data-reveal className="mt-9 flex flex-wrap gap-4">
              <a href={SITE.phoneHref} className="btn btn-race glow-race">
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="btn btn-ghost">
                Écrire au circuit
              </a>
            </div>
          </div>
          <div data-reveal className="overflow-hidden rounded-sm">
            <Image
              src="/images/galerie-23-aerien-nuit.jpg"
              alt="Vue aérienne du circuit MegaKart éclairé la nuit"
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Liens */}
      <section className="mx-auto max-w-7xl px-5 py-16 text-center md:px-8 md:py-24">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/agenda" className="btn btn-ghost">
            Tout l&rsquo;agenda
          </Link>
          <Link href="/live" className="btn btn-ghost">
            Le chrono en direct
          </Link>
          <Link href="/la-piste" className="btn btn-ghost">
            La piste
          </Link>
        </div>
      </section>
    </>
  );
}
