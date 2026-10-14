import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import HeroVideo from "@/components/HeroVideo";
import Reviews from "@/components/Reviews";
import PhotoMosaic from "@/components/PhotoMosaic";
import CircuitVideo from "@/components/CircuitVideo";
import RowArrows from "@/components/RowArrows";
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
              {/* Lien + flèches sur la même ligne (flèches seulement si la rangée dépasse). */}
              <div className="flex w-full items-center justify-between gap-3 md:w-auto">
                <Link href="/agenda" className="btn btn-ghost">
                  Voir tout l&rsquo;agenda
                </Link>
                <RowArrows target="[data-race-bento]" label="Courses" className="flex gap-3" />
              </div>
            </div>
          </div>

          <UpcomingRaces />
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Respiration visuelle entre les courses et la flotte : un pilote en RX250 en pleine courbe. */}
      <div className="relative h-96 overflow-hidden sm:h-[30rem] md:h-[42rem]">
        <Image
          src="/images/galerie-26-pilote-rx250.jpg"
          alt="Pilote casqué en pleine courbe au volant d'un kart Sodi RX250 sur le circuit MegaKart"
          fill
          sizes="100vw"
          className="object-cover object-[50%_28%]"
          // Fondu par masque d'opacité (courbe douce sur toute la hauteur) : la photo se
          // dissout dans le fond de page, sans calque de couleur ni ligne de raccord.
          style={{ maskImage: "linear-gradient(to bottom, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 97%) 20%, rgb(0 0 0 / 92%) 32%, rgb(0 0 0 / 85%) 43%, rgb(0 0 0 / 76%) 53%, rgb(0 0 0 / 65%) 62%, rgb(0 0 0 / 53%) 70%, rgb(0 0 0 / 41%) 77%, rgb(0 0 0 / 30%) 83%, rgb(0 0 0 / 20%) 88%, rgb(0 0 0 / 12%) 92%, rgb(0 0 0 / 5%) 96%, rgb(0 0 0 / 0%) 100%)", WebkitMaskImage: "linear-gradient(to bottom, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 97%) 20%, rgb(0 0 0 / 92%) 32%, rgb(0 0 0 / 85%) 43%, rgb(0 0 0 / 76%) 53%, rgb(0 0 0 / 65%) 62%, rgb(0 0 0 / 53%) 70%, rgb(0 0 0 / 41%) 77%, rgb(0 0 0 / 30%) 83%, rgb(0 0 0 / 20%) 88%, rgb(0 0 0 / 12%) 92%, rgb(0 0 0 / 5%) 96%, rgb(0 0 0 / 0%) 100%)" }}
        />
      </div>

      {/* ========== FLOTTE ========== */}
      <section id="flotte" className="relative z-10 -mt-36 scroll-mt-24 pb-20 sm:-mt-48 md:-mt-72 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Même système que « Cet automne, on court » : grand titre, sous-titre dessous.
            Ombre portée douce : le titre passe sur le bas de la photo du pilote. */}
        <div className="[text-shadow:0_2px_24px_rgb(11_13_18/0.85)]">
          <h2 data-reveal className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
            Une flotte pour
            <br />
            <span className="text-race">chaque pilote.</span>
          </h2>
          <p data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-chalk md:text-xl">
            Du Baby Kart électrique dès 3 ans au 250 RX de compétition :
            {" "}{KARTS.length} machines, de {KARTS[0].price}€ à {KARTS[KARTS.length - 1].price}€ la session.
          </p>
        </div>
      </div>

      <FleetCarousel karts={KARTS} />


      </section>

      <div className="kerb" aria-hidden="true" />

      {/* ========== EXPÉRIENCE + PISTE : une seule section sur la vidéo ==========
          La vidéo (calque de 46–50rem, pour rester nette) s'efface par masque d'opacité dans le fond de page :
          « 1000 m d'esses… » et le tracé animé se posent sur la partie assombrie. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[46rem] lg:h-[50rem]"
          style={{ maskImage: "linear-gradient(to bottom, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 100%) 50%, rgb(0 0 0 / 88%) 58%, rgb(0 0 0 / 68%) 66%, rgb(0 0 0 / 48%) 73%, rgb(0 0 0 / 30%) 80%, rgb(0 0 0 / 16%) 86%, rgb(0 0 0 / 6%) 92%, rgb(0 0 0 / 0%) 100%)", WebkitMaskImage: "linear-gradient(to bottom, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 100%) 50%, rgb(0 0 0 / 88%) 58%, rgb(0 0 0 / 68%) 66%, rgb(0 0 0 / 48%) 73%, rgb(0 0 0 / 30%) 80%, rgb(0 0 0 / 16%) 86%, rgb(0 0 0 / 6%) 92%, rgb(0 0 0 / 0%) 100%)" }}
        >
          <CircuitVideo />
          {/* Voiles de lecture : assombrissement global, puis par le bas (mobile) / la gauche (ordinateur). */}
          <div className="pointer-events-none absolute inset-0 bg-asphalt/45" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/75 to-asphalt/30 lg:bg-gradient-to-r lg:from-asphalt/95 lg:via-asphalt/70 lg:to-asphalt/20" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[30rem] w-full max-w-7xl flex-col justify-end px-5 pb-8 pt-24 md:px-8 lg:min-h-[34rem] lg:justify-center lg:py-16">
          <h2 data-reveal className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
            Un vrai circuit,
            <br />
            <span className="display-outline">pas un manège.</span>
          </h2>
          <ul data-stagger className="mt-8 grid max-w-xl gap-4 text-lg text-chalk md:text-xl">
            <li className="flex items-start gap-3">
              <span aria-hidden="true">⏱️</span>
              <span>Chrono au dixième sur écran géant.</span>
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden="true">🛡️</span>
              <span>Protections Tecpro, homologuée FFSA.</span>
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden="true">🏁</span>
              <span>Sans réservation : on arrive, on roule.</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 pb-16 md:pb-20">
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
        </div>
      </section>

      {/* ========== LES BONS PLANS ========== */}
      <section className="bg-asphalt-2 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          {/* Même système que « Cet automne, on court » : grand titre, sous-titre + lien sur une ligne. */}
          <h2 data-reveal className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
            Les bons plans
            <br />
            <span className="text-flag">de la semaine.</span>
          </h2>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <p data-reveal className="max-w-xl text-base leading-relaxed text-chalk md:text-xl">
              Sans réservation pour la plupart : choisissez votre jour, on s&rsquo;occupe du reste.
            </p>
            <div className="flex w-full items-center justify-between gap-3 md:w-auto">
              <Link href="/agenda#bons-plans" className="btn btn-ghost">
                Voir les bons plans
              </Link>
              <RowArrows target="[data-deals-row]" label="Bons plans" className="flex gap-3" />
            </div>
          </div>

          {/* Trois cartes au même gabarit, aux couleurs de l'agenda : mercredi jaune,
              2 tickets = 1 offert bleu, dimanche blanc. Pas de bouton : la carte se suffit,
              le lien « Voir les bons plans » mène au détail. */}
          <div data-stagger data-deals-row className="bleed-row-mobile no-scrollbar mt-8 grid auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:auto-cols-[45%] md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
            {DEALS.filter((d) => SHOW_PROMOS || d.slug !== "2-plus-1").map((deal) => {
              const skin =
                deal.slug === "2-plus-1"
                  ? { card: "bg-promo text-white", soft: "text-white/80", rule: "border-white/30", label: "bg-white text-promo" }
                  : deal.accent === "flag"
                    ? { card: "bg-flag text-asphalt", soft: "text-asphalt/75", rule: "border-asphalt/20", label: "bg-asphalt text-flag" }
                    : { card: "bg-chalk text-asphalt", soft: "text-asphalt/70", rule: "border-asphalt/15", label: "bg-asphalt text-chalk" };
              return (
                <article
                  key={deal.slug}
                  className={`race-event-card flex snap-start flex-col gap-0 p-5 sm:p-6 ${skin.card}`}
                >
                  {/* Quand : en label. */}
                  <span className={`self-start rounded-full px-3 py-1 text-sm font-bold ${skin.label}`}>
                    {deal.kicker}
                  </span>
                  <h3 className="display mt-4 text-4xl leading-none md:text-[2.75rem]">{deal.name}</h3>
                  <p className={`mt-3 line-clamp-2 min-h-[2lh] text-base leading-snug ${skin.soft}`}>
                    {deal.summary}
                  </p>
                  <div className={`mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t pt-4 ${skin.rule}`}>
                    <p className="display text-3xl leading-none">{deal.price ?? "3e offerte"}</p>
                    <p className={`text-sm leading-snug ${skin.soft}`}>
                      {deal.priceNote ?? "2 sessions achetées, la 3e pour nous"}
                    </p>
                  </div>
                </article>
              );
            })}
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
