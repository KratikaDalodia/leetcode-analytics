// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FriendsList from '../components/FriendsList';
import UserCard from '../components/UserCard';
import { fetchUserProfile, fetchUserProfileBackup } from '../utils/leetcodeApi';

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load friends from localStorage
  useEffect(() => {
    const savedFriends = localStorage.getItem('leetcode-friends');
    if (savedFriends) {
      setFriends(JSON.parse(savedFriends));
    }
  }, []);

  // Real API search function
  const handleSearch = async (username) => {
    setLoading(true);
    setError('');
    setSearchResults([]);
    
    try {
      console.log('Searching for user:', username);
      
      // Try main API first
      let userData;
      try {
        userData = await fetchUserProfile(username);
        console.log('Data from main API:', userData);
      } catch (mainError) {
        console.log('Main API failed, trying backup:', mainError.message);
        // If main API fails, try backup
        userData = await fetchUserProfileBackup(username);
        console.log('Data from backup API:', userData);
      }
      
      setSearchResults([userData]);
      
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
      
      // If both APIs fail, show mock data for demo purposes
      if (error.message.includes('Unable to fetch')) {
        setError('APIs are having issues. Showing demo data instead.');
        const mockUser = {
          username: username,
          realName: username,
          avatar: null,
          ranking: Math.floor(Math.random() * 100000) + 10000,
          totalSolved: Math.floor(Math.random() * 1000) + 100,
          easySolved: Math.floor(Math.random() * 400) + 50,
          mediumSolved: Math.floor(Math.random() * 400) + 30,
          hardSolved: Math.floor(Math.random() * 200) + 10,
          acceptanceRate: (Math.random() * 30 + 50).toFixed(1),
          school: null,
          country: null
        };
        setSearchResults([mockUser]);
      }
    } finally {
      setLoading(false);
    }
  };

  const addFriend = (user) => {
    console.log('Adding friend:', user);
    
    const isAlreadyFriend = friends.some(friend => friend.username === user.username);
    if (!isAlreadyFriend) {
      const updatedFriends = [...friends, user];
      setFriends(updatedFriends);
      localStorage.setItem('leetcode-friends', JSON.stringify(updatedFriends));
    }
  };

  const isUserInFriends = (username) => {
    return friends.some(friend => friend.username === username);
  };

  return (
    <div className="home">
      <div className="container">
        <div className="hero">
          <h2>Analyze Your LeetCode Journey</h2>
          <p>Search for users, compare stats, and track your progress</p>
        </div>
        
        <SearchBar onSearch={handleSearch} loading={loading} />
        
        <div className="content-grid">
          <div className="main-content">
            <div className="search-results">
              {loading && (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Fetching real LeetCode data...</p>
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  <p>⚠️ {error}</p>
                </div>
              )}
              
              {searchResults.length > 0 && !loading && (
                <div className="results-section">
                  <h3>Search Results</h3>
                  <div className="user-cards">
                    {searchResults.map((user) => (
                      <UserCard
                        key={user.username}
                        user={user}
                        onAddFriend={addFriend}
                        isInFriends={isUserInFriends(user.username)}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {searchResults.length === 0 && !loading && !error && (
                <div className="no-results">
                  <p>Search for a LeetCode username to get started!</p>
                  <small>Try real usernames like: "lee215", "awice", "votrubac"</small>
                </div>
              )}
            </div>
          </div>
          
          <div className="sidebar">
            <FriendsList friends={friends} setFriends={setFriends} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;