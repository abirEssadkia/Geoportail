import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState('');
  const [service, setService] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null); // New state for profile image

  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleServiceChange = (e) => {
    setService(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]); // Handle file input change
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('userName', name);
    formData.append('mail', email);
    formData.append('password', password);
    formData.append('type', type);
    formData.append('role', role);
    formData.append('service', service);
    formData.append('profileImage', profileImage); // Ajoutez le fichier de l'image
  
    try {
      const response = await fetch('http://localhost:5000/admins', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('User created:', data);
        // Rediriger l'utilisateur ou afficher un message de succès
      } else {
        const error = await response.json();
        console.error('Error:', error);
        // Gérer les erreurs ici
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };
  

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign In</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="name">Name</label>
          <input
            style={styles.input}
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            style={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="password">Password</label>
          <input
            style={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="type">Type</label>
          <input
            style={styles.input}
            type="text"
            id="type"
            value={type}
            onChange={handleTypeChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="role">Role</label>
          <input
            style={styles.input}
            type="text"
            id="role"
            value={role}
            onChange={handleRoleChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="service">Service</label>
          <input
            style={styles.input}
            type="text"
            id="service"
            value={service}
            onChange={handleServiceChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="profileImage">Profile Image</label>
          <input
            style={styles.input}
            type="file"
            id="profileImage"
            onChange={handleImageChange} // Add change handler
            accept="image/*" // Accept only images
            required
          />
        </div>
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.button}>Sign In</button>
          <button type="button" style={styles.button} onClick={handleLogin}>Login</button>
        </div>
      </form>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: '15px',
    width: '100%',
    maxWidth: '300px',
  },
  label: {
    marginBottom: '5px',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '300px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
    flex: '1',
    margin: '0 5px',
  },
};
export default Signin;
