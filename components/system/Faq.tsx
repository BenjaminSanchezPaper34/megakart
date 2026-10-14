import SectionHeader from "./SectionHeader";

/** Bloc FAQ du système : en-tête standard + questions dépliables (cartes). */
export default function Faq({
  items,
  line1 = "Questions",
  line2 = "fréquentes.",
  id,
  className = "",
}: {
  items: { q: string; a: string }[];
  line1?: string;
  line2?: string;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-7xl scroll-mt-24 px-5 py-(--section-y) md:px-8 ${className}`}>
      <SectionHeader line1={line1} line2={line2} />
      <div data-stagger className="mt-(--section-gap) flex max-w-4xl flex-col gap-4">
        {items.map((f) => (
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
    </section>
  );
}
