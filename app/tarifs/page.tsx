import type { Metadata } from "next";
import KartCard from "@/components/KartCard";
import KartSelector from "@/components/KartSelector";
import Marquee from "@/components/Marquee";
import { KARTS } from "@/lib/karts";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Karts & tarifs — de 5€ à 45€ la session",
  description:
    "Les 7 karts du circuit MegaKart à Vias : Baby Kart électrique dès 3 ans (5€), kart enfant 13€, 280cc, 390cc et 250 RX compétition. Sessions sans réservation.",
  alternates: { canonical: "/tarifs" },
};

const FAQ = [
  {
    q: "Faut-il réserver pour faire du karting chez MegaKart ?",
    a: "Non, les sessions se font sans réservation : vous venez, vous choisissez votre kart et vous roulez. Seuls les événements (anniversaires, EVG/EVJF, entreprises) se réservent à l'avance.",
  },
  {
    q: "À partir de quel âge peut-on piloter ?",
    a: "Dès 3 ans avec le Baby Kart électrique (5€ les 5 minutes) sur piste dédiée. Dès 7 ans et 1,30 m avec le Kart Enfant 160cc, et dès 5 ans en biplace avec un adulte.",
  },
  {
    q: "Combien coûte une session de karting à Vias ?",
    a: "De 5€ (Baby Kart, 5 min) à 45€ (250 RX 30cv compétition, 8 min). Le kart adulte standard 280cc est à 17€ et le 390cc à 22€ les 8 minutes.",
  },
  {
    q: "Quels moyens de paiement sont acceptés ?",
    a: "Cartes bancaires, espèces et chèques-vacances.",
  },
  {
    q: "Y a-t-il des règles d'équipement ?",
    a: "Oui : chaussures fermées type baskets obligatoires, vêtements flottants (écharpes, foulards…) interdits. Casques fournis sur place.",
  },
];

export default function TarifsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Karts & tarifs", path: "/tarifs" }]),
            faqJsonLd(FAQ),
          ]),
        }}
      />

      {/* Hero court */}
      <section className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-48">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="display mb-3 text-lg text-flag">Sessions sans réservation</p>
          <h1 className="display text-[clamp(2.8rem,7vw,6rem)] text-chalk">
            Choisis ta
            <br />
            <span className="text-race">machine.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk-60">
            {KARTS.length} karts, de 3 à 99 ans, de {KARTS[0].price}€ à{" "}
            {KARTS[KARTS.length - 1].price}€ la session. Casque fourni,
            chrono offert par l'écran géant.
          </p>
        </div>
      </section>

      {/* Sélecteur */}
      <section id="selecteur" className="scroll-mt-28 bg-asphalt-2 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2 data-reveal className="display text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
            Trouve ton kart <span className="text-flag">en 10 secondes</span>
          </h2>
          <p data-reveal className="mt-3 max-w-xl text-base text-chalk-60">
            L'âge et la taille du pilote suffisent — le circuit fait le reste.
          </p>
          <div data-reveal className="mt-10">
            <KartSelector />
          </div>
        </div>
      </section>

      <div className="kerb" aria-hidden="true" />

      {/* Grille complète */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <h2 data-reveal className="display text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
          Toute la flotte
        </h2>
        <div data-stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {KARTS.map((k) => (
            <KartCard key={k.slug} kart={k} />
          ))}
        </div>
        <p data-reveal className="mt-8 text-sm text-chalk-60">
          Sessions de 8 minutes (5 minutes pour le Baby Kart). L'accès aux 250 RX
          est conditionné à un chrono de référence — demandez aux moniteurs sur place.
        </p>
      </section>

      <Marquee
        items={[
          "Casque fourni",
          "Chrono Apex Timing offert",
          "CB · espèces · chèques-vacances",
          "Baskets obligatoires",
        ]}
      />

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <h2 data-reveal className="display text-[clamp(2rem,4.5vw,3.4rem)] text-chalk">
          Questions fréquentes
        </h2>
        <div data-stagger className="mt-10 flex flex-col gap-4">
          {FAQ.map((f) => (
            <details key={f.q} className="card group p-6 open:border-white/25">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-chalk [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="display shrink-0 text-2xl text-race transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-base leading-relaxed text-chalk-60">{f.a}</p>
            </details>
          ))}
        </div>
        <p data-reveal className="mt-10 text-base text-chalk-60">
          Une autre question ? Appelez-nous au{" "}
          <a href={SITE.phoneHref} className="link-under font-semibold text-chalk">
            {SITE.phone}
          </a>
          .
        </p>
      </section>
    </>
  );
}
