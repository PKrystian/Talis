import React from "react";
import './Navbar.css';
import { FaSearch, FaUser, FaBars } from 'react-icons/fa';


const Navbar = () =>{

    return(
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
            <img src={'/static/favicon.ico'} alt="Logo"  />
        </div>
        <form className="search-bar">
            <FaSearch className="nav-icon" />
            <input type="text" className="search-input" placeholder="Search..."></input>
        </form>
      </div>
      <ul className="navbar-links">
        <li><a href="/"><FaBars className="nav-icon" />My Collection</a></li>
        <li><a href="/about">Local Game Meetings</a></li>
        <li><a href="/contact">Marketplace</a></li>
      </ul>
      <div className="navbar-user">
        <li><a href="#user"><FaUser className="nav-icon" /> User</a></li>
      </div>
    </nav>
    );
}

export default Navbar;