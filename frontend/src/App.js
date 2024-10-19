import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useFetch from './hooks/useFetch';
import LandingPage from './components/landingPage/LandingPage';
import MeetingsPage from './components/MeetingsPage';
import MarketplacePage from './components/MarketplacePage';
import Navbar from './components/Navbar';
import GamePage from './components/GamePage';
import UserPage from './components/user/UserPage';
import RegistrationPage from './components/user/RegistrationPage';
import SearchPage from './components/SearchPage';
import CollectionPage from './components/CollectionPage';
import Footer from './components/Footer';
import PolicyPage from './components/PolicyPage';
import LicensePage from './components/LicensePage';
import LoginModal from './components/utils/LoginModal';
import CreateEventPage from './components/CreateEventPage';

const App = () => {
  const apiPrefix =
    process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000/api/'
      : '/api/';
  const apiUrl = apiPrefix + 'board-games/';
  const { data: boardGames, isLoading, error } = useFetch(apiUrl);

  const [userState, setUserState] = useState(false);
  const [user, setUser] = useState({});

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

  if (isLoading) {
    return (
      <div className="text-center vh-100 align-content-center">
        <div className="spinner-border">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
        />
        {!userState && (
          <LoginModal
            apiPrefix={apiPrefix}
            userState={userState}
            setUserState={updateUserState}
            setUserData={updateUser}
          />
        )}
        <Routes apiPrefix={apiPrefix}>
          <Route
            path="/"
            element={
              <LandingPage boardGames={boardGames} apiPrefix={apiPrefix} />
            }
          />
          <Route path="/collection" element={<CollectionPage user={user} />} />
          <Route
            path="/meetings"
            element={<MeetingsPage apiPrefix={apiPrefix} user={user} />}
          />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/user" element={<UserPage user={user} />} />
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
