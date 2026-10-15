/**
 * Galeries photos des événements (courses, sorties CE…) — SERVEUR UNIQUEMENT.
 *
 * Même système que paper34.fr/galeries : chaque galerie est un manifest JSON
 * (content/galeries/<slug-paper34>.json) produit par les scripts du projet
 * paper34 (build-gallery.mjs + upload-gallery-r2.mjs). Les photos restent sur
 * R2 (miniature 640 px, affichage 2048 px, original) ; téléchargement côté
 * navigateur (ClientGallery). Lecture au build : pages 100 % statiques.
 *
 * Publier une galerie = copier son manifest ici + ajouter sa ligne dans META.
 * Galeries publiques (choix Benjamin 15/10) : retrait d'une photo sur demande.
 */
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import type { Gallery } from "./gallery-shared";

export type { Gallery, GalleryPhoto } from "./gallery-shared";

const DIR = join(process.cwd(), "content", "galeries");

/** Présentation côté MegaKart : adresse courte, étiquette, accroche. */
const META: Record<string, { path: string; kicker: string; title: string; text: string }> = {
  "megakart-course-enfants": {
    path: "course-enfants-octobre-2026",
    kicker: "Course Enfants",
    title: "La relève sur la grille",
    text: "Onze jeunes pilotes de 8 à 14 ans, trois manches et un podium : la première Course Enfants de la saison.",
  },
  "megakart-bricocash": {
    path: "bricocash",
    kicker: "Entreprise",
    title: "Bricocash sur la piste",
    text: "L'équipe Bricocash en sortie karting sur le 1000 m de Vias-plage.",
  },
  "megakart-lorik": {
    path: "session-lorik",
    kicker: "Session",
    title: "Session Lorik",
    text: "Une session photographiée de bout en bout sur le 1000 m de Vias-plage.",
  },
};

export type Galerie = Gallery & { path: string; kicker: string; titre: string; accroche: string; couverture: string };

function charger(file: string): Galerie | null {
  try {
    const g = JSON.parse(readFileSync(join(DIR, file), "utf-8")) as Gallery;
    const m = META[g.slug];
    if (!m) return null;
    const cover = g.photos.find((p) => p.id === g.cover) ?? g.photos[0];
    return { ...g, path: m.path, kicker: m.kicker, titre: m.title, accroche: m.text, couverture: cover.display };
  } catch {
    return null;
  }
}

/** Toutes les galeries publiées, de la plus récente à la plus ancienne. */
export function getGaleries(): Galerie[] {
  if (!existsSync(DIR)) return [];
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map(charger)
    .filter((g): g is Galerie => g !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getGalerie(path: string): Galerie | null {
  return getGaleries().find((g) => g.path === path) ?? null;
}
