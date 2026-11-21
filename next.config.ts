import type { NextConfig } from "next";

const OLD_HOSTS = ["megakart.info", "www.megakart.info"];
/** Pages de l'ancien sitemap megakart.info → leur équivalent sur megakart.fr. */
const OLD_PATHS: Record<string, string> = {
  "/": "/",
  "/accueil": "/",
  "/a-propos": "/la-piste#histoire",
  "/anniversaire": "/anniversaire",
  "/nouvelle-page-anniversaire": "/anniversaire",
  "/ce-entreprise": "/team-building",
  "/photos": "/photos",
  "/tarifs": "/#flotte",
  "/contact-megakart-karting": "/contact",
  "/visiter-la-piste": "/la-piste",
  "/mentions-legales": "/mentions-legales",
  "/plan-du-site": "/",
  "/boutique-en-ligne": "/",
};

const nextConfig: NextConfig = {
  // Page Tarifs fusionnée dans l'accueil (13/10/2026).
  async redirects() {
    return [
      // Ancien site megakart.info (Simplébo) : 301 page par page vers megakart.fr (21/11/2026),
      // pour transmettre positions Google, ancienneté et liens. Ne joue que si le domaine
      // pointe sur ce projet Vercel ; les mails @megakart.info ne sont pas concernés (MX intacts).
      ...OLD_HOSTS.flatMap((host) => [
        ...Object.entries(OLD_PATHS).map(([source, dest]) => ({
          source,
          has: [{ type: "host" as const, value: host }],
          destination: `https://megakart.fr${dest}`,
          permanent: true,
        })),
        { source: "/:path*", has: [{ type: "host" as const, value: host }], destination: "https://megakart.fr/", permanent: true },
      ]),
      { source: "/tarifs", destination: "/#flotte", permanent: true },
      // Page Anniversaires fusionnée dans Événements (15/10/2026) : une seule page pour les 3 formules.
      { source: "/anniversaires", destination: "/anniversaire", permanent: true }, // page dédiée depuis le 21/11
      // Index des galeries fusionné dans la page Photos (15/10/2026).
      { source: "/galeries", destination: "/photos#galeries", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Vignettes des galeries paper34.fr (frise « Les courses en photos »).
    remotePatterns: [{ protocol: "https", hostname: "pub-054d5e4ec36144bea38e07a1452fe2b0.r2.dev" }],
  },
};

export default nextConfig;
