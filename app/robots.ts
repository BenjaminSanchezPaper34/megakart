import type { MetadataRoute } from "next";
import { PRE_PROD, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Pré-prod : on bloque tout tant que le domaine définitif n'est pas branché.
  if (PRE_PROD) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Crawlers IA explicitement autorisés (GEO)
      ...[
        "GPTBot",
        "OAI-SearchBot",
        "ChatGPT-User",
        "ClaudeBot",
        "Claude-Web",
        "PerplexityBot",
        "Google-Extended",
        "Applebot-Extended",
      ].map((bot) => ({ userAgent: bot, allow: "/" as const })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
