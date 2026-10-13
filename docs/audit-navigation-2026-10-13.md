# Audit de navigation — 13 octobre 2026

Périmètre : navigation de l'aperçu de l'accueil, sans changement de l'interface. Référence examinée : version 430912b, domaine de branche partagé.

## Constats vérifiés

- À 1024 × 768, les liens « Karts & tarifs » et « La piste » occupent deux lignes. Sept entrées, le logo et le bouton téléphone se disputent la largeur disponible dès le breakpoint desktop de 1024 px.
- À cette largeur, le menu utilise une police de 13,6 px et les liens simples mesurent environ 16 px de haut : texte inférieur au minimum 14 px et surfaces à agrandir à 44 px minimum.
- À 375 × 667, le menu mobile contient huit entrées avec Accueil, puis les horaires et l'appel. Le bouton d'appel finit à 701 px, hors du viewport de 667 px ; la surface du menu n'a pas de défilement vertical propre.
- La page /evenements concerne actuellement les groupes, avec la mention globale « Uniquement sur réservation ». Elle ne peut pas servir telle quelle de page d'entrée aux promos sans réservation.

## Navigation recommandée

**Logo (Accueil) · Tarifs · Événements · Photos · Contact · Appeler**

| Entrée | Destination ou contenu |
|---|---|
| Tarifs | /tarifs : choix des karts et tarifs, sans séparer ces informations |
| Événements | Page d'entrée /evenements réorganisée et menu de catégories ci-dessous |
| Photos | /photos |
| Contact | /contact : accès, horaires et coordonnées |
| Appeler | Téléphone existant, CTA distinct |

Sous « Événements », deux groupes courts et explicites :

- **Au programme** : Courses & calendrier → /agenda ; Promos & bons plans → les offres existantes de /agenda.
- **En groupe** : Anniversaires → /anniversaires ; EVG & EVJF → /evenements#evg-evjf ; Entreprises & CE → /evenements#entreprise.

L'Agenda reste accessible directement dans ce sous-menu et depuis les cartes de l'accueil. « La piste » quitte uniquement la navigation principale : /la-piste reste accessible depuis le hero, la section circuit et le footer. Aucune page supprimée ni URL changée.

## Ergonomie à appliquer après validation

1. Quatre entrées principales, texte 16 px lisible, libellés sans retour à la ligne. Réduire le nombre d'entrées plutôt que la taille des lettres.
2. Événements s'ouvre au clic, au clavier et au toucher ; aucune dépendance au survol. Un lien « Tous les événements » mène à la page d'entrée. Échap ferme le menu et le focus revient au déclencheur.
3. Sur mobile : liste courte, Événements en accordéon, zone de contenu défilante et appel toujours accessible, prise en compte de la safe area. Ne pas ajouter huit liens au même niveau.
4. Réorganiser /evenements en deux ensembles visuels : rendez-vous et bons plans, puis groupes privés. Déplacer « Uniquement sur réservation » dans le seul ensemble des groupes ; distinguer l'inscription aux courses des promos sans réservation.
5. Vérifier 320/375/390 px, 1024/1280/1440 px, ouverture et fermeture au clavier, destinations des liens et zoom navigateur. Le changement de texte du CTA hero « Karts & tarifs » n'est pas nécessaire pour résoudre la navigation ; « Voir les tarifs » peut être retenu séparément.

## État

Audit terminé. Proposition à valider avant développement ; aucun menu ni contenu du site modifié, aucun déploiement requis.
