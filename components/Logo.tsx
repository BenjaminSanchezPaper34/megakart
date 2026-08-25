import Link from "next/link";
import Image from "next/image";

/**
 * Logo original MegaKart (MEGA rouge / KART blanc, bande damier jaune) —
 * fichier fourni par le client, version blanche pour fonds sombres.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="MegaKart — retour à l'accueil"
      className={`group inline-flex items-center ${className}`}
    >
      <Image
        src="/images/logo-megakart.png"
        alt="MegaKart"
        width={421}
        height={229}
        priority
        className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
      />
    </Link>
  );
}
