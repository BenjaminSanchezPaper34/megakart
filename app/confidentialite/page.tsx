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
                · Ce site ne dépose <strong className="text-chalk">aucun cookie</strong>,
                ni de suivi ni d'aucune autre sorte : rien n'est écrit dans
                votre navigateur, rien ne vous suit d'un site à l'autre.
              </li>
              <li>
                · La fréquentation est mesurée de façon{" "}
                <strong className="text-chalk">anonyme et sans cookie</strong>{" "}
                (Vercel Web Analytics) : on compte les pages vues, pas les
                personnes.
              </li>
              <li>
                · Aucun formulaire ne collecte vos données : le contact se
                fait par téléphone ou par e-mail (les messages reçus servent
                uniquement à traiter votre demande).
              </li>
              <li>
                · Les deux services tiers du site (la carte Google Maps et le
                chrono en direct Apex Timing) ne se chargent qu'après votre
                accord explicite, au clic.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="display mb-3 text-2xl text-chalk">
              Responsable du traitement
            </h2>
            <p>
              {SITE.legalName}, {SITE.company.form} au capital de{" "}
              {SITE.company.capital} ({SITE.company.siren} R.C.S.{" "}
              {SITE.company.rcs}) — siège social : {SITE.company.headOffice},
              France. Téléphone : {SITE.phone}. E-mail : {SITE.email}.
            </p>
          </div>

          <div>
            <h2 className="display mb-3 text-2xl text-chalk">
              Données traitées
            </h2>
            <p>
              La navigation sur ce site ne fait l'objet d'aucune collecte de
              données personnelles nominatives : aucun compte, aucun
              formulaire, aucun profil. Seules des statistiques anonymes sont
              établies (voir « Mesure d'audience » ci-dessous).
              L'hébergeur (Vercel Inc.)
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
              Mesure d&rsquo;audience
            </h2>
            <p>
              Pour savoir quelles pages sont consultées et améliorer le site,
              nous utilisons <strong className="text-chalk">Vercel Web Analytics</strong>,
              fourni par notre hébergeur. Cet outil{" "}
              <strong className="text-chalk">ne dépose aucun cookie</strong>,
              ne crée aucun identifiant persistant et ne permet ni de vous
              reconnaître d&rsquo;une visite à l&rsquo;autre, ni de vous
              suivre sur d&rsquo;autres sites. Chaque visite est réduite à un
              identifiant temporaire (dérivé notamment de la page et du
              navigateur) qui expire dans la journée.
            </p>
            <p className="mt-2">
              Sont comptés : les pages vues, la page d&rsquo;origine, le type
              d&rsquo;appareil et le pays, ainsi que quelques actions utiles
              au circuit (clic sur le numéro de téléphone, sur l&rsquo;adresse
              e-mail, sur l&rsquo;itinéraire, sur nos réseaux sociaux) —
              toujours sous forme de compteurs, jamais rattachés à une
              personne. Aucune de ces données n&rsquo;est revendue ni utilisée
              à des fins publicitaires. Étant dépourvue de cookie et de
              traceur, cette mesure entre dans le cadre des exemptions prévues
              par la CNIL et ne requiert pas votre consentement préalable.
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
            <h2 className="display mb-3 text-2xl text-chalk">
              Chrono en direct (Apex Timing)
            </h2>
            <p>
              Sur la page{" "}
              <Link href="/live" className="link-under text-chalk">chrono en direct</Link>,
              le classement est fourni par Apex Timing, le prestataire de
              chronométrage du circuit. Il n&rsquo;est chargé qu&rsquo;après
              un clic de votre part sur « Afficher le chrono en direct » :
              tant que vous ne cliquez pas, aucune donnée n&rsquo;est échangée
              avec ce service.
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
