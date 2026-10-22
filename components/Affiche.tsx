import Image from "next/image";
import { afficheDe, type Operation } from "@/lib/agenda";

/**
 * Affiche officielle d'une épreuve — le visuel réseau social, affiché entier
 * dans un cadre carte. Un seul composant pour la fiche agenda et les pages
 * d'inscription : même cadre, même ombre, même légende partout.
 * Ne rend rien si l'opération n'a pas d'affiche. Affiche datée de la prochaine
 * édition en priorité (afficheDe).
 */
export default function Affiche({
  op,
  className = "",
  priority = false,
}: {
  op: Operation;
  className?: string;
  priority?: boolean;
}) {
  const affiche = afficheDe(op);
  if (!affiche) return null;
  return (
    <figure data-reveal className={`race-event-card overflow-hidden border border-chalk/15 shadow-[0_18px_48px_rgb(0_0_0/0.35)] ${className}`}>
      <Image
        src={affiche.src}
        alt={`Affiche officielle : ${op.name} chez MegaKart`}
        width={affiche.width}
        height={affiche.height}
        sizes="(max-width: 767px) 80vw, 320px"
        priority={priority}
        className="block h-auto w-full"
      />
    </figure>
  );
}
