import NewsletterForm from "@/components/NewsletterForm";
import SectionHeader from "@/components/system/SectionHeader";

/**
 * Section newsletter de l'accueil, juste après les courses à venir : celui
 * qui n'a pas trouvé sa date laisse son e-mail pour la prochaine.
 * Fond asphalte (la section des courses au-dessus est en asphalt-2).
 */
export default function Newsletter() {
  return (
    <section id="newsletter" className="scroll-mt-24 py-(--section-y)">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-2 lg:items-end">
        <SectionHeader
          line1="Premier sur"
          line2="la grille."
          subtitle="Les prochaines courses arrivent d'abord par e-mail : dates, ouverture des inscriptions, places qui partent."
        />
        <div data-reveal className="lg:pb-2">
          <NewsletterForm source="accueil" />
        </div>
      </div>
    </section>
  );
}
