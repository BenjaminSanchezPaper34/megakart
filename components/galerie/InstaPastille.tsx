"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics/react";
import { SITE } from "@/lib/site";

/**
 * Pastille Instagram DANS la visionneuse (Benjamin, 22/10 : « pendant la
 * navigation des photos ») : dans le bandeau du haut, entre le compteur et la
 * croix, elle ne couvre jamais la photo. ClientGallery l'affiche à partir de
 * la 3e photo. Masquée 30 jours si on la ferme, un an si on clique « Suivre ».
 * Mesure : `insta-vu` {galerie, ou: "visionneuse"}, `insta-clic` idem.
 */
const CLE = "megakart-insta-pastille";

function masquee() {
  try {
    return Date.now() < Number(localStorage.getItem(CLE) ?? 0);
  } catch {
    return false;
  }
}

function masquer(jours: number) {
  try {
    localStorage.setItem(CLE, String(Date.now() + jours * 24 * 3600 * 1000));
  } catch {}
}

export default function InstaPastille({ galerie }: { galerie: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (masquee()) return;
    setVisible(true);
    track("insta-vu", { galerie, ou: "visionneuse" });
  }, [galerie]);

  if (!visible) return null;

  const handle = SITE.social.instagram.replace(/\/$/, "").split("/").pop();

  return (
    <div className="pointer-events-auto flex min-w-0 items-center gap-1 rounded-full bg-black/55 p-1 pr-1.5 backdrop-blur-md motion-safe:animate-[popupBoite_.35s_cubic-bezier(.22,1,.36,1)]">
      <a
        href={SITE.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          track("insta-clic", { galerie, ou: "visionneuse" });
          masquer(365);
          setVisible(false);
        }}
        className="flex min-h-9 min-w-0 items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        {/* Couleurs de la marque Instagram (logo tiers, pas un token du site). */}
        <span
          aria-hidden="true"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
          style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
          </svg>
        </span>
        <span className="truncate">
          Suivre <span className="hidden sm:inline">@{handle}</span>
          <span className="sm:hidden">sur Insta</span>
        </span>
      </a>
      <button
        type="button"
        onClick={() => {
          masquer(30);
          setVisible(false);
        }}
        aria-label="Masquer"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
