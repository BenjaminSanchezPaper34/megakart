import Link from "next/link";

/**
 * Logos officiels MegaKart (SVG fournis par le client) :
 * - banner  : LOGOBAN, format horizontal pour la barre de navigation
 * - stacked : LOGO, version empilée (footer, encarts)
 */
export default function Logo({
  variant = "banner",
  className = "",
}: {
  variant?: "banner" | "stacked";
  className?: string;
}) {
  const banner = variant === "banner";
  return (
    <Link
      href="/"
      aria-label="MegaKart — retour à l'accueil"
      className={`group inline-flex items-center ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner ? "/images/LOGOBAN-MEGAKART.svg" : "/images/LOGO-MEGAKART.svg"}
        alt="MegaKart"
        width={banner ? 305 : 187}
        height={banner ? 43 : 91}
        className={`${banner ? "h-8 md:h-9" : "h-20"} w-auto transition-transform duration-300 group-hover:scale-105`}
      />
    </Link>
  );
}
