const express = require('express');
const router = express.Router();
const { getDerivative } = require('../lib/node-differentiator/lib/differentiator'); // Adjust this path

// POST route to calculate derivative
router.post('/calculate', (req, res) => {
  const inputFunction = req.body.function; // Expecting the input function in the body
  if (!inputFunction) {
    return res.status(400).json({ status: 'failure', message: 'Function is required' });
  }

  // Get the derivative and its explanation
  const derivativeResult = getDerivative(inputFunction);

  if (derivativeResult.status === 'failure') {
    return res.status(400).json({ status: 'failure', message: 'Failed to compute derivative' });
  }

  res.json(derivativeResult); // Send the result back to the frontend
});

module.exports = router;
