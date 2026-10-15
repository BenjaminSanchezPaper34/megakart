"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import OpenBadge from "./OpenBadge";
import SocialIcons from "./SocialIcons";
import { SITE } from "@/lib/site";

/*
 * Navigation resserrée (audit Codex du 13/10, docs/audit-navigation-2026-10-13.md,
 * avec Agenda gardé en accès direct) : 5 entrées tiennent sur une ligne dès
 * 1024 px, sans sous-menu (choix Benjamin 13/10). Toutes les pages restent
 * accessibles depuis le plan du site du pied de page. Pas de numéro sur
 * desktop : l'appel reste dans le menu mobile.
 */
const LINKS = [
  { href: "/#flotte", label: "Tarifs" },
  { href: "/agenda", label: "Agenda" },
  { href: "/evenements", label: "Événements" },
  { href: "/photos", label: "Photos" },
  { href: "/contact", label: "Contact" },
];

const EVENT_PATHS = ["/evenements", "/anniversaires"];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Referme le menu mobile à chaque navigation
  useEffect(() => setOpen(false), [pathname]);

  // Lien du menu mobile : on referme et on libère le scroll AVANT la navigation.
  // Sinon un lien d'ancre sur la même page (« Tarifs » → /#flotte depuis l'accueil)
  // ne fait rien : le chemin ne change pas, le menu reste ouvert, le scroll bloqué.
  const onMenuLink = (href: string) => (e: React.MouseEvent) => {
    document.documentElement.style.overflow = "";
    setOpen(false);
    const [path, hash] = href.split("#");
    if (hash && (path || "/") === pathname) {
      e.preventDefault();
      window.history.replaceState(null, "", href);
      // Laisse le menu se refermer, puis descend jusqu'à la section.
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  };

  // Bloque le scroll derrière le menu mobile
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="nav-veil" aria-hidden="true" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 md:px-8">
        <Logo className="relative z-50" />

        {/* Desktop */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {LINKS.map((l) => {
            const active = l.href === "/evenements" ? EVENT_PATHS.includes(pathname) : pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`link-under inline-flex min-h-11 items-center font-display text-base font-bold uppercase italic tracking-wide transition-colors ${
                    active ? "text-race" : "text-chalk hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-2 border-l border-white/15 pl-2">
            <SocialIcons />
          </li>
        </ul>

        {/* Burger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="relative z-50 flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="relative block h-4 w-7">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full bg-chalk transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-full bg-chalk transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-full bg-chalk transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Menu mobile plein écran : liste défilante, appel toujours visible en bas. */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-asphalt/[0.985] pt-24 transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
          {[{ href: "/", label: "Accueil" }, ...LINKS].map((l, i) => (
            <li
              key={l.href}
              style={{
                transition: `transform 0.5s ${0.06 * i + 0.1}s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ${0.06 * i + 0.1}s`,
                transform: open ? "translateY(0)" : "translateY(24px)",
                opacity: open ? 1 : 0,
              }}
            >
              <Link
                href={l.href}
                onClick={onMenuLink(l.href)}
                className={`display block py-2 text-3xl ${pathname === l.href ? "text-race" : "text-chalk"}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div
          className="flex flex-col gap-4 border-t border-white/10 px-6 pt-4"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          <SocialIcons size="lg" />
          <OpenBadge withDetail />
          <a href={SITE.phoneHref} className="btn btn-race justify-center">
            Appeler · {SITE.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
