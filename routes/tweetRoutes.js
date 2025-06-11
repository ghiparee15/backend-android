const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const {
  createTweet, getAllTweets, getTweetById, updateTweet, deleteTweet
} = require('../controllers/tweetController');

const router = express.Router();

router.use(authenticateToken);

router.post('/', createTweet);
router.get('/', getAllTweets);
router.get('/:id', getTweetById);
router.put('/:id', updateTweet);
router.delete('/:id', deleteTweet);

module.exports = router;
