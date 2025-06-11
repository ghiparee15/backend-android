const express = require('express');
const { getTestData, createSampleData } = require('../controllers/testController');

const router = express.Router();

// Test endpoints (no auth required for testing)
router.get('/data', getTestData);
router.post('/sample', createSampleData);

module.exports = router;
