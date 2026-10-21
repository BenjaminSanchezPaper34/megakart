"use client";

import { useEffect } from "react";

/* Le temps de laisser voir la page d'abord. Plus long sur mobile : l'écran
   est petit, un voile immédiat y est vécu comme une agression. */
const DELAI_MOBILE = 2600;
const DELAI_DESKTOP = 1000;
const GESTES = ["scroll", "pointerdown", "keydown", "touchstart"] as const;

/** Une seule annonce (course ou newsletter) par visite. */
export const VU_CETTE_VISITE = "megakart-popup-vu";

/**
 * Ouverture d'un pop-up au premier geste (défilement, toucher, clic, touche)
 * APRÈS le délai. Le navigateur fige la mesure « plus grand affichage » (LCP)
 * dès le premier geste : sans cette attente, le pop-up devenait l'élément LCP
 * de la page et plombait la note de vitesse (agenda : 4 s au lieu de ~1,5).
 * Partagé par EventPopup et NewsletterPopup.
 */
export function useOuvertureAuGeste(actif: boolean, ouvrir: () => void) {
  useEffect(() => {
    if (!actif) return;
    const petit = window.matchMedia("(max-width: 767px)").matches;
    let pret = false;
    const surGeste = () => {
      if (!pret) return;
      ouvrir();
      GESTES.forEach((g) => window.removeEventListener(g, surGeste));
    };
    GESTES.forEach((g) => window.addEventListener(g, surGeste, { passive: true }));
    // Déjà défilé pendant le délai : on ouvre au prochain geste, pas avant.
    const t = setTimeout(() => {
      pret = true;
    }, petit ? DELAI_MOBILE : DELAI_DESKTOP);
    return () => {
      clearTimeout(t);
      GESTES.forEach((g) => window.removeEventListener(g, surGeste));
    };
  }, [actif, ouvrir]);
}
