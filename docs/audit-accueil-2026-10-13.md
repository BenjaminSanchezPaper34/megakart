# Accueil MegaKart — audit visuel du 13 octobre 2026

Périmètre : page d'accueil déployée sur https://megakart.fr/, priorité mobile. Lecture du code, inspection responsive et références Mobbin. Audit et recommandations uniquement : aucune modification de l'interface ni mise en ligne.

## Diagnostic

La sensation de lecture vient de trois facteurs combinés : des fiches détaillées empilées sur mobile, des gabarits de cartes similaires pour des sujets différents, et des photos de visiteurs concentrées dans la galerie tardive. Le site possède déjà une vidéo de hero, un réel, un tracé illustré, des visuels de karts et de nombreuses photos ; leur répartition doit changer autant que leur nombre.

Le hero est immersif et la palette rouge/jaune/fond sombre porte bien l'identité. La section « La pause fraîcheur » constitue une bonne rupture : fond clair, photos liées au sujet, texte court. Conserver cette direction artistique et faire évoluer le rythme des sections.

## Mesures du déployé

Mesures DOM approximatives après chargement, à 390 × 844 ; la hauteur peut varier selon les polices, contenus et animations.

| Bloc | Hauteur mobile | Observation |
|---|---:|---|
| Chiffres clés | 472 px | Cinq chiffres sur trois rangées, plusieurs informations déjà présentes dans le hero et la bande défilante. |
| Courses d'automne | 1 254 px | Presque 1,5 écran, sans photo dans ce bloc. |
| Flotte | 2 842 px | Environ 3,4 écrans pour quatre fiches détaillées. Les images montrent les machines détourées ; elles ne remplacent pas des scènes de visiteurs en piste. |
| Expérience | 1 487 px | Sur mobile, les trois cartes précèdent le réel (`order-2` pour les cartes, `order-3` pour le média). La vidéo ne coupe donc pas la lecture dès l'entrée du bloc. |
| Bons plans + groupes | 2 237 px | Environ 2,7 écrans de cartes et textes, sans photo ni vidéo dans ces deux sections. |
| Galerie | Début vers 10 009 px | La grande concentration de photos arrive après presque douze hauteurs d'écran depuis le haut de la page. |

À 1440 × 1000, les grilles réduisent l'empilement (flotte autour de 1 072 px), mais les sections courses, flotte, offres et groupes restent proches dans leur grammaire visuelle. Le contraste de fond asphalt/asphalt-2 et les vibreurs apportent des repères limités face à une vraie scène photographique.

## Recommandations par ordre d'impact

### 1. Alléger la flotte, conserver son utilité

Sur l'accueil : photo du kart, nom, âge/condition essentielle, prix et durée, lien vers les tarifs. Réserver moteur, progression, commentaires et conditions détaillées à la page tarifs déjà existante. Ne pas supprimer les conditions essentielles, notamment l'accès au RX après chrono validé.

Mobile : fiches nettement plus courtes, accessibles par défilement vertical. Éviter de rendre le swipe obligatoire pour découvrir une catégorie. Desktop : conserver une grille à quatre entrées, en réduisant le texte. Une photo de pilotage à proximité crée le contraste entre choix de la machine et expérience réelle.

### 2. Transformer les groupes en entrées photographiques

Remplacer les trois cartes de paragraphes par des entrées « Anniversaires », « EVG / EVJF », « Entreprises » comprenant une photo réelle pertinente, un titre, une phrase et un lien propre. Le clic doit appartenir à chaque entrée plutôt qu'à une rangée de boutons dissociée en dessous.

Ne pas étiqueter une photo de famille comme un anniversaire ou un groupe d'entreprise sans confirmation. Aucun cliché de groupe adéquat n'a été validé dans cette passe ; une grande photo d'ambiance commune avec les trois entrées en dessous est une option si les photos spécifiques manquent.

### 3. Faire apparaître l'humain plus tôt

Dans « Un vrai circuit », placer le réel ou une photo d'encadrement avant les trois arguments sur mobile. Réduire ces arguments à trois preuves courtes et garder un lien vers la piste. Sur desktop, conserver la composition en deux colonnes, avec le média clairement visible et moins de cartes emboîtées.

Cela introduit des visages, un geste et une ambiance à mi-parcours, avant les offres. Le plan du circuit répond à un autre besoin et reste accessible via « Explorer le circuit » ; envisager de le réduire ou le déplacer sur la page piste si les deux blocs restent redondants.

### 4. Compacter les courses et les offres

Accueil : une prochaine course mise en avant avec photo d'action ou vignette d'affiche, date, prix, inscription ; les suivantes en lignes courtes. Garder l'Agenda comme destination du programme complet. Ne pas transposer la maquette Agenda rejetée.

Pour les bons plans, jour + nom de l'offre + prix/avantage + lien suffisent généralement. Ne pas ajouter une photo décorative à chaque promotion : une seule scène en piste peut séparer ce bloc du précédent, puis les offres restent faciles à comparer.

### 5. Répartir la galerie, préserver les respirations utiles

Utiliser quelques photos existantes dans les sections concernées et réduire la mosaïque finale en conséquence. Une photo ajoutée doit remplacer une partie du texte, une répétition ou une grande zone vide ; éviter d'intercaler de nouvelles bandes sans rien retirer.

Conserver le bloc clair du stand, les avis et les informations pratiques. Le regroupement des horaires, accès et règlement reste utile ; son accessibilité depuis le haut de page mérite d'être prévue dans une future maquette, sans réactiver les tests de barre mobile écartés.

## Photos existantes examinées

Quatre fichiers ont été ouverts visuellement, au-delà de leurs noms :

- `public/images/galerie-01-kart-adulte.jpg` : pilote adulte en piste, portrait avec beaucoup d'espace autour. Bon pour l'expérience ou une séparation photographique, sous réserve du cadrage mobile.
- `public/images/galerie-02-kart-enfant.jpg` : enfant en kart, paysage. Bon pour une entrée enfants ou famille ; ne pas confondre les conditions de location et celles des courses enfants.
- `public/images/galerie-18-equipe.jpg` : un membre de l'équipe accompagne un jeune pilote dans son kart. Très pertinent pour rendre l'encadrement concret, plutôt qu'ajouter un paragraphe de sécurité.
- `public/images/galerie-22-aerien-crepuscule.jpg` : vue plongeante d'un kart et d'un virage au soleil bas. Bonne scène d'ambiance de piste ; ce n'est pas une vue panoramique complète du circuit.

Réutiliser les vraies photos avant d'envisager une génération. Ne pas suggérer un équipement, un service ou un événement absent des images validées.

## Rythme proposé, sans figer une nouvelle maquette

Hero vidéo → repères pratiques courts → choix du kart simplifié → immersion photo/vidéo + trois preuves → prochaine course et offres compactes → groupes illustrés → stand clair → avis → accès/horaires/contact.

La place de la prochaine course peut rester très haute pendant une campagne importante. L'ordre doit préserver la visite loisir sans réservation et l'inscription aux courses comme deux parcours distincts. Il ne faut pas bouleverser l'accueil avant validation visuelle.

## Références Mobbin

- [KOBU — destination](https://mobbin.com/sites/sections/5dd15202-c09f-4df9-bee1-204a6b3d71af) : une grande photo avec un texte court et un seul lien. Principe utile pour l'immersion, sans copier son esthétique de voyage.
- [Airbnb — expériences](https://mobbin.com/sites/sections/a821109b-aa96-4c84-ad6b-2ead3eb750b2) : une scène humaine occupe une grande partie de la section, le titre et l'action restent séparés de l'image. Principe adapté aux groupes ou à l'encadrement.
- Résultat Wise également examiné, non retenu : article avec photo de destination, moins pertinent pour le parcours de l'accueil MegaKart.

## Limites et suite

Audit visuel de l'accueil, pas audit complet technique, SEO ou légal de l'ensemble du site. Pas de Lighthouse, de test sur iPhone physique ni d'analyse des conversions. Les gains attendus sont des hypothèses de conception, pas des résultats mesurés.

Première passe recommandée : flotte plus courte, groupes illustrés, réel placé avant les preuves sur mobile. Préparer un aperçu limité à ces sections et le comparer au site actuel avant développement. Préserver les tests CTA mis de côté et la maquette Agenda rejetée.
