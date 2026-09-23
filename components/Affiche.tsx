import Image from "next/image";
import type { Operation } from "@/lib/agenda";

/**
 * Affiche officielle d'une épreuve — le visuel réseau social, affiché entier
 * dans un cadre carte. Un seul composant pour la fiche agenda et les pages
 * d'inscription : même cadre, même ombre, même légende partout.
 * Ne rend rien si l'opération n'a pas d'affiche.
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
  if (!op.affiche) return null;
  return (
    <figure data-reveal className={`card overflow-hidden p-2 ${className}`}>
      <Image
        src={op.affiche.src}
        alt={`Affiche officielle : ${op.name} chez MegaKart`}
        width={op.affiche.width}
        height={op.affiche.height}
        sizes="(max-width: 767px) 80vw, 320px"
        priority={priority}
        className="h-auto w-full"
      />
    </figure>
  );
}
