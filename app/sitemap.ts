import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getGaleries } from "@/lib/galeries";

// Mettre à jour la date à chaque modification de contenu d'une page.
const LASTMOD = "2026-10-27";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}`, lastModified: LASTMOD, priority: 1 },
    { url: `${SITE_URL}/agenda`, lastModified: LASTMOD, priority: 0.9 },
    { url: `${SITE_URL}/12-heures`, lastModified: LASTMOD, priority: 0.8 },
    // Pages des courses (formulaire + détail) depuis le 15/10.
    { url: `${SITE_URL}/inscription/100-tours`, lastModified: LASTMOD, priority: 0.8 },
    { url: `${SITE_URL}/inscription/course-enfant`, lastModified: LASTMOD, priority: 0.8 },
    { url: `${SITE_URL}/inscription/plein-gaz`, lastModified: LASTMOD, priority: 0.8 },
    { url: `${SITE_URL}/live`, lastModified: LASTMOD, priority: 0.7 },
    { url: `${SITE_URL}/la-piste`, lastModified: LASTMOD, priority: 0.8 },
    { url: `${SITE_URL}/evenements`, lastModified: LASTMOD, priority: 0.8 },
    { url: `${SITE_URL}/photos`, lastModified: LASTMOD, priority: 0.6 },
    // Galeries publiques des événements (15/10).
    ...getGaleries().map((g) => ({ url: `${SITE_URL}/galerie/${g.path}`, lastModified: LASTMOD, priority: 0.5 })),
    { url: `${SITE_URL}/en`, lastModified: LASTMOD, priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: LASTMOD, priority: 0.7 },
    { url: `${SITE_URL}/mentions-legales`, lastModified: LASTMOD, priority: 0.2 },
    { url: `${SITE_URL}/confidentialite`, lastModified: LASTMOD, priority: 0.2 },
  ];
}
