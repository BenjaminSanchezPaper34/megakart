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

export type Dimensions = { width: number; height: number };

export type PopupCampagne = {
  /** Slug de l'opération dans l'agenda — donne la date de fin. */
  op: string;
  /** Destination du clic : la page qui doit convertir. */
  href: string;
  /** Libellé du bouton. Par défaut « En savoir plus ». */
  cta?: string;
  /** Description du visuel, pour les lecteurs d'écran. */
  alt: string;
  /** Visuel affiché sur ordinateur (couverture par défaut). */
  wide: string;
  /** Visuel affiché sur mobile (post par défaut). */
  tall: string;
  /**
   * Dimensions des deux visuels si elles s'écartent des gabarits par défaut
   * (FORMATS). Seul le rapport largeur/hauteur compte pour la mise en page.
   */
  formats?: { wide: Dimensions; tall: Dimensions };
  /** Première date d'affichage (ISO) : la campagne attend son tour (ex. 13/12 après le 8/11). */
  des?: string;
  /** Dates couvertes par le visuel (affiche datée) ; absent = toutes les dates de l'opération. */
  dates?: string[];
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
    cta: "En savoir plus",
    alt: "Course Les 100 Tours, dimanche 18 octobre chez MegaKart — trois pilotes casqués derrière un kart Sodi RT10. Infos et inscriptions.",
    wide: "/images/popup/100-tours-couverture.jpg",
    tall: "/images/popup/100-tours-post.jpg",
    key: "megakart-popup-100-tours-2026",
    // L'affiche porte « dimanche 18 octobre » : jamais pour une autre date.
    dates: ["2026-10-18"],
  },
  {
    // Un seul visuel, le post 3:4 : sur ordinateur il s'affiche en portrait
    // (la boîte se resserre), sur mobile c'est le format natif.
    op: "course-enfant",
    href: "/inscription/course-enfant#formulaire",
    cta: "Inscrire mon enfant",
    alt: "Journée des enfants, dimanche 8 novembre chez MegaKart — une jeune pilote au casque rose au volant d'un kart Sodi n° 4. Infos et inscriptions.",
    // Affiche datée du 8/11 (Benjamin, 22/10) : jamais pour une autre date.
    wide: "/images/popup/journee-enfants-2026-11-08-v3.jpg",
    tall: "/images/popup/journee-enfants-2026-11-08-v3.jpg",
    formats: { wide: { width: 1500, height: 2000 }, tall: { width: 1500, height: 2000 } },
    dates: ["2026-11-08"],
    // Nouvelle clé : nouvelle campagne, elle réapparaît chez ceux qui avaient fermé l'ancienne.
    key: "megakart-popup-journee-enfants-2026-11-08",
  },
  {
    // Même formule pour la Journée des enfants du 13/12.
    op: "course-enfant",
    href: "/inscription/course-enfant#formulaire",
    cta: "Inscrire mon enfant",
    alt: "Journée des enfants, dimanche 13 décembre chez MegaKart — un jeune pilote au casque bleu et jaune au volant d'un kart Sodi n° 7. Infos et inscriptions.",
    wide: "/images/popup/journee-enfants-2026-12-13-v2.jpg",
    tall: "/images/popup/journee-enfants-2026-12-13-v2.jpg",
    formats: { wide: { width: 1500, height: 2000 }, tall: { width: 1500, height: 2000 } },
    dates: ["2026-12-13"],
    // Le 8/11 étant complet (29/10), le 13/12 prend le relais tout de suite.
    key: "megakart-popup-journee-enfants-2026-12-13",
  },
  {
    // Trophée Plein Gaz du 15/11 : affiche 3:4 livrée le 27/10.
    op: "plein-gaz",
    href: "/inscription/plein-gaz#formulaire",
    cta: "Inscrire mes pilotes",
    alt: "Trophée Plein Gaz, dimanche 15 novembre chez MegaKart — deux pilotes casqués côte à côte dans leurs karts Sodi n° 14 et n° 39. Infos et inscriptions.",
    wide: "/images/popup/plein-gaz-2026-11-15.jpg",
    tall: "/images/popup/plein-gaz-2026-11-15.jpg",
    formats: { wide: { width: 1500, height: 2000 }, tall: { width: 1500, height: 2000 } },
    dates: ["2026-11-15"],
    key: "megakart-popup-plein-gaz-2026-11-15",
  },
  {
    // Affiche 3:4 (1500 × 2000), même traitement que la Course Enfants.
    op: "12-heures",
    href: "/12-heures",
    cta: "Inscrire mon équipe",
    alt: "Les 12 Heures, samedi 19 décembre chez MegaKart, avec Vortex — un pilote casqué de dos, entre le jour et la nuit. Infos et inscriptions.",
    wide: "/images/popup/12-heures.jpg",
    tall: "/images/popup/12-heures.jpg",
    formats: { wide: { width: 1500, height: 2000 }, tall: { width: 1500, height: 2000 } },
    dates: ["2026-12-19"],
    key: "megakart-popup-12-heures-2026",
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
 * Les campagnes en cours aujourd'hui, de la plus proche à la plus lointaine
 * (à égalité, l'ordre de CAMPAGNES tranche). `until` est la prochaine date
 * confirmée — la campagne disparaît le jour de la course, quand il n'y a plus
 * rien à réserver. Le navigateur montre la première que le visiteur n'a pas
 * encore fermée : une fois la Course Enfants fermée, il verra les 12 Heures
 * à la visite suivante (choix Benjamin 20/10).
 */
export function campagnesDuJour(today: string): (PopupCampagne & { until: string })[] {
  const liste: (PopupCampagne & { until: string })[] = [];
  for (const c of CAMPAGNES) {
    const prochaine = AGENDA.filter(
      (a) => a.op === c.op && a.status === "confirme" && !a.endDate && a.date > today && a.places !== 0 && (!c.dates || c.dates.includes(a.date))
    ).map((a) => a.date).sort()[0];
    if (prochaine) liste.push({ ...c, until: prochaine });
  }
  return liste.sort((a, b) => a.until.localeCompare(b.until));
}
