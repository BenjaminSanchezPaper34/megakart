import type { Metadata } from "next";
import Link from "next/link";
import Affiche from "@/components/Affiche";
import InscriptionCentTours from "@/components/InscriptionCentTours";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { AGENDA, formatDate, getOperation } from "@/lib/agenda";
import { CENT_TOURS_SLUG } from "@/lib/inscription";
import PageHero from "@/components/system/PageHero";
import SectionHeader from "@/components/system/SectionHeader";
import EmojiList from "@/components/system/EmojiList";
import { factEmoji } from "@/components/system/tones";

/* Les dates passées disparaissent d'elles-mêmes : page régénérée chaque jour. */
export const revalidate = 86400;

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
  (a) => a.op === CENT_TOURS_SLUG && a.status === "confirme" && !a.endDate && a.date >= new Date().toISOString().slice(0, 10),
).map((a) => {
  const f = formatDate(a.date);
  return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}`, places: a.places };
});

/* Les dates complètes restent annoncées mais sortent du formulaire. */
const OUVERTES = DATES.filter((d) => d.places !== 0);

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

      <PageHero
        short
        image={ src: "/images/galerie-01-kart-adulte.jpg", alt: "Pilote en pleine session sur le circuit MegaKart", position: "object-[center_40%]" }
        label={<>{op.kicker} · {DATES.map((d) => d.label).join(" et ")}</>}
        line1="Inscrivez"
        line2="votre équipe."
        subtitle="Deux ou trois pilotes, un nom d'équipe, un capitaine qu'on peut joindre : c'est tout ce qu'il faut."
        action={
          <>
            {DATES.filter((d) => d.places !== undefined).map((d) => (
              <span key={d.iso} className="rounded-full bg-race px-4 py-2 text-base font-bold text-white">
                {d.label} : {d.places === 0 ? "complet" : d.places === 1 ? "dernière place" : `plus que ${d.places} équipes`}
              </span>
            ))}
            <a href="#formulaire" className="btn btn-race">
              Aller au formulaire
            </a>
          </>
        }
      />

      {/*
        Le contexte AVANT le formulaire. Un visiteur arrive ici directement
        depuis le pop-up ou le bouton de l'agenda : il doit pouvoir lire ce
        qu'est la course avant qu'on lui demande le nom de ses coéquipiers.
        Colonne unique et lecture en descendant — schéma à reprendre pour
        toute future page d'inscription.
      */}
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
        className="scroll-mt-28 bg-asphalt-2 py-(--section-y)"
      >
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <SectionHeader line1="Inscrire" line2="votre équipe." />
          <p data-reveal className="mt-5 text-base leading-relaxed text-chalk md:text-xl">
            Le circuit vous rappelle pour confirmer la place. Aucun paiement en
            ligne.
          </p>

          <div className="mt-(--section-gap)">
            <InscriptionCentTours dates={OUVERTES} />
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
              className="btn btn-ghost mt-6"
            >
              Tout sur les 100 Tours
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
