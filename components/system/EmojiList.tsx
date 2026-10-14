/**
 * Liste d'arguments à émojis du système MegaKart : émoji à 3rem (taille unique
 * sur tout le site), texte aligné sur son centre. `layout="row"` : une ligne sur
 * ordinateur, deux colonnes en dessous de 1024 px.
 */
export type EmojiItem = { emoji: string; text: React.ReactNode };

export default function EmojiList({
  items,
  layout = "column",
  tone = "dark",
  className = "",
}: {
  items: EmojiItem[];
  layout?: "column" | "row" | "grid";
  tone?: "dark" | "light";
  className?: string;
}) {
  const ink = tone === "light" ? "text-asphalt" : "text-chalk";
  const wrap =
    layout === "row"
      ? "grid grid-cols-2 gap-x-6 gap-y-4 lg:flex lg:flex-wrap lg:gap-x-8"
      : layout === "grid"
        ? "grid gap-5 sm:grid-cols-2"
        : "grid max-w-xl gap-5";
  return (
    <ul data-stagger className={`${wrap} ${ink} ${className}`}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-4 text-lg leading-snug md:text-xl">
          <span aria-hidden="true" className="w-14 shrink-0 text-center text-5xl leading-none">
            {it.emoji}
          </span>
          <span>{it.text}</span>
        </li>
      ))}
    </ul>
  );
}
