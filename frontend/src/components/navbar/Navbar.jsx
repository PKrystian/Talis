import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropsTypes from 'prop-types';
import {
  FaUserFriends,
  FaCog,
  FaBullhorn,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import { MagnifyingGlass, Equals, MapPin, Bell } from '@phosphor-icons/react';
import { MdAddHome } from 'react-icons/md';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Navbar.css';
import LoginButton from '../utils/login/button/LoginButton';
import { toast } from 'react-toastify';

const Navbar = ({ apiPrefix, user, userState, resetUser, inviteCount }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [filterType] = useState('');
  const [filter] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchFormRef = useRef(null);
  const userDropdownRef = useRef(null);
  const cancelTokenSource = useRef(null);

  const [isFloating, setIsFloating] = useState(false);

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
            toast.error(error.response.data.error, {
              theme: 'dark',
              position: 'top-center',
            });
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
          toast.success('Logged out successfully', {
            theme: 'dark',
            position: 'top-center',
          });
          resetUser();
          navigate('/');
        }
      })
      .catch((error) => {
        toast.error(error.response.data.error, {
          theme: 'dark',
          position: 'top-center',
        });
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

  const checkScrollPosition = () => {
    if (window.scrollY > 50) {
      setIsFloating(true);
    } else {
      setIsFloating(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition, { passive: true });
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark fixed-top px-5 ${isFloating ? 'navbar-floating' : ''}`}
    >
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/static/logo512.png"
            alt="Logo"
            className="navbar-logo me-2"
          />
          <span className="site-name">Talis</span>
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
              className="navbar-search"
              type="search"
              placeholder="Search Talis"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
            />
            <button
              className="navbar-search-submit"
              type="submit"
              aria-label="Search"
            >
              <MagnifyingGlass size={20} />
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
          {user.user_id && (
            <div className="mx-auto">
              <ul className="navbar-nav">
                <li className="nav-item me-2">
                  <Link
                    className="nav-link navbar-text d-flex align-items-center"
                    to="/collection"
                  >
                    <Equals size={24} className="me-2" />
                    <div>My Collection</div>
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link
                    className="nav-link navbar-text d-flex align-items-center"
                    to="/events"
                  >
                    <MapPin size={24} className="me-2" />
                    <div>Local Game Meetings</div>
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <div className={`me-0${userState ? ' mx-auto' : ''}`}>
            <ul className="navbar-nav me-auto">
              {userState && (
                <li className="nav-item me-2">
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
                    <Bell size={24} />
                  </button>
                </li>
              )}
              {userState ? (
                <li className="nav-item navbar-profile nav-user-profile mx-1">
                  <button
                    ref={userDropdownRef}
                    className="nav-link"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
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
                        <MapPin size={20} className="me-1" />
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
                        to="/game-add"
                      >
                        <MdAddHome className="me-1" />
                        Add Game
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
                  <LoginButton
                    ButtonTag={'button'}
                    buttonClass={'navbar-button login mx-1'}
                    buttonText={'Log In'}
                  />
                  <Link className="mx-1" to="/register">
                    <button className="navbar-button register">Sign up</button>
                  </Link>
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
