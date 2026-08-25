/**
 * Configuration centrale du site.
 * PRE_PROD : true = noindex + robots disallow (URL technique vercel.app).
 * À passer à false au moment de la bascule sur le domaine définitif,
 * en même temps que SITE_URL.
 */
export const PRE_PROD = true;

export const SITE_URL = "https://megakart.vercel.app";

export const SITE = {
  name: "MegaKart",
  legalName: "MegaKart", // raison sociale exacte à confirmer par le client
  phone: "09 50 28 95 91",
  phoneHref: "tel:+33950289591",
  address: {
    street: "Voie Communale du Tricot et des Tots",
    city: "Vias",
    zip: "34450",
    dept: "Hérault",
    region: "Occitanie",
    country: "FR",
  },
  geo: { lat: 43.3008507, lng: 3.412867 },
  mapsUrl: "https://goo.gl/maps/EQbS3j9zknnM32bb7",
  landmark: "Entre Fabrikus World et Europark Indoor, route de Vias-plage",
  social: {
    facebook: "https://www.facebook.com/megakart.karting",
    instagram: "https://www.instagram.com/karting_megakart/",
    youtube: "https://www.youtube.com/channel/UC-r14_i1pUWRY6-i0VbkI_g",
    tripadvisor:
      "https://www.tripadvisor.fr/Attraction_Review-g1080326-d8621170-Reviews-MegaKart-Vias_Herault_Occitanie.html",
  },
} as const;
