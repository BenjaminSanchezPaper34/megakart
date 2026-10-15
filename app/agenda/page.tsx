import type { Metadata } from "next";
import Link from "next/link";
import Affiche from "@/components/Affiche";
import Marquee from "@/components/Marquee";
import MonthPlanner from "@/components/MonthPlanner";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, agendaJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import EmojiList from "@/components/system/EmojiList";
import CtaFinal from "@/components/system/CtaFinal";
import { dealSkin, factEmoji, LABEL_TONE } from "@/components/system/tones";
import RowArrows from "@/components/RowArrows";
import {
  RACES,
  DEALS,
  AGENDA,
  SHOW_PROMOS,
  getOperation,
  formatDate,
} from "@/lib/agenda";

/* Les promos datées attendent le feu vert du client (voir SHOW_PROMOS). */
const VISIBLE_DEALS = DEALS.filter((d) => SHOW_PROMOS || d.slug !== "2-plus-1");

/* Événements JSON-LD : uniquement les dates confirmées à jour unique. */
const JSONLD_EVENTS = AGENDA.filter(
  (a) => a.status === "confirme" && !a.endDate,
).map((a) => {
  const op = a.op ? getOperation(a.op) : undefined;
  return {
    date: a.date,
    name: a.label ?? op?.name ?? "",
    slug: a.op,
    description: op ? `${op.summary} ${op.facts.join(" · ")}.` : (a.note ?? ""),
    price: op?.priceValue,
    image:
      a.label === "Nocturne Halloween" ? "galerie-08-nocturne.jpg" : undefined,
  };
});

export const metadata: Metadata = {
  title: "Agenda — courses, trophées & offres de fin d'année 2026",
  description:
    "Le programme MegaKart à Vias : Les 100 Tours, Trophée Plein Gaz, courses enfants, mercredis à volonté et Pack Découverte avec coaching. Le calendrier complet de fin 2026, jour par jour.",
  alternates: { canonical: "/agenda" },
};

/** Dates connues d'une opération, formatées pour sa fiche. */
function opDates(slug: string) {
  return AGENDA.filter((a) => a.op === slug && !a.endDate).map((a) => {
    const f = formatDate(a.date);
    return { ...a, text: `${f.weekday} ${f.day} ${f.month}` };
  });
}

/* Dates passées grisées : la page est régénérée chaque jour. */
export const revalidate = 86400;

export default function AgendaPage() {
  const AUJOURDHUI = new Date().toISOString().slice(0, 10);
  /* Prochaine date encore ouverte de chaque course (ni passée, ni complète). */
  const prochaine = (slug: string) =>
    AGENDA.filter((a) => a.op === slug && a.status === "confirme" && !a.endDate && a.date >= AUJOURDHUI && a.places !== 0)
      .map((a) => a.date)
      .sort()[0];
  /* Courses dans l'ordre de leur prochaine date ouverte ; complètes ou passées en dernier. */
  const COURSES = [...RACES].sort((a, b) => (prochaine(a.slug) ?? "9999").localeCompare(prochaine(b.slug) ?? "9999"));
  /* Raccourcis du haut de page : les prochaines dates ouvertes, une par course. */
  const RACCOURCIS = COURSES.filter((r) => prochaine(r.slug)).map((r) => {
    const f = formatDate(prochaine(r.slug)!);
    return { slug: r.slug, label: `${f.day} ${f.month} · ${r.name}` };
  });
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Agenda", path: "/agenda" }]),
            agendaJsonLd(JSONLD_EVENTS),
          ]),
        }}
      />

      <PageHero
        short
        image={{ src: "/images/galerie-22-aerien-crepuscule.jpg", alt: "Le circuit MegaKart au crépuscule, vu du ciel", position: "object-[center_40%]" }}
        label="Fin d'année 2026, le programme"
        line1="Ça roule aussi"
        line2="hors saison."
        subtitle="Endurance, trophées, courses enfants, roulage à volonté et bons plans : l'automne et l'hiver sont la vraie saison des pilotes."
        action={
          <nav aria-label="Prochaines courses" className="flex flex-wrap gap-2">
            {RACCOURCIS.map((r) => (
              <a
                key={r.slug}
                href={`#${r.slug}`}
                className="rounded-full border border-chalk/30 bg-asphalt/60 px-4 py-2 text-sm font-semibold text-chalk transition-colors hover:border-chalk hover:bg-chalk hover:text-asphalt"
              >
                {r.label}
              </a>
            ))}
            <a
              href="#bons-plans"
              className="rounded-full bg-flag px-4 py-2 text-sm font-bold text-asphalt transition-colors hover:bg-chalk"
            >
              Bons plans
            </a>
          </nav>
        }
      />

      <Marquee
        items={[
          "Mercredi à volonté",
          ...(SHOW_PROMOS ? ["2 tickets = 1 offert"] : []),
          "Les 100 Tours",
          "Trophée Plein Gaz",
          "Pack Découverte",
          "Chrono Apex Timing",
        ]}
      />

      {/* ========== LE MOIS EN PISTE (calendrier mensuel) ========== */}
      <section className="bg-asphalt-2 py-(--section-y)">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader
            line1="Le mois en piste,"
            line2="en un coup d'œil."
            accent="flag"
            subtitle={
              <>
                Ouvert, fermé, à volonté ou jour de course : touchez un jour pour le détail. Les jours de course, le
                classement défile en direct sur la page{" "}
                <Link href="/live" className="link-under font-semibold">
                  chrono
                </Link>
                .
              </>
            }
          />
          <div data-reveal className="mt-(--section-gap)">
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
            . Pour les courses, les places sont limitées : réservation au{" "}
            <a href={SITE.phoneHref} className="link-under font-semibold text-chalk">
              {SITE.phone}
            </a>
            {SITE.email && (
              <>
                {" "}
                ou par e-mail à{" "}
                <a href={`mailto:${SITE.email}`} className="link-under font-semibold text-chalk">
                  {SITE.email}
                </a>
              </>
            )}
            .
          </p>
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* ========== LES COURSES ========== */}
      <section className="mx-auto max-w-7xl px-5 py-(--section-y) md:px-8">
        <SectionHeader
          line1="Les courses"
          line2="de fin d'année."
          accent="outline"
          subtitle="Le rythme est simple : une course adulte et une course enfant par mois, toujours le dimanche. Et le 19 décembre, le circuit passe aux 12 Heures."
        />

        <div className="mt-(--section-gap) flex flex-col gap-(--section-y)">
          {COURSES.map((race, i) => {
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
                  <p className={`mb-4 inline-flex rounded-full px-4 py-1.5 text-sm font-bold ${LABEL_TONE[race.accent]}`}>
                    {race.kicker}
                  </p>
                  <h3 data-reveal className="display text-[clamp(2.6rem,6vw,4.75rem)] leading-none text-chalk">
                    {race.name}
                  </h3>
                  {dates.length > 0 && (
                    <p data-reveal className="mt-5 flex flex-wrap gap-2">
                      {dates.map((d) => (
                        <span
                          key={d.date}
                          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                            d.date < AUJOURDHUI
                              ? "bg-white/5 text-chalk-60/60 line-through decoration-1"
                              : d.status === "confirme"
                                ? "bg-chalk text-asphalt"
                                : "border border-white/20 text-chalk-60"
                          }`}
                          title={d.date < AUJOURDHUI ? "Date passée" : undefined}
                        >
                          {d.text}
                          {d.date < AUJOURDHUI ? null : (
                            <>
                              {d.status === "a-confirmer" && " · à confirmer"}
                              {d.badge && ` · ${d.badge}`}
                              {d.places !== undefined && (d.places === 0 ? " · complet" : d.places === 1 ? " · dernière place" : ` · plus que ${d.places} équipes`)}
                            </>
                          )}
                        </span>
                      ))}
                    </p>
                  )}
                  <p data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-chalk md:text-lg">
                    {race.details[0]}
                  </p>
                  {race.details.length > 1 && (
                    <details className="group mt-3 max-w-xl">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-base font-semibold text-chalk [&::-webkit-details-marker]:hidden">
                        <span className="link-under">En savoir plus</span>
                        <span aria-hidden="true" className="display text-xl text-race transition-transform duration-300 group-open:rotate-45">+</span>
                      </summary>
                      {race.details.slice(1).map((p) => (
                        <p key={p} className="mt-4 text-base leading-relaxed text-chalk-60">
                          {p}
                        </p>
                      ))}
                    </details>
                  )}
                  {race.price && (
                    <p data-reveal className="display mt-6 flex flex-wrap items-baseline gap-x-3">
                      <span className="text-4xl text-chalk">{race.price}</span>
                      {race.priceNote && <span className="text-base text-chalk-60">{race.priceNote}</span>}
                    </p>
                  )}
                  <div data-reveal className="mt-8 flex flex-wrap gap-4">
                    {race.signup ? (
                      <>
                        {/* Inscription en ligne : le téléphone passe en second. */}
                        <Link href={race.signup} data-track="inscription-ouverture" className="btn btn-race">
                          {race.signupCta ?? "Inscrire mon équipe"}
                        </Link>
                        <a href={SITE.phoneHref} className="btn btn-ghost">
                          {SITE.phone}
                        </a>
                      </>
                    ) : (
                      <>
                        <a href={SITE.phoneHref} className="btn btn-race">
                          Réserver · {SITE.phone}
                        </a>
                        {SITE.email && (
                          <a href={`mailto:${SITE.email}`} className="btn btn-ghost">
                            Réserver par e-mail
                          </a>
                        )}
                      </>
                    )}
                    {race.page && (
                      <Link href={race.page} className="btn btn-ghost">
                        La page de l&rsquo;épreuve
                      </Link>
                    )}
                  </div>
                </div>
                {/* Colonne droite : l'affiche officielle quand elle existe, puis les faits à émojis. */}
                <div
                  className={
                    race.affiche ? "grid gap-8 sm:grid-cols-[minmax(0,240px)_1fr] sm:items-center" : ""
                  }
                >
                  <Affiche op={race} className="mx-auto hidden w-full max-w-[260px] sm:block sm:max-w-none" />
                  <EmojiList size="sm" items={race.facts.map((f) => ({ emoji: factEmoji(f), text: f }))} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* ========== LES BONS PLANS ========== */}
      <section id="bons-plans" className="scroll-mt-24 bg-asphalt-2 py-(--section-y)">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader
            line1="Les bons plans"
            line2="qui reviennent."
            accent="flag"
            subtitle="Sans réservation pour la plupart : choisissez votre jour, on s'occupe du reste."
            action={<RowArrows target="[data-deals-agenda]" label="Bons plans" className="flex gap-3" />}
          />
          {/* Aux couleurs du calendrier : mercredi jaune, 2+1 bleu, dimanche blanc. */}
          <div
            data-stagger
            data-deals-agenda
            className={`bleed-row-mobile no-scrollbar mt-(--section-gap) grid auto-cols-[85%] grid-flow-col items-start gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:auto-cols-[45%] md:auto-cols-auto md:grid-flow-row md:gap-5 md:overflow-visible md:pb-0 ${VISIBLE_DEALS.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
          >
            {VISIBLE_DEALS.map((deal) => {
              const skin = dealSkin(deal);
              return (
                <article
                  key={deal.slug}
                  id={deal.slug}
                  className={`race-event-card flex h-full snap-start scroll-mt-28 flex-col items-center p-6 text-center sm:p-7 ${skin.card}`}
                >
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${skin.label}`}>{deal.kicker}</span>
                  <h3 className="display mt-4 text-4xl leading-none md:text-[2.75rem]">{deal.name}</h3>
                  <p className={`mt-4 text-base leading-relaxed ${skin.soft}`}>{deal.summary}</p>
                  {/* Détail et conditions repliés : la carte reste courte, surtout sur mobile. */}
                  <details className={`group mt-4 w-full border-t pt-3 text-left ${skin.rule}`}>
                    <summary className="flex cursor-pointer list-none items-center justify-center gap-2 text-sm font-bold [&::-webkit-details-marker]:hidden">
                      Les conditions
                      <span aria-hidden="true" className="display text-lg transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    {deal.details.map((p) => (
                      <p key={p} className={`mt-3 text-sm leading-relaxed ${skin.soft}`}>
                        {p}
                      </p>
                    ))}
                    <ul className={`mt-3 border-t text-sm ${skin.rule}`}>
                      {deal.facts.map((fact) => (
                        <li key={fact} className={`border-b py-2 last:border-b-0 ${skin.rule}`}>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </details>
                  {deal.price && (
                    <div className={`mt-auto flex w-full flex-col items-center gap-1 border-t pt-4 ${skin.rule}`}>
                      <p className="display text-4xl leading-none">{deal.price}</p>
                      {deal.priceNote && <p className={`text-sm ${skin.soft}`}>{deal.priceNote}</p>}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CtaFinal
        line1="Une date"
        line2="vous parle ?"
        subtitle="Les courses et le Pack Découverte se réservent par téléphone ou par e-mail. Le roulage à volonté, c'est sans réservation."
      >
        <a href={SITE.phoneHref} className="btn btn-race">
          {SITE.phone}
        </a>
        {SITE.email && (
          <a href={`mailto:${SITE.email}`} className="btn btn-ghost">
            Écrire au circuit
          </a>
        )}
      </CtaFinal>
    </>
  );
}
