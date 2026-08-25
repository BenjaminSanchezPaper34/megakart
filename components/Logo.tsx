import Link from "next/link";

/**
 * Logotype MegaKart reconstruit en HTML/SVG — fidèle à l'identité
 * (MEGA rouge / KART blanc, italique, bande damier jaune).
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="MegaKart — retour à l'accueil"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      {/* Bande damier */}
      <svg
        viewBox="0 0 20 44"
        className="h-10 w-auto -skew-x-12 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <g fill="var(--color-flag)">
          <rect x="0" y="0" width="10" height="11" />
          <rect x="10" y="11" width="10" height="11" />
          <rect x="0" y="22" width="10" height="11" />
          <rect x="10" y="33" width="10" height="11" />
        </g>
      </svg>
      <span className="display flex flex-col leading-none">
        <span className="text-race text-[1.35rem] tracking-tight">MEGA</span>
        <span className="text-chalk text-[1.35rem] tracking-tight">KART</span>
      </span>
    </Link>
  );
}
