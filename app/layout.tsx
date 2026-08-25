import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Archivo } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FX from "@/components/FX";
import { PRE_PROD, SITE_URL } from "@/lib/site";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-saira",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MegaKart — Karting à Vias-plage · Circuit outdoor 1000 m, dès 3 ans",
    template: "%s · MegaKart Vias",
  },
  description:
    "Circuit de karting outdoor de 1000 m à Vias-plage (Hérault), homologué FFSA. Karts dès 3 ans, sessions sans réservation, anniversaires, EVG/EVJF et team building. Ouvert 7j/7 en été.",
  robots: PRE_PROD ? { index: false, follow: false } : { index: true, follow: true },
  alternates: {
    canonical: "/",
    languages: { fr: "/", en: "/en" },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "MegaKart",
    title: "MegaKart — Karting à Vias-plage · Circuit outdoor 1000 m",
    description:
      "1000 m de piste homologuée FFSA entre Fabrikus et Europark Indoor. Karts dès 3 ans, sans réservation.",
    // L'image OG est générée par app/opengraph-image.tsx (photo + logo).
  },
  twitter: {
    card: "summary_large_image",
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0d12",
  // Nécessaire pour que le voile de nav couvre la zone de la barre
  // d'état iOS (env(safe-area-inset-top)).
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${barlow.variable} ${archivo.variable}`}>
      {/* Test perf : grain désactivé (remettre className="grain" pour le réactiver) */}
      <body>
        <FX />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
