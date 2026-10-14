import type { ReactNode } from "react";

/**
 * En-tête de section du système MegaKart (accueil refondu, 14/10/2026) :
 * grand titre sur deux lignes (2e ligne en accent), puis sous-titre et action
 * (bouton contour, flèches…) sur une même ligne, l'action calée à droite.
 * Toute section du site ouvre par ce composant — jamais de titre « à la main ».
 */
export const TITLE_XL = "display text-[clamp(3rem,9vw,7.5rem)]";

const ACCENT = {
  race: "text-race",
  flag: "text-flag",
  outline: "display-outline",
} as const;

export default function SectionHeader({
  as: Tag = "h2",
  line1,
  line2,
  accent = "race",
  tone = "dark",
  subtitle,
  action,
  align = "left",
  className = "",
}: {
  as?: "h1" | "h2";
  line1: ReactNode;
  line2?: ReactNode;
  accent?: keyof typeof ACCENT;
  tone?: "dark" | "light";
  subtitle?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const ink = tone === "light" ? "text-asphalt" : "text-chalk";
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <Tag data-reveal className={`${TITLE_XL} ${ink}`}>
        {line1}
        {line2 && (
          <>
            <br />
            <span className={ACCENT[accent]}>{line2}</span>
          </>
        )}
      </Tag>
      {(subtitle || action) && (
        <div
          className={`mt-5 flex flex-wrap gap-4 ${
            centered ? "flex-col items-center" : "items-end justify-between"
          }`}
        >
          {subtitle && (
            <p
              data-reveal
              className={`max-w-xl text-base leading-relaxed md:text-xl ${ink} ${centered ? "mx-auto" : ""}`}
            >
              {subtitle}
            </p>
          )}
          {action && <div className="flex flex-wrap items-center gap-3">{action}</div>}
        </div>
      )}
    </div>
  );
}
