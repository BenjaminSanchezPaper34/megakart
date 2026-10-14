import type { ReactNode } from "react";
import SectionHeader from "./SectionHeader";

/** Bloc d'appel final centré, commun à toutes les pages (même système que l'accueil). */
export default function CtaFinal({
  line1,
  line2,
  subtitle,
  children,
}: {
  line1: ReactNode;
  line2?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden py-(--section-y)">
      <div className="checker absolute inset-x-0 top-0 h-5 opacity-[0.07]" aria-hidden="true" />
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionHeader line1={line1} line2={line2} subtitle={subtitle} align="center" />
        <div data-reveal className="mt-(--section-gap) flex flex-wrap justify-center gap-4">
          {children}
        </div>
      </div>
    </section>
  );
}
