/**
 * Utilitaires et types de galerie SANS dépendance Node (fs/path).
 * Importable côté client ET serveur. La lecture des manifests (fs) vit
 * dans galleries.ts (serveur uniquement).
 */

export type GalleryPhoto = {
  id: string;
  /** "video" pour un film (grille = affiche + badge lecture, lightbox = player). */
  type?: "image" | "video";
  /** Vignette légère pour la grille (URL R2 ou chemin relatif) */
  thumb?: string;
  /** Chemin relatif (depuis /galeries/<slug>/) du JPEG d'affichage (affiche pour une vidéo) */
  display: string;
  /** URL du MP4 web (items vidéo uniquement) */
  video?: string;
  /** Titre court affiché sous la vignette (items vidéo) */
  title?: string;
  /** Durée lisible, ex. « 4 min 46 » (items vidéo) */
  duration?: string;
  /** Chemin relatif de l'original intact (téléchargement) */
  original: string;
  /** Nom de fichier exact pour le téléchargement */
  downloadName: string;
  width: number;
  height: number;
  originalBytes: number;
  originalExt: string;
};

export type Gallery = {
  slug: string;
  title: string;
  client: string;
  date: string;
  count: number;
  totalOriginalBytes: number;
  /** Texte d'intro personnalisé (avec retours ligne et @mentions). Optionnel. */
  intro?: string;
  /** ID de la photo de couverture pour /galeries (sinon la première). */
  cover?: string;
  /** Thème du bloc d'accroche en fin de galerie ("mariage" | "entreprise").
   *  Par défaut : événement pour les photos, projet vidéo pour les films. */
  ctaTheme?: "mariage" | "entreprise";
  photos: GalleryPhoto[];
};

/** Préfixe URL public d'une galerie. */
export function galleryBase(slug: string): string {
  return `/galeries/${slug}`;
}

/** URL d'un asset. Renvoie tel quel si c'est déjà une URL absolue (Blob),
 *  sinon préfixe par le chemin public local et encode les espaces. */
export function assetUrl(slug: string, pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  // encodeURI préserve les "/" mais encode les espaces → %20
  return encodeURI(`${galleryBase(slug)}/${pathOrUrl}`);
}

/** Formatte une taille d'octets en Ko/Mo lisible. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
