import Link from "next/link";
import Logo from "./Logo";
import { SITE } from "@/lib/site";

const SOCIALS = [
  { label: "Instagram", href: SITE.social.instagram },
  { label: "Facebook", href: SITE.social.facebook },
  { label: "YouTube", href: SITE.social.youtube },
  { label: "TripAdvisor", href: SITE.social.tripadvisor },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-asphalt-2">
      <div className="kerb" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-3 md:px-8">
        <div className="flex flex-col items-start gap-5">
          <Logo />
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

        <div className="text-sm">
          <h3 className="display mb-3 text-lg text-chalk">Suivre la course</h3>
          <ul className="flex flex-col gap-2">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-under text-chalk-60 transition-colors hover:text-chalk"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-chalk-60/80 md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} {SITE.name} — Tous droits réservés</p>
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
            <li>
              Site conçu par{" "}
              <a
                href="https://www.paper34.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-chalk"
              >
                Paper34
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
