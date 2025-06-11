// Test script untuk comment system
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testCommentSystem() {
  try {
    console.log('🧪 Testing Comment System...\n');

    // 1. Login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received\n');

    // 2. Get tweets to find a tweet ID
    console.log('2. Getting tweets...');
    const tweetsResponse = await axios.get(`${BASE_URL}/tweets`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (tweetsResponse.data.length === 0) {
      console.log('❌ No tweets found. Please create a tweet first.');
      return;
    }
    
    const tweetId = tweetsResponse.data[0].id;
    console.log(`✅ Found tweet with ID: ${tweetId}\n`);

    // 3. Test posting comment
    console.log('3. Posting comment...');
    const commentResponse = await axios.post(`${BASE_URL}/tweets/${tweetId}/comments`, {
      content: 'Test comment from script'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Comment posted successfully:');
    console.log(JSON.stringify(commentResponse.data, null, 2));
    console.log('');

    // 4. Test getting comments
    console.log('4. Getting comments...');
    const getCommentsResponse = await axios.get(`${BASE_URL}/tweets/${tweetId}/comments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Comments retrieved:');
    console.log(JSON.stringify(getCommentsResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Run test
testCommentSystem();
