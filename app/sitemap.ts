import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Mettre à jour la date à chaque modification de contenu d'une page.
const LASTMOD = "2026-08-25";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}`, lastModified: LASTMOD, priority: 1 },
    { url: `${SITE_URL}/tarifs`, lastModified: LASTMOD, priority: 0.9 },
    { url: `${SITE_URL}/la-piste`, lastModified: LASTMOD, priority: 0.8 },
    { url: `${SITE_URL}/evenements`, lastModified: LASTMOD, priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: LASTMOD, priority: 0.7 },
    { url: `${SITE_URL}/mentions-legales`, lastModified: LASTMOD, priority: 0.2 },
    { url: `${SITE_URL}/confidentialite`, lastModified: LASTMOD, priority: 0.2 },
  ];
}
