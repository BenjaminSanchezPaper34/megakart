"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import OpenBadge from "./OpenBadge";
import { SITE } from "@/lib/site";

/*
 * Navigation resserrée (audit Codex du 13/10, docs/audit-navigation-2026-10-13.md,
 * avec Agenda gardé en accès direct) : 5 entrées tiennent sur une ligne dès
 * 1024 px. Les pages de groupe passent dans le sous-menu Événements ; « La
 * piste » reste accessible depuis l'accueil et le pied de page.
 */
const LINKS = [
  { href: "/tarifs", label: "Tarifs" },
  { href: "/agenda", label: "Agenda" },
  { href: "/evenements", label: "Événements", menu: true },
  { href: "/photos", label: "Photos" },
  { href: "/contact", label: "Contact" },
];

const EVENT_GROUPS = [
  {
    title: "Au programme",
    links: [
      { href: "/agenda", label: "Courses & calendrier" },
      { href: "/12-heures", label: "Les 12 Heures" },
    ],
  },
  {
    title: "En groupe",
    links: [
      { href: "/anniversaires", label: "Anniversaires" },
      { href: "/evenements#evg-evjf", label: "EVG & EVJF" },
      { href: "/evenements#entreprise", label: "Entreprises & CE" },
    ],
  },
];

const EVENT_PATHS = ["/evenements", "/anniversaires", "/12-heures"];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [evOpen, setEvOpen] = useState(false);
  const pathname = usePathname();
  const evRef = useRef<HTMLLIElement>(null);
  const evBtnRef = useRef<HTMLButtonElement>(null);

  // Referme les menus à chaque navigation
  useEffect(() => {
    setOpen(false);
    setEvOpen(false);
  }, [pathname]);

  // Sous-menu Événements : clic extérieur ou Échap le referment.
  useEffect(() => {
    if (!evOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!evRef.current?.contains(e.target as Node)) setEvOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEvOpen(false);
        evBtnRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [evOpen]);

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
        <div className="hidden items-center gap-4 lg:flex xl:gap-8">
          <ul className="flex items-center gap-4 xl:gap-8">
            {LINKS.map((l) => {
              const active = l.menu ? EVENT_PATHS.includes(pathname) : pathname === l.href;
              const cls = `link-under inline-flex min-h-11 items-center font-display text-base font-bold uppercase italic tracking-wide transition-colors ${
                active ? "text-race" : "text-chalk hover:text-white"
              }`;
              if (!l.menu)
                return (
                  <li key={l.href}>
                    <Link href={l.href} className={cls} style={{ fontFamily: "var(--font-display)" }}>
                      {l.label}
                    </Link>
                  </li>
                );
              return (
                <li key={l.href} ref={evRef} className="relative">
                  <button
                    ref={evBtnRef}
                    type="button"
                    aria-expanded={evOpen}
                    aria-controls="menu-evenements"
                    onClick={() => setEvOpen((v) => !v)}
                    className={`${cls} inline-flex items-center gap-1.5`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {l.label}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 12 12"
                      className={`h-3 w-3 transition-transform duration-200 ${evOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                  {evOpen && (
                    <div
                      id="menu-evenements"
                      className="absolute left-1/2 top-full mt-4 w-[34rem] -translate-x-1/2 rounded-lg border border-white/10 bg-asphalt-2 p-6 shadow-2xl"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        {EVENT_GROUPS.map((g) => (
                          <div key={g.title}>
                            <p className="display mb-3 text-sm text-flag">{g.title}</p>
                            <ul className="flex flex-col">
                              {g.links.map((x) => (
                                <li key={x.href}>
                                  <Link
                                    href={x.href}
                                    className="block rounded py-2.5 text-base font-semibold text-chalk transition-colors hover:text-race"
                                  >
                                    {x.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/evenements"
                        className="mt-4 inline-flex min-h-11 items-center gap-1.5 border-t border-white/10 pt-4 text-sm font-semibold text-chalk-60 hover:text-chalk"
                      >
                        Tous les événements →
                      </Link>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <a href={SITE.phoneHref} className="btn btn-race">
            <span className="xl:hidden">Appeler</span>
            <span className="hidden xl:inline">{SITE.phone}</span>
          </a>
        </div>

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
              {"menu" in l && l.menu ? (
                <>
                  <button
                    type="button"
                    aria-expanded={evOpen}
                    onClick={() => setEvOpen((v) => !v)}
                    className={`display flex w-full items-center justify-between py-2 text-left text-3xl ${
                      EVENT_PATHS.includes(pathname) ? "text-race" : "text-chalk"
                    }`}
                  >
                    {l.label}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 12 12"
                      className={`h-5 w-5 transition-transform duration-200 ${evOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                  {evOpen && (
                    <div className="mb-3 flex flex-col gap-4 border-l border-white/15 pl-4 pt-1">
                      {EVENT_GROUPS.map((g) => (
                        <div key={g.title}>
                          <p className="display mb-1 text-sm text-flag">{g.title}</p>
                          {g.links.map((x) => (
                            <Link key={x.href} href={x.href} className="block py-2 text-lg font-semibold text-chalk">
                              {x.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                      <Link href="/evenements" className="py-2 text-base font-semibold text-chalk-60">
                        Tous les événements →
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={l.href}
                  className={`display block py-2 text-3xl ${pathname === l.href ? "text-race" : "text-chalk"}`}
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div
          className="flex flex-col gap-4 border-t border-white/10 px-6 pt-4"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          <OpenBadge withDetail />
          <a href={SITE.phoneHref} className="btn btn-race justify-center">
            Appeler · {SITE.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
