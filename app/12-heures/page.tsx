import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import InscriptionDouzeHeures from "@/components/InscriptionDouzeHeures";
import { SITE, SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { formatDate } from "@/lib/agenda";
import { DOUZE_H, placesRestantes, prixEquipe } from "@/lib/inscription-12h";

/*
 * Toutes les valeurs de l'épreuve (date, horaires, tarif, pilotes, places)
 * viennent de lib/inscription-12h.ts — ne rien écrire en dur ici.
 */
const f = formatDate(DOUZE_H.date);
const DATE_LABEL = `${f.weekday} ${f.day} ${f.monthFull}`;
const PRIX = prixEquipe();
const RESTANTES = placesRestantes();

export const metadata: Metadata = {
  title: `Les 12 Heures — endurance par équipes avec Vortex, ${DATE_LABEL}`,
  description: `Douze heures d'endurance par équipes de ${DOUZE_H.pilotesMin} à ${DOUZE_H.pilotesMax} pilotes au circuit MegaKart de Vias, avec l'écurie Vortex. ${DATE_LABEL}, de ${DOUZE_H.depart} à ${DOUZE_H.arrivee}. ${DOUZE_H.placesMax} équipes maximum.`,
  alternates: { canonical: "/12-heures" },
};

const EVENT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Les 12 Heures de MegaKart — endurance par équipes avec l'écurie Vortex",
  startDate: `${DOUZE_H.date}T12:00:00+01:00`,
  endDate: `${DOUZE_H.date}T23:59:00+01:00`,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  url: `${SITE_URL}/12-heures`,
  image: [`${SITE_URL}/images/galerie-17-nocturne-action.jpg`, `${SITE_URL}/images/og.jpg`],
  description: `Course d'endurance de 12 heures par équipes sur le circuit outdoor de 1000 m de MegaKart à Vias-plage, coorganisée avec l'écurie Vortex. Un ravitaillement par heure, changement de kart à chaque ravitaillement, box chauffé par équipe, chronométrage Apex Timing en direct. ${DOUZE_H.placesMax} équipes maximum.`,
  organizer: [
    { "@type": "Organization", "@id": `${SITE_URL}/#business`, name: SITE.name, url: SITE_URL },
    { "@type": "Organization", name: "Vortex" },
  ],
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
    price: DOUZE_H.prixEquipe,
    priceCurrency: "EUR",
    availability: RESTANTES > 0 ? "https://schema.org/LimitedAvailability" : "https://schema.org/SoldOut",
    url: `${SITE_URL}/12-heures#formulaire`,
  },
};

/* Le déroulé, vulgarisé depuis le règlement présenté par Vortex (réunion du 29/09/2026). */
const FORMAT = [
  {
    step: "01",
    title: `De ${DOUZE_H.depart} à ${DOUZE_H.arrivee}`,
    text: "Départ en plein jour, arrivée sous les projecteurs. Douze heures de relais par équipes sur les 1000 m du circuit, avec la bascule dans la nuit en milieu de course.",
  },
  {
    step: "02",
    title: "Un ravitaillement par heure",
    text: `${DOUZE_H.ravitos} ravitaillements imposés, un par heure, annoncés au gyrophare, et ${DOUZE_H.arretsMin} arrêts au minimum sur la course. Le reste, c'est votre stratégie : qui roule, quand, combien de temps.`,
  },
  {
    step: "03",
    title: "Un nouveau kart à chaque ravito",
    text: "À chaque ravitaillement, l'équipe repart sur un autre kart : personne ne garde « le bon » toute la journée. Votre numéro vous suit sur le transpondeur, pas sur la machine.",
  },
  {
    step: "04",
    title: "Le chrono en direct",
    text: "Chronométrage Apex Timing en continu, classement sur l'écran géant et sur la page chrono du site pour ceux qui suivent la course de loin.",
  },
];

const ACCUEIL = [
  "Un box chauffé par équipe, avec écran de suivi de course",
  "Repas des pilotes compris, restauration sur place",
  "Pisteurs et commissaires tout au long de la course",
  "Trophée, podium et lots des partenaires en fin de course",
];

const PUBLICS = [
  {
    title: "Entre amis",
    text: "Pas besoin d'être licencié : si vous avez déjà roulé en loisir, vous avez votre place. C'est la tête et la régularité qui gagnent une endurance.",
  },
  {
    title: "En entreprise",
    text: "Une fin d'année qui change du restaurant : une équipe, un objectif, douze heures pour se serrer les coudes. Facture au nom de l'entreprise.",
  },
  {
    title: "Habitués et équipages Vortex",
    text: "Les pilotes de la communauté Vortex et les habitués du circuit seront sur la grille. De quoi se mesurer aux meilleurs, dans une ambiance qui reste celle du loisir.",
  },
];

export default function DouzeHeuresPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd([{ name: "Les 12 Heures", path: "/12-heures" }]), EVENT_JSONLD]),
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
            {DATE_LABEL} · {DOUZE_H.depart} → {DOUZE_H.arrivee} · avec l&rsquo;écurie Vortex
          </p>
          <h1 className="display text-[clamp(2.8rem,8vw,6.5rem)] text-chalk">
            Les 12 Heures
            <br />
            <span className="text-race">de MegaKart.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk">
            Le plus grand format jamais couru sur le circuit : douze heures d&rsquo;endurance par équipes, du jour à la
            nuit, sur les 1000 m de Vias-plage.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#formulaire" className="btn btn-race glow-race">
              Inscrire mon équipe
            </a>
            <p className="display text-lg text-chalk">
              {RESTANTES > 0 ? (
                <>
                  Plus que <span className="text-flag">{RESTANTES}</span> places sur {DOUZE_H.placesMax}
                </>
              ) : (
                "Complet — liste d'attente par téléphone"
              )}
            </p>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          DATE_LABEL,
          `${DOUZE_H.depart} → ${DOUZE_H.arrivee}`,
          `Équipes de ${DOUZE_H.pilotesMin} à ${DOUZE_H.pilotesMax}`,
          `${DOUZE_H.placesMax} équipes max`,
          "Avec Vortex",
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
          L&rsquo;épreuve est coorganisée avec l&rsquo;écurie Vortex : leur équipe technique travaille aux côtés de celle
          du circuit pour que la journée tienne du vrai meeting d&rsquo;endurance. Les karts sont les {DOUZE_H.karts} du
          circuit, préparés pour l&rsquo;épreuve.
        </p>
        <div data-stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FORMAT.map((s) => (
            <article key={s.step} className="card p-7">
              <p className="display text-4xl text-race">{s.step}</p>
              <h3 className="display mt-3 text-2xl text-chalk">{s.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-chalk-60">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* L'accueil des équipes */}
      <section className="bg-asphalt-2 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p data-reveal className="display text-lg text-flag">
              Votre camp de base
            </p>
            <h2 data-reveal className="display mt-1 text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
              Au chaud entre deux relais.
            </h2>
            <p data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-chalk-60">
              Décembre au bord de la mer, ça peut piquer : chaque équipe a son box chauffé pour se reposer, manger et
              suivre la course. Les accompagnants sont les bienvenus
              {DOUZE_H.repasAccompagnant ? `, repas à ${DOUZE_H.repasAccompagnant} € par personne` : ", repas en supplément"}.
            </p>
            <ul data-stagger className="mt-8 flex flex-col gap-3">
              {ACCUEIL.map((item) => (
                <li key={item} className="card flex items-center gap-4 p-4">
                  <span className="checker-sm h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
                  <span className="text-base text-chalk">{item}</span>
                </li>
              ))}
            </ul>
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

      {/* Pour qui */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <h2 data-reveal className="display max-w-3xl text-[clamp(2.2rem,5vw,4rem)] text-chalk">
          Ouvert à tous
          <span className="text-race"> les équipages.</span>
        </h2>
        <div data-stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {PUBLICS.map((p) => (
            <article key={p.title} className="card p-7">
              <h3 className="display text-2xl text-chalk">{p.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-chalk-60">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Inscription — le formulaire après le décor, comme toutes les pages d'inscription. */}
      <section id="formulaire" className="scroll-mt-28 bg-asphalt-2 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p data-reveal className="display text-lg text-flag">
            Inscription
          </p>
          <h2 data-reveal className="display mt-1 text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
            {PRIX} <span className="text-chalk-60">l&rsquo;équipe</span>
          </h2>
          <p data-reveal className="mt-3 text-base leading-relaxed text-chalk-60">
            Le même tarif de {DOUZE_H.pilotesMin} à {DOUZE_H.pilotesMax} pilotes. Aucun paiement en ligne : le circuit
            vous rappelle sous 48 heures pour confirmer la place et vous envoyer le règlement.
            {RESTANTES > 0 ? ` ${RESTANTES} places restantes sur ${DOUZE_H.placesMax}.` : ""}
          </p>

          <div className="mt-8">
            <InscriptionDouzeHeures dateLabel={DATE_LABEL} />
          </div>

          <div className="card mt-8 p-6">
            <p className="display text-lg text-chalk">Plutôt de vive voix ?</p>
            <p className="mt-2 text-base leading-relaxed text-chalk-60">
              L&rsquo;équipe du circuit prend aussi les inscriptions au téléphone et par e-mail.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a href={SITE.phoneHref} className="link-under w-fit text-base font-semibold text-chalk">
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="link-under w-fit text-base font-semibold text-chalk">
                {SITE.email}
              </a>
            </div>
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
