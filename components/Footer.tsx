import Link from "next/link";
import Logo from "./Logo";
import OpenBadge from "./OpenBadge";
import SocialIcons from "./SocialIcons";
import PaperSignature from "./PaperSignature";
import { SITE } from "@/lib/site";

/*
 * Pied de page (15/10, inspirations Mobbin : Cosmos / Zellerfeld pour le nom géant,
 * Monte pour les trois blocs pratiques, Resend pour le statut en direct) :
 * 1. trois blocs utiles — appeler, l'ouverture du jour, venir ;
 * 2. le plan du site en trois familles, logo compact à droite ;
 * 3. la ligne légale (English, ©, mentions, signature Paper34).
 */
const PLAN = [
  {
    title: "Rouler",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/#flotte", label: "Karts & tarifs" },
      { href: "/la-piste", label: "La piste" },
      { href: "/live", label: "Chrono en direct" },
      { href: "/photos", label: "Photos" },
      { href: "/galeries", label: "Vos photos à télécharger" },
    ],
  },
  {
    title: "Courir",
    links: [
      { href: "/agenda", label: "Agenda" },
      { href: "/inscription/100-tours", label: "Les 100 Tours" },
      { href: "/inscription/course-enfant", label: "Course Enfant" },
      { href: "/inscription/plein-gaz", label: "Trophée Plein Gaz" },
      { href: "/12-heures", label: "Les 12 Heures" },
    ],
  },
  {
    title: "Fêter",
    links: [
      { href: "/evenements#anniversaire", label: "Anniversaires" },
      { href: "/evenements#evg-evjf", label: "EVG · EVJF" },
      { href: "/evenements#entreprise", label: "Entreprises & CE" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const BLOC = "flex flex-col gap-3 border-t border-white/15 pt-5";
const BLOC_TITRE = "text-sm font-semibold uppercase tracking-widest text-chalk-60";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-asphalt-2">
      <div className="kerb" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 pt-(--section-gap) md:px-8">
        {/* 1. Les trois blocs utiles */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className={BLOC}>
            <p className={BLOC_TITRE}>Appeler</p>
            <a href={SITE.phoneHref} data-track="tel" className="display w-fit text-4xl leading-none text-chalk transition-colors hover:text-race">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="link-under w-fit text-base text-chalk-60 hover:text-chalk">
              {SITE.email}
            </a>
            <SocialIcons className="-ml-2.5" />
          </div>
          <div className={BLOC}>
            <p className={BLOC_TITRE}>Aujourd&rsquo;hui</p>
            <OpenBadge withDetail />
            <Link href="/agenda" className="link-under w-fit text-base font-semibold text-chalk">
              Le calendrier jour par jour
            </Link>
          </div>
          <div className={BLOC}>
            <p className={BLOC_TITRE}>Venir</p>
            <address className="text-base not-italic leading-relaxed text-chalk">
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city} · {SITE.address.dept}
            </address>
            <p className="text-sm leading-relaxed text-chalk-60">{SITE.landmark}</p>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-under w-fit text-base font-semibold text-chalk">
              Itinéraire
            </a>
          </div>
        </div>

        {/* 2. Plan du site, et le logo compact dans l'espace à droite */}
        <div className="mt-(--section-gap) flex flex-col gap-10 pb-(--section-gap) lg:flex-row lg:items-end lg:justify-between">
          <nav aria-label="Plan du site" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:w-2/3">
            {PLAN.map((col) => (
              <div key={col.title}>
                <p className="display text-xl text-chalk">{col.title}</p>
                <ul className="mt-3 flex flex-col">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-under inline-flex min-h-10 items-center text-base text-chalk-60 transition-colors hover:text-chalk">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <Logo variant="stacked" large className="self-start lg:self-end" />
        </div>
      </div>

      {/* 3. Ligne légale */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 text-xs text-chalk-60/80 md:flex-row md:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {/* Version anglaise : touristes de Vias-plage. */}
            <Link
              href="/en"
              hrefLang="en"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-chalk transition-colors hover:border-chalk/50 hover:bg-white/5"
            >
              <span aria-hidden="true" className="text-lg leading-none">🇬🇧</span> English
            </Link>
            <p>© {new Date().getFullYear()} {SITE.name} — Tous droits réservés</p>
          </div>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <li>
              <Link href="/mentions-legales" className="hover:text-chalk">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-chalk">
                Confidentialité
              </Link>
            </li>
          </ul>

          {/* Signature Paper34 — sobre au repos, fumée fluide au survol */}
          <PaperSignature />
        </div>
      </div>
    </footer>
  );
}
