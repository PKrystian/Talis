import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to='/'>
            <img src={'/static/favicon.ico'} alt="Logo"  />
          </Link>
        </div>
        <form className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="nav-icon" />
          <input type="text" className="search-input" placeholder="Search..." />
        </form>
      </div>
      <ul className="navbar-links">
        <li><Link to="/"><FontAwesomeIcon icon={faBars} className="nav-icon" /> My Collection</Link></li>
        <li><Link to="/about">Local Game Meetings</Link></li>
        <li><Link to="/contact">Marketplace</Link></li>
      </ul>
      <div className="navbar-user">
        <li><a href="/user"><FontAwesomeIcon icon={faUser} className="nav-icon" /> User</a></li>
      </div>
    </nav>
  );
}

export default Navbar;
