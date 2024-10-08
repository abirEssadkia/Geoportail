import React from "react";
 import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import HomePage from "./components/homePage";  // Correct import
import Login from "./components/Login";
import SignIn from "./components/signin";
import Profile from "./components/Profile";
import VisualizeMap from "./components/visualizeMap";
import Map from "./components/Map"; // Corrected import of the Map component
 import Navebarre from "./components/Navebarre";
 import About from "./components/about";
import Footer from "./components/footer";
import Services from "./components/services";
import Contact from "./components/contact";

function App() {
  return (
  
    <Router>
      <Navebarre /> {/* Navigation bar */}
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* HomePage is the default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/map" element={<Map />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/visualizeMap" element={<VisualizeMap />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        

      </Routes>
      <Footer/>
    </Router>
    
  );
}


export default App;
