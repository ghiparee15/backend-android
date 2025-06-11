const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { likeTweet, unlikeTweet } = require('../controllers/likeController');

const router = express.Router();

router.use(authenticateToken);

router.post('/:tweetId/like', likeTweet);
router.delete('/:tweetId/like', unlikeTweet);

module.exports = router;
