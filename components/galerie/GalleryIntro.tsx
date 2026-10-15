/**
 * Rend un texte d'intro de galerie : retours à la ligne préservés et
 * @mentions transformées en liens cliquables vers Instagram.
 * Server component (aucune interactivité au-delà des liens).
 */

const MENTION = /(@[a-zA-Z0-9._]+)/g;

function renderLine(line: string) {
  return line.split(MENTION).map((part, i) => {
    if (part.startsWith("@")) {
      return (
        <a
          key={i}
          href={`https://www.instagram.com/${part.slice(1)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-race hover:underline font-medium"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function GalleryIntro({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  return (
    <div className="mt-5 max-w-2xl text-base leading-relaxed text-chalk md:text-lg">
      {lines.map((line, i) =>
        line.trim() === "" ? (
          <div key={i} className="h-3" aria-hidden="true" />
        ) : (
          <p key={i}>{renderLine(line)}</p>
        )
      )}
    </div>
  );
}
