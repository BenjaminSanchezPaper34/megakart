import type { Metadata } from "next";
import Marquee from "@/components/Marquee";
import MonthPlanner from "@/components/MonthPlanner";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, agendaJsonLd } from "@/lib/jsonld";
import { RACES, DEALS, AGENDA, SHOW_PROMOS, formatDate, type Operation } from "@/lib/agenda";

/* Les promos datées attendent le feu vert du client (voir SHOW_PROMOS). */
const VISIBLE_DEALS = DEALS.filter((d) => SHOW_PROMOS || d.slug !== "2-plus-1");

export const metadata: Metadata = {
  title: "Agenda — courses, trophées & offres de fin d'année 2026",
  description:
    "Le programme MegaKart à Vias : Les 100 Tours, Trophée Plein Gaz, Women Cup, courses enfants, mercredis à volonté et promo 2 tickets = 1 offert. Toutes les dates de fin 2026.",
  alternates: { canonical: "/agenda" },
};

/* Couleur d'accent par opération, alignée sur les liserés de la flotte. */
const ACCENT_TEXT: Record<Operation["accent"], string> = {
  race: "text-race",
  flag: "text-flag",
  chalk: "text-chalk",
};
const ACCENT_BG: Record<Operation["accent"], string> = {
  race: "bg-race",
  flag: "bg-flag",
  chalk: "bg-chalk/30",
};

/** Dates connues d'une opération, formatées pour sa fiche. */
function opDates(slug: string) {
  return AGENDA.filter((a) => a.op === slug && !a.endDate).map((a) => {
    const f = formatDate(a.date);
    return { ...a, text: `${f.weekday} ${f.day} ${f.month}` };
  });
}

export default function AgendaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Agenda", path: "/agenda" }]),
            agendaJsonLd([
              {
                date: "2026-10-04",
                name: "Les 100 Tours",
                slug: "100-tours",
                description:
                  "Course d'endurance par équipes de 3 pilotes : 20 min d'essais et qualifications, puis 100 tours de course. 59€ par pilote, soit 177€ l'équipe.",
                price: 59,
              },
              {
                date: "2026-10-11",
                name: "Course Enfant",
                slug: "course-enfant",
                description:
                  "Course réservée aux enfants dès 7 ans (1,30 m minimum) : essais, grille de départ, drapeau à damier et podium. Inscription par téléphone.",
              },
              {
                date: "2026-11-01",
                name: "Trophée Plein Gaz",
                slug: "plein-gaz",
                description:
                  "8 min d'essais, 8 min de qualifications, course de 12 tours et finale de 10 minutes. À gagner : un baptême en voiture Vortex. 85€ par pilote.",
                price: 85,
              },
              {
                date: "2026-11-21",
                name: "Women Cup",
                slug: "women-cup",
                description:
                  "Course réservée aux femmes : 6 min d'essais, 6 min de qualifications et course de 14 tours. 48€ par pilote.",
                price: 48,
              },
            ]),
          ]),
        }}
      />

      {/* Hero court */}
      <section className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-48">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="display mb-3 text-lg text-flag">Fin d&rsquo;année 2026 — le programme</p>
          <h1 className="display text-[clamp(2.8rem,7vw,6rem)] text-chalk">
            Ça roule aussi
            <br />
            <span className="text-race">hors saison.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk-60">
            Endurance, trophées, courses enfants, roulage à volonté et bons
            plans : l&rsquo;automne et l&rsquo;hiver sont la vraie saison
            des pilotes. Toutes les dates sont ici — les courses se réservent
            par téléphone.
          </p>
        </div>
      </section>

      <Marquee
        items={[
          "Mercredi à volonté",
          "Les 100 Tours",
          "Trophée Plein Gaz",
          "Women Cup",
          "Pack Découverte",
          "Chrono Apex Timing",
        ]}
      />

      {/* ========== LE MOIS EN PISTE (calendrier mensuel) ========== */}
      <section className="bg-asphalt-2 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <h2 data-reveal className="display text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
            Le mois en piste, <span className="text-flag">en un coup d&rsquo;œil</span>
          </h2>
          <p data-reveal className="mt-3 max-w-xl text-base text-chalk-60">
            Ouvert, fermé, à volonté ou jour de course : touchez un jour pour
            le détail.
          </p>
          <div data-reveal className="mt-8">
            <MonthPlanner />
          </div>
          <p data-reveal className="mt-8 text-sm text-chalk-60">
            Les dates « à confirmer » seront validées ici et sur{" "}
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-under font-semibold text-chalk"
            >
              Instagram
            </a>
            . Pour les courses, les places sont limitées — réservation au{" "}
            <a href={SITE.phoneHref} className="link-under font-semibold text-chalk">
              {SITE.phone}
            </a>
            .
          </p>
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* ========== LES COURSES ========== */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
          Les courses
          <br />
          <span className="display-outline">de fin d&rsquo;année.</span>
        </h2>

        <div className="mt-16 flex flex-col gap-20">
          {RACES.map((race, i) => {
            const dates = opDates(race.slug);
            return (
              <article
                key={race.slug}
                id={race.slug}
                className={`grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p data-reveal className={`display text-lg ${ACCENT_TEXT[race.accent]}`}>
                    {race.kicker}
                  </p>
                  <h3 data-reveal className="display mt-1 text-[clamp(2.2rem,5vw,4rem)] text-chalk">
                    {race.name}
                  </h3>
                  {dates.length > 0 && (
                    <p data-reveal className="mt-3 flex flex-wrap gap-2">
                      {dates.map((d) => (
                        <span
                          key={d.date}
                          className={`display px-3 py-1.5 text-sm tracking-wide ${
                            d.status === "confirme"
                              ? "bg-chalk text-asphalt"
                              : "border border-white/20 text-chalk-60"
                          }`}
                        >
                          {d.text}
                          {d.status === "a-confirmer" && " — à confirmer"}
                        </span>
                      ))}
                    </p>
                  )}
                  {race.details.map((p) => (
                    <p key={p} data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-chalk-60">
                      {p}
                    </p>
                  ))}
                  {race.price && (
                    <p data-reveal className="display mt-6 flex items-baseline gap-3">
                      <span className="text-4xl text-chalk">{race.price}</span>
                      {race.priceNote && (
                        <span className="text-base text-chalk-60">{race.priceNote}</span>
                      )}
                    </p>
                  )}
                  <a href={SITE.phoneHref} data-reveal className="btn btn-race mt-7">
                    Réserver · {SITE.phone}
                  </a>
                </div>
                <ul data-stagger className="flex flex-col gap-4">
                  {race.facts.map((fact) => (
                    <li key={fact} className="card relative flex items-center gap-4 overflow-hidden p-5">
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-0 h-full w-1 ${ACCENT_BG[race.accent]}`}
                      />
                      <span className="checker-sm h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
                      <span className="text-base font-medium text-chalk">{fact}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* ========== LES BONS PLANS ========== */}
      <section className="bg-asphalt-2 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2 data-reveal className="display text-[clamp(2.2rem,5vw,4rem)] text-chalk">
            Les bons plans
            <br />
            <span className="text-flag">qui reviennent.</span>
          </h2>
          <div
            data-stagger
            className={`mt-12 grid gap-6 ${
              VISIBLE_DEALS.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {VISIBLE_DEALS.map((deal) => (
              <article
                key={deal.slug}
                id={deal.slug}
                className="card group relative flex scroll-mt-28 flex-col overflow-hidden p-7"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-full w-1 ${ACCENT_BG[deal.accent]}`}
                />
                <p className={`display text-base ${ACCENT_TEXT[deal.accent]}`}>{deal.kicker}</p>
                <h3 className="display mt-1 text-3xl text-chalk">{deal.name}</h3>
                {deal.details.map((p) => (
                  <p key={p} className="mt-4 text-base leading-relaxed text-chalk-60">
                    {p}
                  </p>
                ))}
                {deal.price && (
                  <p className="display mt-5 flex items-baseline gap-2">
                    <span className="text-4xl text-chalk">{deal.price}</span>
                    {deal.priceNote && (
                      <span className="text-sm text-chalk-60">{deal.priceNote}</span>
                    )}
                  </p>
                )}
                <ul className="mt-5 flex flex-1 flex-col border-t border-white/10 text-sm text-chalk-60">
                  {deal.facts.map((fact) => (
                    <li key={fact} className="border-b border-white/5 py-2 last:border-b-0">
                      {fact}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative overflow-hidden py-24 text-center md:py-32">
        <div className="checker absolute inset-x-0 top-0 h-5 opacity-[0.07]" aria-hidden="true" />
        <div className="mx-auto max-w-2xl px-5">
          <h2 data-reveal className="display text-[clamp(2.4rem,6vw,4.5rem)] text-chalk">
            Une date vous parle ?
          </h2>
          <p data-reveal className="mx-auto mt-5 max-w-md text-lg text-chalk-60">
            Les courses et le Pack Découverte se réservent par téléphone —
            le roulage à volonté, c&rsquo;est sans réservation.
          </p>
          <div data-reveal className="mt-9">
            <a href={SITE.phoneHref} className="btn btn-race glow-race text-lg">
              {SITE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
