# Visuels du pop-up « événement à venir »

Deux fichiers par campagne, exportés des gabarits InDesign du dossier client.
Le site n'en recadre aucun : ce qui est lisible sur le réseau social l'est ici.

| Fichier | Gabarit InDesign | Dimensions | Vu par |
|---|---|---|---|
| `100-tours-couverture.jpg` | `COUVERTURE-1250x462-MEGAKART.indd` | 1250 × 462 | ordinateur |
| `100-tours-post.jpg` | `POST-1080x1440-MEGAKART.indd` | 1080 × 1440 | mobile |
| `course-enfant-post.jpg` | `POST-1080x1440-MEGAKART.indd` | 1080 × 1440 | ordinateur **et** mobile |

Une campagne peut n'avoir qu'un visuel portrait (Course Enfant) : on le
déclare pour les deux écrans avec ses dimensions dans `formats`, et sur
ordinateur la boîte se resserre pour tenir dans la hauteur de l'écran.
Quand plusieurs campagnes ont une date à venir, c'est la plus proche qui
s'affiche ; la suivante prend le relais le jour de la course.

JPEG qualité 80, sRGB, moins de 300 Ko chacun.

**Tant que les deux fichiers ne sont pas là, le pop-up ne s'affiche pas** —
le composant serveur vérifie leur présence au build. Rien à activer : ils
arrivent, le déploiement suivant les montre.

Le texte doit tenir **loin des bords** : le visuel est affiché entier, mais
sur un petit écran les 30 derniers pixels se lisent mal.

Pour une autre course : ajouter une entrée dans `lib/popup.ts` (slug de
l'opération, destination du clic, chemins des deux visuels, nouvelle clé de
mémorisation) et déposer les fichiers ici.
