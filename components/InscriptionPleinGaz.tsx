"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { CaseInfos } from "@/components/CaseInfos";
import { provenance } from "@/lib/provenance";
import { track } from "@vercel/analytics/react";
import { SITE } from "@/lib/site";
import { MAX_PILOTES, PLEIN_GAZ, PLEIN_GAZ_SLUG } from "@/lib/inscription-plein-gaz";

/**
 * Inscription d'un à quatre pilotes au Trophée Plein Gaz, par un responsable
 * (le contact que le circuit rappelle). Inscription individuelle : chaque
 * pilote paie sa place, au tarif de l'opération (lib/agenda.ts).
 * Même structure et mêmes classes que InscriptionCourseEnfant.tsx ; la
 * validation de référence reste côté serveur (lib/inscription-plein-gaz.ts).
 */
type DateOption = { iso: string; label: string };
type Status = "idle" | "sending" | "sent" | "error";
type PiloteSaisi = { prenom: string; nom: string; habitue: boolean };

const INPUT =
  "w-full border border-white/10 bg-asphalt-3 px-4 py-3 text-base text-chalk placeholder:text-chalk-60/60 transition-colors focus:border-race focus:outline-none aria-[invalid=true]:border-race";

const vide = (): PiloteSaisi => ({ prenom: "", nom: "", habitue: false });

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

export default function InscriptionPleinGaz({ dates }: { dates: DateOption[] }) {
  const [open, setOpen] = useState<DateOption[]>(dates);
  const [date, setDate] = useState("");
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const ouvertes = dates.filter((d) => d.iso >= today);
    setOpen(ouvertes);
    // Lien depuis une carte course (?date=AAAA-MM-JJ) : la date arrive déjà cochée.
    const voulue = new URLSearchParams(window.location.search).get("date");
    if (voulue && ouvertes.some((d) => d.iso === voulue)) setDate(voulue);
  }, [dates]);
  const [pilotes, setPilotes] = useState<PiloteSaisi[]>([vide()]);
  const [responsable, setResponsable] = useState({ name: "", phone: "", email: "" });
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [infos, setInfos] = useState(true); // prochaines courses (lib/contacts.ts)
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!date && open.length === 1) setDate(open[0].iso);
  }, [open, date]);

  function setPilote(i: number, patch: Partial<PiloteSaisi>) {
    setPilotes((list) => list.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: PLEIN_GAZ_SLUG,
          date,
          pilotes,
          responsable, message, consent, infos, website,
        }),
      });
      const json = (await res.json()) as { ok: boolean; errors?: Record<string, string> };
      if (json.ok) {
        setStatus("sent");
        track("inscription", { course: PLEIN_GAZ_SLUG, date, pilotes: pilotes.length, source: provenance()?.source ?? "direct", campagne: provenance()?.campagne ?? "" });
        return;
      }
      if (json.errors) setErrors(json.errors);
      setStatus(json.errors ? "idle" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    const chosen = open.find((d) => d.iso === date);
    const prenoms = pilotes.map((p) => p.prenom).join(" et ");
    return (
      <div className="card p-6 md:p-8" role="status">
        <span className="checker-sm block h-4 w-8 opacity-60" aria-hidden="true" />
        <h2 className="display mt-4 text-3xl text-chalk">
          <span className="text-race">{prenoms}</span> {pilotes.length > 1 ? "sont" : "est"} sur la liste.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-chalk-60">
          Un récapitulatif part à l&rsquo;instant sur <strong className="text-chalk">{responsable.email}</strong>.
          Le circuit revient vers vous sous 48 heures pour confirmer {pilotes.length > 1 ? "les places" : "la place"}
          {chosen ? ` pour le ${chosen.label}` : ""}. Une question d&rsquo;ici là ? Le {SITE.phone} répond aux heures d&rsquo;ouverture.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/agenda" className="btn btn-ghost">Retour à l&rsquo;agenda</Link>
          <Link href="/#flotte" className="btn btn-ghost">Les karts</Link>
        </div>
      </div>
    );
  }

  if (open.length === 0) {
    return (
      <div className="card p-6 md:p-8">
        <h2 className="display text-2xl text-chalk">Les inscriptions en ligne sont closes.</h2>
        <p className="mt-3 text-base leading-relaxed text-chalk-60">
          Les prochaines dates seront annoncées ici et sur l&rsquo;agenda. Pour une demande particulière, appelez le circuit au{" "}
          <a href={SITE.phoneHref} className="link-under font-semibold text-chalk">{SITE.phone}</a>.
        </p>
      </div>
    );
  }

  const disabled = status === "sending";

  return (
    <form onSubmit={submit} noValidate className="card relative flex flex-col gap-8 p-6 md:p-8">
      {/* Date */}
      <fieldset>
        <legend className="display mb-3 text-lg text-chalk">La course</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {open.map((d) => {
            const active = date === d.iso;
            return (
              <label key={d.iso} className={`flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors ${active ? "border-race bg-race/10" : "border-white/10 bg-asphalt-3 hover:border-white/25"}`}>
                <input type="radio" name="date" value={d.iso} checked={active} onChange={() => setDate(d.iso)} className="accent-[var(--color-race)]" disabled={disabled} />
                <span className="display text-lg text-chalk">{d.label}</span>
              </label>
            );
          })}
        </div>
        {errors.date && <p role="alert" className="mt-1.5 text-sm font-medium text-race">{errors.date}</p>}
      </fieldset>

      {/* Pilotes */}
      {pilotes.map((p, i) => {
        const k = `pilotes.${i}.`;
        return (
          <fieldset key={i} className="flex flex-col gap-5 border-t border-white/10 pt-6">
            <legend className="display mb-1 flex w-full items-center justify-between text-lg text-chalk">
              <span>{pilotes.length > 1 ? `Pilote ${i + 1}` : "Le pilote"}</span>
              {pilotes.length > 1 && (
                <button type="button" onClick={() => setPilotes((l) => l.filter((_, j) => j !== i))} className="link-under text-sm font-semibold text-chalk-60" disabled={disabled}>
                  Retirer
                </button>
              )}
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${k}prenom`} label="Prénom" error={errors[k + "prenom"]}>
                <input id={`${k}prenom`} className={INPUT} value={p.prenom} onChange={(e) => setPilote(i, { prenom: e.target.value })} autoComplete="off" maxLength={60} aria-invalid={Boolean(errors[k + "prenom"])} disabled={disabled} />
              </Field>
              <Field id={`${k}nom`} label="Nom" error={errors[k + "nom"]}>
                <input id={`${k}nom`} className={INPUT} value={p.nom} onChange={(e) => setPilote(i, { nom: e.target.value })} autoComplete="off" maxLength={60} aria-invalid={Boolean(errors[k + "nom"])} disabled={disabled} />
              </Field>
            </div>
            <label className="flex cursor-pointer items-center gap-3 text-base text-chalk-60">
              <input type="checkbox" checked={p.habitue} onChange={(e) => setPilote(i, { habitue: e.target.checked })} className="size-4 accent-[var(--color-race)]" disabled={disabled} />
              A déjà roulé chez MegaKart
            </label>
          </fieldset>
        );
      })}
      {pilotes.length < MAX_PILOTES && (
        <button type="button" onClick={() => setPilotes((l) => [...l, vide()])} className="btn btn-ghost self-start" disabled={disabled}>
          + Ajouter un autre pilote
        </button>
      )}
      {errors.pilotes && <p role="alert" className="text-sm font-medium text-race">{errors.pilotes}</p>}

      {/* Responsable */}
      <fieldset className="flex flex-col gap-5 border-t border-white/10 pt-6">
        <legend className="display mb-1 text-lg text-chalk">Vos coordonnées <span className="text-chalk-60">: le contact du circuit</span></legend>
        <Field id="responsable-name" label="Nom et prénom" error={errors["responsable.name"]}>
          <input id="responsable-name" className={INPUT} value={responsable.name} onChange={(e) => setResponsable({ ...responsable, name: e.target.value })} autoComplete="name" maxLength={80} aria-invalid={Boolean(errors["responsable.name"])} disabled={disabled} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="responsable-phone" label="Téléphone" error={errors["responsable.phone"]}>
            <input id="responsable-phone" type="tel" className={INPUT} value={responsable.phone} onChange={(e) => setResponsable({ ...responsable, phone: e.target.value })} autoComplete="tel" inputMode="tel" maxLength={30} aria-invalid={Boolean(errors["responsable.phone"])} disabled={disabled} />
          </Field>
          <Field id="responsable-email" label="E-mail" error={errors["responsable.email"]}>
            <input id="responsable-email" type="email" className={INPUT} value={responsable.email} onChange={(e) => setResponsable({ ...responsable, email: e.target.value })} autoComplete="email" inputMode="email" maxLength={120} aria-invalid={Boolean(errors["responsable.email"])} disabled={disabled} />
          </Field>
        </div>
      </fieldset>

      <Field id="message" label="Un mot pour le circuit" hint="Facultatif.">
        <textarea id="message" className={`${INPUT} min-h-28 resize-y`} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1500} disabled={disabled} />
      </Field>

      {/* Piège à robots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Site web</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {/* Consentement */}
      <div className="flex flex-col gap-4">
        <label className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-chalk-60">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1.5 size-4 shrink-0 accent-[var(--color-race)]" aria-invalid={Boolean(errors.consent)} disabled={disabled} />
          <span>
            J&rsquo;accepte que ces informations soient transmises au circuit MegaKart pour traiter l&rsquo;inscription.{" "}
            <Link href="/confidentialite" className="link-under text-chalk">Comment elles sont utilisées</Link>.
          </span>
        </label>
        {errors.consent && <p role="alert" className="text-sm font-medium text-race">{errors.consent}</p>}
      </div>

      <CaseInfos checked={infos} onChange={setInfos} disabled={disabled} />

      {status === "error" && (
        <p role="alert" className="border border-race/40 bg-race/10 px-4 py-3 text-base leading-relaxed text-chalk">
          L&rsquo;envoi n&rsquo;a pas abouti. Le plus simple : appelez le <a href={SITE.phoneHref} className="link-under font-semibold">{SITE.phone}</a> ou écrivez à <a href={`mailto:${SITE.email}`} className="link-under font-semibold">{SITE.email}</a>.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-race w-full justify-center sm:w-auto" disabled={disabled}>
          {disabled ? "Envoi…" : pilotes.length > 1 ? "Inscrire mes pilotes" : "Inscrire mon pilote"}
        </button>
        <p className="text-sm text-chalk-60">
          {PLEIN_GAZ.prix}€ par pilote{pilotes.length > 1 ? `, soit ${PLEIN_GAZ.prix * pilotes.length}€ pour ${pilotes.length} pilotes` : ""}, réglé sur place.
        </p>
      </div>
    </form>
  );
}
