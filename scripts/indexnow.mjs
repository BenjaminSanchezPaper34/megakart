#!/usr/bin/env node
/**
 * IndexNow — prévient Bing (et donc ChatGPT / Copilot) qu'une ou plusieurs
 * pages ont changé. Google n'utilise pas IndexNow : pour lui, c'est le
 * sitemap + Search Console.
 *
 *   node scripts/indexnow.mjs                 → toutes les URLs du sitemap
 *   node scripts/indexnow.mjs /agenda /tarifs → seulement ces pages
 *
 * La clé est le fichier public/<clé>.txt : IndexNow la relit sur le site
 * pour vérifier qu'on est bien propriétaire du domaine. Ne pas la renommer.
 */
import { readdirSync } from "node:fs";

const HOST = "megakart.fr";
const ORIGIN = `https://${HOST}`;

const key = readdirSync(new URL("../public", import.meta.url))
  .find((f) => /^[0-9a-f]{8,128}\.txt$/.test(f))
  ?.replace(/\.txt$/, "");

if (!key) {
  console.error("Aucune clé IndexNow trouvée dans public/ (fichier <clé>.txt).");
  process.exit(1);
}

const args = process.argv.slice(2);
let urlList;

if (args.length) {
  urlList = args.map((p) => (p.startsWith("http") ? p : `${ORIGIN}${p.startsWith("/") ? p : `/${p}`}`));
} else {
  const xml = await fetch(`${ORIGIN}/sitemap.xml`).then((r) => r.text());
  urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

if (!urlList.length) {
  console.error("Aucune URL à soumettre.");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${key}.txt`,
    urlList,
  }),
});

console.log(`IndexNow → ${res.status} ${res.statusText} · ${urlList.length} URL(s)`);
urlList.forEach((u) => console.log(`  ${u}`));
// 200 et 202 valent tous les deux « accepté ».
process.exit(res.ok ? 0 : 1);
