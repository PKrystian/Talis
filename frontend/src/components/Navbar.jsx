import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser } from 'react-icons/fa';
import { FaLocationDot, FaShop } from "react-icons/fa6";
import { HiSquaresPlus } from "react-icons/hi2";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Navbar.css';
import {TOP_CATEGORY_LIST, TOP_MECHANIC_LIST} from "../messages/suggestions";

const Navbar = ({ apiPrefix, user, userState }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchFormRef = useRef(null);

  const categoryOptions = TOP_CATEGORY_LIST;
  const mechanicOptions = TOP_MECHANIC_LIST;

  useEffect(() => {
    if (query.length >= 3 && isInputFocused) {

      axios.get(apiPrefix + 'search/', { params: { query, limit: 5, filterType, filter } })
        .then(response => {
          setSuggestions(response.data.results);
        })
        .catch(error => {
          console.error("There was an error fetching the search results!", error);
        });
    } else {
      setSuggestions([]);
    }
  }, [query, filterType, filter, isInputFocused]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${query}&filterType=${filterType}&filter=${filter}`);
  };

  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    let selectedFilterType = '';

    if (categoryOptions.includes(selectedValue)) {
      selectedFilterType = 'Category';
    } else if (mechanicOptions.includes(selectedValue)) {
      selectedFilterType = 'Mechanic';
    }

    setFilter(selectedValue);
    setFilterType(selectedFilterType);
  };

  const handleClickOutside = (e) => {
    if (searchFormRef.current && !searchFormRef.current.contains(e.target)) {
      setSuggestions([]);
      setIsInputFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to='/'>
          <div className="d-flex align-items-center">
            <img src='/static/favicon.ico' alt="Logo" className="navbar-logo me-2"/>
            <span className="site-name">Talis</span>
            <span className="wip-badge ms-2">WIP</span>
          </div>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <form ref={searchFormRef} className="d-flex mx-auto flex-nowrap form-search mt-2" onSubmit={handleSubmit}>
            <select className="form-select flex-shrink-0 w-auto mx-lg-1" value={filter} onChange={handleFilterChange}>
              <option value="">All</option>
              <optgroup label="Category:">
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </optgroup>
              <optgroup label="Mechanic:">
                {mechanicOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </optgroup>
            </select>
            <input
              className="form-control flex-grow-1 mx-lg-1"
              type="search"
              placeholder="Search Talis"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
            />
            <button
              className="btn form-button btn-outline-light flex-shrink-0 mx-lg-1"
              type="submit"
            >
              <FaSearch />
            </button>
            <button
              className="btn form-button btn-outline-light flex-shrink-0 mx-lg-1"
              type="button"
              onClick={() => navigate(`/search?query=${query}&filterType=${filterType}&filter=${filter}`)}>
              Advanced
            </button>
            {suggestions.length > 0 && isInputFocused && (
              <div className="search-suggestions bg-dark position-absolute w-50 top-100">
                <ul className="list-group">
                  {suggestions.map(suggestion => (
                    <li
                      key={suggestion.id}
                      className="list-group-item list-group-item-action list-group-item-dark"
                      onClick={() => navigate(`/game?boardGame=${encodeURIComponent(JSON.stringify(suggestion))}`)}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
          <div className="navbar-nav-wrapper">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/collection"><HiSquaresPlus className="me-1"/>My Collection</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/meetings"><FaLocationDot className="me-1"/>Local Game Meetings</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/marketplace"><FaShop className="me-1"/>Marketplace</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/user"><FaUser className="me-1" />{ userState ? user.username : 'User' }</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
