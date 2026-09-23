import type { Metadata } from "next";
import Link from "next/link";
import Affiche from "@/components/Affiche";
import InscriptionCourseEnfant from "@/components/InscriptionCourseEnfant";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { AGENDA, formatDate, getOperation } from "@/lib/agenda";
import { COURSE_ENFANT_SLUG, ENFANT } from "@/lib/inscription-enfant";

export const metadata: Metadata = {
  title: "Inscrire mon enfant à la Course Enfant",
  description:
    "Inscription en ligne à la Course Enfant de MegaKart à Vias : de 8 à 14 ans, 1,40 m minimum, 3 manches de 8 minutes en Kart Enfant, 32 € par enfant. Le circuit confirme la place sous 48 h.",
  alternates: { canonical: "/inscription/course-enfant" },
  robots: { index: false, follow: true },
};

/* Toutes les dates confirmées ; le composant écarte celles déjà passées. */
const DATES = AGENDA.filter(
  (a) => a.op === COURSE_ENFANT_SLUG && a.status === "confirme" && !a.endDate,
).map((a) => {
  const f = formatDate(a.date);
  return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}` };
});

export default function InscriptionCourseEnfantPage() {
  const op = getOperation(COURSE_ENFANT_SLUG)!;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Agenda", path: "/agenda" },
              {
                name: "Inscription à la Course Enfant",
                path: "/inscription/course-enfant",
              },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden pb-12 pt-40 md:pb-16 md:pt-48">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="display mb-3 text-lg text-flag">
            {op.kicker} · {DATES.map((d) => d.label).join(" · ")}
          </p>
          <h1 className="display text-[clamp(2.8rem,7vw,6rem)] text-chalk">
            Inscrivez
            <br />
            <span className="text-race">votre enfant.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk-60">
            De {ENFANT.ageMin} à {ENFANT.ageMax} ans, 1,40 m minimum. Un parent,
            un ou plusieurs enfants : c&rsquo;est tout ce qu&rsquo;il faut.
          </p>
          <a href="#formulaire" className="btn btn-race glow-race mt-8">
            Aller au formulaire
          </a>
        </div>
      </section>

      {/* Le contexte avant le formulaire — même schéma que les 100 Tours. */}
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
                <span className="text-base text-chalk-60">
                  réglé sur place le jour de la course
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      <section
        id="formulaire"
        className="scroll-mt-28 bg-asphalt-2 py-16 md:py-20"
      >
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2
            data-reveal
            className="display text-[clamp(1.8rem,4vw,2.6rem)] text-chalk"
          >
            Inscrire <span className="text-race">votre enfant.</span>
          </h2>
          <p
            data-reveal
            className="mt-3 text-base leading-relaxed text-chalk-60"
          >
            Le circuit vous rappelle sous 48 heures pour confirmer la place.
            Aucun paiement en ligne. L&rsquo;âge et la taille sont vérifiés à
            l&rsquo;accueil le jour J.
          </p>
          <div className="mt-8">
            <InscriptionCourseEnfant dates={DATES} />
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
              href="/agenda#course-enfant"
              className="btn btn-ghost mt-6 text-sm"
            >
              Tout sur la Course Enfant
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
