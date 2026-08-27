"use client";

import { useMemo, useState } from "react";
import { recommend } from "@/lib/karts";
import KartCard from "./KartCard";

/**
 * Killer feature « Trouve ton kart » : âge + taille + expérience
 * → recommandation instantanée dans la flotte.
 */
export default function KartSelector() {
  const [age, setAge] = useState(10);
  const [height, setHeight] = useState(140);
  const [confirmed, setConfirmed] = useState(false);

  const reco = useMemo(() => recommend(age, height, confirmed), [age, height, confirmed]);
  const isAdult = age >= 18;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      {/* Commandes */}
      <div className="card flex flex-col gap-8 p-6 md:p-8">
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <label htmlFor="sel-age" className="display text-xl text-chalk">
              Âge du pilote
            </label>
            <output htmlFor="sel-age" className="display text-3xl text-race">
              {age} ans
            </output>
          </div>
          <input
            id="sel-age"
            type="range"
            min={3}
            max={60}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full accent-[var(--color-race)]"
          />
          <div className="mt-1 flex justify-between text-xs text-chalk-60">
            <span>3 ans</span>
            <span>60 ans</span>
          </div>
        </div>

        {!isAdult && (
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <label htmlFor="sel-height" className="display text-xl text-chalk">
                Taille
              </label>
              <output htmlFor="sel-height" className="display text-3xl text-race">
                {(height / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} m
              </output>
            </div>
            <input
              id="sel-height"
              type="range"
              min={90}
              max={200}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-[var(--color-race)]"
            />
            <div className="mt-1 flex justify-between text-xs text-chalk-60">
              <span>0,90 m</span>
              <span>2,00 m</span>
            </div>
          </div>
        )}

        {isAdult && (
          <fieldset>
            <legend className="display mb-3 text-xl text-chalk">Niveau de pilotage</legend>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: false, label: "Loisir" },
                { v: true, label: "Confirmé" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setConfirmed(opt.v)}
                  aria-pressed={confirmed === opt.v}
                  className={`display px-4 py-3 text-base transition-all duration-300 ${
                    confirmed === opt.v
                      ? "glow-race bg-race text-white"
                      : "bg-asphalt-3 text-chalk-60 hover:text-chalk"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {/* Résultat */}
      <div aria-live="polite" className="flex flex-col gap-4">
        <p className="text-base leading-relaxed text-chalk-60">{reco.message}</p>
        <KartCard kart={reco.primary} cta={null} />
        {reco.alternatives.length > 0 && (
          <p className="text-sm text-chalk-60">
            Aussi possible :{" "}
            {reco.alternatives.map((k, i) => (
              <span key={k.slug} className="font-semibold text-chalk">
                {k.name} ({k.price}€){i < reco.alternatives.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
