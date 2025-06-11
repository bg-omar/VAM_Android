const express = require('express');
const router = express.Router();

// GET data
router.get('/data', (req, res) => {
  res.json({ message: 'Here is your data' });
});

// POST data
router.post('/data', (req, res) => {
  // Handle post data
  res.json({ message: 'Data saved' });
});

module.exports = router;
