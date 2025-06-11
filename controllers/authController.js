const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Lengkapi semua data' });

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (existingUser) return res.status(400).json({ error: 'Username atau email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword }
    });

    res.status(201).json({ message: 'User terdaftar', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Gagal registrasi' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Lengkapi email dan password' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Email tidak ditemukan' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Password salah' });

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Gagal login' });
  }
}

// Get current user profile
async function getCurrentUser(req, res) {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        tweets: {
          orderBy: { createdAt: 'desc' },
          include: {
            likes: true,
            comments: true,
            user: { select: { id: true, username: true } }
          }
        },
        _count: {
          select: {
            tweets: true,
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil profil user' });
  }
}

// Get user profile by ID
async function getUserProfile(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        tweets: {
          orderBy: { createdAt: 'desc' },
          include: {
            likes: true,
            comments: true,
            user: { select: { id: true, username: true } }
          }
        },
        _count: {
          select: {
            tweets: true,
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil profil user' });
  }
}

// Update user profile
async function updateProfile(req, res) {
  try {
    const userId = req.user.userId;
    const { username, email } = req.body;

    // Validate input
    if (!username && !email) {
      return res.status(400).json({ error: 'Minimal satu field harus diisi' });
    }

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                username ? { username } : {},
                email ? { email } : {}
              ]
            }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username atau email sudah digunakan' });
      }
    }

    // Update user
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    res.json({ message: 'Profil berhasil diupdate', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Gagal update profil' });
  }
}

// Get user's tweets only
async function getUserTweets(req, res) {
  try {
    const userId = parseInt(req.params.userId);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true }
    });

    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    const tweets = await prisma.tweet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true } },
        likes: true,
        comments: {
          include: {
            user: { select: { id: true, username: true } }
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    res.json({
      user: user,
      tweets: tweets,
      totalTweets: tweets.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil tweets user' });
  }
}

module.exports = { register, login, getCurrentUser, getUserProfile, updateProfile, getUserTweets };
