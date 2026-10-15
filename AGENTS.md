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
- 2026-10-13 — Codex : section courses alignée sur le système du hero : grand titre conservé, sous-titre placé dessous sur tous les écrans, largeur et taille de description harmonisées avec le hero. Aperçu en cours ; audit navigation non implémenté, production inchangée.
- 2026-10-13 — Codex : aperçu a707099 Ready (megakart-rklesfca8-paper34.vercel.app), servi sur le domaine de branche partagé. Sous-titre courses vérifié sous le titre, aligné à gauche à 390/1440 px, 20 px desktop comme le hero ; aucun débordement. Aperçu ouvert sur les courses ; production et navigation inchangées.
- 2026-10-13 — Claude reprend la main sur codex/accueil-promo-visible (crédits Codex épuisés). EN COURS : Claude. Pas de fusion sans accord de Benjamin.
- 2026-10-13 — Claude : navigation resserrée (Tarifs · Agenda · Événements[menu] · Photos · Contact + Appeler), sous-menu Événements (Au programme / En groupe), menu mobile défilant avec appel fixe en bas, lien La piste ajouté au footer. Aperçu à valider ; production inchangée.
- 2026-10-13 — Claude : pop-up retravaillé (bandeau gris retiré, CTA sur le fond flouté, croix SVG centrée au-dessus du visuel, style pilule contour). Aperçu à valider.
- 2026-10-13 — Claude : cartes « prochaines dates » en rayon concentrique au CTA pilule (demi-hauteur CTA + padding).
- 2026-10-13 — Claude : pop-up — visuel au même rayon que les cartes courses (classe race-event-card), croix centrée au-dessus. Aperçu 2cr8iwsmh.
- 2026-10-13 — Claude : sous-menu Événements retiré (lien simple), numéro/bouton d appel retiré du header desktop, plan du site complet dans le footer (colonne « Le site »), pop-up : croix et CTA à cheval sur les bords haut/bas du visuel.
- 2026-10-13 — Claude : essai fiches karts « widget Audi » (components/KartWidget.tsx) sur /tarifs uniquement ; KartCard inchangé ailleurs. À valider.
- 2026-10-13 — Claude : accueil — fiches karts en KartWidget non cliquable, visuels Sodi officiels (public/images/sodi, même pose) pour Baby/Enfant/Biplace/390 + référence modèle ; 280cc et 250 RX gardent l ancien visuel (modèle à confirmer par Lucas).
- 2026-10-13 — Claude : visuels Sodi remis à l échelle réelle (longueurs officielles : KidRacer 1457, LR6 1850, RT10 1865, 2Drive 2092 mm).
- 2026-10-13 — Claude : section « Cet automne » — tous les CTA en rouge « S inscrire », « Voir tout l agenda » en contour au-dessus des affiches à droite. Visuels Sodi originaux remis à Benjamin (VISUELS/sodi-officiels) pour recadrage manuel.
- 2026-10-13 — Claude : cartes « Cet automne » — date au format du bandeau promo (jour+mois display, jour de semaine dessous, filet), suppression « Prochain départ / À venir », rareté en label jaune sur l affiche.
- 2026-10-13 — Claude : label rareté « Dernières inscriptions » à cheval sur le haut de la carte. Visuel Higgsfield (GPT Image 2) des 4 karts uniformisés dans VISUELS/sodi-officiels/higgsfield-flotte-uniforme.png, en attente de validation avant découpe.
- 2026-10-13 — Claude : cartes courses à gabarit fixe (titre 2 lignes, sous-titre 2 lignes, tarif, ligne d accompagnement 2 lignes — priceNote sinon 1er fait).
- 2026-10-13 — Claude : visuels karts régénérés via Higgsfield (GPT Image 2, châssis uniformisés, fond blanc) puis détourés (Vision macOS) → public/images/sodi/*.webp ; PNG dans VISUELS/sodi-officiels/uniforme-*.png.
- 2026-10-13 — Claude : home — toute la flotte (7 karts) en carrousel latéral à butées alignées sur la grille ; visuels 280/250RX générés (Higgsfield) ; icônes Instagram/Facebook/TikTok dans le header (TikTok masqué tant que SITE.social.tiktok est vide).
- 2026-10-13 — Claude : carrousel flotte extrait dans components/FleetCarousel.tsx avec flèches précédent/suivant.
- 2026-10-13 — Claude : page /tarifs supprimée (redirection 308 → /#flotte), onglet Tarifs → /#flotte, FAQ déplacée en bas de l accueil (lib/faq.ts + FAQPage JSON-LD), sélecteur minimaliste « Trouve ton kart » (profils d âge en pastilles) sous le carrousel qui recentre et met en avant le kart recommandé.
- 2026-10-13 — Claude : FUSION en production de codex/accueil-promo-visible (accueil refondu). Puis harmonisation des sections suivantes (intros à droite, CTA contour en haut à droite, CTA rouges dans les cartes, arrondis concentriques sur .card et images, FAQ à l échelle des titres) — en ligne. Aucune session en cours.
- 2026-10-14 — Claude : fiches karts resserrées (hauteur calée sur le contenu, plus de min-h ; cartes à hauteur égale via h-full ; âge du Biplace raccourci « Dès 5 ans + 1 adulte » pour tenir sur une ligne) — en ligne. Aucune session en cours.
- 2026-10-14 — Claude : flotte desktop (≥1024) à 3 cartes visibles alignées sur les butées (lg:w calc 76rem/3) au lieu de 38rem — en ligne. Aucune session en cours.
- 2026-10-14 — Claude : « Trouve ton kart » compacté — le CTA laisse place au choix d âge sur la même ligne (mobile : titre + croix, puis 4 pastilles sur une rangée), bouton de fermeture qui remet la flotte à plat, recommandation sur une ligne — en ligne. Aucune session en cours.
- 2026-10-14 — Claude : 100 Tours du 18/10 COMPLET (places: 0 dans lib/agenda.ts → label « Complet » sur l accueil, agenda, page d inscription ; la date sort du formulaire, seule la 6/12 reste). Pop-up : dates complètes ignorées, champ dates (affiche 100 Tours limitée au 18/10), Course Enfant sur l affiche sans date (clé -2026-11) — en ligne. Aucune session en cours.
- 2026-10-14 — Claude : 12 Heures → 9 équipes engagées (placesPrises: 9, 6 places restantes) — en ligne.
- 2026-10-14 — Claude : Trophée Plein Gaz reporté du 1/11 au 15/11 (lib/agenda.ts, llms.txt). 
- 2026-10-14 — Claude : RÈGLE DE DÉPLOIEMENT — ne plus lancer `vercel --prod` depuis le Mac : le dossier est sur iCloud et les fichiers « déchargés » partent vides (images absentes en prod le 14/10). La prod se déploie UNIQUEMENT par `git push origin main` (intégration GitHub → Vercel déjà branchée). Branches = aperçus. Aucune session en cours.
- 2026-10-14 — Claude : hero mobile fluidifié (FX.tsx : pas de scale au doigt, ignoreMobileResize, will-change ; badge sans backdrop-blur sur mobile).
- 2026-10-14 — Claude : fiches karts — badge (Nouveauté/Duo/Compétition) à cheval sur le haut de la carte, comme les cartes de courses.
- 2026-10-14 — Claude : menu mobile — icônes réseaux en pastilles 56 px espacées (SocialIcons size="lg").
- 2026-10-14 — Claude : icônes réseaux du header resserrées (w-9, gap-0) + soulignement rouge animé des onglets (.link-under-icon).
- 2026-10-14 — Claude : hero mobile — sortie du texte en CSS scroll-driven (animation-timeline) au lieu du scrub GSAP au doigt ; parallaxe du fond coupée sur mobile.
- 2026-10-14 — Claude : bandeau photo fin (casques du stand, galerie-25-casques.jpg) entre « Cet automne » et la flotte ; photo ajoutée à /photos.
- 2026-10-14 — Claude : bandeau casques plus haut (176/224/288 px).
- 2026-10-14 — Claude : bandeau casques agrandi (256/320/416 px) + fondu vers la flotte.
- 2026-10-14 — Claude : bandeau accueil → photo pilote RX250 (galerie-26-pilote-rx250.jpg), aussi ajoutée à /photos ; casques restent dans la galerie.
- 2026-10-14 — Claude : section « Un vrai circuit » refaite — vidéo plein cadre (CircuitVideo : reel-4 sur mobile, circuit-paysage.mp4 recadré sur ordinateur), titre grand format, 3 arguments courts avec émojis.
- 2026-10-14 — Claude : « Un vrai circuit » + « 1000 m d'esses » fusionnées en une section ; la vidéo s'efface par masque d'opacité vers le bas, le tracé animé se pose sur la partie assombrie.
- 2026-10-14 — Claude : « Les bons plans » au système titre/sous-titre + « Voir l'agenda » ; 3 offres au gabarit des cartes courses (quand, nom, résumé 3 lignes, prix + note 2 lignes, CTA rouge).
- 2026-10-14 — Claude : flèches précédent/suivant (components/RowArrows.tsx) sur les cartes de courses et les bons plans, affichées seulement si la rangée dépasse de l'écran.
- 2026-10-14 — Claude : bons plans accueil — cartes colorées comme l'agenda (mercredi jaune, 2+1 bleu --color-promo, dimanche blanc), sans CTA ; bouton « Voir les bons plans » → /agenda#bons-plans. Token --color-promo (#2e7cf6) remplace le hex en dur de MonthPlanner.
- 2026-10-14 — Claude : « Les grands jours » au système titre/sous-titre ; émojis 🎂 🥂 🏆 dans les cartes.
- 2026-10-14 — Claude : « Sur la piste, jour et nuit » modernisée — titre/sous-titre/lien, tuiles alignées même hauteur à arrondi concentrique (fin des parallélogrammes, décalages et halo), + photos pilote RX250 et casques.
- 2026-10-14 — Claude : « La pause fraîcheur » au système titre/sous-titre, pastilles arrondies avec émojis (🍦 🧊 🥤 ⛱️), kicker « Le stand » retiré.
- 2026-10-14 — Claude : « La pause fraîcheur » en plein cadre sur la photo de la terrasse (galerie-09), voiles de lecture, pastilles claires ; photo granités retirée de l'accueil.
- 2026-10-14 — Claude : « Ils ont roulé ici » — titre grand format, note + nombre d'avis alignés avec « Lire les avis sur Google » sur la même ligne, cartes sans effet au survol, butées --site-gutter (1er avis plus collé au bord sur mobile).
- 2026-10-14 — Claude : respiration uniforme des sections de l'accueil — tokens --section-y (haut/bas) et --section-gap (en-tête → contenu) dans globals.css, appliqués partout (py-(--section-y), mt-(--section-gap)).
- 2026-10-14 — Claude : essai d'aimantation au scroll (branche claude/scroll-sections) abandonné à la demande de Benjamin, branche supprimée.
- 2026-10-14 — Claude : SYSTÈME DE DESIGN — DESIGN.md + components/system/ (PageHero, SectionHeader, EmojiList, EmojiCards, Faq, CtaFinal, tones.ts) appliqués à toutes les pages sur la branche claude/systeme-pages (aperçu, pas encore en prod).
- 2026-10-14 — Claude : système de design FUSIONNÉ en production (claude/systeme-pages → main), validé par Benjamin. Référence : web/DESIGN.md + components/system/.
- 2026-10-15 — Claude : 100 Tours — rendez-vous 10h, roulage dès 10h15 (lib/agenda.ts : détails + fait ; factEmoji : ⏰ pour « rendez-vous »).
- 2026-10-15 — Claude : agenda revu (tri par prochaine date ouverte, raccourcis de dates, fiches repliables, bons plans en rangée + conditions repliables, calendrier arrondi sans mois passés, affiche masquée sur mobile) + inscription en ligne Trophée Plein Gaz (/inscription/plein-gaz, lib/inscription-plein-gaz.ts, type plein-gaz dans l'API). À confirmer avec Emma : âge/autorisation parentale, heure de RDV, affiche.

- 15/10 (Claude) — Agenda, `MonthPlanner` : onglets mois en grille 2×2 sur mobile ; cases desktop agrandies (numéro text-2xl, libellés text-base/lg, horaires text-base, min-h 7.5rem). Fiche du jour refaite : bandeau à la couleur de la case, jour précédent/suivant (‹ ›, passe d'un mois à l'autre), faits à émojis, boutons pleine largeur au mobile, défilement auto vers la fiche au doigt. `CalendarDay.event.full` (= `places: 0`) → pastille « Complet » ; course passée → « Course terminée » ; ni inscription ni réservation dans ces deux cas.
- 15/10 (Claude) — Règle unique d'ouverture des inscriptions : `datesOuvertes(slug)` / `inscriptionOuverte(slug)` dans `lib/agenda.ts` (confirmée, à venir, `places !== 0`). Utilisée par les 3 pages d'inscription, les helpers serveur (`centToursDates`, `courseEnfantDates`, `pleinGazDates` → la route API refuse désormais une date complète) et les fiches courses de l'agenda (« Inscriptions closes » + téléphone). Bouton « Aller au formulaire » masqué s'il n'y a plus de date ouverte.
- 15/10 (Claude) — Agenda, fiches courses : fin de la quinconce, même disposition pour toutes (texte à gauche, affiche + faits à droite) pour comparer.
- 15/10 (Claude) — Agenda : hero et calendrier fusionnés (PageHero accepte `children`, photo limitée à 80svh fondue derrière). Pastille « Fin d'année 2026 » et bandeau défilant retirés ; en-tête « Le mois en piste » supprimé, lien chrono passé dans la note sous le calendrier.
- 15/10 (Claude) — Agenda : raccourcis de courses retirés du hero ; onglets mois agrandis (text-xl → 2xl) ; légende du calendrier très agrandie (pastilles `Tag large`) et tout ce qui suit la grille centré (légende, consigne, fiche du jour max-w-3xl, note).
- 15/10 (Claude) — Bons plans agenda : « Les conditions » passe du <details> brut à `components/system/DealConditions.tsx` (client) : hauteur animée grid-rows 0fr→1fr 500 ms, lignes en fondu décalé (60 ms), « + » qui pivote, inert quand fermé, coupé en reduced-motion.
- 15/10 (Claude) — Fiche du jour : plus aucun bouton (ni inscription, ni course, ni téléphone), infos seules.
- 15/10 (Claude) — Bons plans : conditions des 3 offres uniformisées sur le gabarit du mercredi (2 paragraphes courts + 4 faits courts) ; 2+1 et Pack Découverte réécrits sans perdre dates, tarifs, progression 390cc → RX250, coaching.
- 15/10 (Claude) — Calendrier : numéro du jour plus entouré (seul le contour de la case marque aujourd'hui) ; légende déplacée entre les onglets et la grille (centrée mobile, alignée à gauche ordinateur).
