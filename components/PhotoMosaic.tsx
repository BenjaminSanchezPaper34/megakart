import Link from "next/link";

/**
 * Mosaïque photos : une bande bord à bord qui défile en continu de droite à
 * gauche (animation CSS .mosaic-track dans globals.css), pause au survol.
 * Le format de chaque case suit l'orientation de la photo (4/5, 3/2, 5/4).
 */
type Tile = { src: string; alt: string; ratio: string };

const ROW_A: Tile[] = [
  { src: "galerie-26-pilote-rx250.jpg", alt: "Pilote en RX250 en pleine courbe", ratio: "aspect-[3/2]" },
  { src: "galerie-01-kart-adulte.jpg", alt: "Pilote adulte en pleine session", ratio: "aspect-[4/5]" },
  { src: "galerie-07-baby-kart.jpg", alt: "Enfant au volant d'un Baby Kart", ratio: "aspect-[4/5]" },
  { src: "galerie-03-drapeau-damier.jpg", alt: "Drapeau à damier en fin de course", ratio: "aspect-[3/2]" },
  { src: "galerie-15-nocturne-grande-roue.jpg", alt: "Session nocturne, grande roue illuminée", ratio: "aspect-[4/5]" },
  { src: "galerie-06-biplace.jpg", alt: "Kart biplace adulte et enfant", ratio: "aspect-[4/5]" },
  { src: "galerie-05-piste.jpg", alt: "La piste bordée de palmiers", ratio: "aspect-[4/5]" },
  { src: "galerie-12-kart-adulte.jpg", alt: "Pilote en plein virage", ratio: "aspect-[3/2]" },
];

const ROW_B: Tile[] = [
  { src: "galerie-02-kart-enfant.jpg", alt: "Jeune pilote en kart enfant", ratio: "aspect-[3/2]" },
  { src: "galerie-14-enfant-nocturne.jpg", alt: "Enfant en session du soir", ratio: "aspect-[4/5]" },
  { src: "galerie-25-casques.jpg", alt: "Les casques alignés au stand", ratio: "aspect-[3/2]" },
  { src: "galerie-16-jeune-pilote.jpg", alt: "Jeune pilote casqué", ratio: "aspect-[4/5]" },
  { src: "galerie-19-famille.jpg", alt: "Parent et enfant en biplace", ratio: "aspect-[4/5]" },
  { src: "galerie-22-aerien-crepuscule.jpg", alt: "Le circuit au crépuscule vu du ciel", ratio: "aspect-[4/5]" },
  { src: "galerie-17-nocturne-action.jpg", alt: "Kart en pleine action de nuit", ratio: "aspect-[5/4]" },
  { src: "galerie-20-famille.jpg", alt: "Sortie karting en famille", ratio: "aspect-[5/4]" },
];

/* Tuiles bord à bord, même hauteur par bande, sans arrondi ni espace ; la section
   suivante démarre directement sous les photos (choix Benjamin, 14/10). */
const TILE_H = "h-56 md:h-80";


export default function PhotoMosaic() {
  const items = [...ROW_A, ...ROW_B];
  const renderRow = () => (
    <div className="mosaic-row overflow-hidden" aria-label="Photos du circuit — défilement automatique">
      {/* Deux copies de la bande : l'animation glisse de -50 % puis boucle sans couture. */}
      <div className="mosaic-track flex w-max items-center">
        {[...items, ...items].map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            aria-hidden={i >= items.length}
            className={`relative flex-shrink-0 overflow-hidden ${TILE_H} ${item.ratio}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/${item.src}`}
              alt={i < items.length ? item.alt : ""}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-asphalt-2 pt-14 md:pt-20">
      {/* Même système que les autres sections : grand titre, sous-titre + lien sur une ligne. */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <h2 data-reveal className="display text-[clamp(3rem,9vw,7.5rem)] text-chalk">
          Sur la piste,
          <br />
          <span className="text-flag">jour et nuit.</span>
        </h2>
        <div className="mt-5 mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-12">
          <p data-reveal className="max-w-xl text-base leading-relaxed text-chalk md:text-xl">
            Sessions au soleil, nocturnes sous les projecteurs, premiers tours en Baby Kart : le circuit en vrai.
          </p>
          <Link href="/photos" className="btn btn-ghost">
            Toutes les photos
          </Link>
        </div>
      </div>

      {/* Une seule bande, dérive de droite à gauche (choix Benjamin, 14/10) */}
      <div className="relative">
        {renderRow()}
      </div>
    </section>
  );
}
