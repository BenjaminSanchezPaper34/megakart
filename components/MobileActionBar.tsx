import { SITE } from "@/lib/site";

/**
 * Barre d'action collée en bas d'écran, mobile uniquement (< 768 px) :
 * les deux gestes qui font venir du monde, toujours sous le pouce.
 * Test sur l'accueil (12/10/2026, docs/audit-cta-2026-10-12.md).
 * Les clics sont mesurés par Mesure.tsx (liens tel: et Google Maps).
 */
export default function MobileActionBar() {
  return (
    <>
      {/* Réserve la place de la barre pour ne pas masquer le pied de page. */}
      <div className="h-24 md:hidden" aria-hidden="true" />
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-white/10 bg-asphalt/95 px-4 pt-3 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <a href={SITE.phoneHref} className="cta cta-primary flex-1 !px-3">
          Appeler
        </a>
        <a
          href={SITE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta cta-secondary flex-1 !px-3"
        >
          Itinéraire
        </a>
      </div>
    </>
  );
}
