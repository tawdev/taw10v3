import React from 'react';

export const metadata = {
  title: 'Mentions Légales & Confidentialité | TAW 10',
  description: 'Mentions légales et politique de confidentialité du cabinet TAW 10.',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#fcf9f6] pt-48 pb-24 font-body">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-[#1c1c1b] mb-12">
          Mentions Légales & <br />
          <span className="text-[#dab055]">Confidentialité</span>
        </h1>

        <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 space-y-12 text-[#1c1c1b]/80 leading-relaxed text-lg">
          
          <section>
            <h2 className="text-2xl font-bold text-[#1c1c1b] mb-4 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#dab055] inline-block"></span>
              Éditeur du site
            </h2>
            <p className="mb-2">Le site <strong>TAW 10</strong> est édité par :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Raison sociale :</strong> TAW 10 Consulting SARL</li>
              <li><strong>Siège social :</strong> Marrakech, Maroc</li>
              <li><strong>Contact :</strong> contact@taw10.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1c1c1b] mb-4 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#dab055] inline-block"></span>
              Propriété Intellectuelle
            </h2>
            <p>
              L'ensemble de ce site relève de la législation marocaine et internationale sur le droit d'auteur et la propriété intellectuelle. 
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1c1c1b] mb-4 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#dab055] inline-block"></span>
              Protection des Données (RGPD & CNDP)
            </h2>
            <p className="mb-4">
              Conformément à la loi 09-08 promulguée par le Dahir 1-09-15 du 18 février 2009, 
              relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Les informations recueillies sur notre formulaire de contact et notre simulateur sont enregistrées dans un fichier informatisé par TAW 10 pour la gestion de la relation client.</li>
              <li>Elles sont conservées pendant la durée légale et sont destinées exclusivement à nos services internes.</li>
              <li>Vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier ou supprimer en contactant notre support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1c1c1b] mb-4 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#dab055] inline-block"></span>
              Gestion des Cookies
            </h2>
            <p>
              Lors de la consultation du site TAW 10, des cookies sont déposés sur votre ordinateur, votre mobile ou votre tablette. 
              Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site ou de la consultation d'une publicité.
              Vous pouvez à tout moment modifier vos préférences via notre outil de gestion des cookies en bas de page.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
