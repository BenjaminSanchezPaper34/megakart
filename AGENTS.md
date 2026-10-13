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
- 2026-10-12 — Codex : accès aux sources et au dépôt local vérifié, consignes de relais et standards Paper34 lus ; megakart.fr répond HTTP 200. Aucun changement du site ni déploiement. Reste : aucune modification demandée, relais prêt.
- 2026-10-12 — Codex : retrait de l'affiche Course Enfant uniquement dans /agenda ; informations et page d'inscription conservées, date du sitemap actualisée. Vérification et mise en ligne en cours.
- 2026-10-12 — Codex : à la demande de Benjamin, remplacement du retrait par l'affiche sans date fournie (course-enfant-sans-date.jpg), partagée entre agenda et inscription. Build local bloqué sur iCloud puis arrêté ; validation confiée au build Vercel. Mise en ligne et contrôle du rendu en cours.
- 2026-10-12 — Codex : affiche sans date vérifiée sur megakart.fr ; production Vercel Ready. Audit mobile/desktop via Mobbin consigné dans docs/audit-agenda-2026-10-12.md. Principaux points : détail du calendrier désynchronisé au changement de mois, inscription en ligne absente de ce détail, parcours mobile trop long. Aucune refonte appliquée ; reste à valider la direction proposée, puis corriger.
- 2026-10-12 — Codex : maquette interactive de l'Agenda préparée dans la conversation (mobile et desktop, filtres et calendrier) pour validation visuelle avant développement. Aucun changement de l'interface du site ; reste à recueillir les retours de Benjamin.
- 2026-10-12 — Benjamin écarte la maquette proposée : conserver l'interface actuelle de l'Agenda, aucune refonte à appliquer. L'affiche sans date reste en ligne. Les recommandations de l'audit ne sont pas validées pour implémentation ; rien à développer à ce stade.
- 2026-10-12 — Claude : test de nouveaux CTA (biseau resserré 44 px + barre mobile Appeler/Itinéraire) sur la branche `test/cta-accueil`, accueil seulement. Benjamin met le sujet de côté : NE PAS fusionner ni appliquer. Proposition détaillée : docs/audit-cta-2026-10-12.md.
- 2026-10-13 — Codex : vérification des accès disponibles (fichiers web en lecture/écriture, GitHub, CLI Vercel, outils Mobbin et Higgsfield). Aucun connecteur Hostinger exposé dans cette session. Aucun changement du site ; tests CTA et refonte Agenda toujours écartés.
- 2026-10-13 — Codex : audit visuel de l'accueil mobile/desktop et références Mobbin, consigné dans docs/audit-accueil-2026-10-13.md. Priorités proposées : alléger les fiches de karts, illustrer les groupes, montrer le réel avant les arguments sur mobile et répartir les photos plus haut. Aucune interface modifiée ni déploiement ; direction à valider visuellement avant développement, tests CTA et maquette Agenda précédents toujours écartés.
- 2026-10-13 — Codex : à la demande de Benjamin, promo intégrée au bas du premier écran de l'accueil, ajout de « 8,5 m de large », « Depuis 1992 » et du nombre de karts au bandeau défilant ; section compteurs supprimée. Aperçu Vercel et vérification responsive en cours ; aucune autre proposition d'audit appliquée.
