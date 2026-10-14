import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import HeroVideo from "@/components/HeroVideo";
import Reviews from "@/components/Reviews";
import PhotoMosaic from "@/components/PhotoMosaic";
import ReelCard from "@/components/ReelCard";
import TrackMap from "@/components/TrackMap";
import FleetCarousel from "@/components/FleetCarousel";
import OpenBadge from "@/components/OpenBadge";
import UpcomingRaces from "@/components/UpcomingRaces";
import TodayOffer from "@/components/TodayOffer";
import { DEALS, SHOW_PROMOS } from "@/lib/agenda";
import { KARTS } from "@/lib/karts";
import { SITE } from "@/lib/site";
import { localBusinessJsonLd, webSiteJsonLd, faqJsonLd } from "@/lib/jsonld";
import { FAQ } from "@/lib/faq";


export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([localBusinessJsonLd(), webSiteJsonLd(), faqJsonLd(FAQ)]),
        }}
      />

      {/* ========== HERO ========== */}
      <section className="flex min-h-svh flex-col">
        {/* La vidéo et la promo partagent le premier écran. */}
        <div className="relative flex flex-1 flex-col justify-end overflow-hidden">
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

          <div data-hero-content className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-28 md:px-8 md:pb-20 md:pt-40 [@media(max-height:740px)]:pb-6 [@media(max-height:740px)]:pt-24">
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-asphalt/70 px-4 py-2 md:bg-asphalt/50 md:backdrop-blur-sm">
              <OpenBadge />
            </div>
            <p className="display mb-3 text-lg text-flag md:text-xl">
              Vias-plage · Hérault<span className="hidden md:inline"> — </span>
              <span className="block md:inline">Entre Fabrikus &amp; Europark Indoor</span>
            </p>
            <h1 className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
              1000 mètres
              <br />
              <span className="text-race">plein gaz.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-chalk md:text-xl">
              Le circuit de karting outdoor de Vias-plage, homologué FFSA.
              Dès 3 ans, sans réservation : on arrive, on s'équipe, on roule.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap md:mt-9 md:gap-4">
              <Link href="/#flotte" className="btn btn-race justify-center">
                Karts &amp; tarifs
              </Link>
              <Link href="/la-piste" className="btn btn-ghost justify-center">
                Découvrir la piste
              </Link>
            </div>
          </div>

          {/* Flèche scroll */}
          <div
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-chalk-60 md:block"
            aria-hidden="true"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m0 0l-6-6m6 6l6-6" />
            </svg>
          </div>
        </div>
        <div className="relative z-10 shrink-0">
          <TodayOffer />
        </div>
      </section>

      <Marquee
        items={[
          "Sans réservation",
          "Dès 3 ans",
          "7j/7 en été · 10h – minuit trente",
          "1000 m de piste",
          "8,5 m de large",
          "Depuis 1992",
          `${KARTS.length} karts au choix`,
          "Homologué FFSA",
          "Chrono Apex Timing",
          "Courses & bons plans à l'agenda",
        ]}
      />
      <p className="sr-only">
        Circuit de 1000 m, large de 8,5 m, depuis 1992. {KARTS.length} karts au choix.
      </p>

      {/* ========== AGENDA (temps forts de fin d'année) ========== */}
      <section id="courses-accueil" className="bg-asphalt-2 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div>
            <h2 className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
              Cet automne,
              <br />
              <span className="text-race">on court.</span>
            </h2>
            {/* Sous-titre et lien agenda sur la même ligne, au-dessus des affiches. */}
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <p className="max-w-xl text-base leading-relaxed text-chalk md:text-xl">
                En équipe, en solo ou pour les enfants :
                trouvez votre prochain départ.
              </p>
              <Link href="/agenda" className="btn btn-ghost">
                Voir tout l&rsquo;agenda
              </Link>
            </div>
          </div>

          <UpcomingRaces />
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Respiration visuelle entre les courses et la flotte : un pilote en RX250 en pleine courbe. */}
      <div className="relative h-72 overflow-hidden sm:h-96 md:h-[32rem]">
        <Image
          src="/images/galerie-26-pilote-rx250.jpg"
          alt="Pilote casqué en pleine courbe au volant d'un kart Sodi RX250 sur le circuit MegaKart"
          fill
          sizes="100vw"
          className="object-cover object-[50%_28%]"
        />
        {/* Fondu vers la flotte (fond asphalte) : la photo se dissout dans la section suivante. */}
        {/* Dégradé en courbe douce (10 paliers) sur toute la hauteur ; le titre de la flotte remonte par-dessus. */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--color-asphalt) 2%, transparent) 15%, color-mix(in srgb, var(--color-asphalt) 5%, transparent) 28%, color-mix(in srgb, var(--color-asphalt) 10%, transparent) 40%, color-mix(in srgb, var(--color-asphalt) 17%, transparent) 50%, color-mix(in srgb, var(--color-asphalt) 27%, transparent) 60%, color-mix(in srgb, var(--color-asphalt) 40%, transparent) 70%, color-mix(in srgb, var(--color-asphalt) 56%, transparent) 79%, color-mix(in srgb, var(--color-asphalt) 72%, transparent) 87%, color-mix(in srgb, var(--color-asphalt) 88%, transparent) 94%, var(--color-asphalt) 100%)",
          }}
        />
      </div>

      {/* ========== FLOTTE ========== */}
      <section id="flotte" className="relative z-10 -mt-36 scroll-mt-24 pb-20 sm:-mt-48 md:-mt-60 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
            Une flotte pour
            <br />
            <span className="text-race">chaque pilote.</span>
          </h2>
          <p data-reveal className="max-w-sm text-base leading-relaxed text-chalk-60 md:text-right">
            Du Baby Kart électrique dès 3 ans au 250 RX de compétition :
            {" "}{KARTS.length} machines, de {KARTS[0].price}€ à {KARTS[KARTS.length - 1].price}€ la session.
          </p>
        </div>
      </div>

      <FleetCarousel karts={KARTS} />


      </section>

      <div className="kerb" aria-hidden="true" />

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
              href: "/live",
              cta: "Voir le chrono en direct",
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
              {"href" in f && f.href && (
                <Link href={f.href} className="link-under mt-4 inline-block text-base font-semibold text-chalk">
                  {f.cta}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ========== PISTE ========== */}
      <section className="relative overflow-hidden py-20 md:py-28">
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

      {/* ========== LES BONS PLANS ========== */}
      <section className="bg-asphalt-2 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
              Les bons plans
              <br />
              <span className="text-flag">de la semaine.</span>
            </h2>
            <p data-reveal className="max-w-sm text-base leading-relaxed text-chalk-60 md:text-right">
              Des offres qui reviennent chaque semaine, sans réservation
              pour la plupart : il suffit de choisir son jour.
            </p>
          </div>

          <div data-stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {DEALS.filter((d) => SHOW_PROMOS || d.slug !== "2-plus-1").map((deal) => (
              <Link
                key={deal.slug}
                href={`/agenda#${deal.slug}`}
                className="card group relative flex flex-col overflow-hidden p-7 transition-transform duration-300 hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-full w-1 ${
                    deal.accent === "race"
                      ? "bg-race"
                      : deal.accent === "flag"
                        ? "bg-flag"
                        : "bg-chalk/40"
                  }`}
                />
                <p
                  className={`display text-base ${
                    deal.accent === "race"
                      ? "text-race"
                      : deal.accent === "flag"
                        ? "text-flag"
                        : "text-chalk"
                  }`}
                >
                  {deal.kicker}
                </p>
                <h3 className="display mt-1 text-2xl text-chalk transition-colors duration-300 group-hover:text-race">
                  {deal.name}
                </h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-chalk-60">
                  {deal.summary}
                </p>
                {deal.price && (
                  <p className="display mt-5 flex items-baseline gap-2">
                    <span className="text-3xl text-chalk">{deal.price}</span>
                    {deal.priceNote && (
                      <span className="text-sm text-chalk-60">{deal.priceNote}</span>
                    )}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* ========== ÉVÉNEMENTS ========== */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
            Les grands jours
            <br />
            <span className="display-outline">se courent ici.</span>
          </h2>
          <div data-reveal className="flex max-w-sm flex-col items-start gap-4 md:items-end md:text-right">
            <p className="text-base leading-relaxed text-chalk-60">
              Anniversaires, enterrements de vie, sorties d&rsquo;équipe : on construit le format avec vous.
            </p>
            <Link href="/evenements" className="btn btn-ghost">
              Tous les événements
            </Link>
          </div>
        </div>

        <div data-stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Anniversaires",
              href: "/anniversaires",
              text: "Une course d'endurance à son nom, le podium, la terrasse ombragée pour le gâteau : l'anniversaire dont on parle encore à la rentrée. Dès 7 participants.",
            },
            {
              title: "EVG · EVJF",
              href: "/evenements#evg-evjf",
              text: "Avant le grand oui, un grand prix. Défis sur mesure, grille de départ complète et remise de prix pour enterrer une vie de célibataire à pleine vitesse.",
            },
            {
              title: "Entreprises & CE",
              href: "/evenements#entreprise",
              text: "Le team building qui met tout le monde d'accord : mêmes machines, même piste, un seul chrono. Formats course ou endurance, privatisation possible.",
            },
          ].map((e) => (
            <article key={e.title} className="card flex flex-col p-5 sm:p-6">
              <h3 className="display text-2xl text-chalk">{e.title}</h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-chalk-60">{e.text}</p>
              <Link href={e.href} className="btn btn-race mt-6 w-full">
                Demander un devis
              </Link>
            </article>
          ))}
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
            <div className="race-event-card overflow-hidden shadow-[0_18px_48px_rgb(0_0_0/0.18)]">
              <Image
                src="/images/galerie-09-terrasse.jpg"
                alt="La terrasse et le stand du circuit MegaKart"
                width={900}
                height={600}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="race-event-card mt-10 overflow-hidden bg-white p-4 shadow-[0_18px_48px_rgb(0_0_0/0.12)]">
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
              Hors saison, ouvert tous les jours de 14 h à 19 h (fermé lundi et
              mardi en octobre, hors vacances) — jusqu&rsquo;à
              minuit trente en été. Fermeture annuelle en janvier et février.
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

      {/* ========== FAQ (ex-page Tarifs) ========== */}
      <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
        <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
          Questions
          <br />
          <span className="text-race">fréquentes.</span>
        </h2>
        <div data-stagger className="mt-10 flex flex-col gap-4">
          {FAQ.map((f) => (
            <details key={f.q} className="card group p-6 open:border-white/25">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-chalk [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="display shrink-0 text-2xl text-race transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-base leading-relaxed text-chalk-60">{f.a}</p>
            </details>
          ))}
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
            <a href={SITE.phoneHref} className="btn btn-race">
              {SITE.phone}
            </a>
            <Link href="/contact" className="btn btn-ghost">
              Comment venir
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
