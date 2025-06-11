const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { createComment, getCommentsByTweet } = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

router.use(authenticateToken);

router.post('/:tweetId/comments', createComment);
router.get('/:tweetId/comments', getCommentsByTweet);

module.exports = router;
