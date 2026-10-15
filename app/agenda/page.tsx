import type { Metadata } from "next";
import Link from "next/link";
import MonthPlanner from "@/components/MonthPlanner";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, agendaJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/system/PageHero";
import CoursesAVenir from "@/components/CoursesAVenir";
import CtaFinal from "@/components/system/CtaFinal";
import BonsPlans from "@/components/system/BonsPlans";
import {
  AGENDA,
  getOperation,
  pageCourse,
} from "@/lib/agenda";


/* Événements JSON-LD : uniquement les dates confirmées à jour unique. */
const JSONLD_EVENTS = AGENDA.filter(
  (a) => a.status === "confirme" && !a.endDate,
).map((a) => {
  const op = a.op ? getOperation(a.op) : undefined;
  return {
    date: a.date,
    name: a.label ?? op?.name ?? "",
    slug: a.op,
    path: op ? pageCourse(op) : undefined,
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

/* Dates passées grisées : la page est régénérée chaque jour. */
export const revalidate = 86400;

export default function AgendaPage() {
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
        image={{ src: "/images/galerie-22-aerien-crepuscule.jpg", alt: "Le circuit MegaKart au crépuscule, vu du ciel", position: "object-[center_40%]" }}
        line1="Ça roule aussi"
        line2="hors saison."
        subtitle="Courses, roulage à volonté et bons plans : touchez un jour du calendrier pour le détail."
      >
        <MonthPlanner />
        <p className="mx-auto mt-8 max-w-3xl text-center text-base text-chalk-60">
          Les jours de course, le classement défile en direct sur la page{" "}
          <Link href="/live" className="link-under font-semibold text-chalk">
            chrono
          </Link>
          . Les dates « à confirmer » seront validées ici et sur{" "}
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
      </PageHero>
      <div className="kerb" aria-hidden="true" />

      {/* ========== LES COURSES (même section que l'accueil) ========== */}
      <CoursesAVenir lienAgenda={false} id="courses" />

      <div className="kerb" aria-hidden="true" />

      {/* ========== LES BONS PLANS (même section que l'accueil) ========== */}
      <BonsPlans />

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
