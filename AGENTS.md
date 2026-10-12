# AGENTS.md — site megakart.fr (relais Codex)

Ce fichier sert quand Benjamin bascule sur Codex parce que ses crédits Claude sont épuisés.
**Périmètre : le site web uniquement** (ce dossier `web/`). Pubs Meta, réseaux sociaux, fiche
Google, e-mails, rapports : c'est Claude qui s'en charge — ne pas y toucher.

Standards du studio Paper34 (design, mobile, SEO, conformité) : `../../../CLAUDE.md`.
Les respecter comme s'ils étaient écrits ici.

## Le projet

- Karting MegaKart, Vias-plage (Hérault). Client : Lucas Paina (gérant). Studio : Paper34 (Benjamin).
- Next.js 15 (App Router), Tailwind v4, TypeScript. Textes du site en français.
- Repo GitHub `BenjaminSanchezPaper34/megakart`, branche `main` = production.
- Vercel : projet `megakart`, équipe `paper34`, domaine **megakart.fr**.

## Où sont les choses (le site est piloté par des données)

| Besoin | Fichier |
|---|---|
| Courses, dates, places restantes, badges, agenda | `lib/agenda.ts` (`RACES`, `AGENDA`, champs `places`, `badge`) |
| Horaires, fermetures, ouvertures exceptionnelles | `lib/hours.ts` (+ `isOpen` dans `lib/agenda.ts`) |
| Les 12 Heures (date, tarif, places prises…) | `lib/inscription-12h.ts` (`DOUZE_H`) |
| Pop-up d'annonce des événements | `lib/popup.ts` (`CAMPAGNES`) |
| Frise « Les courses en photos » (/photos) | `lib/souvenirs.ts` |
| Nom, adresse, téléphone, réseaux | `lib/site.ts` |
| Données structurées (JSON-LD) | `lib/jsonld.ts` |
| Résumé pour les IA | `public/llms.txt` — à garder cohérent avec le site |
| Plan du site | `app/sitemap.ts` (mettre `LASTMOD` à la date du jour si contenu modifié) |

Formulaires d'inscription : `components/Inscription*.tsx` → `app/api/inscription/route.ts`
(e-mails Resend vers contact@megakart.fr ; clé uniquement sur Vercel, ne jamais la chercher ni l'écrire).

## Mettre en ligne

1. `git add -A && git commit -m "…"` puis `git push origin main` → Vercel déploie tout seul.
2. Si aucun déploiement n'apparaît après 2-3 min (déjà arrivé) : `npx vercel@latest --prod --yes`.
3. Vérifier sur **megakart.fr** (pas seulement en local). Attention : interroger le site en boucle
   avec `curl` déclenche la protection anti-robots Vercel (page « Security Checkpoint ») — c'est
   normal, ça ne gêne pas les visiteurs ; espacer les vérifications.

## Pièges connus (le dossier est sur iCloud)

- `npx tsc --noEmit` peut être très lent ou bloquer : le build Vercel vérifie aussi les types.
- iCloud crée parfois des doublons dans `.git` (`refs/heads/main 2`, `index 2`) qui cassent
  `git pull` (« bad object ») : les supprimer (`find .git -name "* 2*" -delete`).
- `.git/index.lock` orphelin : le supprimer si aucun autre git ne tourne.

## Règles

- Ne jamais inventer une info client (tarif, horaire, date, nom) : si ce n'est pas donné par
  Benjamin, le signaler au lieu de deviner.
- Couleurs, rayons, espacements : uniquement les tokens existants (`app/globals.css`), pas de hex en dur.
- Mobile d'abord (la majorité des visiteurs), textes ≥ 14 px, cibles tactiles ≥ 44 px.
- Pas de nouveau script tiers, cookie ou traceur sans accord (le site est sans bandeau cookies).

## Journal de relais (obligatoire)

À chaque session Codex, ajouter une ligne ici : date, ce qui a été fait, ce qui reste.
Claude relit ce journal en reprenant la main.

- 2026-10-12 — Création du fichier (Claude). État : site à jour, rien en cours côté site.
