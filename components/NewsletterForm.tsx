"use client";

import Link from "next/link";
import { useState } from "react";
import { track } from "@vercel/analytics/react";

/**
 * Formulaire newsletter « prochaines courses » : deux pastilles (adultes,
 * enfants), un e-mail, un bouton. Partagé par la section de l'accueil
 * (Newsletter.tsx) et le pop-up de repli (NewsletterPopup.tsx).
 * Envoi vers /api/newsletter → base contacts Resend.
 */
const INPUT =
  "w-full min-w-0 rounded-full border border-white/10 bg-asphalt-3 px-5 py-3 text-base text-chalk placeholder:text-chalk-60/60 transition-colors focus:border-race focus:outline-none aria-[invalid=true]:border-race";

function Pastille({ actif, onClick, children }: { actif: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
        actif ? "border-race bg-race text-white" : "border-white/20 text-chalk-60 hover:border-chalk/50 hover:text-chalk"
      }`}
    >
      <span aria-hidden="true">{actif ? "✓" : "+"}</span>
      {children}
    </button>
  );
}

export default function NewsletterForm({ source, onDone }: { source: "accueil" | "popup" | "galerie"; onDone?: () => void }) {
  const [email, setEmail] = useState("");
  const [adultes, setAdultes] = useState(true);
  const [enfants, setEnfants] = useState(false);
  const [website, setWebsite] = useState(""); // piège à robots
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, adultes, enfants, website }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? "Inscription impossible.");
      setStatus("ok");
      track("newsletter", { source });
      onDone?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Inscription impossible.");
    }
  }

  if (status === "ok")
    return (
      <p role="status" className="text-base leading-relaxed text-chalk md:text-lg">
        <strong className="text-flag">C&rsquo;est noté.</strong> Vous serez prévenu des prochaines courses, avant tout le monde.
      </p>
    );

  return (
    <form onSubmit={submit} noValidate className="relative flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Les courses qui m'intéressent">
        <Pastille actif={adultes} onClick={() => setAdultes(!adultes)}>Courses adultes</Pastille>
        <Pastille actif={enfants} onClick={() => setEnfants(!enfants)}>Courses enfants</Pastille>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`nl-${source}`} className="sr-only">Votre e-mail</label>
        <input
          id={`nl-${source}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={200}
          placeholder="votre@email.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === "error"}
          className={INPUT}
          disabled={status === "sending"}
        />
        <button type="submit" className="btn btn-race shrink-0 justify-center" disabled={status === "sending" || (!adultes && !enfants)}>
          {status === "sending" ? "Envoi…" : "Me prévenir"}
        </button>
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`nl-web-${source}`}>Site web</label>
        <input id={`nl-web-${source}`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-race">{error}</p>
      )}
      <p className="text-sm leading-relaxed text-chalk-60">
        Quelques e-mails par an, seulement pour annoncer les courses. Désinscription en un clic.{" "}
        <Link href="/confidentialite" className="link-under text-chalk">Confidentialité</Link>
      </p>
    </form>
  );
}
