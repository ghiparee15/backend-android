const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTweet = async (req, res) => {
  const userId = req.user.userId;
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content tidak boleh kosong' });

  try {
    const tweet = await prisma.tweet.create({ data: { content, userId } });
    res.status(201).json(tweet);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat tweet' });
  }
};

const getAllTweets = async (req, res) => {
  try {
    const tweets = await prisma.tweet.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true } },
        likes: { include: { user: { select: { id: true, username: true } } } },
        comments: {
          include: { user: { select: { id: true, username: true } } },
          orderBy: { createdAt: 'desc' }
        },
      },
    });

    console.log(`Retrieved ${tweets.length} tweets with comments and likes`); // Debug log
    res.json(tweets);
  } catch (error) {
    console.error('Error getting tweets:', error); // Debug log
    res.status(500).json({ error: 'Gagal mengambil tweet' });
  }
};

const getTweetById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const tweet = await prisma.tweet.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
        likes: true,
        comments: {
          include: {
            user: { select: { id: true, username: true } }
          }
        }
      },
    });
    if (!tweet) return res.status(404).json({ error: 'Tweet tidak ditemukan' });
    res.json(tweet);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil tweet' });
  }
};

const updateTweet = async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user.userId;
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content tidak boleh kosong' });

  try {
    const tweet = await prisma.tweet.findUnique({ where: { id } });
    if (!tweet) return res.status(404).json({ error: 'Tweet tidak ditemukan' });
    if (tweet.userId !== userId) return res.status(403).json({ error: 'Tidak punya akses update' });

    const updatedTweet = await prisma.tweet.update({
      where: { id },
      data: { content },
    });
    res.json(updatedTweet);
  } catch (error) {
    res.status(500).json({ error: 'Gagal update tweet' });
  }
};

const deleteTweet = async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user.userId;

  try {
    const tweet = await prisma.tweet.findUnique({ where: { id } });
    if (!tweet) return res.status(404).json({ error: 'Tweet tidak ditemukan' });
    if (tweet.userId !== userId) return res.status(403).json({ error: 'Tidak punya akses hapus' });

    await prisma.tweet.delete({ where: { id } });
    res.json({ message: 'Tweet berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal hapus tweet' });
  }
};

module.exports = { createTweet, getAllTweets, getTweetById, updateTweet, deleteTweet };
