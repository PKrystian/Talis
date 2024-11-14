import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropsTypes from 'prop-types';
import {
  FaSearch,
  FaUserFriends,
  FaMapPin,
  FaCog,
  FaBullhorn,
  FaSignOutAlt,
  FaUser,
  FaBell,
} from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Navbar.css';
import { TOP_CATEGORY_LIST, TOP_MECHANIC_LIST } from '../messages/suggestions';
import LoginButton from './utils/LoginButton';

const Navbar = ({ apiPrefix, user, userState, resetUser, inviteCount }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchFormRef = useRef(null);
  const userDropdownRef = useRef(null);
  const cancelTokenSource = useRef(null);

  const categoryOptions = TOP_CATEGORY_LIST;
  const mechanicOptions = TOP_MECHANIC_LIST;

  useEffect(() => {
    if (query.length >= 3 && isInputFocused) {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel();
      }
      cancelTokenSource.current = axios.CancelToken.source();

      axios
        .get(apiPrefix + 'search/', {
          params: { query, limit: 5, filterType, filter },
          cancelToken: cancelTokenSource.current.token,
        })
        .then((response) => {
          setSuggestions(response.data.results);
        })
        .catch((error) => {
          if (!axios.isCancel(error)) {
            console.error('Error fetching suggestions:', error);
          }
        });
    } else {
      setSuggestions([]);
    }
  }, [query, filterType, filter, isInputFocused, apiPrefix]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }
    navigate(
      `/search?query=${encodeURIComponent(query)}&filterType=${encodeURIComponent(filterType)}&filter=${encodeURIComponent(filter)}&sort=rating_desc`,
    );
  };

  const handleClickOutsideSuggestions = (e) => {
    if (searchFormRef.current && !searchFormRef.current.contains(e.target)) {
      setSuggestions([]);
      setIsInputFocused(false);
    }
  };

  const handleClickOutsideUserDropdown = (e) => {
    if (
      userDropdownRef.current &&
      !userDropdownRef.current.contains(e.target)
    ) {
      setShowUserDropdown(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');

    axios
      .post(apiPrefix + 'logout/', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((resp) => {
        if (resp.status === 200) {
          resetUser();
          navigate('/');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideSuggestions);
    document.addEventListener('mousedown', handleClickOutsideUserDropdown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSuggestions);
      document.removeEventListener('mousedown', handleClickOutsideUserDropdown);
    };
  }, []);

  const onUserProfileClick = () => setShowUserDropdown(!showUserDropdown);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <div className="d-flex align-items-center">
            <img
              src="/static/logo512.png"
              alt="Logo"
              className="navbar-logo me-2"
            />
            <span className="site-name">Talis</span>
          </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <form
            ref={searchFormRef}
            className="d-flex mx-auto flex-nowrap form-search mt-2"
            onSubmit={handleSubmit}
          >
            <input
              className="form-control flex-grow-1"
              type="search"
              placeholder="Search Talis"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
            />
            <button
              className="btn form-button btn-outline-light flex-shrink-0 mx-1"
              type="submit"
              aria-label="Search"
            >
              <FaSearch />
            </button>
            {suggestions.length > 0 && isInputFocused && (
              <div className="search-suggestions bg-dark position-absolute w-50 top-100">
                <ul className="list-group">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="list-group-item list-group-item-action list-group-item-dark"
                      onClick={() => navigate(`/game/${suggestion.id}`)}
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
              {user.user_id && (
                <li className="nav-item">
                  <Link className="nav-link" to="/collection">
                    <HiSquaresPlus className="me-1" />
                    My Library
                  </Link>
                </li>
              )}
              {user.user_id && (
                <li className="nav-item">
                  <Link className="nav-link" to="/events">
                    <FaLocationDot className="me-1" />
                    Local Game Meetings
                  </Link>
                </li>
              )}
              {userState && (
                <li className="nav-item">
                  <button
                    className="nav-link"
                    data-bs-toggle="modal"
                    data-bs-target="#notifications"
                  >
                    <div
                      className={
                        inviteCount > 0
                          ? 'notification-pending'
                          : 'notification-none'
                      }
                    >
                      {inviteCount}
                    </div>
                    <FaBell />
                  </button>
                </li>
              )}
              {userState ? (
                <li className="nav-item nav-user-profile mx-1">
                  <button className="nav-link" onClick={onUserProfileClick}>
                    <img
                      src={
                        user.profile_image_url || '/static/default-profile.png'
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/static/default-profile.png';
                      }}
                      alt="User Profile"
                      className="rounded-circle me-1 small-avatar"
                    />
                  </button>
                  {showUserDropdown ? (
                    <div
                      ref={userDropdownRef}
                      className="user-dropdown row bg-dark"
                    >
                      <Link
                        className="nav-user-profile-link pb-2"
                        to={`/user/${user.user_id}`}
                      >
                        <FaUser className="me-1" />
                        Profile
                      </Link>
                      <Link
                        className="nav-user-profile-link pb-2"
                        to={`/friends`}
                      >
                        <FaUserFriends className="me-1" />
                        Friends
                      </Link>
                      <Link
                        className="nav-user-profile-link pb-2"
                        to="/user-events"
                      >
                        <FaMapPin className="me-1" />
                        Scheduled Meetings
                      </Link>
                      <Link
                        className="nav-user-profile-link pb-2"
                        to="/settings"
                      >
                        <FaCog className="me-1" />
                        Settings
                      </Link>
                      <Link
                        className="nav-user-profile-link pb-2"
                        to="https://www.trustpilot.com/review/talis.live"
                        target="_blank"
                      >
                        <FaBullhorn className="me-1" />
                        Send Feedback
                      </Link>
                      <Link
                        className="nav-user-profile-link pb-2"
                        onClick={logout}
                      >
                        <FaSignOutAlt className="me-1" />
                        Log Out
                      </Link>
                    </div>
                  ) : null}
                </li>
              ) : (
                <li className="d-inline-flex">
                  <div className="mx-1">
                    <Link className="btn btn-secondary" to="/register">
                      Register
                    </Link>
                  </div>
                  <div className="mx-1">
                    <LoginButton
                      ButtonTag={'button'}
                      buttonClass={'btn btn-primary'}
                      buttonText={'Login'}
                    />
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  apiPrefix: PropsTypes.string.isRequired,
  user: PropsTypes.object,
  setUserData: PropsTypes.func.isRequired,
  userState: PropsTypes.bool.isRequired,
  setUserState: PropsTypes.func.isRequired,
  resetUser: PropsTypes.func.isRequired,
  inviteCount: PropsTypes.number,
}.isRequired;

export default Navbar;
