import Link from "next/link";

/**
 * Cartes à émoji du système (modèle « Les grands jours ») : émoji à cheval sur
 * le bord du haut, centré ; titre centré ; texte ; bouton rouge facultatif.
 */
export type EmojiCard = { emoji: string; title: string; text: string; href?: string; cta?: string };

export default function EmojiCards({
  items,
  cols = 3,
  className = "",
}: {
  items: EmojiCard[];
  cols?: 3 | 4;
  className?: string;
}) {
  return (
    <div data-stagger className={`mt-(--section-gap) grid gap-x-5 gap-y-12 pt-6 ${cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"} ${className}`}>
      {items.map((e) => (
        <article key={e.title} className="card relative flex flex-col p-5 pt-12 sm:p-6 sm:pt-12">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-5xl leading-none drop-shadow-[0_6px_10px_rgb(0_0_0/0.5)]"
          >
            {e.emoji}
          </span>
          <h3 className="display text-center text-3xl leading-tight text-chalk">{e.title}</h3>
          <p className="mt-3 flex-1 text-base leading-relaxed text-chalk-60">{e.text}</p>
          {e.href && (
            <Link href={e.href} className="btn btn-race mt-6 w-full">
              {e.cta ?? "En savoir plus"}
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
