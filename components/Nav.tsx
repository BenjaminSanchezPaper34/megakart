"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import OpenBadge from "./OpenBadge";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/tarifs", label: "Karts & tarifs" },
  { href: "/la-piste", label: "La piste" },
  { href: "/anniversaires", label: "Anniversaires" },
  { href: "/evenements", label: "Événements" },
  { href: "/photos", label: "Photos" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Referme le menu mobile à chaque navigation
  useEffect(() => setOpen(false), [pathname]);

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
        <div className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-7">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`link-under font-display text-[0.95rem] font-bold uppercase italic tracking-wide transition-colors ${
                    pathname === l.href ? "text-race" : "text-chalk hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={SITE.phoneHref} className="btn btn-race !py-2.5 !px-5 text-sm">
            {SITE.phone}
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

      {/* Menu mobile plein écran */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-asphalt/[0.985] px-6 pb-10 pt-28 transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-2">
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
                className={`display block py-2 text-4xl ${
                  pathname === l.href ? "text-race" : "text-chalk"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-5">
          <OpenBadge withDetail />
          <a href={SITE.phoneHref} className="btn btn-race justify-center">
            Appeler · {SITE.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
