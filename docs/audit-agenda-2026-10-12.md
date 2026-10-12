# Audit interface Agenda — 12 octobre 2026

Périmètre : https://megakart.fr/agenda. Inspection du site déployé, du code et de six références via le connecteur Mobbin. Audit uniquement, sans refonte appliquée. La nouvelle affiche sans date est bien servie sur le déployé.

## Conclusion

L'identité MegaKart est forte et cohérente : titres expressifs, fond sombre, rouge pour l'action, jaune pour les repères. Le menu mobile est lisible, marque la page active et propose un appel. Le frein principal est la hiérarchie : l'utilisateur doit parcourir une page éditoriale longue pour choisir une prochaine course et s'inscrire.

## Priorités

| Priorité | Constat vérifié | Proposition |
|---|---|---|
| P1 | Le premier écran mobile 390 × 844 contient l'introduction et le titre du calendrier, sans prochaine course ni action d'inscription. | Raccourcir l'introduction et afficher les prochaines dates avec un bouton d'inscription dès le début du parcours. |
| P1 | Après sélection du 8 novembre puis passage à décembre, le détail reste « Dimanche 8 novembre ». Reproduit dans le navigateur ; `goTo` ne met pas à jour `selected`. | Au changement de mois, effacer la sélection ou sélectionner un jour de ce mois ; appliquer la même règle au swipe. |
| P1 | Le détail du 8 novembre propose la fiche, le téléphone et l'e-mail, alors que la fiche possède un formulaire en ligne. | Ajouter l'action principale `op.signup` dans le détail du calendrier ; conserver appel et e-mail en actions secondaires. Ne pas préremplir une date sans vérifier les capacités du formulaire. |
| P1 | Sur mobile, les noms des courses sont masqués dans les cases ; le rouge identifie une course sans préciser laquelle. | Proposer une vue « Prochaines dates » par défaut, chronologique, et une vue « Calendrier & horaires » complémentaire. Garder la grille pour savoir quand venir rouler. |
| P2 | Les fiches enchaînent plusieurs paragraphes avant le prix et le bouton, puis l'affiche et des faits qui répètent les textes. | Présenter d'abord date à venir, nom, âge/format, prix, inscription ; placer les détails dans un accordéon. Affiche entière en vignette, sans recadrage. |
| P2 | Les onglets des quatre mois se répartissent sur deux lignes à 390 px ; septembre passé reste en tête. | Afficher le mois actif avec précédent/suivant et accès « Aujourd'hui » ; garder les mois passés accessibles sans les mettre en avant. |
| P2 | Horaires, légendes et badges utilisent `text-xs` (12 px). La case du 8 novembre mesure environ 49,7 × 43,7 px à 390 px et 45,4 × 43,7 px à 360 px. | Garantir une hauteur de 44 px minimum, des horaires à 14 px, des marqueurs compréhensibles sans la couleur. Le problème tactile mesuré est léger ; la lisibilité est plus importante. |
| P2 | Le texte d'introduction annonce des réservations par téléphone ou e-mail ; plusieurs courses se réservent déjà en ligne. | Aligner les consignes avec les actions réellement disponibles selon chaque épreuve. |
| P2 | Desktop : calendrier sur toute la largeur, détail en dessous ; longues fiches alternées ensuite. | Composer le bloc en calendrier + panneau de détail latéral, avec bouton visible ; présenter les prochaines courses dans une grille régulière. Garder les grands titres et les couleurs existantes. |
| P3 | Onglets avec `role=tab` sans panneau associé ni gestion des flèches dans le code ; noms accessibles des jours limités à la date. | Choisir des boutons de navigation simples ou compléter le modèle d'onglets ; annoncer aussi course/fermeture dans le nom accessible du jour. |

## Structure proposée

Mobile : titre « Agenda » + introduction courte → accès Courses / Calendrier & horaires / Bons plans → prochaines dates triées avec filtre Tous / Enfants / Adultes → calendrier complémentaire → offres récurrentes → contact.

Desktop : même ordre de contenu ; prochaines courses en grille, puis calendrier et détail côte à côte. Conserver les tokens existants, les affiches, la typographie et les ancres actuelles. Éviter un filtre ou une recherche complexe pour seulement quatre types de courses.

Les fiches compactes et les filtres sont une proposition de conception ; aucun gain de conversion n'a été mesuré. Les textes longs restent accessibles pour les visiteurs et le référencement.

## Références Mobbin examinées

- [DICE — découverte](https://mobbin.com/screens/c5ef6ad8-7fa5-48a5-b1d8-135abf1dd8c4) : catégories en haut, listes compactes, date sous le nom. À retenir pour comparer plusieurs prochaines courses sans longues fiches.
- [Meetup — événements](https://mobbin.com/screens/4a052d00-a5c0-4131-8ec7-9515629b4d86) : accès temporels visibles et cartes avec titre/date. À retenir pour l'ordre des informations ; éviter ses grandes images qui rallongeraient l'Agenda.
- [Shazam — concerts](https://mobbin.com/screens/2f2d03de-f91d-407b-820e-ea30e28debf9) : sélection de période avec raccourcis. Inspiration pour un accès aux prochaines dates, sans reproduire une interface de recherche surdimensionnée.
- [Calendly — calendrier](https://mobbin.com/screens/2cb71f1d-cd9c-4675-8fd4-1b9dc19ddad5) : liste par dates et détail latéral du rendez-vous sélectionné. Principe pertinent pour le desktop, sans copier son apparence de logiciel métier.
- [Jobber — planning](https://mobbin.com/screens/fb9e93ab-0399-4794-9b61-6db077c2acc6) : regroupement temporel et sélecteur de vue ; référence secondaire, trop dense pour MegaKart.
- [Cal.com — réservations](https://mobbin.com/screens/f2d9ff95-23a4-4827-8233-9d0789e0091c) : liste regroupée par période ; référence secondaire, moins adaptée à une vitrine loisirs.

## Vérifications et limites

- Inspection responsive à 390 × 844, contrôle tactile à 360 × 800, desktop à 1440 × 1000.
- Test des onglets novembre/décembre, sélection du 8 novembre, ouverture du menu mobile.
- Affiche sans date visible sur le site déployé ; source de l'image confirmée dans le DOM. Vercel annonce le déploiement de production `megakart-k38n2rzif-paper34.vercel.app` Ready et associé à megakart.fr. Le lien exact commit/déploiement n'est pas confirmé par le statut GitHub.
- Les animations ont été inspectées avec navigateur visible ; une capture pendant leur entrée ne constitue pas un défaut de contraste permanent.
- Pas de test sur iPhone physique, d'étude utilisateurs, de mesure de conversion, de Lighthouse ni d'envoi réel de formulaire : hors de cet audit de navigation.
- Point de contrôle technique : certains mois hors écran restent présents dans l'arbre d'accessibilité mobile. Vérifier et limiter le parcours clavier au mois actif lors de l'implémentation.

## Suite proposée

Première passe : synchronisation mois/détail, inscription depuis le calendrier, consignes de réservation cohérentes, tailles tactiles et lisibilité. Deuxième passe : liste chronologique, fiches compactes et composition desktop. Valider cette direction avant la refonte.
