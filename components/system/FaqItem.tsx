"use client";

import { useId, useState } from "react";

/**
 * Une question de la FAQ : même dépliage que « Les conditions » des bons plans
 * (hauteur grid-rows 0fr → 1fr, réponse en fondu, « + » qui pivote).
 * La réponse reste dans le DOM (lisible par les moteurs), inerte quand fermée.
 */
export default function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={`card p-6 transition-colors duration-500 ${open ? "border-white/25" : ""}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 text-left text-lg font-semibold text-chalk"
      >
        {q}
        <span
          aria-hidden="true"
          className={`display shrink-0 text-2xl text-race transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? "rotate-45" : ""}`}
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
          <p
            style={{ transitionDelay: open ? "120ms" : "0ms" }}
            className={`pt-4 text-base leading-relaxed text-chalk-60 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
              open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
