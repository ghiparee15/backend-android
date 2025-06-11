const express = require('express');
const { getTestData, createSampleData } = require('../controllers/testController');

const router = express.Router();

// Health check endpoint for Railway
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoints (no auth required for testing)
router.get('/data', getTestData);
router.post('/sample', createSampleData);

module.exports = router;
