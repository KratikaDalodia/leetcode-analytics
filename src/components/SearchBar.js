import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    // TODO: Implement actual search
    console.log('Searching for:', username);
    setTimeout(() => {
      setLoading(false);
      // Mock result for now
      onSearch([{ username, solved: 150, ranking: 50000 }]);
    }, 1000);
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
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;