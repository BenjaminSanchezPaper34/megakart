import Image from "next/image";
import type { ReactNode } from "react";
import SectionHeader from "./SectionHeader";

/**
 * Ouverture de page du système MegaKart : photo plein cadre, label en pastille
 * (facultatif), grand titre h1 sur deux lignes, sous-titre et actions. Le bas
 * de la photo se dissout dans le fond de page (masque d'opacité, sans couture).
 */
const FADE =
  "linear-gradient(to bottom, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 100%) 45%, rgb(0 0 0 / 80%) 62%, rgb(0 0 0 / 50%) 76%, rgb(0 0 0 / 22%) 88%, rgb(0 0 0 / 0%) 100%)";

export default function PageHero({
  image,
  label,
  line1,
  line2,
  accent = "race",
  subtitle,
  action,
  short = false,
  children,
}: {
  image: { src: string; alt: string; position?: string };
  label?: ReactNode;
  line1: ReactNode;
  line2?: ReactNode;
  accent?: "race" | "flag" | "outline";
  subtitle?: ReactNode;
  action?: ReactNode;
  short?: boolean;
  /** Contenu posé directement sous le titre, sur la photo fondue (ex. le calendrier de l'agenda). */
  children?: ReactNode;
}) {
  // Hero plein (non `short`) avec contenu dessous (agenda) : le titre garde exactement la
  // place d'un hero classique (78svh, calé en bas de la photo), le contenu suit après.
  const tall = !!children && !short;
  const head = (
    <>
      {label && (
        <p className="mb-5 inline-flex rounded-full bg-flag px-4 py-1.5 text-sm font-bold text-asphalt">
          {label}
        </p>
      )}
      <SectionHeader as="h1" line1={line1} line2={line2} accent={accent} subtitle={subtitle} action={action} />
    </>
  );
  return (
    <section
      className={`relative flex items-end overflow-hidden ${short ? "min-h-[56svh]" : "min-h-[78svh]"}`}
    >
      {/* Avec du contenu dessous, la photo garde la hauteur d'un hero et se fond derrière lui. */}
      <div
        data-hero-bg
        className={tall ? "absolute inset-x-0 top-0 h-[78svh]" : children ? "absolute inset-x-0 top-0 h-[80svh]" : "absolute inset-0"}
        style={{ maskImage: FADE, WebkitMaskImage: FADE }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className={`object-cover ${image.position ?? "object-center"}`}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-asphalt/45" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-asphalt/80 via-transparent to-asphalt/40" />
      </div>
      {tall ? (
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-(--section-y) md:px-8">
          <div data-hero-content className="flex min-h-[78svh] flex-col justify-end pb-(--section-gap) pt-40">
            {head}
          </div>
          {children}
        </div>
      ) : (
        <div
          data-hero-content={children ? undefined : ""}
          className={`relative z-10 mx-auto w-full max-w-7xl px-5 pt-40 md:px-8 ${children ? "pb-(--section-y)" : "pb-(--section-gap)"}`}
        >
          {head}
          {children && <div className="mt-(--section-gap)">{children}</div>}
        </div>
      )}
    </section>
  );
}
