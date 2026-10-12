/**
 * Les courses en photos — frise des souvenirs (page /photos).
 *
 * Deux sortes d'étapes :
 *  - « galerie » : un événement photographié par Paper34. Les photos vivent
 *    sur paper34.fr/galerie/<slug> (téléchargement en qualité originale) ;
 *    ici on n'affiche que quelques vignettes (servies depuis R2) et le lien.
 *    Une galerie pas encore publiée garde `slug: null` → « photos en cours de tri ».
 *  - « archive » : les vieilles photos du circuit, par époque, à regarder.
 *    Une époque sans photo n'est pas affichée : on remplit `photos` quand
 *    les scans arrivent (fichiers dans public/images/archives/).
 *
 * Nouvelle course photographiée = une entrée en tête de GALERIES : date,
 * titre, slug de la galerie paper34, nombre de photos et 3-4 vignettes
 * (champ `thumb` du manifest.json de la galerie).
 */

export const GALERIE_BASE = "https://www.paper34.fr/galerie";

export type Vignette = { src: string; width: number; height: number };

export type EtapeGalerie = {
  kind: "galerie";
  /** Date ISO de l'événement. */
  date: string;
  kicker: string;
  title: string;
  text: string;
  /** Slug paper34.fr/galerie/<slug> ; null tant que la galerie n'est pas publiée. */
  slug: string | null;
  count?: number;
  vignettes: Vignette[];
};

export type EtapeArchive = {
  kind: "archive";
  /** Époque affichée (« 1992 », « Années 2000 »…). */
  periode: string;
  title: string;
  text: string;
  photos: { src: string; alt: string; width: number; height: number }[];
};

const R2 = "https://pub-054d5e4ec36144bea38e07a1452fe2b0.r2.dev/galeries";

/** Du plus récent au plus ancien. */
export const GALERIES: EtapeGalerie[] = [
  {
    kind: "galerie",
    date: "2026-10-11",
    kicker: "Course Enfants",
    title: "La relève sur la grille",
    text: "Onze jeunes pilotes de 8 à 14 ans, trois manches et un podium : la première Course Enfants de la saison.",
    slug: null,
    vignettes: [],
  },
  {
    kind: "galerie",
    date: "2026-08-28",
    kicker: "Session",
    title: "Session Lorik",
    text: "Une session photographiée de bout en bout sur le 1000 m de Vias-plage.",
    slug: "megakart-lorik",
    count: 11,
    vignettes: [
      { src: `${R2}/megakart-lorik/thumb/A7507797-DxO_DeepPRIME%20XD3.jpg`, width: 2048, height: 1365 },
      { src: `${R2}/megakart-lorik/thumb/A7507803-DxO_DeepPRIME%20XD3.jpg`, width: 2048, height: 1256 },
      { src: `${R2}/megakart-lorik/thumb/A7507805-DxO_DeepPRIME%20XD3.jpg`, width: 2048, height: 1365 },
    ],
  },
];

/** Les époques du circuit, reprises de la frise de /la-piste (lib/histoire.ts). */
export const ARCHIVES: EtapeArchive[] = [
  { kind: "archive", periode: "2023", title: "La relève en piste", text: "", photos: [] },
  { kind: "archive", periode: "2012", title: "Le passage en compétition", text: "", photos: [] },
  { kind: "archive", periode: "1992", title: "Le premier tour de roue", text: "", photos: [] },
];

export const archivesVisibles = () => ARCHIVES.filter((a) => a.photos.length > 0);
