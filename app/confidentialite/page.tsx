import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site megakart : données collectées, cookies et services tiers, droits RGPD.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([{ name: "Confidentialité", path: "/confidentialite" }])
          ),
        }}
      />
      <section className="mx-auto max-w-3xl px-5 pb-24 pt-40 md:px-8 md:pt-48">
        <h1 className="display text-[clamp(2.4rem,6vw,4.5rem)] text-chalk">
          Confidentialité
        </h1>

        <div className="mt-12 flex flex-col gap-10 text-base leading-relaxed text-chalk-60">
          <div>
            <h2 className="display mb-3 text-2xl text-chalk">L'essentiel</h2>
            <ul className="flex flex-col gap-2">
              <li>
                · Ce site ne dépose <strong className="text-chalk">aucun cookie de suivi</strong> et
                n'embarque aucun outil de mesure d'audience tierce.
              </li>
              <li>
                · Aucun formulaire ne collecte vos données : le contact se
                fait par téléphone.
              </li>
              <li>
                · Le seul service tiers (carte Google Maps) ne se charge
                qu'après votre accord explicite, au clic.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="display mb-3 text-2xl text-chalk">
              Responsable du traitement
            </h2>
            <p>
              {SITE.legalName} — {SITE.address.street}, {SITE.address.zip}{" "}
              {SITE.address.city}, France. Téléphone : {SITE.phone}.
            </p>
          </div>

          <div>
            <h2 className="display mb-3 text-2xl text-chalk">
              Données traitées
            </h2>
            <p>
              La navigation sur ce site ne fait l'objet d'aucune collecte de
              données personnelles par l'éditeur. L'hébergeur (Vercel Inc.)
              traite des journaux techniques (adresse IP, horodatage)
              nécessaires à la fourniture du service et à sa sécurité, sur la
              base de l'intérêt légitime, conservés pour une durée limitée.
            </p>
            <p className="mt-2">
              Si vous nous appelez, votre numéro peut s'afficher ; il n'est
              enregistré dans aucun fichier commercial.
            </p>
          </div>

          <div>
            <h2 className="display mb-3 text-2xl text-chalk">
              Carte Google Maps
            </h2>
            <p>
              Sur la page <Link href="/contact" className="link-under text-chalk">contact</Link>,
              la carte Google Maps est remplacée par un encadré neutre tant
              que vous n'avez pas cliqué sur « Autoriser et afficher la
              carte ». En l'affichant, des données (adresse IP, cookies) sont
              échangées avec Google Ireland Ltd / Google LLC, dont le
              traitement relève de la{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="link-under text-chalk"
              >
                politique de confidentialité de Google
              </a>
              . Ce choix n'est pas mémorisé au-delà de la page.
            </p>
          </div>

          <div>
            <h2 className="display mb-3 text-2xl text-chalk">Vos droits</h2>
            <p>
              Conformément au RGPD et à la loi Informatique et Libertés, vous
              disposez de droits d'accès, de rectification, d'effacement,
              d'opposition et de limitation sur vos données. Pour les
              exercer, contactez-nous au {SITE.phone} ou par courrier à
              l'adresse ci-dessus. Vous pouvez également saisir la CNIL
              (cnil.fr).
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
