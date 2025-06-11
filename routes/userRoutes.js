const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { 
  getCurrentUser, 
  getUserProfile, 
  updateProfile, 
  getUserTweets 
} = require('../controllers/authController');

const router = express.Router();

// Protected routes (need authentication)
router.use(authenticateToken);

// Get current user profile (logged in user)
router.get('/me', getCurrentUser);

// Update current user profile
router.put('/me', updateProfile);

// Get user profile by ID (public profile)
router.get('/:userId', getUserProfile);

// Get user's tweets by ID
router.get('/:userId/tweets', getUserTweets);

module.exports = router;
