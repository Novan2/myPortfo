const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Change this if your MySQL user is different
  password: '', // Change this if you have a password
  database: 'portfolio_db'
});

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// API Endpoint to handle contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  // Insert data into MySQL
  const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
  
  connection.query(query, [name, email, message], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Failed to save message to database' });
    }
    
    console.log('Message saved with ID:', results.insertId);
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
