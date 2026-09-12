import type { Metadata } from "next";
import Link from "next/link";
import InscriptionCentTours from "@/components/InscriptionCentTours";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { AGENDA, formatDate, getOperation } from "@/lib/agenda";
import { CENT_TOURS_SLUG } from "@/lib/inscription";

export const metadata: Metadata = {
  title: "Inscrire mon équipe aux 100 Tours",
  description:
    "Inscription en ligne d'une équipe de 3 pilotes aux 100 Tours de MegaKart à Vias : date, nom d'équipe, capitaine et coéquipiers. Le circuit confirme la place par téléphone ou e-mail.",
  alternates: { canonical: "/inscription/100-tours" },
  // Page outil, liée depuis l'agenda : inutile de l'indexer pour elle-même.
  robots: { index: false, follow: true },
};

/* Toutes les dates confirmées ; le composant écarte celles déjà passées. */
const DATES = AGENDA.filter((a) => a.op === CENT_TOURS_SLUG && a.status === "confirme" && !a.endDate).map(
  (a) => {
    const f = formatDate(a.date);
    return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}` };
  }
);

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
              { name: "Inscription aux 100 Tours", path: "/inscription/100-tours" },
            ])
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
            Trois pilotes, un nom d&rsquo;équipe, un capitaine qu&rsquo;on peut joindre :
            c&rsquo;est tout ce qu&rsquo;il faut. Le circuit vous rappelle pour confirmer
            la place — aucun paiement en ligne.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-14">
          <InscriptionCentTours dates={DATES} />

          <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="card p-6">
              <p className="display text-lg text-race">{op.name}</p>
              <p className="mt-2 text-base leading-relaxed text-chalk-60">{op.summary}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {op.facts.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-base text-chalk">
                    <span className="checker-sm h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              {op.price && (
                <p className="display mt-6 flex items-baseline gap-3">
                  <span className="text-4xl text-chalk">{op.price}</span>
                  {op.priceNote && <span className="text-base text-chalk-60">{op.priceNote}</span>}
                </p>
              )}
            </div>

            <div className="card p-6">
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
              <Link href="/agenda#100-tours" className="btn btn-ghost mt-6 text-sm">
                Tout sur les 100 Tours
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
