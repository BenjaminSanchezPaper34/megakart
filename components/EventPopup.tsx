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
   est petit, un voile immédiat y est vécu comme une agression. */
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
    const t = setTimeout(() => setOpen(true), petit ? DELAI_MOBILE : DELAI_DESKTOP);
    return () => clearTimeout(t);
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

  const format = mobile ? FORMATS.tall : FORMATS.wide;
  const src = mobile ? campagne.tall : campagne.wide;

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
        className="relative w-full max-w-[420px] md:max-w-[1000px] [filter:drop-shadow(0_30px_60px_rgb(0_0_0/0.55))] motion-safe:animate-[popupBoite_.35s_cubic-bezier(.22,1,.36,1)]"
      >
        <div className="overflow-hidden bg-asphalt-2">
          {/* Le visuel entier, cliquable : pas de découpe, pas de recadrage —
              c'est la création telle qu'elle paraît sur le réseau social. */}
          <Link href={campagne.href} onClick={go} className="block" tabIndex={-1} aria-hidden="true">
            <Image
              src={src}
              alt=""
              width={format.width}
              height={format.height}
              sizes="(max-width: 767px) 92vw, 1000px"
              priority
              className="h-auto w-full"
            />
          </Link>

          {/* Le bouton dit explicitement ce qui attend derrière : une image
              cliquable, beaucoup de visiteurs ne devinent pas que c'en est une. */}
          <div className="p-4 sm:flex sm:justify-center sm:p-5">
            <Link
              href={campagne.href}
              onClick={go}
              className="btn btn-race glow-race w-full justify-center sm:w-auto"
            >
              {campagne.cta ?? "En savoir plus"}
            </Link>
          </div>
        </div>

        {/* Fermer : disque plein et cerclé, pour rester lisible par-dessus
            n'importe quel visuel, clair ou sombre. */}
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Fermer l'annonce"
          className="absolute -right-3 -top-3 grid h-12 w-12 place-items-center rounded-full bg-asphalt text-3xl leading-none text-chalk ring-2 ring-chalk/80 transition hover:bg-race hover:text-white hover:ring-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}
