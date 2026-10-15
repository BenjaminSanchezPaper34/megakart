import { SITE } from "@/lib/site";

const ICON = "h-[1.25em] w-[1.25em]";

/* Icônes de marque (tracés simples, couleur héritée = blanc comme les onglets). */
const ICONS = {
  Instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={ICON}>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={ICON}>
      <path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={ICON}>
      <path fill="currentColor" d="M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v2.6c-1.4.1-2.7-.3-3.9-1.1v5.9c0 3.7-2.9 6-6.1 5.6-2.5-.3-4.4-2.4-4.4-5 0-3.1 2.8-5.5 6-5v2.7c-1.5-.4-3.2.6-3.2 2.2 0 1.3 1 2.3 2.3 2.3 1.4 0 2.4-1 2.4-2.6V3h3z" />
    </svg>
  ),
} as const;

/**
 * size « lg » : menu mobile — pastilles de 56 px bien espacées pour le pouce.
 */
export default function SocialIcons({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const lg = size === "lg";
  const links = [
    { label: "Instagram", href: SITE.social.instagram },
    { label: "Facebook", href: SITE.social.facebook },
    { label: "TikTok", href: SITE.social.tiktok },
  ].filter((l) => l.href) as { label: keyof typeof ICONS; href: string }[];
  return (
    <ul className={`flex items-center ${lg ? "gap-3" : "gap-0"} ${className}`}>
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`MegaKart sur ${l.label}`}
            className={
              lg
                ? "grid h-14 w-14 place-items-center rounded-full border border-white/20 text-2xl text-chalk transition-colors active:bg-white/10"
                : "link-under link-under-icon grid h-11 w-10 place-items-center text-lg text-chalk transition-colors hover:text-white xl:w-11 xl:text-xl"
            }
          >
            {ICONS[l.label]}
          </a>
        </li>
      ))}
    </ul>
  );
}
