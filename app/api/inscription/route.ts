import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE, SITE_URL } from "@/lib/site";
import { getOperation } from "@/lib/agenda";
import { CENT_TOURS_SLUG, centToursDates, parseInscription, teamPricing, type Inscription } from "@/lib/inscription";
import {
  COURSE_ENFANT_SLUG,
  ENFANT,
  ageAu,
  courseEnfantDates,
  parseInscriptionEnfant,
  type InscriptionEnfant,
} from "@/lib/inscription-enfant";

export const runtime = "nodejs";

/**
 * Réception d'une inscription — 100 Tours (équipe) ou Course Enfant (parent
 * + enfants), selon `type`. Deux e-mails partent à chaque fois : la fiche
 * complète au circuit (SITE.email), avec « répondre à » = la personne qui
 * s'inscrit ; un accusé de réception à cette personne, avec « répondre à »
 * = circuit. Rien n'est stocké côté site : la boîte du circuit est la seule copie.
 */
const FROM = process.env.MAIL_FROM ?? `MegaKart <inscriptions@megakart.fr>`;
const TO = process.env.MAIL_TO ?? SITE.email;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const row = (k: string, v: string) =>
  `<tr><td style="padding:8px 12px 8px 0;color:#777;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 0;font-weight:600;color:#111">${esc(v)}</td></tr>`;

const table = (rows: string) =>
  `<table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.4">${rows}</table>`;

/* Le bloc « à faire » en tête de la fiche interne : la balle est dans le camp du circuit. */
const aFaire = (qui: string) =>
  `<div style="margin:0 0 18px;padding:12px 14px;background:#fff1f1;border-left:4px solid #e3051b;font-size:15px;line-height:1.5;color:#111"><strong>À faire :</strong> confirmer la place à ${esc(qui)} — répondre à ce message suffit, il lui écrit directement.</div>`;

const shell = (inner: string) =>
  `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:28px 22px;color:#111">${inner}
  <p style="margin:28px 0 0;font-size:13px;color:#888;line-height:1.5">MegaKart · ${esc(SITE.address.street)}, ${SITE.address.zip} ${SITE.address.city} · ${SITE.phone}<br><a href="${SITE_URL}" style="color:#888">${SITE_URL.replace("https://", "")}</a></p></div>`;

const encart = (inner: string) =>
  `<div style="margin-top:20px;padding:14px 16px;background:#f5f5f3;border-radius:10px;font-size:14px;line-height:1.55;color:#444">${inner}</div>`;

const delai = `Le circuit revient vers vous <strong>sous 48 heures</strong>, par téléphone ou par e-mail, pour confirmer la place. Si quelque chose change d'ici là, répondez simplement à ce message.`;

/* ---------- 100 Tours ---------- */
function recapCentTours(d: Inscription, dateLabel: string) {
  const t = teamPricing(d.teamSize);
  return table(
    row("Course", `Les 100 Tours — ${dateLabel}`) +
      row("Équipe", `${d.team} — ${d.teamSize} pilotes`) +
      row("Tarif", `${t.perPilot}€ par pilote · ${t.total}€ l'équipe`) +
      row("Capitaine", d.captain.name) +
      row("Téléphone", d.captain.phone) +
      row("E-mail", d.captain.email) +
      d.pilots.map((n, i) => row(`${i + 2}e pilote`, n)).join("") +
      (d.experience ? row("Expérience", d.experience) : "") +
      (d.message ? row("Message", d.message) : "")
  );
}

async function envoyerCentTours(resend: Resend, raw: unknown) {
  const dates = centToursDates();
  const parsed = parseInscription(raw, dates.map((d) => d.iso));
  if (!parsed.ok) return { status: 422, body: { ok: false, errors: parsed.errors } };
  const d = parsed.data;
  if (d.website) return { status: 200, body: { ok: true } };
  const op = getOperation(CENT_TOURS_SLUG);
  const dateLabel = dates.find((x) => x.iso === d.date)?.label ?? d.date;
  const t = teamPricing(d.teamSize);

  await resend.emails.send({
    from: FROM, to: TO, replyTo: d.captain.email,
    subject: `Inscription 100 Tours · ${dateLabel} · équipe ${d.team}`,
    html: shell(`<h2 style="margin:0 0 6px;font-size:22px">Nouvelle équipe pour les 100 Tours</h2>
      <p style="margin:0 0 14px;color:#555">Reçue depuis le formulaire du site.</p>
      ${aFaire(d.captain.name)}${recapCentTours(d, dateLabel)}`),
  });
  await resend.emails.send({
    from: FROM, to: d.captain.email, replyTo: TO,
    subject: `Votre équipe est pré-inscrite aux 100 Tours — ${dateLabel}`,
    html: shell(`<h2 style="margin:0 0 6px;font-size:22px">C'est noté, ${esc(d.captain.name)} !</h2>
      <p style="margin:0 0 18px;color:#555;line-height:1.55">Votre équipe <strong>${esc(d.team)}</strong> est pré-inscrite aux 100 Tours du <strong>${esc(dateLabel)}</strong>. ${delai}</p>
      ${recapCentTours(d, dateLabel)}
      ${encart(`<strong style="color:#111">Le format</strong> — ${esc(op?.facts.join(" · ") ?? "")}.<br><strong style="color:#111">Votre tarif</strong> — équipe de ${d.teamSize} : ${t.perPilot}€ par pilote, soit ${t.total}€ l'équipe.`)}`),
  });
  return { status: 200, body: { ok: true } };
}

/* ---------- Course Enfant ---------- */
function recapEnfant(d: InscriptionEnfant, dateLabel: string) {
  const enfants = d.enfants
    .map((e, i) => {
      const age = ageAu(e.naissance, d.date);
      return row(
        d.enfants.length > 1 ? `Enfant ${i + 1}` : "Enfant",
        `${e.prenom} ${e.nom} — ${age} ans (né·e le ${e.naissance.split("-").reverse().join("/")}), ${e.taille} cm${e.habitue ? ", a déjà roulé chez MegaKart" : ", première fois"}`
      );
    })
    .join("");
  return table(
    row("Course", `Course Enfant — ${dateLabel}, début ${ENFANT.debut}`) +
      enfants +
      row("Tarif", `${ENFANT.prix}€ par enfant · ${ENFANT.prix * d.enfants.length}€ au total`) +
      row("Parent", d.parent.name) +
      row("Téléphone", d.parent.phone) +
      row("E-mail", d.parent.email) +
      row("Autorisation", "Le responsable légal a autorisé la participation") +
      (d.message ? row("Message", d.message) : "")
  );
}

async function envoyerEnfant(resend: Resend, raw: unknown) {
  const dates = courseEnfantDates();
  const parsed = parseInscriptionEnfant(raw, dates.map((d) => d.iso));
  if (!parsed.ok) return { status: 422, body: { ok: false, errors: parsed.errors } };
  const d = parsed.data;
  if (d.website) return { status: 200, body: { ok: true } };
  const op = getOperation(COURSE_ENFANT_SLUG);
  const dateLabel = dates.find((x) => x.iso === d.date)?.label ?? d.date;
  const prenoms = d.enfants.map((e) => e.prenom).join(" et ");

  await resend.emails.send({
    from: FROM, to: TO, replyTo: d.parent.email,
    subject: `Inscription Course Enfant · ${dateLabel} · ${prenoms} (${d.enfants.length})`,
    html: shell(`<h2 style="margin:0 0 6px;font-size:22px">Nouvelle inscription à la Course Enfant</h2>
      <p style="margin:0 0 14px;color:#555">Reçue depuis le formulaire du site. Âge et taille ci-dessous sont déclarés par le parent : à vérifier à l'accueil.</p>
      ${aFaire(d.parent.name)}${recapEnfant(d, dateLabel)}`),
  });
  await resend.emails.send({
    from: FROM, to: d.parent.email, replyTo: TO,
    subject: `${prenoms} : pré-inscription à la Course Enfant — ${dateLabel}`,
    html: shell(`<h2 style="margin:0 0 6px;font-size:22px">C'est noté, ${esc(d.parent.name)} !</h2>
      <p style="margin:0 0 18px;color:#555;line-height:1.55"><strong>${esc(prenoms)}</strong> ${d.enfants.length > 1 ? "sont pré-inscrits" : "est pré-inscrit·e"} à la Course Enfant du <strong>${esc(dateLabel)}</strong>. ${delai}</p>
      ${recapEnfant(d, dateLabel)}
      ${encart(`<strong style="color:#111">Le jour J</strong> — rendez-vous à ${ENFANT.debut} au circuit ; casque fourni, baskets obligatoires, vêtements flottants interdits. Prévoir une pièce d'identité de l'enfant : l'âge et la taille sont vérifiés à l'accueil.<br><strong style="color:#111">Le format</strong> — ${esc(op?.facts.join(" · ") ?? "")}.<br><strong style="color:#111">Tarif</strong> — ${ENFANT.prix}€ par enfant, réglé sur place.`)}`),
  });
  return { status: 200, body: { ok: true } };
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "Requête illisible." } }, { status: 400 });
  }
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ ok: false, reason: "mail" }, { status: 503 });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const type = (raw as { type?: string })?.type ?? CENT_TOURS_SLUG;

  try {
    const r = type === COURSE_ENFANT_SLUG ? await envoyerEnfant(resend, raw) : await envoyerCentTours(resend, raw);
    return NextResponse.json(r.body, { status: r.status });
  } catch (err) {
    console.error("[inscription] envoi impossible :", err);
    return NextResponse.json({ ok: false, reason: "mail" }, { status: 502 });
  }
}
