import express from 'express';
import cors from 'cors';
import db from './config/db.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.get('/admin', (req, res) => {
  const sql = "SELECT * FROM admin_user";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.get('/sponsors', (req, res) => {
  const sql = "SELECT * FROM sponsors";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received contact form submission:', { name, email, message });
  // Here you would typically handle the form data, e.g., save to a database or send an email
  res.status(200).json({ success: true, message: 'Form submitted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


