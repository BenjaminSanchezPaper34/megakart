import type { Metadata } from "next";
import InscriptionPleinGaz from "@/components/InscriptionPleinGaz";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageCourse from "@/components/system/PageCourse";
import { datesOuvertes, formatDate, getOperation } from "@/lib/agenda";
import { PLEIN_GAZ, PLEIN_GAZ_SLUG } from "@/lib/inscription-plein-gaz";

/* Les dates passées disparaissent d'elles-mêmes : page régénérée chaque jour. */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Inscrire mes pilotes au Trophée Plein Gaz",
  description:
    `Inscription en ligne au Trophée Plein Gaz de MegaKart à Vias, dimanche 15 novembre : qualifs et course en 390cc, dernière course en RX250 pour tous, ${PLEIN_GAZ.prix} € par pilote. Le circuit confirme la place sous 48 h.`,
  alternates: { canonical: "/inscription/plein-gaz" },
  // Page de la course (15/10) : formulaire + tout le détail, donc indexable.
};

/* Toutes les dates confirmées ; le composant écarte celles déjà passées. */
const DATES = datesOuvertes(PLEIN_GAZ_SLUG).map((a) => {
  const f = formatDate(a.date);
  return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}`, badge: a.badge };
});

export default function InscriptionPleinGazPage() {
  const op = getOperation(PLEIN_GAZ_SLUG)!;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Agenda", path: "/agenda" },
              {
                name: "Inscription au Trophée Plein Gaz",
                path: "/inscription/plein-gaz",
              },
            ]),
          ),
        }}
      />

      <PageCourse
        op={op}
        ouvert={DATES.length > 0}
        image={{ src: "/images/galerie-12-kart-adulte.jpg", alt: "Pilote adulte en pleine course sur le circuit MegaKart", position: "object-[center_40%]" }}
        label={<>{op.name} · {DATES.map((d) => d.label).join(" · ")}</>}
        line1="Inscrivez"
        line2="vos pilotes."
        subtitle={`Qualifs et course en 390cc, dernière course en RX250 pour tous, ${op.price}. Un contact, de un à quatre pilotes : c'est tout ce qu'il faut.`}
        badges={DATES.filter((d) => d.badge).map((d) => (
          <span key={d.iso} className="rounded-full bg-race px-4 py-2 text-base font-bold text-white">
            {d.label} : {d.badge}
          </span>
        ))}
        intro="Le circuit vous rappelle sous 48 heures pour confirmer. Aucun paiement en ligne : tout se règle sur place le jour de la course."
        form={<InscriptionPleinGaz dates={DATES} />}
        priceNote="réglé sur place le jour de la course"
      />
    </>
  );
}
