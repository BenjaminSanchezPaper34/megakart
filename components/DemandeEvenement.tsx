"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics/react";
import { provenance } from "@/lib/provenance";
import { SITE } from "@/lib/site";
import {
  EVENEMENT_SLUG,
  FORMULES,
  PARTICIPANTS_MAX,
  PARTICIPANTS_MIN,
  type FormuleId,
} from "@/lib/demande-evenement";

/**
 * Demande d'événement privé — un seul formulaire pour les 3 formules
 * (anniversaire, EVG/EVJF, entreprise & CE) ; les champs propres à chacune
 * apparaissent selon le choix. Même structure et mêmes classes que les
 * formulaires d'inscription ; validation de référence côté serveur
 * (lib/demande-evenement.ts). Arrivée depuis une section (#anniversaire…) :
 * la formule est déjà cochée.
 */
type Status = "idle" | "sending" | "sent" | "error";

const INPUT =
  "w-full border border-white/10 bg-asphalt-3 px-4 py-3 text-base text-chalk placeholder:text-chalk-60/60 transition-colors focus:border-race focus:outline-none aria-[invalid=true]:border-race";

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="display mb-2 block text-lg text-chalk">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-chalk-60">{hint}</p>}
      {error && <p role="alert" className="mt-1.5 text-sm font-medium text-race">{error}</p>}
    </div>
  );
}

export default function DemandeEvenement() {
  const [formule, setFormule] = useState<FormuleId | "">("");
  const [date, setDate] = useState("");
  const [flexible, setFlexible] = useState(false);
  const [participants, setParticipants] = useState("");
  const [age, setAge] = useState("");
  const [societe, setSociete] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
    // Bouton « Demander un devis » d'une section : ?formule=anniversaire
    const voulue = new URLSearchParams(window.location.search).get("formule");
    if (FORMULES.some((f) => f.id === voulue)) setFormule(voulue as FormuleId);
    // Boutons « Demander une date » des sections (data-formule) : la formule arrive cochée.
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-formule]");
      const id = el?.dataset.formule;
      if (id && FORMULES.some((f) => f.id === id)) setFormule(id as FormuleId);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: EVENEMENT_SLUG,
          formule, date, flexible,
          participants: Number(participants),
          age: formule === "anniversaire" ? age : undefined,
          societe: formule === "entreprise" ? societe : undefined,
          contact, message, consent, website,
        }),
      });
      const json = (await res.json()) as { ok: boolean; errors?: Record<string, string> };
      if (json.ok) {
        setStatus("sent");
        track("demande-evenement", { formule, participants: Number(participants), source: provenance()?.source ?? "direct", campagne: provenance()?.campagne ?? "" });
        return;
      }
      if (json.errors) setErrors(json.errors);
      setStatus(json.errors ? "idle" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    const f = FORMULES.find((x) => x.id === formule);
    return (
      <div className="card p-6 md:p-8" role="status">
        <span className="checker-sm block h-4 w-8 opacity-60" aria-hidden="true" />
        <h2 className="display mt-4 text-3xl text-chalk">
          Demande reçue, <span className="text-race">{contact.name.split(" ")[0]}</span>.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-chalk-60">
          Un récapitulatif de votre demande {f ? `(${f.label.toLowerCase()})` : ""} part à l&rsquo;instant sur{" "}
          <strong className="text-chalk">{contact.email}</strong>. Le circuit revient vers vous sous 48 heures pour
          construire la formule. Une question d&rsquo;ici là ? Le {SITE.phone} répond aux heures d&rsquo;ouverture.
        </p>
      </div>
    );
  }

  const disabled = status === "sending";

  return (
    <form onSubmit={submit} noValidate className="card relative flex flex-col gap-8 p-6 text-left md:p-8">
      {/* Formule */}
      <fieldset>
        <legend className="display mb-3 text-lg text-chalk">Votre événement</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {FORMULES.map((f) => {
            const active = formule === f.id;
            return (
              <label key={f.id} className={`flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors ${active ? "border-race bg-race/10" : "border-white/10 bg-asphalt-3 hover:border-white/25"}`}>
                <input type="radio" name="formule" value={f.id} checked={active} onChange={() => setFormule(f.id)} className="accent-[var(--color-race)]" disabled={disabled} />
                <span aria-hidden="true" className="text-2xl leading-none">{f.emoji}</span>
                <span className="display text-lg text-chalk">{f.label}</span>
              </label>
            );
          })}
        </div>
        {errors.formule && <p role="alert" className="mt-1.5 text-sm font-medium text-race">{errors.formule}</p>}
      </fieldset>

      {/* Date et groupe */}
      <fieldset className="flex flex-col gap-5 border-t border-white/10 pt-6">
        <legend className="display mb-1 text-lg text-chalk">Quand et combien</legend>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field id="date" label="Date souhaitée" error={errors.date}>
            <input id="date" type="date" min={today || undefined} className={INPUT} value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={Boolean(errors.date)} disabled={disabled} />
          </Field>
          <Field id="participants" label="Nombre de participants" error={errors.participants} hint={`De ${PARTICIPANTS_MIN} à ${PARTICIPANTS_MAX} personnes.`}>
            <input id="participants" type="number" inputMode="numeric" min={PARTICIPANTS_MIN} max={PARTICIPANTS_MAX} className={INPUT} value={participants} onChange={(e) => setParticipants(e.target.value)} aria-invalid={Boolean(errors.participants)} disabled={disabled} />
          </Field>
          {formule === "anniversaire" && (
            <Field id="age" label="Âge fêté" error={errors.age} hint="Pour choisir les karts adaptés.">
              <input id="age" type="number" inputMode="numeric" min={3} max={99} className={INPUT} value={age} onChange={(e) => setAge(e.target.value)} aria-invalid={Boolean(errors.age)} disabled={disabled} />
            </Field>
          )}
          {formule === "entreprise" && (
            <Field id="societe" label="Entreprise ou CE" hint="Facultatif.">
              <input id="societe" className={INPUT} value={societe} onChange={(e) => setSociete(e.target.value)} autoComplete="organization" maxLength={100} disabled={disabled} />
            </Field>
          )}
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-base text-chalk-60">
          <input type="checkbox" checked={flexible} onChange={(e) => setFlexible(e.target.checked)} className="size-4 accent-[var(--color-race)]" disabled={disabled} />
          Mes dates sont souples, le circuit peut m&rsquo;en proposer d&rsquo;autres
        </label>
      </fieldset>

      {/* Contact */}
      <fieldset className="flex flex-col gap-5 border-t border-white/10 pt-6">
        <legend className="display mb-1 text-lg text-chalk">Vos coordonnées</legend>
        <div className="grid gap-5 lg:grid-cols-3">
          <Field id="contact-name" label="Nom et prénom" error={errors["contact.name"]}>
            <input id="contact-name" className={INPUT} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} autoComplete="name" maxLength={80} aria-invalid={Boolean(errors["contact.name"])} disabled={disabled} />
          </Field>
          <Field id="contact-phone" label="Téléphone" error={errors["contact.phone"]}>
            <input id="contact-phone" type="tel" className={INPUT} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} autoComplete="tel" inputMode="tel" maxLength={30} aria-invalid={Boolean(errors["contact.phone"])} disabled={disabled} />
          </Field>
          <Field id="contact-email" label="E-mail" error={errors["contact.email"]}>
            <input id="contact-email" type="email" className={INPUT} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} autoComplete="email" inputMode="email" maxLength={120} aria-invalid={Boolean(errors["contact.email"])} disabled={disabled} />
          </Field>
        </div>
      </fieldset>

      <Field id="message" label="Votre projet" hint="Facultatif : format souhaité (sprint, endurance…), horaire, goûter, budget…">
        <textarea id="message" className={`${INPUT} min-h-28 resize-y`} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1500} disabled={disabled} />
      </Field>

      {/* Piège à robots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Site web</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-chalk-60">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1.5 size-4 shrink-0 accent-[var(--color-race)]" aria-invalid={Boolean(errors.consent)} disabled={disabled} />
          <span>
            J&rsquo;accepte que ces informations soient transmises au circuit MegaKart pour traiter ma demande.{" "}
            <Link href="/confidentialite" className="link-under text-chalk">Comment elles sont utilisées</Link>.
          </span>
        </label>
        {errors.consent && <p role="alert" className="text-sm font-medium text-race">{errors.consent}</p>}
      </div>

      {status === "error" && (
        <p role="alert" className="border border-race/40 bg-race/10 px-4 py-3 text-base leading-relaxed text-chalk">
          L&rsquo;envoi n&rsquo;a pas abouti. Le plus simple : appelez le <a href={SITE.phoneHref} className="link-under font-semibold">{SITE.phone}</a> ou écrivez à <a href={`mailto:${SITE.email}`} className="link-under font-semibold">{SITE.email}</a>.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-race w-full justify-center sm:w-auto" disabled={disabled}>
          {disabled ? "Envoi…" : "Envoyer ma demande"}
        </button>
        <p className="text-sm text-chalk-60">Sans engagement : le circuit vous rappelle pour construire la formule.</p>
      </div>
    </form>
  );
}
