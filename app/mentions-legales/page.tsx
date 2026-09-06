import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site megakart : éditeur, directeur de la publication, hébergeur et propriété intellectuelle.",
  alternates: { canonical: "/mentions-legales" },
};

/*
 * Données société : extrait Kbis du 8 juillet 2026 (greffe de Béziers),
 * centralisées dans SITE.company (lib/site.ts). Ne jamais publier de
 * données inventées : tout ajout doit venir d'un document officiel.
 */

export default function MentionsLegalesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([{ name: "Mentions légales", path: "/mentions-legales" }])
          ),
        }}
      />
      <section className="mx-auto max-w-3xl px-5 pb-24 pt-40 md:px-8 md:pt-48">
        <h1 className="display text-[clamp(2.4rem,6vw,4.5rem)] text-chalk">
          Mentions légales
        </h1>

        <div className="mt-12 flex flex-col gap-10 text-base leading-relaxed text-chalk-60">
          <div>
            <h2 className="display mb-3 text-2xl text-chalk">Éditeur du site</h2>
            <p>
              {SITE.legalName}, {SITE.company.form} au capital de{" "}
              {SITE.company.capital}, exploitant le circuit sous l&rsquo;enseigne{" "}
              {SITE.company.tradeName}
              <br />
              Siège social : {SITE.company.headOffice}, France
              <br />
              Établissement : {SITE.address.street}, {SITE.address.zip}{" "}
              {SITE.address.city}
              <br />
              {SITE.company.siren} R.C.S. {SITE.company.rcs} (n° de gestion{" "}
              {SITE.company.rcsNumber}) — N° TVA intracommunautaire{" "}
              {SITE.company.vat} — Code NAF {SITE.company.naf} (
              {SITE.company.nafLabel})
              <br />
              Téléphone : {SITE.phone} — E-mail :{" "}
              <a href={`mailto:${SITE.email}`} className="link-under text-chalk">
                {SITE.email}
              </a>
            </p>
            <p className="mt-2">
              Directeur de la publication : {SITE.company.director}, gérant.
            </p>
          </div>

          <div>
            <h2 className="display mb-3 text-2xl text-chalk">Hébergement</h2>
            <p>
              Vercel Inc.
              <br />
              440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis
              <br />
              vercel.com
            </p>
          </div>

          <div>
            <h2 className="display mb-3 text-2xl text-chalk">
              Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des contenus de ce site (textes, photographies,
              logos, tracés, éléments graphiques) est la propriété exclusive
              de {SITE.legalName} ou de ses partenaires. Toute reproduction,
              représentation ou diffusion, totale ou partielle, sans
              autorisation écrite préalable est interdite.
            </p>
          </div>

          <div>
            <h2 className="display mb-3 text-2xl text-chalk">
              Conception &amp; réalisation
            </h2>
            <p>
              Site conçu et réalisé par{" "}
              <a
                href="https://www.paper34.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="link-under font-semibold text-chalk"
              >
                Paper34
              </a>{" "}
              — studio web, Hérault.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
