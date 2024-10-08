import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './contact.css';

// Import the custom marker image
import redMarkerIcon from './a.png';

// Define the custom marker icon
const customIcon = new L.Icon({
  iconUrl: redMarkerIcon,
  iconSize: [38, 38], // size of the icon
  iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
});

const Contact = () => {
  const position = [34.76936, -1.89025]; // Coordinates for ABHM location

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%', borderRadius: '10px', marginBottom: '20px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            Agence des Bassins Hydraulique<br /> 123 Rue des Eaux, Casablanca, Maroc
          </Popup>
        </Marker>
      </MapContainer>
      <p>
        Pour toute question ou demande de renseignement, n'hésitez pas à nous contacter via les moyens suivants :
      </p>
      <h3>Adresse</h3>
      <p>
        Agence des Bassins Hydraulique<br />
       Rue Ibn Khaldoun, Oujda, Maroc
      </p>
      <h3>Téléphone</h3>
      <p>
        +212 123 456 789
      </p>
      <h3>Email</h3>
      <p>
        contact@bassinshydraulique.ma
      </p>
      <h3>Heures d'ouverture</h3>
      <p>
        Lundi - Vendredi : 8h00 - 18h00<br />
        Samedi - Dimanche : Fermé
      </p>
    </div>
  );
};

export default Contact;
