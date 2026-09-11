"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Live timing Apex à chargement bloqué (même modèle que la carte) :
 * rien n'est chargé depuis apex-timing.com tant que le visiteur n'a pas
 * cliqué. L'encadré de repli explique ce qu'on y trouve et donne le lien
 * direct vers Apex pour ceux qui refusent l'intégration.
 */
export default function LiveTiming() {
  const [consented, setConsented] = useState(false);

  if (consented) {
    return (
      <div className="card overflow-hidden !p-0">
        <iframe
          title={`Chronométrage en direct du circuit ${SITE.name}`}
          src={SITE.apexLive}
          className="h-[70svh] min-h-[520px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="card flex min-h-[520px] flex-col items-center justify-center gap-6 p-8 text-center">
      <span className="checker-sm block h-6 w-12 opacity-50" aria-hidden="true" />
      <div>
        <p className="display text-3xl text-chalk">Le classement en direct</p>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-chalk-60">
          Position par position, tour par tour : le chrono Apex Timing du
          circuit, celui-là même qui s&rsquo;affiche sur l&rsquo;écran LED
          au bord de la piste.
        </p>
      </div>
      <ul className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
        {["Classement live", "Meilleur tour", "Temps par secteur", "Comparaison entre pilotes"].map(
          (item) => (
            <li key={item} className="display bg-asphalt-3 px-3 py-1.5 text-sm text-chalk-60">
              {item}
            </li>
          )
        )}
      </ul>
      <button type="button" data-track="live-timing" onClick={() => setConsented(true)} className="btn btn-race">
        Afficher le chrono en direct
      </button>
      <p className="max-w-sm text-xs leading-relaxed text-chalk-60/80">
        L&rsquo;affichage charge la page de notre prestataire de
        chronométrage Apex Timing (échange de données techniques, dont votre
        adresse IP). Vous pouvez aussi l&rsquo;ouvrir directement sur{" "}
        <a
          href={SITE.apexLive}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-chalk"
        >
          apex-timing.com
        </a>
        .
      </p>
    </div>
  );
}
