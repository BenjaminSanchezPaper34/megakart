"use client";

import { useId } from "react";

/**
 * « Les conditions » d'une carte bon plan : dépliage animé (hauteur en
 * grid-rows 0fr → 1fr, puis les lignes arrivent en fondu décalé). Remplace
 * un <details> natif dont l'ouverture était brute et non animable sur Safari.
 */
export default function DealConditions({
  details,
  facts,
  rule,
  soft,
  open,
  onToggle,
}: {
  details: string[];
  facts: string[];
  rule: string;
  soft: string;
  /** Piloté par la carte : un clic n'importe où sur la carte déplie (DealCard). */
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  const lines = [...details.map((text) => ({ text, fact: false })), ...facts.map((text) => ({ text, fact: true }))];

  return (
    <div className={`mt-4 w-full border-t pt-3 text-left ${rule}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="flex min-h-11 w-full items-center justify-center gap-2 text-base font-bold md:text-lg"
      >
        Les conditions
        <span
          aria-hidden="true"
          className={`display text-2xl transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <div
        id={id}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <ul className="pb-1">
            {lines.map((line, i) => (
              <li
                key={line.text}
                style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                className={`text-base leading-relaxed transition-[opacity,transform] md:text-lg duration-500 ease-out motion-reduce:transition-none ${
                  open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                } ${line.fact ? `border-b py-2.5 last:border-b-0 ${rule} ${i === details.length ? `mt-3 border-t ${rule}` : ""}` : `mt-3 ${soft}`}`}
              >
                {line.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
