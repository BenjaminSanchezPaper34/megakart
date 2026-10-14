import type { Metadata } from "next";
import Link from "next/link";
import Affiche from "@/components/Affiche";
import InscriptionCourseEnfant from "@/components/InscriptionCourseEnfant";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { AGENDA, formatDate, getOperation } from "@/lib/agenda";
import { COURSE_ENFANT_SLUG, ENFANT } from "@/lib/inscription-enfant";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import EmojiList from "@/components/system/EmojiList";
import { factEmoji } from "@/components/system/tones";

/* Les dates passées disparaissent d'elles-mêmes : page régénérée chaque jour. */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Inscrire mon enfant à la Course Enfant",
  description:
    "Inscription en ligne à la Course Enfant de MegaKart à Vias : de 8 à 14 ans, 1,40 m minimum, 3 manches de 8 minutes en Kart Enfant, 32 € par enfant. Le circuit confirme la place sous 48 h.",
  alternates: { canonical: "/inscription/course-enfant" },
  robots: { index: false, follow: true },
};

/* Toutes les dates confirmées ; le composant écarte celles déjà passées. */
const DATES = AGENDA.filter(
  (a) => a.op === COURSE_ENFANT_SLUG && a.status === "confirme" && !a.endDate && a.date >= new Date().toISOString().slice(0, 10),
).map((a) => {
  const f = formatDate(a.date);
  return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}`, badge: a.badge };
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

      <PageHero
        short
        image={{ src: "/images/galerie-16-jeune-pilote.jpg", alt: "Jeune pilote casqué prêt à s'élancer sur le circuit MegaKart", position: "object-[center_35%]" }}
        label={<>{op.kicker} · {DATES.map((d) => d.label).join(" · ")}</>}
        line1="Inscrivez"
        line2="votre enfant."
        subtitle={`De ${ENFANT.ageMin} à ${ENFANT.ageMax} ans, 1,40 m minimum. Un parent, un ou plusieurs enfants : c'est tout ce qu'il faut.`}
        action={
          <>
            {DATES.filter((d) => d.badge && d.iso >= new Date().toISOString().slice(0, 10)).map((d) => (
              <span key={d.iso} className="rounded-full bg-race px-4 py-2 text-base font-bold text-white">
                {d.label} : {d.badge}
              </span>
            ))}
            <a href="#formulaire" className="btn btn-race">
              Aller au formulaire
            </a>
          </>
        }
      />

      {/* Le contexte avant le formulaire — même schéma que les 100 Tours. */}
      <section className="mx-auto max-w-5xl px-5 pb-(--section-y) md:px-8">
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
            <h2 data-reveal className="display text-[clamp(2.6rem,6vw,4.75rem)] leading-none text-chalk">
              {op.name}
            </h2>
            {op.details.map((par) => (
              <p
                key={par}
                data-reveal
                className="mt-5 text-base leading-relaxed text-chalk md:text-lg"
              >
                {par}
              </p>
            ))}
            <EmojiList items={op.facts.map((f) => ({ emoji: factEmoji(f), text: f }))} className="mt-8" />
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
        className="scroll-mt-28 bg-asphalt-2 py-(--section-y)"
      >
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <SectionHeader line1="Inscrire" line2="votre enfant." />
          <p data-reveal className="mt-5 text-base leading-relaxed text-chalk md:text-xl">
            Le circuit vous rappelle sous 48 heures pour confirmer la place.
            Aucun paiement en ligne. L&rsquo;âge et la taille sont vérifiés à
            l&rsquo;accueil le jour J.
          </p>
          <div className="mt-(--section-gap)">
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
              className="btn btn-ghost mt-6"
            >
              Tout sur la Course Enfant
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
