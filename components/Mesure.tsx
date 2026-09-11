"use client";

import { Analytics, track } from "@vercel/analytics/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Mesure d'audience — Vercel Web Analytics.
 *
 * Sans cookie et sans identifiant persistant : exempté de consentement
 * (pas de bandeau, cf. la doctrine cookies du studio). Ce que ça mesure,
 * ce sont les pages vues et les ÉVÉNEMENTS UTILES au circuit — ceux qui
 * relient une visite à un appel ou à une réservation.
 *
 * Les événements sont capturés par DÉLÉGATION sur le document : aucune
 * page n'a besoin de devenir un composant client, et un nouveau lien
 * téléphone posé n'importe où est mesuré sans rien câbler.
 *
 * Pour forcer un nom d'événement sur un élément précis :
 *   <button data-track="live-timing">…</button>
 */

/** Déduit le nom d'événement depuis la destination du lien. */
function eventForHref(href: string): string | null {
  if (href.startsWith("tel:")) return "tel";
  if (href.startsWith("mailto:")) return "email";

  let host = "";
  try {
    host = new URL(href, window.location.origin).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }

  if (host.endsWith("google.com") || host === "goo.gl" || host.endsWith("maps.app.goo.gl"))
    return "itineraire";
  if (host.endsWith("instagram.com")) return "instagram";
  if (host.endsWith("facebook.com")) return "facebook";
  if (host.endsWith("youtube.com")) return "youtube";
  if (host.endsWith("tripadvisor.fr") || host.endsWith("tripadvisor.com")) return "tripadvisor";
  if (host.endsWith("apex-timing.com")) return "live-timing";
  return null;
}

function Evenements() {
  const pathname = usePathname();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-track], a[href]");
      if (!el) return;

      const forced = el.dataset.track;
      const href = el.getAttribute("href");
      const name = forced ?? (href ? eventForHref(href) : null);
      if (!name) return;

      // `page` permet de savoir OÙ le visiteur a décroché son téléphone :
      // c'est ce croisement qui dit quelle page fait venir du monde.
      track(name, { page: pathname });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  return null;
}

export default function Mesure() {
  return (
    <>
      <Analytics />
      <Evenements />
    </>
  );
}
