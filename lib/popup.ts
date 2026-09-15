/**
 * Pop-up « événement à venir ».
 *
 * Un visuel, deux formats — celui du réseau social, réutilisé tel quel :
 *   desktop → gabarit couverture Facebook (1250 × 462)
 *   mobile  → gabarit post (1080 × 1440)
 * Le visuel n'est jamais recadré par le site : on affiche le fichier entier,
 * donc ce qui est lisible sur Facebook l'est ici.
 *
 * La campagne s'éteint toute seule : sa date de fin est celle de la prochaine
 * date de l'opération dans l'agenda. Si la course est reportée, le pop-up
 * suit sans qu'on y touche.
 */
import { AGENDA } from "./agenda";

export type PopupCampagne = {
  /** Slug de l'opération dans l'agenda — donne la date de fin. */
  op: string;
  /** Destination du clic : la page qui doit convertir. */
  href: string;
  /** Description du visuel, pour les lecteurs d'écran. */
  alt: string;
  /** Visuel large — gabarit couverture. */
  wide: string;
  /** Visuel portrait — gabarit post. */
  tall: string;
  /**
   * Clé de mémorisation. En changer (suffixe -2, -b…) fait réapparaître le
   * pop-up chez les visiteurs qui l'avaient déjà fermé : à ne faire que pour
   * une vraie nouvelle campagne.
   */
  key: string;
};

export const CAMPAGNES: PopupCampagne[] = [
  {
    op: "100-tours",
    href: "/inscription/100-tours",
    alt: "Course Les 100 Tours, dimanche 18 octobre chez MegaKart — trois pilotes casqués derrière un kart Sodi RT10. Infos et inscriptions.",
    wide: "/images/popup/100-tours-couverture.jpg",
    tall: "/images/popup/100-tours-post.jpg",
    key: "megakart-popup-100-tours-2026",
  },
];

/**
 * Dimensions des visuels livrés (gabarits exportés en 1,33× pour les écrans
 * fins). Seul le rapport compte pour la mise en page : un export à la taille
 * exacte du gabarit tomberait au même endroit.
 */
export const FORMATS = {
  wide: { width: 1667, height: 616 },
  tall: { width: 1440, height: 1920 },
} as const;

/**
 * La campagne à montrer aujourd'hui : la première dont l'opération a encore
 * une date confirmée à venir. `until` est cette date — le pop-up disparaît
 * le jour de la course, quand il n'y a plus rien à réserver.
 */
export function campagneDuJour(today: string): (PopupCampagne & { until: string }) | null {
  for (const c of CAMPAGNES) {
    const prochaine = AGENDA.filter(
      (a) => a.op === c.op && a.status === "confirme" && !a.endDate && a.date > today
    ).map((a) => a.date).sort()[0];
    if (prochaine) return { ...c, until: prochaine };
  }
  return null;
}
