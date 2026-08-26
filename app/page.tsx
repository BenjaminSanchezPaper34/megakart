import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import HeroVideo from "@/components/HeroVideo";
import Reviews from "@/components/Reviews";
import PhotoMosaic from "@/components/PhotoMosaic";
import ReelCard from "@/components/ReelCard";
import TrackMap from "@/components/TrackMap";
import KartCard from "@/components/KartCard";
import OpenBadge from "@/components/OpenBadge";
import { KARTS, getKart } from "@/lib/karts";
import { SITE } from "@/lib/site";
import { localBusinessJsonLd } from "@/lib/jsonld";

const FEATURED_KARTS = ["baby-kart", "kart-enfant", "390cc", "250-rx-30"].map(getKart);

const STATS = [
  { value: 1000, suffix: " m", label: "de piste outdoor" },
  { value: 8.5, suffix: " m", label: "de large", literal: "8,5 m" },
  { value: KARTS.length, suffix: "", label: "karts au choix" },
  { value: 3, suffix: " ans", label: "âge minimum" },
  { value: 1992, suffix: "", label: "année de création", raw: true },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />

      {/* ========== HERO ========== */}
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
        <div data-hero-bg className="absolute inset-0">
          <Image
            src="/images/hero-drone.jpg"
            alt="Vue aérienne du circuit MegaKart de 1000 m à Vias-plage"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <HeroVideo />
          <div className="absolute inset-0 bg-gradient-to-b from-asphalt/70 via-asphalt/35 to-asphalt" />
        </div>

        <div data-hero-content className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-40 md:px-8">
          <div className="mb-5 inline-flex rounded-full border border-white/15 bg-asphalt/50 px-4 py-2 backdrop-blur-sm">
            <OpenBadge />
          </div>
          <p className="display mb-4 text-lg text-flag md:text-xl">
            Vias-plage · Hérault — entre Fabrikus &amp; Europark Indoor
          </p>
          <h1 className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
            1000 mètres
            <br />
            <span className="text-race">plein gaz.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk md:text-xl">
            Le circuit de karting outdoor de Vias-plage, homologué FFSA.
            Dès 3 ans, sans réservation : on arrive, on s'équipe, on roule.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/tarifs" className="btn btn-race glow-race">
              Karts &amp; tarifs
            </Link>
            <Link href="/la-piste" className="btn btn-ghost">
              Découvrir la piste
            </Link>
          </div>
        </div>

        {/* Flèche scroll */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-chalk-60"
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14m0 0l-6-6m6 6l6-6" />
          </svg>
        </div>
      </section>

      <Marquee
        items={[
          "Sans réservation",
          "Dès 3 ans",
          "7j/7 en été · 10h – minuit trente",
          "1000 m de piste",
          "Homologué FFSA",
          "Chrono Apex Timing",
        ]}
      />

      {/* ========== STATS ========== */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <dl data-stagger className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-5">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="display text-5xl text-chalk md:text-6xl">
                {s.literal ? (
                  <span>{s.literal}</span>
                ) : s.raw ? (
                  <span>{s.value}</span>
                ) : (
                  <span data-counter={s.value} data-suffix={s.suffix}>
                    0{s.suffix}
                  </span>
                )}
              </dd>
              <dt className="mt-2 text-sm text-chalk-60">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ========== EXPÉRIENCE (split-screen avec réel plein cadre) ========== */}
      <section className="relative flex flex-col overflow-hidden bg-asphalt-2 lg:grid lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[auto_1fr]">
        {/* Titre */}
        <div className="order-1 px-5 pt-20 md:px-8 md:pt-28 lg:col-start-1 lg:pl-12 xl:pl-[max(3rem,calc((100vw-80rem)/2+2rem))]">
          <h2 data-reveal className="display max-w-2xl text-[clamp(2.2rem,5vw,4rem)] text-chalk">
            Un vrai circuit,
            <br />
            <span className="display-outline">pas un manège.</span>
          </h2>
        </div>

        {/* Réel plein cadre : pleine hauteur de section sur desktop,
            bande immersive pleine largeur entre titre et cartes sur mobile */}
        <div className="relative order-3 -mt-52 h-[82svh] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:h-auto">
          <ReelCard src="reel-4" flush />
          {/* Fondu de raccord : long et progressif sur mobile (la vidéo
              émerge de derrière les cartes), latéral sur desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-asphalt-2 from-15% via-asphalt-2/70 via-45% to-transparent lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:h-auto lg:w-20 lg:bg-gradient-to-r lg:from-asphalt-2 lg:from-0% lg:via-transparent lg:via-100%"
          />
        </div>

        {/* Cartes */}
        <div
          data-stagger
          className="relative z-10 order-2 grid gap-6 px-5 pb-2 pt-10 md:px-8 lg:col-start-1 lg:pb-28 lg:pl-12 lg:pt-12 xl:pl-[max(3rem,calc((100vw-80rem)/2+2rem))] lg:pr-12"
        >
          {[
            {
              title: "Chrono comme les pros",
              text: "Chronométrage Apex Timing au dixième, classement en direct sur écran LED géant. Chaque session a son podium — et vos temps vous attendent au tour suivant.",
            },
            {
              title: "Sécurité niveau F1",
              text: "Protections Tecpro dernière génération — les mêmes qu'en Formule 1 — circuit homologué FFSA et Préfecture, moniteurs diplômés au bord de la piste.",
            },
            {
              title: "Zéro réservation",
              text: "On ne bloque pas votre soirée trois semaines à l'avance : vous passez, vous choisissez votre kart, vous roulez. En été, jusqu'à minuit trente.",
            },
          ].map((f) => (
            <article key={f.title} className="card max-w-2xl p-7">
              <span className="checker-sm mb-4 block h-5 w-10 opacity-60" aria-hidden="true" />
              <h3 className="display text-2xl text-chalk">{f.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-chalk-60">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* ========== FLOTTE ========== */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
            Une flotte pour
            <br />
            <span className="text-race">chaque pilote.</span>
          </h2>
          <p data-reveal className="max-w-sm text-base leading-relaxed text-chalk-60">
            Du Baby Kart électrique dès 3 ans au 250 RX de compétition :
            {" "}{KARTS.length} machines, de {KARTS[0].price}€ à {KARTS[KARTS.length - 1].price}€ la session.
          </p>
        </div>

        <div data-stagger className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURED_KARTS.map((k) => (
            <KartCard key={k.slug} kart={k} />
          ))}
        </div>

        <div data-reveal className="mt-10 flex flex-wrap gap-4">
          <Link href="/tarifs" className="btn btn-race">
            Tous les karts &amp; tarifs
          </Link>
          <Link href="/tarifs#selecteur" className="btn btn-ghost">
            Trouve ton kart en 10 s
          </Link>
        </div>
      </section>

      {/* ========== PISTE ========== */}
      <section className="relative overflow-hidden bg-asphalt-2 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
              1000 m d'esses,
              <br />
              d'épingles et de
              <br />
              <span className="text-flag">lignes droites.</span>
            </h2>
            <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-chalk-60">
              Tracé large de 8,5 m, sections techniques, relances, freinages
              tardifs : un circuit dessiné pour le vrai pilotage, du premier
              tour de roue à la chasse au chrono. Éclairé pour rouler jusqu'à
              minuit trente en été.
            </p>
            <Link href="/la-piste" data-reveal className="btn btn-ghost mt-8">
              Explorer le circuit
            </Link>
          </div>
          <TrackMap className="w-full" />
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* ========== ÉVÉNEMENTS ========== */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
          Les grands jours
          <br />
          <span className="display-outline">se courent ici.</span>
        </h2>

        <div data-stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Anniversaires",
              text: "Une course d'endurance à son nom, le podium, la terrasse ombragée pour le gâteau : l'anniversaire dont on parle encore à la rentrée. Dès 7 participants.",
            },
            {
              title: "EVG · EVJF",
              text: "Avant le grand oui, un grand prix. Défis sur mesure, grille de départ complète et remise de prix pour enterrer une vie de célibataire à pleine vitesse.",
            },
            {
              title: "Entreprises & CE",
              text: "Le team building qui met tout le monde d'accord : mêmes machines, même piste, un seul chrono. Formats course ou endurance, privatisation possible.",
            },
          ].map((e) => (
            <article key={e.title} className="card flex flex-col p-7">
              <h3 className="display text-2xl text-chalk">{e.title}</h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-chalk-60">{e.text}</p>
            </article>
          ))}
        </div>

        <div data-reveal className="mt-10 flex flex-wrap gap-4">
          <Link href="/anniversaires" className="btn btn-race">
            Anniversaires enfants
          </Link>
          <Link href="/evenements" className="btn btn-ghost">
            EVG, EVJF &amp; entreprises
          </Link>
        </div>
      </section>

      {/* ========== MOSAÏQUE PHOTOS ========== */}
      <PhotoMosaic />

      {/* ========== LE STAND (pause fraîcheur) ========== */}
      <section className="bg-chalk py-20 text-asphalt md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p data-reveal className="display text-lg text-race">
              Le stand
            </p>
            <h2 data-reveal className="display mt-1 text-[clamp(2.2rem,5vw,4rem)] text-asphalt">
              La pause
              <br />
              <span className="text-race">fraîcheur.</span>
            </h2>
            <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-asphalt/70">
              Entre deux sessions, le stand du circuit sert glaces,
              granités et boissons fraîches — à savourer sur la terrasse
              ombragée, pendant que les chronos défilent sur l'écran géant.
            </p>
            <ul data-stagger className="mt-8 flex flex-wrap gap-3">
              {["Glaces", "Granités", "Boissons fraîches", "Terrasse ombragée"].map((item) => (
                <li
                  key={item}
                  className="display bg-asphalt px-4 py-2 text-base text-chalk"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div data-stagger className="grid grid-cols-2 items-center gap-6">
            <div className="overflow-hidden rounded-sm shadow-[0_18px_48px_rgb(0_0_0/0.18)]">
              <Image
                src="/images/galerie-09-terrasse.jpg"
                alt="La terrasse et le stand du circuit MegaKart"
                width={900}
                height={600}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-10 overflow-hidden rounded-sm bg-white p-4 shadow-[0_18px_48px_rgb(0_0_0/0.12)]">
              <Image
                src="/images/granites.jpg"
                alt="Granités bleu, rouge et jaune et boisson fraîche servis au stand MegaKart"
                width={520}
                height={676}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== AVIS ========== */}
      <Reviews />

      <div className="kerb" aria-hidden="true" />

      {/* ========== INFOS PRATIQUES ========== */}
      <section className="bg-asphalt-2 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-3">
          <div data-reveal>
            <h2 className="display text-3xl text-chalk">Horaires</h2>
            <div className="mt-4">
              <OpenBadge withDetail />
            </div>
            <p className="mt-4 text-base leading-relaxed text-chalk-60">
              Hors saison, ouvert les week-ends et vacances scolaires —
              appelez-nous pour les horaires du jour.
            </p>
          </div>
          <div data-reveal>
            <h2 className="display text-3xl text-chalk">Accès</h2>
            <address className="mt-4 text-base not-italic leading-relaxed text-chalk-60">
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city}
              <br />
              {SITE.landmark}
            </address>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-under mt-3 inline-block text-base font-semibold text-chalk"
            >
              Itinéraire Google Maps
            </a>
          </div>
          <div data-reveal>
            <h2 className="display text-3xl text-chalk">Le règlement</h2>
            <ul className="mt-4 flex flex-col gap-2 text-base leading-relaxed text-chalk-60">
              <li>· Chaussures fermées type baskets obligatoires</li>
              <li>· Vêtements flottants (écharpes, foulards…) interdits</li>
              <li>· CB, espèces et chèques-vacances acceptés</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="relative overflow-hidden py-24 text-center md:py-36">
        <div className="checker absolute inset-x-0 top-0 h-5 opacity-[0.07]" aria-hidden="true" />
        <div className="mx-auto max-w-3xl px-5">
          <h2 data-reveal className="display text-[clamp(2.6rem,7vw,5.5rem)] text-chalk">
            Feux verts.
            <br />
            <span className="text-race">On vous attend.</span>
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-md text-lg text-chalk-60">
            Pas de réservation, pas d'attente inutile : le circuit est à
            deux minutes de Vias-plage.
          </p>
          <div data-reveal className="mt-10 flex flex-wrap justify-center gap-4">
            <a href={SITE.phoneHref} className="btn btn-race glow-race text-lg">
              {SITE.phone}
            </a>
            <Link href="/contact" className="btn btn-ghost text-lg">
              Comment venir
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
