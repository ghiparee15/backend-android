const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Test endpoint untuk melihat relasi tweet-comment
const getTestData = async (req, res) => {
  try {
    console.log('Getting test data for tweet-comment relations...');
    
    // Get all tweets with their comments and users
    const tweets = await prisma.tweet.findMany({
      include: {
        user: { select: { id: true, username: true, email: true } },
        comments: {
          include: {
            user: { select: { id: true, username: true } },
            tweet: { select: { id: true, content: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        likes: {
          include: {
            user: { select: { id: true, username: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Get all comments with their tweet relations
    const comments = await prisma.comment.findMany({
      include: {
        user: { select: { id: true, username: true } },
        tweet: { 
          select: { 
            id: true, 
            content: true, 
            user: { select: { id: true, username: true } }
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Get all users with their tweets and comments
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        tweets: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            _count: {
              select: {
                comments: true,
                likes: true
              }
            }
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            tweet: {
              select: {
                id: true,
                content: true
              }
            }
          }
        },
        _count: {
          select: {
            tweets: true,
            comments: true,
            likes: true
          }
        }
      }
    });
    
    const testData = {
      summary: {
        totalTweets: tweets.length,
        totalComments: comments.length,
        totalUsers: users.length
      },
      tweets: tweets,
      comments: comments,
      users: users
    };
    
    console.log('Test data retrieved successfully');
    res.json(testData);
    
  } catch (error) {
    console.error('Error getting test data:', error);
    res.status(500).json({ error: 'Gagal mengambil test data' });
  }
};

// Test endpoint untuk membuat sample data
const createSampleData = async (req, res) => {
  try {
    console.log('Creating sample data...');
    
    // Create sample users if not exist
    const user1 = await prisma.user.upsert({
      where: { email: 'user1@test.com' },
      update: {},
      create: {
        username: 'user1',
        email: 'user1@test.com',
        password: 'password123'
      }
    });
    
    const user2 = await prisma.user.upsert({
      where: { email: 'user2@test.com' },
      update: {},
      create: {
        username: 'user2',
        email: 'user2@test.com',
        password: 'password123'
      }
    });
    
    // Create sample tweets
    const tweet1 = await prisma.tweet.create({
      data: {
        content: 'This is a sample tweet for testing comments',
        userId: user1.id
      }
    });
    
    const tweet2 = await prisma.tweet.create({
      data: {
        content: 'Another tweet to test the comment system',
        userId: user2.id
      }
    });
    
    // Create sample comments
    const comment1 = await prisma.comment.create({
      data: {
        content: 'This is a comment on tweet 1 by user 2',
        tweetId: tweet1.id,
        userId: user2.id
      }
    });
    
    const comment2 = await prisma.comment.create({
      data: {
        content: 'This is a comment on tweet 1 by user 1',
        tweetId: tweet1.id,
        userId: user1.id
      }
    });
    
    const comment3 = await prisma.comment.create({
      data: {
        content: 'This is a comment on tweet 2 by user 1',
        tweetId: tweet2.id,
        userId: user1.id
      }
    });
    
    console.log('Sample data created successfully');
    res.json({
      message: 'Sample data created successfully',
      data: {
        users: [user1, user2],
        tweets: [tweet1, tweet2],
        comments: [comment1, comment2, comment3]
      }
    });
    
  } catch (error) {
    console.error('Error creating sample data:', error);
    res.status(500).json({ error: 'Gagal membuat sample data' });
  }
};

module.exports = { getTestData, createSampleData };
