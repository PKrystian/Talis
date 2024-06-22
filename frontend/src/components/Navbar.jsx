import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import './Navbar.css';



const Navbar = () => {

  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${query}`);
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
            <img src={'/static/favicon.ico'} alt="Logo"  />
        </div>
        <form className="search-bar" onSubmit={handleSubmit}>
          <FontAwesomeIcon icon={faSearch} className="nav-icon" />
          <input type="text" className="search-input" placeholder="Search..."  onChange={(e) => setQuery(e.target.value)}/>
        </form>
      </div>
      <ul className="navbar-links">
        <li><Link to="/"><FontAwesomeIcon icon={faBars} className="nav-icon" /> My Collection</Link></li>
        <li><Link to="/search">Local Game Meetings</Link></li>
        <li><Link to="/contact">Marketplace</Link></li>
      </ul>
      <div className="navbar-user">
        <li><a href="/user"><FontAwesomeIcon icon={faUser} className="nav-icon" /> User</a></li>
      </div>
    </nav>
  );
}

export default Navbar;
