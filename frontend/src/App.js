import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import EventsPage from './components/events/EventsPage';
import UserEventsPage from './components/events/UserEventsPage';
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
import CreateEventPage from './components/events/CreateEventPage';
import FriendListPage from './components/FriendListPage';
import CookieConsentModal from './components/utils/CookieConsentModal';
import NotificationModal from './components/utils/NotificationModal';
import axios from 'axios';
import LoginForgotPasswordModal from './components/utils/LoginForgotPasswordModal';
import ForgotPasswordPage from './components/user/ForgotPasswordPage';
import SettingsPage from './components/SettingsPage';
import GameAddPage from './components/GameAddPage';
import EventSinglePage from './components/events/EventSinglePage';
import AccountVerificationModal from './components/user/AccountVerificationModal';
import VerifyAccount from './components/user/VerifyAccount';
import MetaComponent from './components/meta/MetaComponent';

const App = () => {
  const apiPrefix =
    process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000/api/'
      : '/api/';

  const [userState, setUserState] = useState(false);
  const [user, setUser] = useState({});

  const [invites, setInvites] = useState([]);

  const resetUser = () => {
    setUser({});
    setUserState(false);
  };

  const fetchInvites = () => {
    axios
      .post(
        apiPrefix + 'invite/get/',
        { user_id: user.user_id },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      .then((resp) => {
        setInvites(resp.data);
      });
  };

  useEffect(() => {
    if (userState) {
      fetchInvites();
    }
  }, [userState]);

  return (
    <Router>
      <MetaComponent
        title="Talis - Board Game Helper"
        description="Talis is an application designed to help users search for a selection of board games and organize them within their own library. Discover new games and share them with your friends."
      />
      <div className="page-content">
        {userState && !user.is_active && <AccountVerificationModal />}
        {!userState || user.is_active ? (
          <Navbar
            apiPrefix={apiPrefix}
            userState={userState}
            user={user}
            resetUser={resetUser}
            inviteCount={invites.length}
          />
        ) : (
          ''
        )}
        {!userState && (
          <LoginModal
            apiPrefix={apiPrefix}
            userState={userState}
            setUserState={setUserState}
            setUserData={setUser}
          />
        )}
        {!userState && (
          <LoginForgotPasswordModal
            apiPrefix={apiPrefix}
            userState={userState}
          />
        )}
        {userState && invites && (
          <NotificationModal
            apiPrefix={apiPrefix}
            user={user}
            invites={invites}
            fetchInvites={fetchInvites}
          />
        )}
        {userState && user.cookie_consent === null && user.is_active && (
          <CookieConsentModal
            apiPrefix={apiPrefix}
            user={user}
            setUser={setUser}
          />
        )}
        <Routes apiPrefix={apiPrefix}>
          <Route
            path="/"
            element={<LandingPage apiPrefix={apiPrefix} user={user} />}
          />
          <Route path="/collection" element={<CollectionPage user={user} />} />
          <Route
            path="/events"
            element={<EventsPage apiPrefix={apiPrefix} user={user} />}
          />
          <Route
            path="/user-events"
            element={<UserEventsPage apiPrefix={apiPrefix} user={user} />}
          />
          <Route
            path="/events/:event_id"
            element={<EventSinglePage apiPrefix={apiPrefix} user={user} />}
          />
          <Route
            path="/register"
            element={
              <RegistrationPage
                apiPrefix={apiPrefix}
                userState={userState}
                setUserData={setUser}
                setUserState={setUserState}
              />
            }
          />
          <Route
            path="/verify/:token"
            element={
              <VerifyAccount
                apiPrefix={apiPrefix}
                user={user}
                setUserState={setUserState}
                setUserData={setUser}
              />
            }
          />
          <Route
            path="/forgot-password/:token"
            element={
              <ForgotPasswordPage apiPrefix={apiPrefix} userState={userState} />
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
          <Route
            path="/settings"
            element={<SettingsPage apiPrefix={apiPrefix} user={user} />}
          />
          <Route
            path="/game-add"
            element={<GameAddPage apiPrefix={apiPrefix} user={user} />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
