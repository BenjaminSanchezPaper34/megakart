import { existsSync } from "node:fs";
import { join } from "node:path";
import EventPopup from "@/components/EventPopup";
import NewsletterPopup from "@/components/NewsletterPopup";
import { campagnesDuJour } from "@/lib/popup";

/**
 * Garde-fou au build : le pop-up n'existe que si ses deux visuels sont
 * réellement dans `public/`. Tant que le graphiste ne les a pas déposés,
 * rien n'est envoyé au navigateur — pas de cadre vide ni d'image cassée.
 * Le jour où les fichiers arrivent, le pop-up s'allume au déploiement
 * suivant, sans une ligne de code à changer.
 *
 * Aucune course en campagne : le pop-up propose la newsletter à la place
 * (choix Benjamin 21/10).
 */
export default function EventPopupAnnonce() {
  // Au build, `public/` est sur le disque et on vérifie les visuels. Lors d'une régénération
  // en ligne (pages à revalidate), le dossier est absent du serveur : on fait alors confiance
  // à la liste, déjà vérifiée au build, sinon le pop-up retombait sur la newsletter.
  const racine = join(process.cwd(), "public");
  const verifiable = existsSync(racine);
  const present = (p: string) => !verifiable || existsSync(join(racine, p));
  const campagnes = campagnesDuJour(new Date().toLocaleDateString("fr-CA")).filter(
    (c) => present(c.wide) && present(c.tall)
  );
  if (campagnes.length === 0) return <NewsletterPopup />;

  return <EventPopup campagnes={campagnes} />;
}
