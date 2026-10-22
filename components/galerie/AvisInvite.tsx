"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics/react";
import { SITE } from "@/lib/site";

/**
 * Invitation à laisser un avis Google, juste après un téléchargement réussi
 * (22/10) : le moment où le pilote est le plus content. Bandeau en bas
 * d'écran, non bloquant, au-dessus de la visionneuse. Jamais une condition :
 * les photos restent libres (règle Google sur les avis).
 * Une seule demande tous les 60 jours par navigateur, qu'on clique ou qu'on ferme.
 * Mesure : `avis-vu`, `avis-clic` (avec la galerie d'origine).
 */
const CLE = "megakart-avis-demande";
const DELAI = 60 * 24 * 3600 * 1000;

export default function AvisInvite({ galerie, onClose }: { galerie: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  // onClose change à chaque rendu du parent : on le lit par référence, pour que
  // l'effet ne tourne qu'une fois (sinon il relirait sa propre date et se fermerait).
  const fermer = useRef(onClose);
  fermer.current = onClose;

  useEffect(() => {
    try {
      const deja = Number(localStorage.getItem(CLE) ?? 0);
      if (Date.now() - deja < DELAI) return fermer.current();
    } catch {
      // Stockage indisponible : on montre quand même, une fois par visite.
    }
    // Laisse la feuille de partage / l'enregistrement se terminer d'abord.
    const t = setTimeout(() => {
      // Date notée à l'affichage seulement (un effet annulé ne compte pas).
      try {
        localStorage.setItem(CLE, String(Date.now()));
      } catch {}
      setVisible(true);
      track("avis-vu", { galerie });
    }, 900);
    return () => clearTimeout(t);
  }, [galerie]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="avis-titre"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md overflow-hidden bg-asphalt-2 text-chalk shadow-[0_24px_60px_-12px_rgb(0_0_0/0.7)] motion-safe:animate-[popupBoite_.35s_cubic-bezier(.22,1,.36,1)] sm:bottom-6"
    >
      <div className="kerb" aria-hidden="true" />
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-2 top-4 grid h-11 w-11 place-items-center rounded-full text-chalk-60 transition-colors hover:bg-white/10 hover:text-chalk"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
      <div className="px-5 pb-5 pt-5 sm:px-6">
        <p id="avis-titre" className="display pr-10 text-3xl text-chalk">
          Vos photos sont <span className="text-flag">prêtes !</span>
        </p>
        <p className="mt-2 text-base leading-relaxed text-chalk-60">
          Vous avez aimé votre course ? Un avis Google aide énormément le circuit. Ça prend 30 secondes.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={SITE.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track("avis-clic", { galerie });
              onClose();
            }}
            className="btn btn-race"
          >
            <span aria-hidden="true">★</span> Laisser un avis
          </a>
          <button type="button" onClick={onClose} className="min-h-11 px-2 text-sm font-semibold text-chalk-60 hover:text-chalk">
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
