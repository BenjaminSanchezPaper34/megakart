import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE, SITE_URL } from "@/lib/site";
import { getOperation } from "@/lib/agenda";
import { CENT_TOURS_SLUG, centToursDates, parseInscription, type Inscription } from "@/lib/inscription";

export const runtime = "nodejs";

/**
 * Réception d'une inscription aux 100 Tours. Deux e-mails partent :
 *  - la fiche complète au circuit (SITE.email), avec « répondre à » = capitaine ;
 *  - un accusé de réception au capitaine, avec « répondre à » = circuit.
 * Rien n'est stocké côté site : la boîte du circuit est la seule copie.
 */
const FROM = process.env.MAIL_FROM ?? `MegaKart <inscriptions@megakart.fr>`;
const TO = process.env.MAIL_TO ?? SITE.email;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const row = (k: string, v: string) =>
  `<tr><td style="padding:8px 12px 8px 0;color:#777;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 0;font-weight:600;color:#111">${esc(v)}</td></tr>`;

function recapTable(d: Inscription, dateLabel: string) {
  return `<table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.4">
    ${row("Course", `Les 100 Tours — ${dateLabel}`)}
    ${row("Équipe", d.team)}
    ${row("Capitaine", d.captain.name)}
    ${row("Téléphone", d.captain.phone)}
    ${row("E-mail", d.captain.email)}
    ${row("2e pilote", d.pilots[0])}
    ${row("3e pilote", d.pilots[1])}
    ${d.experience ? row("Expérience", d.experience) : ""}
    ${d.message ? row("Message", d.message) : ""}
  </table>`;
}

const shell = (inner: string) =>
  `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:28px 22px;color:#111">${inner}
  <p style="margin:28px 0 0;font-size:13px;color:#888;line-height:1.5">MegaKart · ${esc(SITE.address.street)}, ${SITE.address.zip} ${SITE.address.city} · ${SITE.phone}<br><a href="${SITE_URL}" style="color:#888">${SITE_URL.replace("https://", "")}</a></p></div>`;

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "Requête illisible." } }, { status: 400 });
  }

  const dates = centToursDates();
  const parsed = parseInscription(raw, dates.map((d) => d.iso));
  if (!parsed.ok) return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 422 });
  const d = parsed.data;

  // Piège à robots rempli : on fait semblant d'accepter, sans rien envoyer.
  if (d.website) return NextResponse.json({ ok: true });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: false, reason: "mail" }, { status: 503 });
  }

  const op = getOperation(CENT_TOURS_SLUG);
  const dateLabel = dates.find((x) => x.iso === d.date)?.label ?? d.date;
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: d.captain.email,
      subject: `Inscription 100 Tours · ${dateLabel} · équipe ${d.team}`,
      html: shell(`<h2 style="margin:0 0 6px;font-size:22px">Nouvelle équipe pour les 100 Tours</h2>
        <p style="margin:0 0 18px;color:#555">Reçue depuis le formulaire du site. Répondre à ce message écrit directement au capitaine.</p>
        ${recapTable(d, dateLabel)}`),
    });

    await resend.emails.send({
      from: FROM,
      to: d.captain.email,
      replyTo: TO,
      subject: `Votre équipe est pré-inscrite aux 100 Tours — ${dateLabel}`,
      html: shell(`<h2 style="margin:0 0 6px;font-size:22px">C'est noté, ${esc(d.captain.name)} !</h2>
        <p style="margin:0 0 18px;color:#555;line-height:1.55">Votre équipe <strong>${esc(d.team)}</strong> est pré-inscrite aux 100 Tours du <strong>${esc(dateLabel)}</strong>. Le circuit revient vers vous par téléphone ou par e-mail pour confirmer la place. Si quelque chose change d'ici là, répondez simplement à ce message.</p>
        ${recapTable(d, dateLabel)}
        <div style="margin-top:20px;padding:14px 16px;background:#f5f5f3;border-radius:10px;font-size:14px;line-height:1.55;color:#444">
          <strong style="color:#111">Le format</strong> — ${esc(op?.facts.join(" · ") ?? "")}.<br>
          <strong style="color:#111">Tarif</strong> — ${esc(op?.price ?? "")}${op?.priceNote ? `, ${esc(op.priceNote)}` : ""}.
        </div>`),
    });
  } catch (err) {
    console.error("[inscription] envoi impossible :", err);
    return NextResponse.json({ ok: false, reason: "mail" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
