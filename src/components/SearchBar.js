// src/components/SearchBar.js
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, loading }) => {
  const [username, setUsername] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    onSearch(username.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <div className="search-input-group">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Enter LeetCode username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading || !username.trim()} 
          className="search-button"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      <div className="search-suggestions">
        <small>Try: "test", "user123", or any username</small>
      </div>
    </form>
  );
};

export default SearchBar;