import Image from "next/image";
import Link from "next/link";
import type { Kart } from "@/lib/karts";

/**
 * Fiche kart façon « widget de voiture » (référence : widget Audi de Benjamin,
 * 13/10/2026) : la donnée clé en très grand en haut à gauche (le prix),
 * une ligne de contexte dessous, le kart détouré qui déborde à droite sur un
 * tracé du circuit en filigrane, et une ligne d'info en pied de carte.
 * Essai sur /tarifs uniquement — KartCard reste utilisé ailleurs.
 */
const BADGE: Record<NonNullable<Kart["badge"]>, string> = {
  Nouveauté: "bg-flag text-asphalt",
  Compétition: "bg-race text-white",
  Duo: "bg-chalk text-asphalt",
};

export default function KartWidget({ kart, href = "#selecteur" }: { kart: Kart; href?: string }) {
  return (
    <Link
      href={href}
      className="race-event-card group relative flex min-h-[13.5rem] flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-br from-asphalt-2 via-asphalt-2 to-asphalt-3 p-5 transition-colors hover:border-white/25 sm:p-6"
    >
      {/* Filigrane : le tracé du circuit, comme les anneaux sur le widget. */}
      <Image
        src="/images/TRACECIRCUIT-MEGAKART.svg"
        alt=""
        aria-hidden="true"
        width={161}
        height={104}
        className="pointer-events-none absolute -right-6 top-6 w-[60%] opacity-[0.06]"
      />

      {/* Le kart détouré, qui sort du cadre à droite. */}
      {kart.image && (
        <Image
          src={`/images/${kart.image}`}
          alt={`${kart.name} MegaKart`}
          width={600}
          height={400}
          sizes="(min-width: 1024px) 320px, 60vw"
          className="pointer-events-none absolute -right-[12%] bottom-10 w-[62%] object-contain drop-shadow-[0_16px_14px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:-translate-x-2"
        />
      )}

      <div className="relative">
        <p className="display flex items-baseline gap-2 leading-none">
          <span className="text-5xl text-chalk sm:text-6xl">{kart.price} €</span>
          <span className="text-base text-chalk-60">/ {kart.session}</span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <h3 className="display text-2xl text-chalk">{kart.name}</h3>
          {kart.badge && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${BADGE[kart.badge]}`}>{kart.badge}</span>
          )}
        </div>
        <p className="mt-1 max-w-[55%] text-sm text-chalk-60">{kart.age}</p>
      </div>

      <div className="relative mt-6 flex items-center justify-between gap-3 text-sm">
        <span className="flex min-w-0 items-center gap-2 text-chalk">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-chalk-60">
            <circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 9v4l2.5 2.5M10 2h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="truncate">{kart.engine}</span>
        </span>
        <span aria-hidden="true" className="shrink-0 text-chalk-60 transition-colors group-hover:text-race">
          →
        </span>
      </div>
    </Link>
  );
}
