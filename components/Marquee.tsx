/**
 * Bandeau défilant façon panneau de course.
 * items dupliqués 2× pour une boucle CSS parfaite (translateX(-50%)).
 */
export default function Marquee({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const sequence = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden border-y border-white/10 bg-asphalt-2/80 py-3 ${className}`}
      aria-hidden="true"
    >
      <div className="marquee-track items-center gap-8 pr-8">
        {sequence.map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span
              className="display text-lg text-chalk-60"
              style={{ fontStyle: "italic" }}
            >
              {item}
            </span>
            <span className="checker-sm inline-block h-4 w-4 opacity-40" />
          </span>
        ))}
      </div>
    </div>
  );
}
