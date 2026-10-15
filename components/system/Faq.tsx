import FaqItem from "./FaqItem";
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
      {/* Deux colonnes sur ordinateur, sur toute la largeur du site (6 questions = 2 × 3). */}
      <div data-stagger className="mt-(--section-gap) grid items-start gap-4 lg:grid-cols-2">
        {items.map((f) => (
          <FaqItem key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}
