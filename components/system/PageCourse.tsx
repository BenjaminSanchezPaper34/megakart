import type { ReactNode } from "react";
import Affiche from "@/components/Affiche";
import type { Operation } from "@/lib/agenda";
import { SITE } from "@/lib/site";
import EmojiList from "./EmojiList";
import PageHero from "./PageHero";
import SectionHeader from "./SectionHeader";
import { factEmoji } from "./tones";

/**
 * Page d'une course = sa page d'inscription (15/10) : le formulaire arrive
 * directement sous le titre, sur la photo ; tout le détail (affiche, texte,
 * format) passe dessous pour qui veut en savoir plus. Un clic depuis une carte
 * course suffit pour s'inscrire.
 */
export default function PageCourse({
  op,
  image,
  label,
  line1,
  line2,
  subtitle,
  badges,
  intro,
  form,
  priceNote,
  ouvert,
  children,
}: {
  op: Operation;
  image: { src: string; alt: string; position?: string };
  label: ReactNode;
  line1: string;
  line2: string;
  subtitle: string;
  badges?: ReactNode;
  /** Une phrase au-dessus du formulaire (rappel, paiement…). */
  intro: ReactNode;
  form: ReactNode;
  priceNote?: string;
  /** Au moins une date encore ouverte (sinon pas de rappel vers le formulaire). */
  ouvert: boolean;
  /** Sections propres à la course, après « Tout savoir » (ex. les 12 Heures). */
  children?: ReactNode;
}) {
  return (
    <>
      <PageHero short image={image} label={label} line1={line1} line2={line2} subtitle={subtitle} action={badges}>
        {/* Le formulaire sur toute la largeur du site, même gabarit pour chaque course. */}
        <div id="formulaire" className="scroll-mt-28">
          <p className="mb-5 max-w-3xl text-base leading-relaxed text-chalk md:text-lg">{intro}</p>
          {form}
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-chalk-60">
            Plutôt de vive voix ? Le circuit prend aussi les inscriptions au{" "}
            <a href={SITE.phoneHref} className="link-under font-semibold text-chalk">
              {SITE.phone}
            </a>{" "}
            et à{" "}
            <a href={`mailto:${SITE.email}`} className="link-under font-semibold text-chalk">
              {SITE.email}
            </a>
            .
          </p>
        </div>
      </PageHero>

      <div className="kerb" aria-hidden="true" />

      {/* Tout le détail, après le formulaire. */}
      <section id="la-course" className="scroll-mt-24 bg-asphalt-2 py-(--section-y)">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader line1="Tout savoir" line2={op.name + "."} accent="flag" />
          <div
            className={`mt-(--section-gap) ${op.affiche ? "grid gap-10 md:grid-cols-[minmax(0,1fr)_320px] md:items-start" : ""}`}
          >
            <Affiche op={op} className="mx-auto w-full max-w-[300px] md:order-2 md:max-w-none" />
            <div className="max-w-3xl">
              {op.details.map((par) => (
                <p key={par} data-reveal className="mt-5 text-base leading-relaxed text-chalk first:mt-0 md:text-lg">
                  {par}
                </p>
              ))}
              <EmojiList
                layout="grid"
                size="sm"
                items={op.facts.map((f) => ({ emoji: factEmoji(f), text: f }))}
                className="mt-8"
              />
              {op.price && (
                <p data-reveal className="display mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-4xl text-chalk">{op.price}</span>
                  {(priceNote ?? op.priceNote) && (
                    <span className="text-base text-chalk-60">{priceNote ?? op.priceNote}</span>
                  )}
                </p>
              )}
              {ouvert && (
                <a href="#formulaire" className="btn btn-race mt-8">
                  {op.signupCta ?? "Inscrire mon équipe"}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {children}
    </>
  );
}
