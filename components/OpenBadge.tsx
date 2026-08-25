"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";

/**
 * Badge « ouvert / fermé » calculé côté client (évite tout écart
 * d'hydratation serveur/client sur l'heure).
 */
export default function OpenBadge({ withDetail = false }: { withDetail?: boolean }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    setStatus(getOpenStatus());
    const id = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!status) return null;

  const dot =
    status.open === true
      ? "bg-emerald-400"
      : status.open === false
        ? "bg-race"
        : "bg-flag";

  return (
    <span className="inline-flex flex-col gap-1">
      <span className="inline-flex items-center gap-2 text-sm font-medium text-chalk">
        <span className={`pulse-dot h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
        {status.label}
      </span>
      {withDetail && (
        <span className="text-sm text-chalk-60">{status.detail}</span>
      )}
    </span>
  );
}
