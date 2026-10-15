import type { Metadata } from "next";
import InscriptionCentTours from "@/components/InscriptionCentTours";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageCourse from "@/components/system/PageCourse";
import { AGENDA, datesOuvertes, formatDate, getOperation } from "@/lib/agenda";
import { CENT_TOURS_SLUG } from "@/lib/inscription";

/* Les dates passées disparaissent d'elles-mêmes : page régénérée chaque jour. */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Inscrire mon équipe aux 100 Tours",
  description:
    "Inscription en ligne d'une équipe de 2 ou 3 pilotes aux 100 Tours de MegaKart à Vias, sur les nouveaux Sodi RT10 390cc : date, nom d'équipe, capitaine et coéquipiers. Le circuit confirme la place par téléphone ou e-mail.",
  alternates: { canonical: "/inscription/100-tours" },
  // Page de la course (15/10) : formulaire + tout le détail, donc indexable.
};

/* Toutes les dates confirmées ; le composant écarte celles déjà passées. */
const DATES = AGENDA.filter(
  (a) => a.op === CENT_TOURS_SLUG && a.status === "confirme" && !a.endDate && a.date >= new Date().toISOString().slice(0, 10),
).map((a) => {
  const f = formatDate(a.date);
  return { iso: a.date, label: `${f.weekday} ${f.day} ${f.month}`, places: a.places };
});

/* Les dates complètes restent annoncées mais sortent du formulaire. */
const OUVERTES = datesOuvertes(CENT_TOURS_SLUG).map((a) => DATES.find((d) => d.iso === a.date)!);

export default function InscriptionCentToursPage() {
  const op = getOperation(CENT_TOURS_SLUG)!;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Agenda", path: "/agenda" },
              {
                name: "Inscription aux 100 Tours",
                path: "/inscription/100-tours",
              },
            ]),
          ),
        }}
      />

      <PageCourse
        op={op}
        ouvert={OUVERTES.length > 0}
        image={{ src: "/images/galerie-01-kart-adulte.jpg", alt: "Pilote en pleine session sur le circuit MegaKart", position: "object-[center_40%]" }}
        label={<>{op.name} · {DATES.map((d) => d.label).join(" et ")}</>}
        line1="Inscrivez"
        line2="votre équipe."
        subtitle={`Deux ou trois pilotes, rendez-vous à 10h, départ à 10h15 sur les Sodi RT10 390cc. ${op.price}, ${op.priceNote}.`}
        badges={DATES.filter((d) => d.places !== undefined).map((d) => (
          <span key={d.iso} className="rounded-full bg-race px-4 py-2 text-base font-bold text-white">
            {d.label} : {d.places === 0 ? "complet" : d.places === 1 ? "dernière place" : `plus que ${d.places} équipes`}
          </span>
        ))}
        intro="Le circuit vous rappelle pour confirmer la place. Aucun paiement en ligne."
        form={<InscriptionCentTours dates={OUVERTES} />}
      />
    </>
  );
}
