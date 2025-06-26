// src/utils/leetcodeApi.js
import axios from 'axios';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

// GraphQL query to get user profile data
const USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
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
      submitStats: submitStatsGlobal {
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

const USER_CONTEST_QUERY = `
  query userContestRankingInfo($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
  }
`;

// Function to fetch user profile data
export const fetchUserProfile = async (username) => {
  try {
    const response = await axios.post('http://localhost:5000/api/leetcode/profile', {
    username
  });


    const data = response.data.data;
    
    if (!data.matchedUser) {
      throw new Error('User not found');
    }

    const user = data.matchedUser;
    const submitStats = user.submitStatsGlobal;
    
    // Process the data into our format
    const processedData = {
      username: user.username,
      realName: user.profile?.realName || user.username,
      avatar: user.profile?.userAvatar || null,
      ranking: user.profile?.ranking || null,
      school: user.profile?.school || null,
      country: user.profile?.countryName || null,
      about: user.profile?.aboutMe || null,
      skillTags: user.profile?.skillTags || [],
      
      // Problem solving stats
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      
      // Acceptance rate calculation
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      acceptanceRate: 0
    };

    // Calculate solved problems by difficulty
    if (submitStats && submitStats.acSubmissionNum) {
      submitStats.acSubmissionNum.forEach(stat => {
        const count = stat.count;
        switch (stat.difficulty) {
          case 'Easy':
            processedData.easySolved = count;
            break;
          case 'Medium':
            processedData.mediumSolved = count;
            break;
          case 'Hard':
            processedData.hardSolved = count;
            break;
        }
        const totalStat = submitStats.acSubmissionNum.find(stat => stat.difficulty === "All");
        processedData.totalSolved = totalStat ? totalStat.count : (processedData.easySolved + processedData.mediumSolved + processedData.hardSolved);

      });
    }

    // Calculate acceptance rate
    if (submitStats && submitStats.totalSubmissionNum && submitStats.acSubmissionNum) {
      const totalSubs = submitStats.totalSubmissionNum.reduce((sum, stat) => sum + stat.submissions, 0);
      const acceptedSubs = submitStats.acSubmissionNum.reduce((sum, stat) => sum + stat.submissions, 0);
      
      processedData.totalSubmissions = totalSubs;
      processedData.acceptedSubmissions = acceptedSubs;
      processedData.acceptanceRate = totalSubs > 0 ? ((acceptedSubs / totalSubs) * 100).toFixed(1) : 0;
    }

    return processedData;
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.message === 'User not found') {
      throw new Error('User not found. Please check the username.');
    } else {
      throw new Error('Failed to fetch user data. Please try again.');
    }
  }
};

// Function to fetch contest data (optional)
export const fetchUserContest = async (username) => {
  try {
    const response = await axios.post(LEETCODE_API_URL, {
      query: USER_CONTEST_QUERY,
      variables: { username }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      }
    });

    const contestData = response.data.data.userContestRanking;
    
    return {
      attendedContests: contestData?.attendedContestsCount || 0,
      rating: contestData?.rating || null,
      globalRanking: contestData?.globalRanking || null,
      topPercentage: contestData?.topPercentage || null
    };
    
  } catch (error) {
    console.error('Error fetching contest data:', error);
    return null;
  }
};

// Backup function using alternative method (web scraping approach)
export const fetchUserProfileBackup = async (username) => {
  try {
    // This is a fallback method using a proxy service
    const proxyUrl = `https://alfa-leetcode-api.onrender.com/${username}`;
    
    const response = await axios.get(proxyUrl);
    const data = response.data;
    
    return {
      username: data.name || username,
      realName: data.name || username,
      avatar: null,
      ranking: data.ranking || null,
      school: null,
      country: null,
      about: null,
      skillTags: [],
      
      totalSolved: data.totalSolved || 0,
      easySolved: data.easySolved || 0,
      mediumSolved: data.mediumSolved || 0,
      hardSolved: data.hardSolved || 0,
      
      acceptanceRate: data.acceptanceRate || 0,
      totalSubmissions: 0,
      acceptedSubmissions: 0
    };
    
  } catch (error) {
    console.error('Backup API also failed:', error);
    throw new Error('Unable to fetch user data from any source.');
  }
};