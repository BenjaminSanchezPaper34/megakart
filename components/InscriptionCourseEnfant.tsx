"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics/react";
import { SITE } from "@/lib/site";
import { ENFANT, MAX_ENFANTS, ageAu } from "@/lib/inscription-enfant";

/**
 * Inscription d'un ou plusieurs enfants à la Course Enfant, par un parent.
 * Le contrôle d'âge et de taille se fait en direct, dès la saisie : un parent
 * doit savoir tout de suite si son enfant peut courir, pas après l'envoi.
 * La validation de référence reste côté serveur (lib/inscription-enfant.ts).
 */
type DateOption = { iso: string; label: string };
type Status = "idle" | "sending" | "sent" | "error";
type EnfantSaisi = { prenom: string; nom: string; naissance: string; taille: string; habitue: boolean };

const INPUT =
  "w-full border border-white/10 bg-asphalt-3 px-4 py-3 text-base text-chalk placeholder:text-chalk-60/60 transition-colors focus:border-race focus:outline-none aria-[invalid=true]:border-race";

const vide = (): EnfantSaisi => ({ prenom: "", nom: "", naissance: "", taille: "", habitue: false });

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

/** Contrôle immédiat, même règle que le serveur. */
function verdict(e: EnfantSaisi, date: string): { age?: number; ok: boolean; texte: string } | null {
  if (!e.naissance || !date) return null;
  const age = ageAu(e.naissance, date);
  if (age === null) return null;
  const taille = Number(e.taille) || 0;
  if (age < ENFANT.ageMin || age > ENFANT.ageMax)
    return { age, ok: false, texte: `${age} ans le jour de la course — la course est ouverte de ${ENFANT.ageMin} à ${ENFANT.ageMax} ans.` };
  if (e.taille && taille < ENFANT.tailleMin)
    return { age, ok: false, texte: `${taille} cm — il faut 1,40 m pour atteindre les pédales du Kart Enfant.` };
  if (!e.taille) return { age, ok: true, texte: `${age} ans le jour de la course.` };
  return { age, ok: true, texte: `${age} ans et ${taille} cm : c'est bon pour la grille.` };
}

export default function InscriptionCourseEnfant({ dates }: { dates: DateOption[] }) {
  const [open, setOpen] = useState<DateOption[]>(dates);
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setOpen(dates.filter((d) => d.iso >= today));
  }, [dates]);

  const [date, setDate] = useState("");
  const [enfants, setEnfants] = useState<EnfantSaisi[]>([vide()]);
  const [parent, setParent] = useState({ name: "", phone: "", email: "" });
  const [message, setMessage] = useState("");
  const [autorisation, setAutorisation] = useState(false);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!date && open.length === 1) setDate(open[0].iso);
  }, [open, date]);

  function setEnfant(i: number, patch: Partial<EnfantSaisi>) {
    setEnfants((list) => list.map((e, j) => (j === i ? { ...e, ...patch } : e)));
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
          type: "course-enfant",
          date,
          enfants: enfants.map((c) => ({ ...c, taille: Number(c.taille) || 0 })),
          parent, message, autorisation, consent, website,
        }),
      });
      const json = (await res.json()) as { ok: boolean; errors?: Record<string, string> };
      if (json.ok) {
        setStatus("sent");
        track("inscription", { course: "course-enfant", date, enfants: enfants.length });
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
    const prenoms = enfants.map((c) => c.prenom).join(" et ");
    return (
      <div className="card p-6 md:p-8" role="status">
        <span className="checker-sm block h-4 w-8 opacity-60" aria-hidden="true" />
        <h2 className="display mt-4 text-3xl text-chalk">
          <span className="text-race">{prenoms}</span> {enfants.length > 1 ? "sont" : "est"} sur la liste.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-chalk-60">
          Un récapitulatif part à l&rsquo;instant sur <strong className="text-chalk">{parent.email}</strong>.
          Le circuit revient vers vous sous 48 heures pour confirmer la place
          {chosen ? ` pour le ${chosen.label}` : ""}, rendez-vous à {ENFANT.debut}. Une question d&rsquo;ici là ? Le {SITE.phone} répond aux heures d&rsquo;ouverture.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/agenda#course-enfant" className="btn btn-ghost">Retour à l&rsquo;agenda</Link>
          <Link href="/tarifs" className="btn btn-ghost">Les karts</Link>
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
        <p className="mt-2 text-sm text-chalk-60">Début à {ENFANT.debut}. Choisissez la date d&rsquo;abord : l&rsquo;âge se calcule au jour de la course.</p>
        {errors.date && <p role="alert" className="mt-1.5 text-sm font-medium text-race">{errors.date}</p>}
      </fieldset>

      {/* Enfants */}
      {enfants.map((c, i) => {
        const k = `enfants.${i}.`;
        const v = verdict(c, date);
        return (
          <fieldset key={i} className="flex flex-col gap-5 border-t border-white/10 pt-6">
            <legend className="display mb-1 flex w-full items-center justify-between text-lg text-chalk">
              <span>{enfants.length > 1 ? `Enfant ${i + 1}` : "L'enfant"}</span>
              {enfants.length > 1 && (
                <button type="button" onClick={() => setEnfants((l) => l.filter((_, j) => j !== i))} className="link-under text-sm font-semibold text-chalk-60" disabled={disabled}>
                  Retirer
                </button>
              )}
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${k}prenom`} label="Prénom" error={errors[k + "prenom"]}>
                <input id={`${k}prenom`} className={INPUT} value={c.prenom} onChange={(e) => setEnfant(i, { prenom: e.target.value })} autoComplete="off" maxLength={60} aria-invalid={Boolean(errors[k + "prenom"])} disabled={disabled} />
              </Field>
              <Field id={`${k}nom`} label="Nom" error={errors[k + "nom"]}>
                <input id={`${k}nom`} className={INPUT} value={c.nom} onChange={(e) => setEnfant(i, { nom: e.target.value })} autoComplete="off" maxLength={60} aria-invalid={Boolean(errors[k + "nom"])} disabled={disabled} />
              </Field>
              <Field id={`${k}naissance`} label="Date de naissance" error={errors[k + "naissance"]}>
                <input id={`${k}naissance`} type="date" className={INPUT} value={c.naissance} onChange={(e) => setEnfant(i, { naissance: e.target.value })} max={new Date().toISOString().slice(0, 10)} aria-invalid={Boolean(errors[k + "naissance"])} disabled={disabled} />
              </Field>
              <Field id={`${k}taille`} label="Taille (cm)" error={errors[k + "taille"]} hint="1,40 m minimum">
                <input id={`${k}taille`} type="number" inputMode="numeric" min={100} max={220} className={INPUT} value={c.taille} onChange={(e) => setEnfant(i, { taille: e.target.value })} placeholder="145" aria-invalid={Boolean(errors[k + "taille"])} disabled={disabled} />
              </Field>
            </div>
            {v && (
              <p role="status" className={`text-sm font-medium ${v.ok ? "text-flag" : "text-race"}`}>{v.texte}</p>
            )}
            <label className="flex cursor-pointer items-center gap-3 text-base text-chalk-60">
              <input type="checkbox" checked={c.habitue} onChange={(e) => setEnfant(i, { habitue: e.target.checked })} className="size-4 accent-[var(--color-race)]" disabled={disabled} />
              A déjà roulé chez MegaKart
            </label>
          </fieldset>
        );
      })}
      {enfants.length < MAX_ENFANTS && (
        <button type="button" onClick={() => setEnfants((l) => [...l, vide()])} className="btn btn-ghost self-start text-sm" disabled={disabled}>
          + Ajouter un frère ou une sœur
        </button>
      )}
      {errors.enfants && <p role="alert" className="text-sm font-medium text-race">{errors.enfants}</p>}

      {/* Parent */}
      <fieldset className="flex flex-col gap-5 border-t border-white/10 pt-6">
        <legend className="display mb-1 text-lg text-chalk">Le parent <span className="text-chalk-60">— responsable légal, contact du circuit</span></legend>
        <Field id="parent-name" label="Nom et prénom" error={errors["parent.name"]}>
          <input id="parent-name" className={INPUT} value={parent.name} onChange={(e) => setParent({ ...parent, name: e.target.value })} autoComplete="name" maxLength={80} aria-invalid={Boolean(errors["parent.name"])} disabled={disabled} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="parent-phone" label="Téléphone" error={errors["parent.phone"]}>
            <input id="parent-phone" type="tel" className={INPUT} value={parent.phone} onChange={(e) => setParent({ ...parent, phone: e.target.value })} autoComplete="tel" inputMode="tel" maxLength={30} aria-invalid={Boolean(errors["parent.phone"])} disabled={disabled} />
          </Field>
          <Field id="parent-email" label="E-mail" error={errors["parent.email"]}>
            <input id="parent-email" type="email" className={INPUT} value={parent.email} onChange={(e) => setParent({ ...parent, email: e.target.value })} autoComplete="email" inputMode="email" maxLength={120} aria-invalid={Boolean(errors["parent.email"])} disabled={disabled} />
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

      {/* Autorisation & consentement */}
      <div className="flex flex-col gap-4">
        <label className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-chalk-60">
          <input type="checkbox" checked={autorisation} onChange={(e) => setAutorisation(e.target.checked)} className="mt-1.5 size-4 shrink-0 accent-[var(--color-race)]" aria-invalid={Boolean(errors.autorisation)} disabled={disabled} />
          <span>Je suis le responsable légal {enfants.length > 1 ? "de ces enfants" : "de cet enfant"} et j&rsquo;autorise sa participation à la Course Enfant. Je serai présent au circuit ou joignable pendant la course.</span>
        </label>
        {errors.autorisation && <p role="alert" className="text-sm font-medium text-race">{errors.autorisation}</p>}
        <label className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-chalk-60">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1.5 size-4 shrink-0 accent-[var(--color-race)]" aria-invalid={Boolean(errors.consent)} disabled={disabled} />
          <span>
            J&rsquo;accepte que ces informations soient transmises au circuit MegaKart pour traiter l&rsquo;inscription.{" "}
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
        <button type="submit" className="btn btn-race glow-race w-full justify-center sm:w-auto" disabled={disabled}>
          {disabled ? "Envoi…" : enfants.length > 1 ? "Inscrire les enfants" : "Inscrire mon enfant"}
        </button>
        <p className="text-sm text-chalk-60">{ENFANT.prix}€ par enfant, réglé sur place.</p>
      </div>
    </form>
  );
}
