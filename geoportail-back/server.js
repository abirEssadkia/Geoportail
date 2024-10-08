const express = require('express');
const cors = require('cors');
const pool = require('./db');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path'); // Importez le module path ici
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '10mb' }));
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/users', upload.single('profileImage'), async (req, res) => {
  const { userName, mail, password, type, role, service } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  console.log('Received data:', { userName, mail, password, type, role, service, profileImage });

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    const result = await pool.query(
      'INSERT INTO users (userName, mail, password, type, role, service, profile_image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userName, mail, hashedPassword, type, role, service, profileImage]
    );
    console.log('User inserted:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/admins', upload.single('profileImage'), async (req, res) => {
  const { userName, mail, password, type, role, service } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  console.log('Received data:', { userName, mail, password, type, role, service, profileImage });

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    const result = await pool.query(
      'INSERT INTO admin (name, mail, password, type, role, service, profile_image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userName, mail, hashedPassword, type, role, service, profileImage]
    );
    console.log('Admin inserted:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE mail = $1', [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Vérifier si le mot de passe est correct
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        res.json({ message: 'Login successful', user });
      } else {
        res.status(400).json({ error: 'Invalid password' });
      }
    } else {
      res.status(400).json({ error: 'No user found with that email' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/layers', async (req, res) => {
  const { name, geojson, userId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO layers (name, geojson, user_id) VALUES ($1, $2, $3) RETURNING *',
      [name, geojson, userId]  // Assurez-vous que userId est bien passé
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving layer:', err);
    res.status(500).json({ error: 'Server error' });
  }
});





app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/admins', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM admin');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admins:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/layers', async (req, res) => {
  const { userId } = req.query;
  try {
    const result = await pool.query('SELECT * FROM layers WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching layers:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/profiles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profile');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching layers:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/layers', async (req, res) => {
  const { userId } = req.query;
  try {
    const result = await pool.query('SELECT * FROM layers WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching layers:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/layers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM layers WHERE id = $1', [id]);
    res.status(200).json({ message: 'Layer deleted successfully' });
  } catch (err) {
    console.error('Error deleting layer:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Save a layer
app.post('/layers', async (req, res) => {
  const { name, geojson, userId } = req.body;

  // Input validation
  if (!name || !geojson || !userId) {
    return res.status(400).json({ error: 'Name, GeoJSON, and User ID are required' });
  }

  try {
    // Insert new layer into the database
    const result = await pool.query(
      'INSERT INTO layers (name, geojson, user_id, published) VALUES ($1, $2, $3, false) RETURNING *',
      [name, geojson, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving layer:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/publish', async (req, res) => {
  const { name, geojson, userId } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO public (name, geojson, user_id, created_at, published)
       VALUES ($1, $2, $3, NOW(), true) RETURNING *`,
      [name, geojson, userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting layer to public:', error);
    res.status(500).json({ error: 'Failed to publish layer.' });
  }
});


// Fetch only published layers
// Fetch only published layers from the public table
app.get('/public-layers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public WHERE published = true');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching published layers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Delete a layer
app.delete('/layers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM layers WHERE id = $1', [id]);
    res.status(200).json({ message: 'Layer deleted successfully' });
  } catch (err) {
    console.error('Error deleting layer:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
});


