import { SITE, SITE_URL } from "./site";
import { KARTS } from "./karts";

/** JSON-LD LocalBusiness (type métier) pour la page d'accueil. */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["EntertainmentBusiness", "SportsActivityLocation"],
    "@id": `${SITE_URL}/#business`,
    name: SITE.name,
    description:
      "Circuit de karting outdoor de 1000 m à Vias-plage, homologué FFSA. Location de karts dès 3 ans, compétition, anniversaires et team building.",
    url: SITE_URL,
    telephone: "+33950289591",
    image: `${SITE_URL}/images/og.jpg`,
    priceRange: "5€ - 45€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Carte bancaire, espèces, chèques-vacances",
    foundingDate: "1992",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.zip,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    hasMap: SITE.mapsUrl,
    sameAs: Object.values(SITE.social),
    knowsAbout: [
      "karting",
      "karting enfant",
      "baby kart électrique",
      "compétition karting FFSA",
      "anniversaire karting",
      "team building",
      "EVG EVJF",
    ],
    areaServed: ["Vias", "Agde", "Cap d'Agde", "Béziers", "Hérault"],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Stand glaces, granités et boissons fraîches", value: true },
      { "@type": "LocationFeatureSpecification", name: "Terrasse ombragée", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking gratuit", value: true },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
        ],
        opens: "10:00",
        closes: "00:30",
        validFrom: "2026-06-15",
        validThrough: "2026-08-31",
      },
    ],
    makesOffer: KARTS.map((k) => ({
      "@type": "Offer",
      name: `Session ${k.name} (${k.session})`,
      price: k.price,
      priceCurrency: "EUR",
    })),
  };
}

/** BreadcrumbList pour les pages intérieures. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      ...items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: it.name,
        item: `${SITE_URL}${it.path}`,
      })),
    ],
  };
}

/**
 * Événements datés de l'agenda (schema.org Event).
 * Seuls les temps forts CONFIRMÉS à date unique sont publiés.
 */
export function agendaJsonLd(
  items: {
    date: string;
    name: string;
    slug?: string;
    description: string;
    price?: number;
  }[]
) {
  const place = {
    "@type": "Place",
    name: SITE.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
  };
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/agenda`,
    name: "Agenda MegaKart — courses & offres de fin d'année 2026",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Event",
          name: `${e.name} — MegaKart Vias`,
          startDate: e.date,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: place,
          description: e.description,
          organizer: { "@id": `${SITE_URL}/#business` },
          url: `${SITE_URL}/agenda${e.slug ? `#${e.slug}` : ""}`,
          ...(e.price !== undefined && {
            offers: {
              "@type": "Offer",
              price: e.price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: `${SITE_URL}/agenda${e.slug ? `#${e.slug}` : ""}`,
            },
          }),
        },
      })),
    },
  };
}

/** FAQPage — utilisé sur la page tarifs. */
export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
