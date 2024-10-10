const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes'); // Import your routes

app.use(express.json()); // Handle JSON requests

// Set up routes
app.use('/api', routes);

// Serve Angular frontend
app.use(express.static(path.join(__dirname, 'dist/angular-app')));

// Fallback route for Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular-app/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
