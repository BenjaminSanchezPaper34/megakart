import Image from "next/image";
import type { Kart } from "@/lib/karts";

/**
 * Fiche kart façon « widget de voiture » (référence : widget Audi de Benjamin,
 * 13/10/2026) : la donnée clé en très grand en haut à gauche (le prix),
 * une ligne de contexte dessous, le kart détouré qui déborde à droite sur un
 * tracé du circuit en filigrane, et une ligne d'info en pied de carte.
 * Non cliquable (choix Benjamin 13/10) ; visuels Sodi officiels, même pose.
 */
const BADGE: Record<NonNullable<Kart["badge"]>, string> = {
  Nouveauté: "bg-flag text-asphalt",
  Compétition: "bg-race text-white",
  Duo: "bg-chalk text-asphalt",
};

export default function KartWidget({ kart }: { kart: Kart }) {
  return (
    <div className="relative h-full">
      {/* Label à cheval sur le haut de la carte, comme sur les cartes de courses. */}
      {kart.badge && (
        <span className={`absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold shadow-lg ${BADGE[kart.badge]}`}>
          {kart.badge}
        </span>
      )}
    <article className="race-event-card relative flex h-full flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-br from-asphalt-2 via-asphalt-2 to-asphalt-3 p-5 sm:p-6">
      {/* Filigrane : le tracé du circuit, comme les anneaux sur le widget. */}
      <Image
        src="/images/TRACECIRCUIT-MEGAKART.svg"
        alt=""
        aria-hidden="true"
        width={161}
        height={104}
        className="pointer-events-none absolute -right-6 top-6 w-[60%] opacity-[0.06]"
      />

      {/* Le kart détouré, calé en haut à droite : le haut des visuels recadrés (2Drive)
          tombe pile sur le bord de la carte au lieu de flotter, coupé, au milieu. */}
      {kart.image && (
        <Image
          src={`/images/${kart.image}`}
          alt={`${kart.model ?? kart.name}, ${kart.name} du circuit MegaKart`}
          width={1200}
          height={720}
          sizes="(min-width: 1024px) 320px, 60vw"
          className="pointer-events-none absolute -right-[8%] top-0 w-[56%] object-contain drop-shadow-[0_16px_14px_rgba(0,0,0,0.55)]"
        />
      )}

      <div className="relative">
        <p className="display flex items-baseline gap-2 leading-none">
          <span className="text-5xl text-chalk sm:text-6xl">{kart.price} €</span>
          <span className="text-base text-chalk-60">/ {kart.session}</span>
        </p>
        <h3 className="display mt-3 text-2xl text-chalk">{kart.name}</h3>
        <p className="mt-1 max-w-[55%] text-sm text-chalk-60">{kart.age}</p>
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-3 text-sm">
        <span className="flex min-w-0 items-center gap-2 text-chalk">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-chalk-60">
            <circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 9v4l2.5 2.5M10 2h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="truncate">{kart.engine}</span>
        </span>
        {kart.model && <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-chalk-60">{kart.model}</span>}
      </div>
    </article>
    </div>
  );
}
