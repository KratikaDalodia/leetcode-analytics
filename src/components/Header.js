import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>LeetSync</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/compare" className="nav-link">Compare</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;