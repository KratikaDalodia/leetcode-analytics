// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

app.post('/api/leetcode/profile', async (req, res) => {
  const { username } = req.body;

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          userAvatar
          realName
          aboutMe
          school
          websites
          countryName
          skillTags
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(LEETCODE_API_URL, {
      query,
      variables: { username }
    }, {
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error in proxy:', error.message);
    res.status(500).json({ error: 'Failed to fetch LeetCode data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
