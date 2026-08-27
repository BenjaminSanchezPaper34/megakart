import Link from "next/link";
import type { Kart } from "@/lib/karts";

const BADGE_STYLES: Record<NonNullable<Kart["badge"]>, string> = {
  Nouveauté: "bg-flag text-[#14100a]",
  Compétition: "bg-race text-white",
  Duo: "bg-chalk text-asphalt",
};

/* Halo de la vitrine, accordé au liseré du kart */
const ACCENT_GLOW: Record<Kart["accent"], string> = {
  red: "bg-[radial-gradient(ellipse_65%_70%_at_50%_80%,rgba(227,5,27,0.20),transparent_70%)]",
  yellow: "bg-[radial-gradient(ellipse_65%_70%_at_50%_80%,rgba(251,186,0,0.18),transparent_70%)]",
  white: "bg-[radial-gradient(ellipse_65%_70%_at_50%_80%,rgba(244,243,239,0.10),transparent_70%)]",
};

export type KartCardCta = { href: string; label: string } | null;

/**
 * Fiche kart — parcours « je vois, je comprends, je décide, j'agis » :
 * photo en accroche (badge en surimpression), titre + description,
 * prix resserré avec repère, caractéristiques en tableau compact,
 * CTA pleine largeur. Aucune réserve de vide : hauteur naturelle.
 */
export default function KartCard({
  kart,
  cta = { href: "/tarifs#selecteur", label: "Ce kart me correspond ?" },
}: {
  kart: Kart;
  cta?: KartCardCta;
}) {
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden !p-0">
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

      {/* 1. L'accroche : la machine, badge en surimpression */}
      {kart.image && (
        <div className="relative h-44 shrink-0 bg-asphalt-3/50">
          <div aria-hidden="true" className={`absolute inset-0 ${ACCENT_GLOW[kart.accent]}`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${kart.image}`}
            alt={`${kart.name} — vue 3/4`}
            loading="lazy"
            className="absolute inset-x-4 inset-y-2 h-[calc(100%-1rem)] w-[calc(100%-2rem)] object-contain drop-shadow-[0_18px_16px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-[1.05]"
          />
          {kart.badge && (
            <span
              className={`display absolute right-3 top-3 px-2.5 py-1 text-xs tracking-wider ${BADGE_STYLES[kart.badge]}`}
            >
              {kart.badge}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {/* 2. Je comprends : nom + description */}
        <div className="flex items-start justify-between gap-3">
          {kart.slug === "baby-kart" ? (
            <h3 className="display text-2xl text-chalk">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/BABYKART-MEGAKART.svg"
                alt=""
                width={187}
                height={90}
                className="h-10 w-auto"
              />
              <span className="sr-only">{kart.name}</span>
            </h3>
          ) : (
            <h3 className="display text-2xl text-chalk">{kart.name}</h3>
          )}
          {/* Badge inline seulement quand il n'y a pas de photo */}
          {!kart.image && kart.badge && (
            <span
              className={`display shrink-0 px-2.5 py-1 text-xs tracking-wider ${BADGE_STYLES[kart.badge]}`}
            >
              {kart.badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm leading-snug text-chalk-60">{kart.tagline}</p>

        {/* 3. Je décide : prix resserré + repère */}
        <p className="display mt-4 flex items-baseline gap-2">
          <span className="text-4xl text-chalk transition-colors duration-300 group-hover:text-race">
            {kart.price}€
          </span>
          <span className="text-base text-chalk-60">/ {kart.session}</span>
        </p>
        {kart.priceHint && (
          <p className="mt-1 text-xs text-chalk-60/80">{kart.priceHint}</p>
        )}

        {/* Caractéristiques en tableau compact */}
        <ul className="mt-4 flex flex-col border-t border-white/10 text-sm text-chalk-60">
          <li className="flex justify-between gap-4 border-b border-white/5 py-1.5">
            <span>{kart.ageLabel ?? "Âge"}</span>
            <span className="text-right font-medium text-chalk">{kart.age}</span>
          </li>
          <li className="flex justify-between gap-4 py-1.5">
            <span>Moteur</span>
            <span className="text-right font-medium text-chalk">{kart.engine}</span>
          </li>
          {kart.note && (
            <li className="pt-1.5 text-xs leading-relaxed text-chalk-60">{kart.note}</li>
          )}
        </ul>

        {/* 4. J'agis : CTA pleine largeur */}
        {cta && (
          <Link
            href={cta.href}
            className="btn btn-ghost mt-5 justify-center !px-4 !py-2.5 text-sm"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </article>
  );
}
