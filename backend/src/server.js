const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const meetingRoutes = require('./routes/meetingRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', meetingRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('AI Meeting Minutes Extractor API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
