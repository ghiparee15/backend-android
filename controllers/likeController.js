const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const likeTweet = async (req, res) => {
  const userId = req.user.userId;
  const tweetId = parseInt(req.params.tweetId);

  try {
    const existingLike = await prisma.like.findUnique({
      where: { tweetId_userId: { tweetId, userId } }
    });
    if (existingLike) return res.status(400).json({ error: 'Sudah like tweet ini' });

    const like = await prisma.like.create({ data: { tweetId, userId } });
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: 'Gagal like tweet' });
  }
};

const unlikeTweet = async (req, res) => {
  const userId = req.user.userId;
  const tweetId = parseInt(req.params.tweetId);

  try {
    const existingLike = await prisma.like.findUnique({
      where: { tweetId_userId: { tweetId, userId } }
    });
    if (!existingLike) return res.status(400).json({ error: 'Belum like tweet ini' });

    await prisma.like.delete({
      where: { tweetId_userId: { tweetId, userId } }
    });
    res.json({ message: 'Berhasil unlike tweet' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal unlike tweet' });
  }
};

module.exports = { likeTweet, unlikeTweet };
