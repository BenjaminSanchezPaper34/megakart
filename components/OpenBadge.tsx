"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";

/**
 * Badge « ouvert / fermé » calculé côté client (évite tout écart
 * d'hydratation serveur/client sur l'heure).
 */
const EN_LABELS: Record<string, { label: string; detail: string }> = {
  open: { label: "Open now", detail: "Summer season: every day, 10 am – 12:30 am, non-stop." },
  closed: { label: "Opens at 10 am", detail: "Summer season: every day, 10 am – 12:30 am, non-stop." },
  offseason: {
    label: "Open weekends & holidays",
    detail: "Off season: weekends and French school holidays — call us for today's hours.",
  },
};

export default function OpenBadge({
  withDetail = false,
  en = false,
}: {
  withDetail?: boolean;
  en?: boolean;
}) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    setStatus(getOpenStatus());
    const id = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!status) return null;

  if (en) {
    const key = status.open === true ? "open" : status.open === false ? "closed" : "offseason";
    status.label = EN_LABELS[key].label;
    status.detail = EN_LABELS[key].detail;
  }

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
