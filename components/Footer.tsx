import Link from "next/link";
import Logo from "./Logo";
import SocialIcons from "./SocialIcons";
import PaperSignature from "./PaperSignature";
import { SITE } from "@/lib/site";

/* Plan du site : un lien vers chaque page publique. */
const PAGES = [
  { href: "/", label: "Accueil" },
  { href: "/#flotte", label: "Karts & tarifs" },
  { href: "/la-piste", label: "La piste" },
  { href: "/agenda", label: "Agenda" },
  { href: "/12-heures", label: "Les 12 Heures" },
  { href: "/inscription/100-tours", label: "Les 100 Tours" },
  { href: "/inscription/course-enfant", label: "Course Enfant" },
  { href: "/inscription/plein-gaz", label: "Trophée Plein Gaz" },
  { href: "/evenements", label: "Événements & groupes" },
  { href: "/photos", label: "Photos" },
  { href: "/live", label: "Chrono en direct" },
  { href: "/contact", label: "Contact" },
];


export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-asphalt-2">
      <div className="kerb" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.6fr_0.9fr] md:px-8">
        <div className="flex flex-col items-start gap-5">
          <Logo variant="stacked" />
          <p className="max-w-xs text-sm leading-relaxed text-chalk-60">
            Circuit de karting outdoor de 1000 m à Vias-plage, homologué FFSA.
            Location dès 3 ans &amp; compétition, sans réservation.
          </p>
        </div>

        <div className="text-sm leading-7">
          <h3 className="display mb-3 text-lg text-chalk">Nous trouver</h3>
          <address className="not-italic text-chalk-60">
            {SITE.name}
            <br />
            {SITE.address.street}
            <br />
            {SITE.address.zip} {SITE.address.city} · {SITE.address.dept}
          </address>
          <p className="mt-2 text-chalk-60">{SITE.landmark}</p>
          <a
            href={SITE.phoneHref}
            className="link-under mt-3 inline-block font-semibold text-chalk"
          >
            {SITE.phone}
          </a>
        </div>

        <nav aria-label="Plan du site" className="text-sm">
          <h3 className="display mb-3 text-lg text-chalk">Le site</h3>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {PAGES.map((pg) => (
              <li key={pg.href}>
                <Link
                  href={pg.href}
                  className="link-under inline-flex min-h-9 items-center text-chalk-60 transition-colors hover:text-chalk"
                >
                  {pg.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <h3 className="display mb-3 text-lg text-chalk">Suivre MegaKart</h3>
          {/* Mêmes logos que l'en-tête. */}
          <SocialIcons className="-ml-2" />
        </div>
      </div>

      <div className="border-t border-white/10">
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
