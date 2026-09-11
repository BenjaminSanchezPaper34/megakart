import { ImageResponse } from "next/og";

/**
 * Icône d'écran d'accueil iOS (180×180). Même damier que app/icon.svg,
 * mais sans coin arrondi : iOS applique son propre masque, et un rayon
 * dans l'image se verrait en double. Fond plein, jamais transparent.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const CHALK = "#f4f3ef";
const RACE = "#e62431";

/* Damier : 3 cases claires en haut, 3 rouges en bas, décalées. */
const CASES = [
  { x: 0, y: 0, c: CHALK },
  { x: 34, y: 34, c: CHALK },
  { x: 68, y: 0, c: CHALK },
  { x: 0, y: 68, c: RACE },
  { x: 34, y: 102, c: RACE },
  { x: 68, y: 68, c: RACE },
];

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#0b0d12",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", position: "relative", width: 102, height: 136 }}>
          {CASES.map((c) => (
            <div
              key={`${c.x}-${c.y}`}
              style={{
                position: "absolute",
                left: c.x,
                top: c.y,
                width: 34,
                height: 34,
                background: c.c,
              }}
            />
          ))}
        </div>
      </div>
    ),
    size
  );
}
