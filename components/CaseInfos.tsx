/**
 * Case « me prévenir des prochaines courses », cochée par défaut, sous la case
 * de consentement des formulaires d'inscription. Décochée = le contact n'entre
 * pas dans la base Resend (voir lib/contacts.ts).
 */
export function CaseInfos({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-chalk-60">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1.5 size-4 shrink-0 accent-[var(--color-race)]"
        disabled={disabled}
      />
      <span>
        Me prévenir par e-mail des prochaines courses MegaKart. Désinscription en un clic,
        dans chaque message.
      </span>
    </label>
  );
}
