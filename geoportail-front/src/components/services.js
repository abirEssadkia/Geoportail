import React from 'react';
import './services.css'; // Make sure to import the CSS file

const Services = () => {
  return (
    <div className="services-container">
      <h2>Our Services</h2>
      <img
        src="https://onewaternevada.com/wp/wp-content/uploads/comprehensive-water-resource-management-graphic.jpg"
        alt="Water management services"
      />
      <p>
        L'Agence des Bassins Hydraulique propose une gamme de services conçus pour gérer efficacement les ressources en eau. Nos services sont conçus pour répondre aux besoins variés des collectivités locales, des industries et de l'agriculture.
      </p>
      <h3>Élaboration de plans de gestion de l'eau</h3>
      <p>
        Nous aidons les régions à concevoir des plans de gestion de l'eau adaptés à leurs besoins spécifiques, en tenant compte des ressources disponibles et des demandes futures.
      </p>
      <h3>Suivi de la qualité des eaux</h3>
      <p>
        Nous surveillons en permanence la qualité de l'eau pour garantir que les normes environnementales sont respectées et pour protéger la santé publique.
      </p>
      <h3>Coordination des projets hydrauliques régionaux</h3>
      <p>
        L'Agence coordonne divers projets régionaux pour s'assurer qu'ils sont conformes aux politiques nationales et qu'ils contribuent à la gestion durable des ressources en eau.
      </p>
      <h3>Conseil et assistance aux collectivités locales</h3>
      <p>
        Nous offrons des services de conseil et d'assistance technique aux collectivités locales pour les aider à gérer efficacement leurs ressources en eau.
      </p>
    </div>
  );
};

export default Services;
