"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics/react";
import { SITE } from "@/lib/site";

/**
 * Invitation à suivre l'Instagram pendant la navigation dans une galerie
 * (22/10) : petite carte en bas à gauche, jamais par-dessus une photo ouverte
 * (ClientGallery ne la monte que visionneuse fermée), jamais en même temps que
 * l'invitation à l'avis Google. Une fois tous les 30 jours par navigateur.
 * Mesure : `insta-vu`, `insta-clic` (avec la galerie d'origine).
 */
const CLE = "megakart-insta-demande";
const DELAI = 30 * 24 * 3600 * 1000;

/** La carte a-t-elle déjà été montrée récemment ? (lu par ClientGallery avant de la monter) */
export function instaDejaDemande() {
  try {
    return Date.now() - Number(localStorage.getItem(CLE) ?? 0) < DELAI;
  } catch {
    return false;
  }
}

export default function InstaInvite({ galerie, onClose }: { galerie: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const fermer = useRef(onClose);
  fermer.current = onClose;

  useEffect(() => {
    // Petite attente : la carte glisse après le retour à la grille, pas dans la foulée du clic.
    const t = setTimeout(() => {
      try {
        localStorage.setItem(CLE, String(Date.now()));
      } catch {}
      setVisible(true);
      track("insta-vu", { galerie });
    }, 700);
    return () => clearTimeout(t);
  }, [galerie]);

  if (!visible) return null;

  const handle = SITE.social.instagram.replace(/\/$/, "").split("/").pop();

  return (
    <aside
      aria-label="Suivre MegaKart sur Instagram"
      className="fixed bottom-3 left-3 right-3 z-40 flex items-center gap-3 bg-asphalt-2/95 p-3 pr-2 text-chalk shadow-[0_18px_40px_-12px_rgb(0_0_0/0.7)] backdrop-blur-md motion-safe:animate-[popupBoite_.35s_cubic-bezier(.22,1,.36,1)] sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-sm"
    >
      <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-race text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
        </svg>
      </span>
      <p className="min-w-0 flex-1 text-sm leading-snug text-chalk-60">
        Les photos et réels de chaque course, en premier :{" "}
        <strong className="whitespace-nowrap text-chalk">@{handle}</strong>
      </p>
      <a
        href={SITE.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          track("insta-clic", { galerie });
          fermer.current();
        }}
        className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-chalk px-4 text-sm font-bold text-asphalt transition-colors hover:bg-white"
      >
        Suivre
      </a>
      <button
        type="button"
        onClick={() => fermer.current()}
        aria-label="Fermer"
        className="grid h-11 w-9 shrink-0 place-items-center text-chalk-60 transition-colors hover:text-chalk"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </aside>
  );
}
