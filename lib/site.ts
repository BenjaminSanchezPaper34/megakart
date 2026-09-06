/**
 * Configuration centrale du site.
 * PRE_PROD : true = noindex + robots disallow (URL technique vercel.app).
 * À passer à false au moment de la bascule sur le domaine définitif,
 * en même temps que SITE_URL.
 */
export const PRE_PROD = true;

// URL de pré-prod ("megakart.vercel.app" est pris par un autre projet).
// À remplacer par le domaine définitif au moment de la bascule.
export const SITE_URL = "https://megakart-kohl.vercel.app";

export const SITE = {
  name: "MegaKart",
  legalName: "SARL PAINA",
  /** Données officielles transmises par le client le 06/09/2026 (Kbis). */
  company: {
    form: "SARL",
    capital: "1 000 €",
    /** 9 chiffres : identifiant de l'entreprise (le SIRET y ajoute le NIC de l'établissement). */
    siren: "499 989 978",
    vat: "FR67499989978",
    naf: "9329Z",
    nafLabel: "Autres activités récréatives et de loisirs",
    director: "Lucas PAINA",
  },
  phone: "09 50 28 95 91",
  phoneHref: "tel:+33950289591",
  /** Réservation des courses par e-mail — adresse à fournir par le client (vide = non affiché). */
  email: "contact@megakart.info",
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
