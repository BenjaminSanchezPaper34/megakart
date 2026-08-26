import type { Kart } from "@/lib/karts";

const BADGE_STYLES: Record<NonNullable<Kart["badge"]>, string> = {
  Nouveauté: "bg-flag text-[#14100a]",
  Compétition: "bg-race text-white",
  Duo: "bg-chalk text-asphalt",
};

/* Halo du coin machine, accordé au liseré du kart */
const ACCENT_GLOW: Record<Kart["accent"], string> = {
  red: "bg-[radial-gradient(ellipse_65%_60%_at_82%_95%,rgba(227,5,27,0.20),transparent_70%)]",
  yellow: "bg-[radial-gradient(ellipse_65%_60%_at_82%_95%,rgba(251,186,0,0.18),transparent_70%)]",
  white: "bg-[radial-gradient(ellipse_65%_60%_at_82%_95%,rgba(244,243,239,0.10),transparent_70%)]",
};

/**
 * « Fiche pilote » d'un kart : prix en display géant, specs en liste.
 */
export default function KartCard({ kart }: { kart: Kart }) {
  return (
    <article
      className={`card group relative flex h-full flex-col overflow-hidden p-6 md:p-7 ${
        kart.image ? "pb-40 md:pb-44" : ""
      }`}
    >
      {/* Liseré accent */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 z-10 h-full w-1 ${
          kart.accent === "red"
            ? "bg-race"
            : kart.accent === "yellow"
              ? "bg-flag"
              : "bg-chalk/30"
        }`}
      />

      {/* La machine en vedette : kart géant ancré au coin bas-droit,
          coupé par les bords de la carte, nez vers le contenu */}
      {kart.image && (
        <>
          <div
            aria-hidden="true"
            className={`absolute inset-0 ${ACCENT_GLOW[kart.accent]}`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${kart.image}`}
            alt={`${kart.name} — vue 3/4`}
            loading="lazy"
            className="pointer-events-none absolute -bottom-10 -right-12 w-[112%] max-w-none object-contain drop-shadow-[0_22px_20px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:-translate-x-1 group-hover:scale-[1.04]"
          />
        </>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {kart.slug === "baby-kart" ? (
            <h3 className="display text-2xl text-chalk">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/BABYKART-MEGAKART.svg"
                alt=""
                width={187}
                height={90}
                className="h-12 w-auto"
              />
              <span className="sr-only">{kart.name}</span>
            </h3>
          ) : (
            <h3 className="display text-2xl text-chalk">{kart.name}</h3>
          )}
          <p className="mt-1 text-sm leading-snug text-chalk-60">{kart.tagline}</p>
        </div>
        {kart.badge && (
          <span
            className={`display shrink-0 px-2.5 py-1 text-xs tracking-wider ${BADGE_STYLES[kart.badge]}`}
          >
            {kart.badge}
          </span>
        )}
      </div>

      <p className="display mt-auto flex items-baseline gap-2 pt-2">
        <span className="text-5xl text-chalk transition-colors duration-300 group-hover:text-race">
          {kart.price}€
        </span>
        <span className="text-lg text-chalk-60">/ {kart.session}</span>
      </p>

      <ul className="mt-5 flex flex-col gap-1.5 border-t border-white/10 pt-4 text-sm text-chalk-60">
        <li className="flex justify-between gap-4">
          <span>Âge</span>
          <span className="text-right font-medium text-chalk">{kart.age}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span>Moteur</span>
          <span className="text-right font-medium text-chalk">{kart.engine}</span>
        </li>
        {kart.note && <li className="pt-1.5 text-chalk-60">{kart.note}</li>}
      </ul>
    </article>
  );
}
