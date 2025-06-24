import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import FriendsList from '../components/FriendsList';

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="home">
      <div className="container">
        <div className="hero">
          <h2>Analyze Your LeetCode Journey</h2>
          <p>Search for users, compare stats, and track your progress</p>
        </div>
        
        <SearchBar onSearch={setSearchResults} />
        
        <div className="content-grid">
          <div className="main-content">
            {/* Search results will go here */}
          </div>
          <div className="sidebar">
            <FriendsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;