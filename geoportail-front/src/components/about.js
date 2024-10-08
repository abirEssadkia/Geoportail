import React from 'react';
import './about.css'; // Make sure to import the CSS file

const About = () => {
  return (
    <div className="about-container">
      <h2>About Agence des Bassins Hydraulique</h2>
      <img
        src="https://www.mapphoto.ma/wp-content/uploads/2024/03/PHOTO_21032024_171517110413251725.JPG"
        alt="Water resources management"
      />
      <p>
        L'Agence des Bassins Hydraulique est une organisation gouvernementale chargée de la gestion durable des ressources en eau dans diverses régions. Elle joue un rôle crucial dans l'élaboration des politiques hydrauliques, la protection des ressources en eau, et la coordination entre les différentes parties prenantes.
      </p>
      <h3>Mission</h3>
      <p>
        La mission de l'Agence est de garantir une gestion efficace et durable des bassins hydrauliques en assurant un équilibre entre les besoins en eau des populations, de l'agriculture, et des industries tout en préservant l'environnement.
      </p>
      <h3>Services</h3>
      <ul>
        <li>Élaboration de plans de gestion de l'eau</li>
        <li>Suivi de la qualité des eaux</li>
        <li>Coordination des projets hydrauliques régionaux</li>
        <li>Conseil et assistance aux collectivités locales</li>
      </ul>
      <h3>Contact</h3>
      <p>
        Pour plus d'informations, veuillez contacter l'Agence des Bassins Hydraulique à travers leur site officiel ou par téléphone au +212 123 456 789.
      </p>
    </div>
  );
};

export default About;
