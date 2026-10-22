import type { Metadata } from "next";
import InscriptionCourseEnfant from "@/components/InscriptionCourseEnfant";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageCourse from "@/components/system/PageCourse";
import { datesOuvertes, formatDate, getOperation } from "@/lib/agenda";
import { COURSE_ENFANT_SLUG, ENFANT } from "@/lib/inscription-enfant";

/* Les dates passées disparaissent d'elles-mêmes : page régénérée chaque jour. */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Inscrire mon enfant à la Journée des enfants",
  description:
    "Inscription en ligne à la Journée des enfants de MegaKart à Vias : de 8 à 14 ans, 1,40 m minimum, 3 manches de 8 minutes en Kart Enfant, 32 € par enfant. Le circuit confirme la place sous 48 h.",
  alternates: { canonical: "/inscription/course-enfant" },
  // Page de la course (15/10) : formulaire + tout le détail, donc indexable.
};

/* Toutes les dates confirmées ; le composant écarte celles déjà passées. */
const DATES = datesOuvertes(COURSE_ENFANT_SLUG).map((a) => {
  const f = formatDate(a.date);
  return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}`, badge: a.badge };
});

export default function InscriptionCourseEnfantPage() {
  const op = getOperation(COURSE_ENFANT_SLUG)!;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Agenda", path: "/agenda" },
              {
                name: "Inscription à la Journée des enfants",
                path: "/inscription/course-enfant",
              },
            ]),
          ),
        }}
      />

      <PageCourse
        op={op}
        ouvert={DATES.length > 0}
        // En-tête tiré de la galerie de la Journée du 11/10 (Benjamin, 22/10) : la grille de départ des enfants.
        image={{ src: "https://pub-054d5e4ec36144bea38e07a1452fe2b0.r2.dev/galeries/megakart-course-enfants/display/A7501534-DxO_DeepPRIME%20XD3.jpg", alt: "Grille de départ de la Journée des enfants chez MegaKart : jeunes pilotes casqués alignés dans leurs karts", position: "object-[center_40%]" }}
        label={<>{op.name} · {DATES.map((d) => d.label).join(" · ")}</>}
        line1="Inscrivez"
        line2="votre enfant."
        subtitle={`De ${ENFANT.ageMin} à ${ENFANT.ageMax} ans, 1,40 m minimum. Rendez-vous à 14h, ${op.price}, réglé sur place.`}
        badges={DATES.filter((d) => d.badge).map((d) => (
          <span key={d.iso} className="rounded-full bg-race px-4 py-2 text-base font-bold text-white">
            {d.label} : {d.badge}
          </span>
        ))}
        intro="Le circuit vous rappelle sous 48 heures pour confirmer la place. Aucun paiement en ligne ; l'âge et la taille sont vérifiés à l'accueil le jour J."
        form={<InscriptionCourseEnfant dates={DATES} />}
        priceNote="réglé sur place le jour de la course"
      />
    </>
  );
}
