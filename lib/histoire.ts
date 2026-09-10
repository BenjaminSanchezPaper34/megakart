/**
 * L'histoire du circuit — frise chronologique.
 *
 * PHOTOS D'ARCHIVES : déposer les scans dans `public/images/archives/`
 * puis renseigner le champ `photos` du jalon concerné. Un jalon sans
 * photo s'affiche proprement en texte seul : la section est publiable
 * avant même l'arrivée des scans.
 *
 * Nommage conseillé : `archives/<année>-<sujet>.jpg`
 * (ex. `archives/1992-ouverture.jpg`, `archives/2012-travaux.jpg`).
 *
 * ⚠️ NE JAMAIS INVENTER un fait historique. Les éléments marqués
 * « À CONFIRMER » attendent la validation du client avant publication.
 */

export type ArchivePhoto = {
  /** Chemin depuis /images (ex. "archives/1992-ouverture.jpg"). */
  src: string;
  /** Description factuelle pour l'accessibilité et le référencement. */
  alt: string;
  /** Légende affichée sous la photo (facultative). */
  caption?: string;
};

export type Jalon = {
  /** Année affichée en gros sur la frise. */
  year: string;
  title: string;
  /** Un à deux paragraphes. */
  text: string[];
  photos?: ArchivePhoto[];
  /** Met le jalon en avant (année en rouge). */
  highlight?: boolean;
};

export const JALONS: Jalon[] = [
  {
    year: "1992",
    title: "Le premier tour de roue",
    text: [
      "Un circuit de location ouvre à Vias-plage, entre les campings et la mer. À l'époque, le karting de loisir est encore une curiosité sur la côte : on vient y faire quelques tours en famille, l'été, entre deux baignades.",
    ],
    highlight: true,
    // photos: [{ src: "archives/1992-ouverture.jpg", alt: "…", caption: "…" }],
  },
  {
    year: "2012",
    title: "Le passage en compétition",
    text: [
      "Le circuit est considérablement agrandi et homologué en catégorie 1.1 : il accueille désormais la compétition officielle, avec des créneaux réservés aux pilotes licenciés et à leurs karts personnels.",
      "C'est le moment où MegaKart cesse d'être une simple attraction de bord de mer pour devenir un vrai équipement sportif, avec ses protections Tecpro et son chronométrage professionnel.",
    ],
  },
  {
    year: "2023",
    title: "La relève en piste",
    text: [
      "Lucas PAINA reprend l'exploitation du circuit en mai 2023, succédant à Michel PAINA. La nouvelle génération garde le cap : un circuit ouvert à tous, du premier tour de roue à la chasse au chrono.",
    ],
    highlight: true,
  },
  {
    year: "Aujourd'hui",
    title: "1000 mètres pour toutes les générations",
    text: [
      "Sept karts, du Baby Kart électrique dès 3 ans au 250 RX de compétition, un tracé de 1000 mètres large de 8,5 m, éclairé pour rouler jusqu'à minuit trente en été, et un chrono Apex Timing qui affiche les temps au dixième sur l'écran géant.",
      "Trente ans plus tard, on vient toujours y faire quelques tours en famille. On repart juste avec un temps à battre.",
    ],
  },
];

/*
 * À CONFIRMER AVEC LE CLIENT avant d'enrichir la frise :
 *  - Qui a fondé le circuit en 1992 ? (nom, histoire de la création)
 *  - Le lien exact entre Michel et Lucas PAINA (le Kbis ne dit que
 *    « précédent exploitant » — ne rien affirmer sans confirmation).
 *  - Depuis quand la famille est-elle liée au circuit ? La société PAINA
 *    est immatriculée en 2007, le circuit existe depuis 1992 : que s'est-il
 *    passé entre les deux ?
 *  - Dates et nature des travaux marquants (extension 2012, éclairage,
 *    protections Tecpro, arrivée du Baby Kart).
 *  - Anecdotes : pilotes connus venus rouler, records du circuit,
 *    la première course organisée, l'inondation de janvier 2026.
 */
