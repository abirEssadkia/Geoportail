import React from 'react';
import { useNavigate } from 'react-router-dom';
import './homePage.css';
import banc from './banc.png';
import skype from './skype.png';
import earth from './google-earth.jpg';
import net from './netvibes.png';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleVisualizeMap = () => {
    navigate('/visualizeMap');
  };

  const handleGeoportal = () => {
    navigate('/geoportal');
  };

  return (
    <div className="home-container">
      <div className="showcase">
        <h1>Welcome to Geoportail</h1>
        <p>Discover marine aquaculture areas in Morocco</p>
        <div className="button-container">
          <button className="btn" onClick={handleLogin}>Login</button>
          <button className="btn" onClick={handleSignIn}>Sign Up</button>
          <button className="btn" onClick={handleVisualizeMap}>Accéder au Géoportail</button>
          
        </div>
      </div>

      {/* New Section for Articles */}
      <div className="articles-section">
        <h2>Articles à découvrir</h2>
        <div className="articles-container">
          <div className="article">
            <img src={banc} alt="Banques en ligne" />
            <p>
              <a href="https://www.quechoisir.org/guide-d-achat-banque-en-ligne-n6031/" target="_blank" rel="noopener noreferrer">
                Banques en ligne : comment s’y retrouver parmi toutes les offres ?
              </a>
            </p>
          </div>
          <div className="article">
            <img src={skype} alt="Skype pour iPhone" />
            <p>
              <a href="https://apps.apple.com/fr/app/skype/id304878510" target="_blank" rel="noopener noreferrer">
                Skype pour iPhone : installation, fonctionnalités, et avantages de l’outil de conversation
              </a>
            </p>
          </div>
          <div className="article">
            <img src={net} alt="Netvibes" />
            <p>
              <a href="https://www.netvibes.com/consent?url=https%3A%2F%2Fwww.netvibes.com%2Ffr" target="_blank" rel="noopener noreferrer">
                Netvibes : l’outil web pour gérer efficacement votre veille de contenus
              </a>
            </p>
          </div>
          <div className="article">
            <img src={earth} alt="Google Earth" />
            <p>
              <a href="https://earth.google.com/web/" target="_blank" rel="noopener noreferrer">
                Google Earth : comment y accéder et le télécharger ?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
