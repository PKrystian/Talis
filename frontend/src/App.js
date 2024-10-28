import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import MeetingsPage from './components/MeetingsPage';
import MarketplacePage from './components/MarketplacePage';
import Navbar from './components/Navbar';
import GamePage from './components/GamePage';
import UserProfilePage from './components/user/UserProfilePage';
import RegistrationPage from './components/user/RegistrationPage';
import SearchPage from './components/SearchPage';
import CollectionPage from './components/CollectionPage';
import Footer from './components/Footer';
import PolicyPage from './components/PolicyPage';
import LicensePage from './components/LicensePage';
import LoginModal from './components/utils/LoginModal';
import CreateEventPage from './components/CreateEventPage';
import FriendListPage from './components/FriendListPage';
import CookieConsentModal from './components/utils/CookieConsentModal';
import NotificationModal from './components/utils/NotificationModal';
import axios from 'axios';

const App = () => {
  const apiPrefix =
    process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000/api/'
      : '/api/';

  const [userState, setUserState] = useState(false);
  const [user, setUser] = useState({});

  const [invites, setInvites] = useState([]);

  const updateUserState = (userStateData) => {
    setUserState(userStateData);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const resetUser = () => {
    setUser({});
    setUserState(false);
  };

  useEffect(() => {
    if (userState) {
      axios
        .post(
          apiPrefix + 'invite/get/',
          { user_id: user.user_id },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .then((resp) => {
          setInvites(resp.data);
        });
    }
  }, [user]);

  return (
    <Router>
      <div className="page-content">
        <Navbar
          apiPrefix={apiPrefix}
          userState={userState}
          setUserState={updateUserState}
          user={user}
          setUserData={updateUser}
          resetUser={resetUser}
          inviteCount={invites.length}
        />
        {!userState && (
          <LoginModal
            apiPrefix={apiPrefix}
            userState={userState}
            setUserState={updateUserState}
            setUserData={updateUser}
          />
        )}
        {userState && invites.length > 0 && (
          <NotificationModal invites={invites} />
        )}
        {userState && user.cookie_consent === null && (
          <CookieConsentModal
            apiPrefix={apiPrefix}
            user={user}
            setUser={updateUser}
          />
        )}
        <Routes apiPrefix={apiPrefix}>
          <Route
            path="/"
            element={<LandingPage apiPrefix={apiPrefix} user={user} />}
          />
          <Route path="/collection" element={<CollectionPage user={user} />} />
          <Route
            path="/meetings"
            element={<MeetingsPage apiPrefix={apiPrefix} user={user} />}
          />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route
            path="/register"
            element={
              <RegistrationPage
                apiPrefix={apiPrefix}
                userState={userState}
                setUserData={updateUser}
                setUserState={updateUserState}
              />
            }
          />
          <Route
            path="/game/:id"
            element={<GamePage apiPrefix={apiPrefix} user={user} />}
          />
          <Route
            path="/user/:id"
            element={<UserProfilePage apiPrefix={apiPrefix} user={user} />}
          />
          <Route
            path="/friends"
            element={<FriendListPage apiPrefix={apiPrefix} user={user} />}
          />
          <Route
            path="/search"
            element={<SearchPage apiPrefix={apiPrefix} />}
          />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/license" element={<LicensePage />} />
          <Route
            path="/create-event"
            element={
              <CreateEventPage
                apiPrefix={apiPrefix}
                user={user}
                userState={userState}
              />
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
