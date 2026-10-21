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
  const present = (p: string) => existsSync(join(process.cwd(), "public", p));
  const campagnes = campagnesDuJour(new Date().toISOString().slice(0, 10)).filter(
    (c) => present(c.wide) && present(c.tall)
  );
  if (campagnes.length === 0) return <NewsletterPopup />;

  return <EventPopup campagnes={campagnes} />;
}
