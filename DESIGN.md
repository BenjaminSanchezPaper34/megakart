# DESIGN.md — MegaKart (megakart.fr)

Système tiré de la refonte de l'accueil validée par Benjamin le 14/10/2026, puis appliqué à toutes les pages (mis à jour le 15/10 : parcours d'inscription, galeries, logos animés).
Référence pour toute évolution (Claude comme Codex). Les briques vivent dans `components/system/`.

## 0. Message

- **Pour qui** : familles en vacances à Vias-plage, ados et adultes qui veulent piloter, groupes (anniversaires, EVG, entreprises), habitués des courses.
- **Problème** : savoir vite quel kart, quel prix, quand c'est ouvert, quelle course arrive.
- **Promesse** : « 1000 mètres, plein gaz. » Un vrai circuit, pas un manège, sans réservation.

## 1. Couleurs (`app/globals.css`, `@theme`)

| Nom | Hex | Variable | Rôle |
|---|---|---|---|
| Asphalte | `#0b0d12` | `--color-asphalt` | fond de page, voiles de lecture, fondus de photo |
| Asphalte 2 | `#12151d` | `--color-asphalt-2` | une section sur deux (rythme sombre / plus sombre) |
| Asphalte 3 | `#1a1e28` | `--color-asphalt-3` | fonds de cartes secondaires |
| Craie | `#f4f3ef` | `--color-chalk` | texte principal, section claire (« La pause fraîcheur »), carte du dimanche |
| Craie 60 | `#b9b8b2` | `--color-chalk-60` | texte secondaire seulement (jamais pour un sous-titre de section) |
| Rouge course | `#e3051b` | `--color-race` | l'action : boutons pleins, 2e ligne des titres, « Complet » |
| Jaune drapeau | `#fbba00` | `--color-flag` | labels (pastilles), 2e ligne de titre alternative, mercredi à volonté |
| Bleu bon plan | `#2e7cf6` | `--color-promo` | uniquement « 2 tickets = 1 offert » (calendrier + cartes) |

Un hex dans un composant = un bug : passer par ces tokens.

## 2. Typographie

- **Display** (Saira, italique capitales via `.display`) : titres, prix, chiffres.
- **Texte** (Archivo) : tout le reste, 16 px minimum, sous-titres 16 → 20 px.
- **Titre de section** : `TITLE_XL` = `clamp(3rem, 9vw, 7.5rem)`, deux lignes, la seconde en accent
  (`race`, `flag` ou `outline`). Toujours via `<SectionHeader>`.
- **Titre de bloc** dans une section (nom d'une course, d'une offre) : `clamp(2.6rem, 6vw, 4.75rem)`.
- **Titre de carte** : `text-3xl`, centré.

## 3. Matière

- **Respiration** : `--section-y` (haut/bas de section, 80 → 144 px) et `--section-gap` (en-tête → contenu, 40 → 72 px).
  Toute section : `py-(--section-y)` ; tout contenu après un en-tête : `mt-(--section-gap)`.
- **Gouttière** : `--site-gutter` (rangées qui défilent alignées sur la grille).
- **Rayons** : concentriques au bouton pilule — `.race-event-card` / `.card` = `calc(var(--cta-height)/2 + 1rem)`.
  Labels et dates : `rounded-full`. Exception assumée : la bande photos est à angles droits, bord à bord.
- **Boutons** : `.btn-race` (plein rouge, l'action) et `.btn-ghost` (contour) ; un seul bouton plein par bloc.
- **Émojis** : une seule taille, `text-5xl` (48 px). Listes : `<EmojiList>`. Cartes : `<EmojiCards>` (émoji à cheval sur
  le bord haut, sans cercle). Les « faits » des opérations reçoivent leur émoji via `factEmoji()` (`components/system/tones.ts`).
- **Photos plein cadre** : voile `asphalt` + dégradé de lecture, bas fondu par **masque d'opacité** (`mask-image`),
  jamais un calque de couleur (sinon ligne de raccord). Voir `PageHero`, bandeau pilote, vidéo du circuit.
- **Séparateur** : `.kerb` (bordure rouge et blanche) entre deux grandes parties.

## 4. Composants (`components/system/`)

| Composant | Usage |
|---|---|
| `PageHero` | ouverture de chaque page : photo plein cadre fondue, label pastille, h1 deux lignes, sous-titre, actions (`short` pour les pages utilitaires) |
| `SectionHeader` | en-tête de toute section : titre deux lignes, puis sous-titre + action/flèches sur une ligne |
| `EmojiList` | arguments à émojis (colonne, ligne, grille) |
| `EmojiCards` | cartes 3 ou 4 colonnes avec émoji à cheval sur le haut |
| `Faq` | FAQ dépliable standard |
| `CtaFinal` | appel final centré en bas de page |
| `tones.ts` | `dealSkin` (couleurs des bons plans), `LABEL_TONE`, `factEmoji` |
| `RowArrows` (`components/`) | flèches précédent/suivant, visibles seulement si la rangée dépasse |
| `PageCourse` | page d'une course : formulaire en tête (pleine largeur), puis « Tout savoir » |
| `CoursesAVenir` (`components/`) | « Cet automne, on court » : une carte par date (affiche/photo + essentiel + inscription), bande pleine largeur comme les karts — identique accueil/agenda |
| `BonsPlans`, `DealCard`, `DealConditions` | section bons plans identique accueil/agenda, conditions dépliables animées |
| `Faq` / `FaqItem` | FAQ en 2 colonnes, même dépliage animé que les bons plans |
| `LogoAnime`, `LogoAnimeEmpile` (`components/`) | logos animés en 3 blocs (MEGA, KART, damier), en-tête au chargement, pied de page à l'entrée à l'écran |
| `components/galerie/` | galeries photos publiques des événements (R2, téléchargement original), listées sur /photos |

## 5. Animation

- Reveals GSAP (`data-reveal`, `data-stagger`) ; hero : parallaxe au scroll sur ordinateur, sortie du texte en CSS
  `animation-timeline` sur mobile (jamais de scrub JS au doigt).
- Défilements continus (bande photos) : `translate3d` en position flottante, jamais `scrollLeft` (Safari vibre).
- Pas d'aimantation ni de contrôle du scroll (essayé et abandonné le 14/10).
- `prefers-reduced-motion` : tout s'arrête, le contenu reste lisible.

## 6. Interdits

- Titres de section « à la main » ou à une autre échelle que `TITLE_XL`.
- Coupes en parallélogramme, décalages en escalier, halos décoratifs (version datée retirée le 14/10).
- Sous-titres en `chalk-60`, texte < 16 px hors mentions.
- Calque de couleur pour fondre une photo dans le fond (utiliser un masque).
- Effet de survol qui déplace une carte d'avis ; cartes karts cliquables.
- Déployer depuis le Mac (`vercel --prod`) : la prod part de GitHub (`git push origin main`).
- Pastilles jaunes de label en haut des pages et des sections (retirées partout le 15/10) ; étiquettes à cheval sur les cartes de courses.
- Boutons téléphone répétés dans les cartes et fiches (le numéro vit dans le pied de page et l'appel final).
- Formulaire caché en bas de page : sur une page de course, il vient juste après le titre.
