"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Carte Google Maps à chargement bloqué (CNIL) : rien n'est chargé
 * depuis Google tant que le visiteur n'a pas cliqué « Autoriser ».
 * L'encadré de remplacement garde l'info utile (adresse + itinéraire).
 */
export default function MapEmbed() {
  const [consented, setConsented] = useState(false);

  if (consented) {
    return (
      <iframe
        title={`Carte d'accès au circuit ${SITE.name} à Vias`}
        src={`https://www.google.com/maps?q=${SITE.geo.lat},${SITE.geo.lng}&z=15&output=embed`}
        className="h-[420px] w-full border-0 grayscale-[35%] contrast-[1.05]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  return (
    <div className="card flex h-[420px] flex-col items-center justify-center gap-5 p-8 text-center">
      <span className="checker-sm block h-6 w-6 opacity-50" aria-hidden="true" />
      <div>
        <p className="display text-2xl text-chalk">{SITE.name}</p>
        <p className="mt-2 text-base text-chalk-60">
          {SITE.address.street}
          <br />
          {SITE.address.zip} {SITE.address.city}
        </p>
        <p className="mt-1 text-sm text-chalk-60">{SITE.landmark}</p>
      </div>
      <button type="button" onClick={() => setConsented(true)} className="btn btn-ghost text-sm">
        Autoriser et afficher la carte Google Maps
      </button>
      <p className="max-w-sm text-xs leading-relaxed text-chalk-60/80">
        En affichant la carte, des données sont échangées avec Google (cookies,
        adresse IP). Sans la carte, retrouvez l'itinéraire sur{" "}
        <a
          href={SITE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-chalk"
        >
          Google Maps
        </a>
        .
      </p>
    </div>
  );
}
