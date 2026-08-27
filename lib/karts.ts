export type Kart = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  session: string;
  age: string;
  minAge: number;
  minHeight?: number; // en cm
  adultsOnly?: boolean;
  engine: string;
  badge?: "Nouveauté" | "Compétition" | "Duo";
  note?: string;
  /** Visuel détouré (PNG transparent, vue 3/4 uniforme) */
  image?: string;
  /** Libellé de la ligne d'accès (défaut « Âge ») */
  ageLabel?: string;
  /** Repère de prix affiché sous le tarif */
  priceHint?: string;
  accent: "yellow" | "red" | "white";
};

export const KARTS: Kart[] = [
  {
    slug: "baby-kart",
    name: "Baby Kart",
    tagline: "Les premiers tours de volant, en toute sécurité",
    price: 5,
    session: "5 min",
    age: "3 – 6 ans",
    minAge: 3,
    engine: "100 % électrique",
    badge: "Nouveauté",
    image: "kart-baby.png",
    priceHint: "La formule découverte de la flotte",
    note: "Un adulte accompagne au bord de la piste dédiée.",
    accent: "yellow",
  },
  {
    slug: "kart-enfant",
    name: "Kart Enfant",
    tagline: "Le vrai kart thermique, taille junior",
    price: 13,
    session: "8 min",
    age: "7 – 15 ans",
    minAge: 7,
    minHeight: 130,
    engine: "160 cm³ · 4 temps",
    image: "kart-enfant.png",
    note: "Taille minimum : 1,30 m.",
    accent: "white",
  },
  {
    slug: "biplace",
    name: "Kart Biplace",
    tagline: "Deux sièges, deux volants : les sensations à partager",
    price: 25,
    session: "8 min",
    age: "Dès 5 ans, avec un adulte",
    minAge: 5,
    engine: "4 temps · double commande",
    badge: "Duo",
    note: "L'adulte garde le contrôle du kart à tout moment.",
    accent: "white",
  },
  {
    slug: "280cc",
    name: "Kart 280cc",
    tagline: "L'entrée dans la cour des grands",
    price: 17,
    session: "8 min",
    age: "Dès 14 ans",
    minAge: 14,
    minHeight: 160,
    engine: "280 cm³ · 4 temps",
    note: "Taille minimum : 1,60 m.",
    accent: "white",
  },
  {
    slug: "390cc",
    name: "Kart 390cc",
    tagline: "Puissance et adhérence : le kart des habitués",
    price: 22,
    session: "8 min",
    age: "Adultes",
    minAge: 18,
    adultsOnly: true,
    engine: "390 cm³ · 4 temps",
    image: "kart-390.png",
    accent: "red",
  },
  {
    slug: "250-rx-16",
    name: "250 RX · 16 cv",
    tagline: "L'injection, le vrai rythme course",
    price: 32,
    session: "8 min",
    age: "Dès 18 ans",
    minAge: 18,
    adultsOnly: true,
    engine: "250 cm³ · injection · 16 cv",
    priceHint: "Les sessions loisir démarrent à 17 €",
    note: "Chrono de référence à valider en 390cc auprès des moniteurs.",
    accent: "red",
  },
  {
    slug: "250-rx-30",
    name: "250 RX · 30 cv",
    tagline: "Le sommet de la flotte, réservé aux pilotes confirmés",
    price: 45,
    session: "8 min",
    age: "Pilotes confirmés",
    ageLabel: "Accès",
    minAge: 18,
    adultsOnly: true,
    engine: "250 cm³ · injection · 30 cv",
    badge: "Compétition",
    image: "kart-rx.png",
    priceHint: "Les sessions loisir démarrent à 17 €",
    note: "Accès après un chrono de référence validé en 390cc — à voir avec les moniteurs sur place.",
    accent: "red",
  },
];

export function getKart(slug: string): Kart {
  const k = KARTS.find((k) => k.slug === slug);
  if (!k) throw new Error(`Kart inconnu : ${slug}`);
  return k;
}

export type Recommendation = {
  primary: Kart;
  alternatives: Kart[];
  message: string;
};

/**
 * Moteur de recommandation du sélecteur « Trouve ton kart ».
 * age en années, height en cm, confirmed = pilote régulier avec chronos.
 */
export function recommend(
  age: number,
  height: number,
  confirmed: boolean
): Recommendation {
  if (age < 3) {
    return {
      primary: getKart("biplace"),
      alternatives: [],
      message:
        "Avant 3 ans, pas encore de volant… mais le kart biplace se partage dès 5 ans. Rendez-vous très vite !",
    };
  }
  if (age <= 6) {
    return {
      primary: getKart("baby-kart"),
      alternatives: age >= 5 ? [getKart("biplace")] : [],
      message:
        "Le Baby Kart électrique est fait pour ça : une piste dédiée, un adulte au bord, et les premières sensations de pilote.",
    };
  }
  if (age <= 13) {
    if (height >= 130) {
      return {
        primary: getKart("kart-enfant"),
        alternatives: [getKart("biplace")],
        message:
          "Direction le Kart Enfant : un vrai thermique 160cc à sa taille. Et pour rouler en famille, le biplace attend un copilote.",
      };
    }
    return {
      primary: getKart("biplace"),
      alternatives: [getKart("baby-kart")],
      message:
        "En dessous de 1,30 m, on partage un biplace avec un adulte — double volant, doubles sensations.",
    };
  }
  if (age <= 17) {
    if (height >= 160) {
      return {
        primary: getKart("280cc"),
        alternatives: age <= 15 ? [getKart("kart-enfant")] : [],
        message:
          "À partir de 14 ans et 1,60 m, le 280cc ouvre les portes du grand circuit.",
      };
    }
    return {
      primary: getKart("kart-enfant"),
      alternatives: [getKart("biplace")],
      message:
        "Encore un peu court pour le 280cc (1,60 m minimum) — le Kart Enfant reste une belle machine.",
    };
  }
  if (confirmed) {
    return {
      primary: getKart("250-rx-30"),
      alternatives: [getKart("250-rx-16"), getKart("390cc")],
      message:
        "Pilote confirmé ? Les 250 RX injection vous attendent — accès aux 30 cv sous conditions de chronos.",
    };
  }
  return {
    primary: getKart("390cc"),
    alternatives: [getKart("280cc"), getKart("250-rx-16")],
    message:
      "Le 390cc est le meilleur rapport sensations/pilotage pour un adulte. Posez un chrono de référence et visez ensuite les 250 RX.",
  };
}
