// src/components/NavBar.js
import React from 'react';
import './Navebarre.css';

const Navebarre = () => {
  return (
    <nav>
      <div className="logo">
        <div className="icon spin">G</div>
        <div className="text">Geoportail</div>
      </div>
      <ul className="nav-items">
        <li><a href="http://localhost:3000/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
        <li className="dropdown">
          <a href="#!" className="dropbtn">Account</a>
          <ul className="dropdown-content">
            <li><a href="/login">Sign In</a></li>
            <li><a href="/signin">Sign Up</a></li>
          </ul>
        </li>
        <li><a href="/visualizeMap">Map</a></li>
      </ul>
    </nav>
  );
};

export default Navebarre;
