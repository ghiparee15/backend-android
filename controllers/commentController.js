const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createComment = async (req, res) => {
  const userId = req.user.userId;
  const tweetId = parseInt(req.params.tweetId);
  const { content } = req.body;

  console.log('Creating comment:', { userId, tweetId, content }); // Debug log

  // Validasi input
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content tidak boleh kosong' });
  }

  if (!tweetId || isNaN(tweetId)) {
    return res.status(400).json({ error: 'Tweet ID tidak valid' });
  }

  try {
    // Cek apakah tweet exists
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId }
    });

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet tidak ditemukan' });
    }

    console.log('Tweet found:', { tweetId: tweet.id, tweetContent: tweet.content });

    // Buat comment dengan relasi ke tweet
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        tweetId,
        userId
      },
      include: {
        user: { select: { id: true, username: true } },
        tweet: { select: { id: true, content: true } } // Include tweet info
      }
    });

    console.log('Comment created successfully:', comment); // Debug log
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error); // Debug log
    res.status(500).json({ error: 'Gagal membuat comment' });
  }
};

const getCommentsByTweet = async (req, res) => {
  const tweetId = parseInt(req.params.tweetId);

  console.log('Getting comments for tweet:', tweetId); // Debug log

  if (!tweetId || isNaN(tweetId)) {
    return res.status(400).json({ error: 'Tweet ID tidak valid' });
  }

  try {
    // Cek apakah tweet exists
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId }
    });

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet tidak ditemukan' });
    }

    // Ambil comments untuk tweet ini
    const comments = await prisma.comment.findMany({
      where: { tweetId },
      include: {
        user: { select: { id: true, username: true } },
        tweet: { select: { id: true, content: true } } // Include tweet info
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${comments.length} comments for tweet ${tweetId}`); // Debug log
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error); // Debug log
    res.status(500).json({ error: 'Gagal mengambil comment' });
  }
};

module.exports = { createComment, getCommentsByTweet };
