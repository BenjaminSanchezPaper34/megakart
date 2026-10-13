import { SITE } from "@/lib/site";

/* Icônes de marque (tracés simples, couleur héritée = blanc comme les onglets). */
const ICONS = {
  Instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="currentColor" d="M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v2.6c-1.4.1-2.7-.3-3.9-1.1v5.9c0 3.7-2.9 6-6.1 5.6-2.5-.3-4.4-2.4-4.4-5 0-3.1 2.8-5.5 6-5v2.7c-1.5-.4-3.2.6-3.2 2.2 0 1.3 1 2.3 2.3 2.3 1.4 0 2.4-1 2.4-2.6V3h3z" />
    </svg>
  ),
} as const;

export default function SocialIcons({ className = "" }: { className?: string }) {
  const links = [
    { label: "Instagram", href: SITE.social.instagram },
    { label: "Facebook", href: SITE.social.facebook },
    { label: "TikTok", href: SITE.social.tiktok },
  ].filter((l) => l.href) as { label: keyof typeof ICONS; href: string }[];
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`MegaKart sur ${l.label}`}
            className="grid h-11 w-11 place-items-center text-chalk transition-colors hover:text-white"
          >
            {ICONS[l.label]}
          </a>
        </li>
      ))}
    </ul>
  );
}
