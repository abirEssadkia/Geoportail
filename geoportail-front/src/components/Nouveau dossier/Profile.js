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
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
  email: {
    fontSize: '18px',
    color: '#555',
  },
  profilePicture: {
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    marginBottom: '20px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  buttonContainer: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
    margin: '0 10px',
    transition: 'background-color 0.3s',
  }
};

export default Profile;
