import { NextResponse } from "next/server";
import { ajouterContact, type Evenement } from "@/lib/contacts";

export const runtime = "nodejs";

/**
 * Inscription à la newsletter (section de l'accueil et pop-up de repli).
 * Le visiteur choisit ses courses : « adultes » abonne aux topics 100 Tours,
 * Plein Gaz et 12 Heures, « enfants » au topic Courses Enfants. Le contact
 * entre dans le segment « Tous les participants » (lib/contacts.ts).
 */
const ADULTES: Evenement[] = ["100-tours", "plein-gaz", "12-heures"];

export async function POST(req: Request) {
  let raw: { email?: unknown; adultes?: unknown; enfants?: unknown; website?: unknown };
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête illisible." }, { status: 400 });
  }
  // Piège à robots : un humain ne remplit pas ce champ invisible.
  if (typeof raw.website === "string" && raw.website) return NextResponse.json({ ok: true });

  const email = typeof raw.email === "string" ? raw.email.trim().slice(0, 200) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return NextResponse.json({ ok: false, error: "Adresse e-mail invalide." }, { status: 422 });

  const topics: Evenement[] = [
    ...(raw.adultes === true ? ADULTES : []),
    ...(raw.enfants === true ? (["course-enfant"] as Evenement[]) : []),
  ];
  if (topics.length === 0)
    return NextResponse.json({ ok: false, error: "Choisissez au moins un type de course." }, { status: 422 });

  const ok = await ajouterContact(email, "", topics);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ ok: false, error: "Inscription impossible pour le moment, réessayez plus tard." }, { status: 502 });
}
