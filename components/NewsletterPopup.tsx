"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics/react";
import NewsletterForm from "@/components/NewsletterForm";
import { useOuvertureAuGeste, VU_CETTE_VISITE } from "@/components/useOuvertureAuGeste";

/**
 * Pop-up de repli : quand aucune course n'est en campagne (lib/popup.ts),
 * on propose la newsletter à la place. Mêmes règles que l'annonce de course :
 * délai + premier geste, une annonce par visite, jamais sur une page
 * d'inscription ni sur l'accueil (la section newsletter y est déjà), et plus
 * jamais une fois fermé ou rempli.
 */
const CLE = "megakart-popup-newsletter";

export default function NewsletterPopup() {
  const [actif, setActif] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setActif(false);
    try {
      localStorage.setItem(CLE, "closed");
    } catch {}
  }, []);

  useEffect(() => {
    setActif(false);
    if (pathname === "/" || pathname.startsWith("/inscription/")) return;
    try {
      if (sessionStorage.getItem(VU_CETTE_VISITE) || localStorage.getItem(CLE) === "closed") return;
    } catch {
      return;
    }
    setActif(true);
  }, [pathname]);

  const ouvrir = useCallback(() => setOpen(true), []);
  useOuvertureAuGeste(actif, ouvrir);

  // Échap pour fermer, fond figé, focus sur la croix.
  useEffect(() => {
    if (!open) return;
    track("popup-vu", { campagne: "newsletter" });
    try {
      sessionStorage.setItem(VU_CETTE_VISITE, "1");
    } catch {}
    closeRef.current?.focus();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nl-popup-titre"
      onClick={close}
      className="fixed inset-0 z-[2000] grid place-items-center bg-asphalt/80 p-4 backdrop-blur-sm motion-safe:animate-[popupFond_.3s_ease-out]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[520px] bg-asphalt-2 [filter:drop-shadow(0_30px_60px_rgb(0_0_0/0.55))] motion-safe:animate-[popupBoite_.35s_cubic-bezier(.22,1,.36,1)]"
      >
        <div className="kerb" aria-hidden="true" />
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Fermer"
          className="absolute right-3 top-5 grid h-11 w-11 place-items-center rounded-full text-chalk-60 transition-colors hover:bg-white/10 hover:text-chalk focus-visible:outline focus-visible:outline-2 focus-visible:outline-flag"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="px-6 pb-7 pt-8 sm:px-8">
          <p id="nl-popup-titre" className="display text-5xl text-chalk">
            Premier sur
            <br />
            <span className="text-race">la grille.</span>
          </p>
          <p className="mb-6 mt-4 text-base leading-relaxed text-chalk-60">
            Les prochaines courses MegaKart arrivent d&rsquo;abord par e-mail : dates, inscriptions, places qui partent.
          </p>
          <NewsletterForm source="popup" onDone={() => {
            try {
              localStorage.setItem(CLE, "closed");
            } catch {}
          }} />
        </div>
      </div>
    </div>
  );
}
