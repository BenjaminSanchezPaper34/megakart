import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * OG image générée au build : photo drone + logo officiel + accroche.
 * Servie pour les partages WhatsApp / réseaux sur toutes les pages.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "MegaKart — circuit de karting outdoor de 1000 m à Vias-plage, dès 3 ans";

export default async function OpengraphImage() {
  const [photo, logo] = await Promise.all([
    readFile(join(process.cwd(), "public/images/og.jpg")),
    readFile(join(process.cwd(), "public/images/LOGO-MEGAKART.svg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover" }}
          alt=""
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(to top, rgba(11,13,18,0.95) 0%, rgba(11,13,18,0.45) 45%, rgba(11,13,18,0.15) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 52,
            left: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={300} height={147} alt="" />
          <div
            style={{
              marginTop: 22,
              color: "#f4f3ef",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            Circuit outdoor 1000 m · Vias-plage · dès 3 ans · sans réservation
          </div>
        </div>
      </div>
    ),
    size
  );
}
