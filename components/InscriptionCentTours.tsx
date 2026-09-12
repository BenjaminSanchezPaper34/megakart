"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics/react";
import { SITE } from "@/lib/site";
import { EXPERIENCES } from "@/lib/inscription";

/**
 * Formulaire d'inscription d'une équipe aux 100 Tours.
 * La validation fine est faite par la route (lib/inscription.ts) : ici on
 * affiche ses retours champ par champ. En cas de panne d'envoi, le
 * téléphone et l'e-mail restent la solution de repli, jamais un mur.
 */
type DateOption = { iso: string; label: string };
type Status = "idle" | "sending" | "sent" | "error";

const INPUT =
  "w-full border border-white/10 bg-asphalt-3 px-4 py-3 text-base text-chalk placeholder:text-chalk-60/60 transition-colors focus:border-race focus:outline-none aria-[invalid=true]:border-race";

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="display mb-2 block text-lg text-chalk">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-chalk-60">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-race">
          {error}
        </p>
      )}
    </div>
  );
}

export default function InscriptionCentTours({ dates }: { dates: DateOption[] }) {
  // Les dates passées disparaissent après montage : la page est prérendue,
  // seule cette étape connaît la date du jour du visiteur.
  const [open, setOpen] = useState<DateOption[]>(dates);
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setOpen(dates.filter((d) => d.iso >= today));
  }, [dates]);

  const [date, setDate] = useState("");
  const [team, setTeam] = useState("");
  const [captain, setCaptain] = useState({ name: "", phone: "", email: "" });
  const [pilots, setPilots] = useState<[string, string]>(["", ""]);
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // piège à robots
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!date && open.length === 1) setDate(open[0].iso);
  }, [open, date]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, team, captain, pilots, experience, message, consent, website }),
      });
      const json = (await res.json()) as { ok: boolean; errors?: Record<string, string> };
      if (json.ok) {
        setStatus("sent");
        track("inscription", { course: "100-tours", date });
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
    return (
      <div className="card p-6 md:p-8" role="status">
        <span className="checker-sm block h-4 w-8 opacity-60" aria-hidden="true" />
        <h2 className="display mt-4 text-3xl text-chalk">
          Équipe <span className="text-race">{team}</span>, vous êtes sur la liste.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-chalk-60">
          Un récapitulatif part à l&rsquo;instant sur <strong className="text-chalk">{captain.email}</strong>.
          Le circuit revient vers vous pour confirmer votre place aux 100 Tours
          {chosen ? ` du ${chosen.label}` : ""}. Une question d&rsquo;ici là ? Le {SITE.phone} répond
          aux heures d&rsquo;ouverture.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/agenda#100-tours" className="btn btn-ghost">
            Retour à l&rsquo;agenda
          </Link>
          <Link href="/live" className="btn btn-ghost">
            Le chrono en direct
          </Link>
        </div>
      </div>
    );
  }

  if (open.length === 0) {
    return (
      <div className="card p-6 md:p-8">
        <h2 className="display text-2xl text-chalk">Les inscriptions en ligne sont closes.</h2>
        <p className="mt-3 text-base leading-relaxed text-chalk-60">
          Les prochaines dates seront annoncées ici et sur l&rsquo;agenda. Pour une
          demande particulière, appelez le circuit au{" "}
          <a href={SITE.phoneHref} className="link-under font-semibold text-chalk">
            {SITE.phone}
          </a>
          .
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
        <div className="grid gap-3 sm:grid-cols-2">
          {open.map((d) => {
            const active = date === d.iso;
            return (
              <label
                key={d.iso}
                className={`flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors ${
                  active ? "border-race bg-race/10" : "border-white/10 bg-asphalt-3 hover:border-white/25"
                }`}
              >
                <input
                  type="radio"
                  name="date"
                  value={d.iso}
                  checked={active}
                  onChange={() => setDate(d.iso)}
                  className="accent-[var(--color-race)]"
                />
                <span className="display text-lg text-chalk">{d.label}</span>
              </label>
            );
          })}
        </div>
        {errors.date && (
          <p role="alert" className="mt-1.5 text-sm font-medium text-race">
            {errors.date}
          </p>
        )}
      </fieldset>

      {/* Équipe */}
      <Field id="team" label="Nom de l'équipe" error={errors.team} hint="C'est ce nom qui s'affichera au chrono.">
        <input
          id="team"
          className={INPUT}
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          autoComplete="organization"
          maxLength={80}
          aria-invalid={Boolean(errors.team)}
          disabled={disabled}
        />
      </Field>

      {/* Capitaine */}
      <fieldset className="flex flex-col gap-5">
        <legend className="display mb-1 text-lg text-chalk">
          Le capitaine <span className="text-chalk-60">— 1er pilote et contact de l&rsquo;équipe</span>
        </legend>
        <Field id="captain-name" label="Nom et prénom" error={errors["captain.name"]}>
          <input
            id="captain-name"
            className={INPUT}
            value={captain.name}
            onChange={(e) => setCaptain({ ...captain, name: e.target.value })}
            autoComplete="name"
            maxLength={80}
            aria-invalid={Boolean(errors["captain.name"])}
            disabled={disabled}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="captain-phone" label="Téléphone" error={errors["captain.phone"]}>
            <input
              id="captain-phone"
              type="tel"
              className={INPUT}
              value={captain.phone}
              onChange={(e) => setCaptain({ ...captain, phone: e.target.value })}
              autoComplete="tel"
              inputMode="tel"
              maxLength={30}
              aria-invalid={Boolean(errors["captain.phone"])}
              disabled={disabled}
            />
          </Field>
          <Field id="captain-email" label="E-mail" error={errors["captain.email"]}>
            <input
              id="captain-email"
              type="email"
              className={INPUT}
              value={captain.email}
              onChange={(e) => setCaptain({ ...captain, email: e.target.value })}
              autoComplete="email"
              inputMode="email"
              maxLength={120}
              aria-invalid={Boolean(errors["captain.email"])}
              disabled={disabled}
            />
          </Field>
        </div>
      </fieldset>

      {/* Coéquipiers */}
      <fieldset className="flex flex-col gap-5">
        <legend className="display mb-1 text-lg text-chalk">Les coéquipiers</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {([0, 1] as const).map((i) => (
            <Field key={i} id={`pilot-${i}`} label={`${i + 2}e pilote — nom et prénom`} error={errors[`pilots.${i}`]}>
              <input
                id={`pilot-${i}`}
                className={INPUT}
                value={pilots[i]}
                onChange={(e) => {
                  const next: [string, string] = [...pilots] as [string, string];
                  next[i] = e.target.value;
                  setPilots(next);
                }}
                maxLength={80}
                aria-invalid={Boolean(errors[`pilots.${i}`])}
                disabled={disabled}
              />
            </Field>
          ))}
        </div>
      </fieldset>

      {/* Expérience & message */}
      <Field id="experience" label="Votre expérience" hint="Facultatif — ça aide le circuit à préparer le briefing.">
        <select
          id="experience"
          className={INPUT}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          disabled={disabled}
        >
          <option value="">—</option>
          {EXPERIENCES.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </Field>
      <Field id="message" label="Un mot pour le circuit" hint="Facultatif.">
        <textarea
          id="message"
          className={`${INPUT} min-h-28 resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1500}
          disabled={disabled}
        />
      </Field>

      {/* Piège à robots : invisible, ne doit jamais être rempli. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Site web</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {/* Consentement */}
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-chalk-60">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1.5 size-4 shrink-0 accent-[var(--color-race)]"
            aria-invalid={Boolean(errors.consent)}
            disabled={disabled}
          />
          <span>
            J&rsquo;accepte que ces informations soient transmises au circuit MegaKart pour
            traiter l&rsquo;inscription de mon équipe.{" "}
            <Link href="/confidentialite" className="link-under text-chalk">
              Comment elles sont utilisées
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="mt-1.5 text-sm font-medium text-race">
            {errors.consent}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="border border-race/40 bg-race/10 px-4 py-3 text-base leading-relaxed text-chalk">
          L&rsquo;envoi n&rsquo;a pas abouti. Le plus simple : appelez le{" "}
          <a href={SITE.phoneHref} className="link-under font-semibold">
            {SITE.phone}
          </a>{" "}
          ou écrivez à{" "}
          <a href={`mailto:${SITE.email}`} className="link-under font-semibold">
            {SITE.email}
          </a>
          .
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-race glow-race" disabled={disabled}>
          {disabled ? "Envoi…" : "Inscrire l'équipe"}
        </button>
        <p className="text-sm text-chalk-60">
          {SITE.phone} reste ouvert pour toute question.
        </p>
      </div>
    </form>
  );
}
