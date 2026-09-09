/**
 * Configuration centrale du site.
 * PRE_PROD : true = noindex + robots disallow (URL technique vercel.app).
 * À passer à false au moment de la bascule sur le domaine définitif,
 * en même temps que SITE_URL.
 */
export const PRE_PROD = true;

// Domaine définitif (acheté et branché le 09/09/2026). Le site y répond
// déjà, mais reste en noindex tant que PRE_PROD vaut true.
export const SITE_URL = "https://megakart.fr";

export const SITE = {
  name: "MegaKart",
  legalName: "PAINA",
  /** Données officielles — extrait Kbis du 8 juillet 2026, greffe de Béziers. */
  company: {
    form: "société à responsabilité limitée à associé unique",
    capital: "1 000 €",
    siren: "499 989 978",
    rcs: "Béziers",
    /** Numéro de gestion au greffe. */
    rcsNumber: "2007B00904",
    vat: "FR67499989978",
    naf: "9329Z",
    nafLabel: "Autres activités récréatives et de loisirs",
    director: "Lucas PAINA",
    /** Siège social — distinct de l'adresse du circuit (établissement). */
    headOffice: "42 Chemin de la Croix-de-Fer, 34450 Vias",
    /** Enseigne telle qu'immatriculée. */
    tradeName: "MEGA KART",
  },
  phone: "09 50 28 95 91",
  phoneHref: "tel:+33950289591",
  /** Réservation des courses par e-mail — adresse à fournir par le client (vide = non affiché). */
  email: "contact@megakart.info",
  address: {
    street: "301 Voie Communale du Tricot et des Tots",
    city: "Vias",
    zip: "34450",
    dept: "Hérault",
    region: "Occitanie",
    country: "FR",
  },
  geo: { lat: 43.3008507, lng: 3.412867 },
  mapsUrl: "https://goo.gl/maps/EQbS3j9zknnM32bb7",
  /** Live timing public du circuit (aucun identifiant requis). */
  apexLive: "https://live.apex-timing.com/megakart-vias/",
  landmark: "Entre Fabrikus World et Europark Indoor, route de Vias-plage",
  social: {
    facebook: "https://www.facebook.com/megakart.karting",
    instagram: "https://www.instagram.com/karting_megakart/",
    youtube: "https://www.youtube.com/channel/UC-r14_i1pUWRY6-i0VbkI_g",
    tripadvisor:
      "https://www.tripadvisor.fr/Attraction_Review-g1080326-d8621170-Reviews-MegaKart-Vias_Herault_Occitanie.html",
  },
} as const;
