"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics/react";
import { FORMATS, type PopupCampagne } from "@/lib/popup";
import { useOuvertureAuGeste, VU_CETTE_VISITE } from "@/components/useOuvertureAuGeste";

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
type Campagne = PopupCampagne & { until: string };
/** Campagnes en cours, la plus proche d'abord : on montre la première pas encore fermée. */
type Props = { campagnes: Campagne[] };

export default function EventPopup({ campagnes }: Props) {
  const [campagne, setCampagne] = useState<Campagne | null>(null);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    if (!campagne) return;
    try {
      localStorage.setItem(campagne.key, "closed");
    } catch {}
  }, [campagne]);

  /** Le visuel et le bouton mènent au même endroit et se mesurent pareil. */
  const go = useCallback(() => {
    if (campagne) track("popup-clic", { campagne: campagne.op });
    close();
  }, [campagne, close]);

  useEffect(() => {
    // Nouveau choix à chaque page : l'ancien est oublié (ses écouteurs de geste tombent avec).
    setCampagne(null);
    // Jamais sur une page d'inscription, la sienne ou celle d'une autre course :
    // un parent venu inscrire son enfant n'a pas à se voir vendre les 100 Tours.
    if (pathname.startsWith("/inscription/")) return;
    const today = new Date().toISOString().slice(0, 10);
    let choix: Campagne | undefined;
    try {
      // La première campagne en cours, pas encore fermée, qui ne pointe pas vers la page affichée.
      // Une seule annonce par visite : la campagne suivante attend la prochaine visite.
      if (sessionStorage.getItem(VU_CETTE_VISITE)) return;
      choix = campagnes.find(
        // `des` se vérifie ici, côté visiteur : la page est construite à l'avance, la date du jour non.
        (c) => today < c.until && (!c.des || today >= c.des) && pathname !== c.href && localStorage.getItem(c.key) !== "closed"
      );
    } catch {
      // Navigateur sans stockage : on n'insiste pas, plutôt que de
      // représenter le pop-up à chaque page.
      return;
    }
    if (!choix) return;
    setCampagne(choix);
    setMobile(window.matchMedia("(max-width: 767px)").matches);
  }, [campagnes, pathname]);

  // Délai puis premier geste du visiteur (voir useOuvertureAuGeste).
  const ouvrir = useCallback(() => setOpen(true), []);
  useOuvertureAuGeste(campagne !== null, ouvrir);

  // Échap pour fermer, fond figé, et le focus qui part sur la croix.
  useEffect(() => {
    if (!open || !campagne) return;
    track("popup-vu", { campagne: campagne.op });
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
  }, [open, close, campagne]);

  if (!open || !campagne) return null;

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
