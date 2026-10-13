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
- 2026-10-13 — Codex : reprise après interruption, changements enregistrés sur codex/accueil-promo-visible (78a373f). Aperçu Vercel Ready : megakart-itcxxcmjw-paper34.vercel.app, ouvert dans le navigateur intégré via un lien de partage temporaire de 24 h. Promo vérifiée dans le premier écran sur mobile et desktop ; compteurs retirés, informations présentes dans le bandeau. Production/main inchangés ; reste à recueillir le retour visuel de Benjamin avant mise en production. Pour éviter les lenteurs iCloud, aperçu créé via `vercel api /v13/deployments` avec gitSource GitHub, sans upload local.
- 2026-10-13 — Benjamin valide le hero/promo et demande un essai de CTA en pilule sur tout le site. Codex : tokens CTA centralisés (hauteur 56 px, typographie Archivo droite 14 px, rayon pilule), variantes rouge/contour/jaune cohérentes ; tailles locales et lueurs retirées des CTA, CTA du bandeau promo harmonisé. Vérification responsive et aperçu en cours sur codex/accueil-promo-visible ; ancien test/cta-accueil non fusionné, production inchangée.
- 2026-10-13 — Codex : essai des CTA pilule déployé en aperçu Ready (231036e), megakart-3op2lghwg-paper34.vercel.app. Contrôle mobile/desktop de l'accueil, navigation à 1024 px et formulaire enfant : CTA à 56 px, texte 14 px, aucun clip-path ni débordement horizontal ; aucun formulaire envoyé. Lien temporaire 24 h pour l'aperçu intégré. Production inchangée, reste à recueillir le retour de Benjamin sur les CTA.
- 2026-10-13 — Codex : à la demande de Benjamin, texte des CTA renforcé (Archivo 700), contour secondaire plus lisible, rouge légèrement approfondi avec les tokens existants pour le contraste, focus clavier renforcé, interactions courtes au pointeur et à la pression, respect de la réduction des animations. Hauteur commune 56 px conservée ; nouvel aperçu en cours, production inchangée.
- 2026-10-13 — Codex : aperçu CTA renforcés Ready (12d7d47), megakart-16cqndvvf-paper34.vercel.app, ouvert dans le navigateur intégré. Gras 700, hauteur 56 px et focus clavier 3 px vérifiés ; promo toujours visible au premier écran. Production inchangée ; reste à recueillir le retour de Benjamin avant fusion de codex/accueil-promo-visible.

- 2026-10-13 — Codex : bandeau promo réorganisé à la demande de Benjamin : date en repère calendrier agrandi à gauche, titre et avantage à droite, retrait de l'étiquette empilée et du titre tronqué. Aperçu et contrôles mobile/desktop en cours ; production inchangée.
- 2026-10-13 — Codex : bandeau promo vérifié sur aperçu Ready 64b405c (megakart-cyw0o4m7u-paper34.vercel.app) : date 36 px mobile / 48 px desktop, affichage côte à côte, aucun débordement à 320/390/1440 px ; bas de promo aligné sur le premier écran, aucune erreur console. Aperçu ouvert pour validation ; production inchangée.
- 2026-10-13 — Codex : alignement de la hauteur du bloc date sur le bloc titre/sous-titre du bandeau promo, chiffres recalibrés et étirement commun adaptatif. Vérification en aperçu en cours ; production inchangée.
- 2026-10-13 — Codex : aperçu 85ab77c Ready (megakart-eugkn81q5-paper34.vercel.app), ouvert dans le navigateur intégré. Hauteurs des blocs date/offre mesurées identiques : 47,25 px à 390 px, 62,5 px à 1440 px ; aucun débordement ni erreur console, bandeau au bas du premier écran. Production inchangée, retour visuel de Benjamin attendu.
- 2026-10-13 — Codex : correction après retour visuel de Benjamin : jour et mois réunis avec la typographie display du site, jour de semaine en sous-titre ; mêmes styles et espacements que titre/accroche de l'offre, pour aligner le texte et pas seulement les conteneurs. Aperçu en cours ; production inchangée.
- 2026-10-13 — Codex : aperçu 4c68df5 Ready (megakart-5sippslll-paper34.vercel.app) ouvert. Vérification des lignes de texte : date et offre ont exactement les mêmes positions verticales et hauteurs à 390 px (22,08 + 19,25 px) et 1280 px (27,59 + 26 px). Mois et numéro utilisent ensemble la police display ; aucun débordement ni erreur console. Production inchangée.
- 2026-10-13 — Codex : à la demande de Benjamin, section courses de l'accueil retravaillée en bento inspiré des cartes Chiringuito, avec affiches entières/photos existantes, date/tarif/CTA lisibles et une carte par épreuve. Affiche datée 100 Tours réservée au 18 octobre ; futures dates conservées dans l'agenda. Aperçu et contrôles en cours, production inchangée.
- 2026-10-13 — Codex : bento courses déployé en aperçu Ready dff0efb (megakart-3y9jf2nnt-paper34.vercel.app/#courses-accueil). Rendu contrôlé à 320/390/1440 px, quatre cartes uniques et visuels chargés, boutons 56 px sans débordement, liens vers les inscriptions/détails existants, aucune erreur console. Captures mobile/desktop enregistrées ; aperçu ouvert sur la section, production inchangée. Reste : retour de Benjamin avant éventuelle mise en production.
- 2026-10-13 — Codex : à la demande de Benjamin, cadres photo des courses fixés au ratio portrait 3:4 des affiches (sans étirement ni bandes), bento rééquilibré en colonnes 5/7 ; titre de section aligné sur le clamp typographique du hero. Contrôle de l'aperçu en cours ; production inchangée.
- 2026-10-13 — Codex : aperçu 7786450 Ready (megakart-ht5eynwc3-paper34.vercel.app/#courses-accueil), affiches et cadres mesurés au ratio 0,75 sur mobile/desktop. Titre courses et h1 identiques : 48 px à 320/390 px, 120 px à 1440 px ; aucun débordement ni erreur console. Aperçu mobile ouvert sur la section ; production inchangée, retour de Benjamin attendu.
- 2026-10-13 — Codex : repère du hero réparti en deux lignes sur mobile (« Vias-plage · Hérault » puis « Entre Fabrikus & Europark Indoor »), ligne unique conservée dès tablette/desktop. Aperçu en cours ; production inchangée.
- 2026-10-13 — Codex : aperçu 6f8e558 Ready, repère du hero vérifié sur deux lignes à 390 px et une seule à 1440 px. Lien de partage du domaine de branche utilisé après redirection connexion sur l'URL de déploiement : megakart-git-codex-accueil-promo-visible-paper34.vercel.app. Pour le partage, résoudre l'UID réel de l'alias via GET /v4/aliases/<domaine>, puis PATCH /aliases/<uid>/protection-bypass. Aperçu mobile ouvert sur le hero ; production inchangée.
- 2026-10-13 — Codex : CTA agrandis à la demande de Benjamin : texte 16 px au lieu de 14, icônes 20 px, marges latérales réduites et largeur minimale 144 px pour limiter le vide ; hauteur commune 56 px conservée. Aperçu et vérification mobile en cours ; production inchangée.
- 2026-10-13 — Codex : aperçu CTA 69c3588 Ready (megakart-99m0rg6y9-paper34.vercel.app), servi sur le domaine de branche partagé déjà ouvert. Texte 16 px et hauteur 56 px vérifiés ; aucun débordement de bouton/page à 320 px, navigation vérifiée à 1024 px, rendu à 390 px, aucune erreur console. Production inchangée.
- 2026-10-13 — Codex : à la demande de Benjamin (référence cartes partenaires Chiringuito), courses présentées en quatre cartes portrait uniformes côte à côte sur desktop, défilement horizontal natif avec aperçu de la carte suivante sur mobile. Format image 3:4, titre taille hero et CTA 16 px conservés. Aperçu en cours ; production inchangée.
- 2026-10-13 — Codex : aperçu cartes uniformes 430912b Ready (megakart-l75x6hs70-paper34.vercel.app), actualisé sur le domaine de branche partagé. À 1440 px : quatre cartes côte à côte, mêmes dimensions 289 × 694,76 px et boutons alignés ; à 390 px : défilement horizontal natif, carte suivante visible, navigation clavier vers les cartes testée (scroll horizontal 601 px puis retour à 0), aucun débordement de page ni erreur console. Aperçu ouvert sur la section ; production inchangée.
- 2026-10-13 — Codex : audit navigation demandé par Benjamin consigné dans docs/audit-navigation-2026-10-13.md. Retours à la ligne confirmés à 1024 px ; appel mobile partiellement hors écran à 375×667. Proposition : Tarifs / Événements / Photos / Contact, courses-promos et groupes dans Événements ; La piste reste accessible depuis l'accueil. Aucun changement d'interface ni déploiement ; direction à valider.
