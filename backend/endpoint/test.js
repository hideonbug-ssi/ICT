// endpoint/test.js
const express = require('express');
const router = express.Router();
const { dbPool } = require('../common/postgres'); // Import your database connection pool

// Define the GET route to fetch all topics
router.get('/', async (req, res) => {
  try {
    const result = await dbPool.query('SELECT * FROM topic'); // Fetch data from the Topic table
    res.json(result.rows); // Send the data back as JSON
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send('Server error'); // Handle server error
  }
});

module.exports = router; // Export the router