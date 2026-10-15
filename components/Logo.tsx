import Link from "next/link";
import LogoAnime from "./LogoAnime";
import LogoAnimeEmpile from "./LogoAnimeEmpile";

/**
 * Logos officiels MegaKart (SVG fournis par le client) :
 * - banner  : LOGOBAN, format horizontal pour la barre de navigation
 * - stacked : LOGO, version empilée (footer, encarts)
 */
export default function Logo({
  variant = "banner",
  className = "",
  large = false,
}: {
  variant?: "banner" | "stacked";
  className?: string;
  /** Logo empilé en grand (pied de page). */
  large?: boolean;
}) {
  const banner = variant === "banner";
  return (
    <Link
      href="/"
      aria-label="MegaKart — retour à l'accueil"
      className={`group inline-flex items-center ${className}`}
    >
      {banner ? (
        // En-tête : logo animé en 3 blocs (MEGA, KART, damier).
        <LogoAnime className="h-8 w-auto transition-transform duration-300 group-hover:scale-105 md:h-9" />
      ) : (
        // Pied de page : logo empilé, animé à son entrée à l'écran.
        <LogoAnimeEmpile className={`${large ? "h-24 md:h-32" : "h-20"} w-auto transition-transform duration-300 group-hover:scale-105`} />
      )}
    </Link>
  );
}
