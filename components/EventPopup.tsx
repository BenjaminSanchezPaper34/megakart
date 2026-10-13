"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics/react";
import { FORMATS, type PopupCampagne } from "@/lib/popup";

/**
 * Pop-up d'annonce d'un événement. Une seule apparition par visiteur : une
 * fois fermé, il ne revient plus (mémorisé dans le navigateur). Il ne s'ouvre
 * jamais sur la page vers laquelle il pointe — inutile de proposer d'aller
 * là où l'on est déjà.
 *
 * Deux événements de mesure : `popup-vu` à l'affichage, `popup-clic` au clic.
 * Le rapport entre les deux dit si le visuel convertit — c'est toute la
 * raison de mesurer.
 */
type Props = { campagne: PopupCampagne & { until: string } };

/* Le temps de laisser voir la page d'abord. Plus long sur mobile : l'écran
   est petit, un voile immédiat y est vécu comme une agression. Le pop-up
   attend en plus le premier geste du visiteur (voir plus bas). */
const DELAI_MOBILE = 2600;
const DELAI_DESKTOP = 1000;

export default function EventPopup({ campagne }: Props) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(campagne.key, "closed");
    } catch {}
  }, [campagne.key]);

  /** Le visuel et le bouton mènent au même endroit et se mesurent pareil. */
  const go = useCallback(() => {
    track("popup-clic", { campagne: campagne.op });
    close();
  }, [campagne.op, close]);

  useEffect(() => {
    // Jamais sur une page d'inscription, la sienne ou celle d'une autre course :
    // un parent venu inscrire son enfant n'a pas à se voir vendre les 100 Tours.
    if (pathname === campagne.href || pathname.startsWith("/inscription/")) return;
    // La campagne est terminée : plus rien à annoncer.
    if (new Date().toISOString().slice(0, 10) >= campagne.until) return;
    try {
      if (localStorage.getItem(campagne.key) === "closed") return;
    } catch {
      // Navigateur sans stockage : on n'insiste pas, plutôt que de
      // représenter le pop-up à chaque page.
      return;
    }
    const petit = window.matchMedia("(max-width: 767px)").matches;
    setMobile(petit);
    // Ouverture au premier geste (défilement, toucher, clic, touche) APRÈS le
    // délai. Le navigateur fige la mesure « plus grand affichage » (LCP) dès
    // le premier geste : sans cette attente, le pop-up devenait l'élément LCP
    // de la page et plombait la note de vitesse (agenda : 4 s au lieu de ~1,5).
    let pret = false;
    const GESTES = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    const ouvrir = () => {
      if (!pret) return;
      setOpen(true);
      GESTES.forEach((g) => window.removeEventListener(g, ouvrir));
    };
    GESTES.forEach((g) => window.addEventListener(g, ouvrir, { passive: true }));
    const t = setTimeout(() => {
      pret = true;
      // Déjà défilé pendant le délai : on ouvre au prochain geste, pas avant.
    }, petit ? DELAI_MOBILE : DELAI_DESKTOP);
    return () => {
      clearTimeout(t);
      GESTES.forEach((g) => window.removeEventListener(g, ouvrir));
    };
  }, [campagne, pathname]);

  // Échap pour fermer, fond figé, et le focus qui part sur la croix.
  useEffect(() => {
    if (!open) return;
    track("popup-vu", { campagne: campagne.op });
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
  }, [open, close, campagne.op]);

  if (!open) return null;

  const formats = campagne.formats ?? FORMATS;
  const format = mobile ? formats.tall : formats.wide;
  const src = mobile ? campagne.tall : campagne.wide;
  // Un visuel portrait sur ordinateur doit tenir dans la hauteur de l'écran :
  // la boîte se resserre au lieu de déborder sous la ligne de flottaison.
  const portrait = format.height > format.width;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={campagne.alt}
      onClick={close}
      className="fixed inset-0 z-[2000] grid place-items-center bg-asphalt/80 p-4 backdrop-blur-sm motion-safe:animate-[popupFond_.3s_ease-out]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-[420px] ${portrait ? "md:max-w-[min(440px,58vh)]" : "md:max-w-[1000px]"} [filter:drop-shadow(0_30px_60px_rgb(0_0_0/0.55))] motion-safe:animate-[popupBoite_.35s_cubic-bezier(.22,1,.36,1)]`}
      >
        {/* Croix et CTA à cheval sur les bords du visuel (haut / bas), centrés. */}
        <div className="relative my-6">
          <Link href={campagne.href} onClick={go} className="race-event-card block overflow-hidden" tabIndex={-1} aria-hidden="true">
            <Image
              src={src}
              alt=""
              width={format.width}
              height={format.height}
              sizes={portrait ? "(max-width: 767px) 92vw, 440px" : "(max-width: 767px) 92vw, 1000px"}
              priority
              className="h-auto w-full"
            />
          </Link>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Fermer l'annonce"
            className="absolute left-1/2 top-0 z-10 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-chalk/80 bg-asphalt text-chalk transition-colors hover:border-chalk hover:bg-chalk hover:text-asphalt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flag"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Le CTA dit ce qui attend derrière l'image (beaucoup ne devinent pas qu'elle est cliquable). */}
          <Link
            href={campagne.href}
            onClick={go}
            className="btn btn-race absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 whitespace-nowrap"
          >
            {campagne.cta ?? "En savoir plus"}
          </Link>
        </div>
      </div>
    </div>
  );
}
