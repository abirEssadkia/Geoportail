import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from './Map'; 


const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
  
      // Récupérer les couches de l'utilisateur spécifique
      fetch(`http://localhost:5000/layers?userId=${userData.id}`)
        .then(response => response.json())
        .then(data => setLayers(data))
        .catch(err => console.error('Error fetching layers:', err));
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenue, {user.name ? user.name : 'Utilisateur'}</h1>
      <img src={`http://localhost:5000/uploads/${user.profile_image}`} alt="Profile" style={styles.profilePicture} />
      <p style={styles.email}>Email: {user.mail}</p>
      <p style={styles.email}>Type: {user.type}</p>
      <p style={styles.email}>Service: {user.service}</p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate('/editProfile')}>Modifier Profil</button>
        <button style={styles.button} onClick={() => {
          localStorage.removeItem('user');
          navigate('/login');
        }}>Déconnexion</button>
      </div>
  
      <Map layers={layers} setLayers={setLayers} />
    </div>
  );
  
  
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5', // Light gray background
    minHeight: '100vh',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
  },
  email: {
    fontSize: '20px',
    color: '#777',
    marginBottom: '10px',
    fontFamily: 'Arial, sans-serif',
  },
  profilePicture: {
    borderRadius: '50%',
    width: '160px',
    height: '160px',
    marginBottom: '20px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Stronger shadow for more depth
  },
  buttonContainer: {
    marginTop: '30px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    padding: '12px 24px',
    fontSize: '18px',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
    margin: '0 15px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  }
};

export default Profile;
