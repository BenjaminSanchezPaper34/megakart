import type { Metadata } from "next";
import Link from "next/link";
import Affiche from "@/components/Affiche";
import InscriptionCentTours from "@/components/InscriptionCentTours";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { AGENDA, formatDate, getOperation } from "@/lib/agenda";
import { CENT_TOURS_SLUG } from "@/lib/inscription";

export const metadata: Metadata = {
  title: "Inscrire mon équipe aux 100 Tours",
  description:
    "Inscription en ligne d'une équipe de 2 ou 3 pilotes aux 100 Tours de MegaKart à Vias, sur les nouveaux Sodi RT10 390cc : date, nom d'équipe, capitaine et coéquipiers. Le circuit confirme la place par téléphone ou e-mail.",
  alternates: { canonical: "/inscription/100-tours" },
  // Page outil, liée depuis l'agenda : inutile de l'indexer pour elle-même.
  robots: { index: false, follow: true },
};

/* Toutes les dates confirmées ; le composant écarte celles déjà passées. */
const DATES = AGENDA.filter(
  (a) => a.op === CENT_TOURS_SLUG && a.status === "confirme" && !a.endDate,
).map((a) => {
  const f = formatDate(a.date);
  return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}` };
});

export default function InscriptionCentToursPage() {
  const op = getOperation(CENT_TOURS_SLUG)!;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Agenda", path: "/agenda" },
              {
                name: "Inscription aux 100 Tours",
                path: "/inscription/100-tours",
              },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden pb-12 pt-40 md:pb-16 md:pt-48">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="display mb-3 text-lg text-flag">
            {op.kicker} · {DATES.map((d) => d.label).join(" et ")}
          </p>
          <h1 className="display text-[clamp(2.8rem,7vw,6rem)] text-chalk">
            Inscrivez
            <br />
            <span className="text-race">votre équipe.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk-60">
            Deux ou trois pilotes, un nom d&rsquo;équipe, un capitaine
            qu&rsquo;on peut joindre : c&rsquo;est tout ce qu&rsquo;il faut.
          </p>
          <a href="#formulaire" className="btn btn-race glow-race mt-8">
            Aller au formulaire
          </a>
        </div>
      </section>

      {/*
        Le contexte AVANT le formulaire. Un visiteur arrive ici directement
        depuis le pop-up ou le bouton de l'agenda : il doit pouvoir lire ce
        qu'est la course avant qu'on lui demande le nom de ses coéquipiers.
        Colonne unique et lecture en descendant — schéma à reprendre pour
        toute future page d'inscription.
      */}
      <section className="mx-auto max-w-5xl px-5 pb-16 md:px-8 md:pb-20">
        <div
          className={
            op.affiche
              ? "grid gap-10 md:grid-cols-[minmax(0,1fr)_320px] md:items-start"
              : ""
          }
        >
          <Affiche
            op={op}
            priority
            className="mx-auto w-full max-w-[300px] md:order-2 md:max-w-none"
          />
          <div className="max-w-3xl">
            <h2
              data-reveal
              className="display text-[clamp(1.8rem,4vw,2.6rem)] text-chalk"
            >
              {op.name}
            </h2>
            {op.details.map((par) => (
              <p
                key={par}
                data-reveal
                className="mt-4 text-base leading-relaxed text-chalk-60"
              >
                {par}
              </p>
            ))}

            <ul data-stagger className="mt-8 grid gap-3 sm:grid-cols-2">
              {op.facts.map((f) => (
                <li
                  key={f}
                  className="card flex items-center gap-3 p-4 text-base text-chalk"
                >
                  <span
                    className="checker-sm h-3 w-3 shrink-0 opacity-60"
                    aria-hidden="true"
                  />
                  {f}
                </li>
              ))}
            </ul>

            {op.price && (
              <p
                data-reveal
                className="display mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1"
              >
                <span className="text-4xl text-chalk">{op.price}</span>
                {op.priceNote && (
                  <span className="text-base text-chalk-60">
                    {op.priceNote}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Le formulaire, une fois le décor planté. */}
      <section
        id="formulaire"
        className="scroll-mt-28 bg-asphalt-2 py-16 md:py-20"
      >
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2
            data-reveal
            className="display text-[clamp(1.8rem,4vw,2.6rem)] text-chalk"
          >
            Inscrire <span className="text-race">votre équipe.</span>
          </h2>
          <p
            data-reveal
            className="mt-3 text-base leading-relaxed text-chalk-60"
          >
            Le circuit vous rappelle pour confirmer la place. Aucun paiement en
            ligne.
          </p>

          <div className="mt-8">
            <InscriptionCentTours dates={DATES} />
          </div>

          <div className="card mt-8 p-6">
            <p className="display text-lg text-chalk">Plutôt de vive voix ?</p>
            <p className="mt-2 text-base leading-relaxed text-chalk-60">
              L&rsquo;équipe du circuit prend aussi les inscriptions au
              téléphone et par e-mail.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={SITE.phoneHref}
                className="link-under w-fit text-base font-semibold text-chalk"
              >
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="link-under w-fit text-base font-semibold text-chalk"
              >
                {SITE.email}
              </a>
            </div>
            <Link
              href="/agenda#100-tours"
              className="btn btn-ghost mt-6 text-sm"
            >
              Tout sur les 100 Tours
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
