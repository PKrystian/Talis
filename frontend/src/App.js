import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useFetch from './hooks/useFetch';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import UserPage from './components/UserPage';
import Navbar from './components/Navbar';
import GamePage from './components/GamePage'
import RegistrationPage from './components/RegistrationPage';
import SearchPage from './components/SearchPage';

const App = () => {
  const apiPrefix = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/' : '/api/';
  const apiUrl = apiPrefix + 'board-games/'
  const { data: boardGames, isLoading, error } = useFetch(apiUrl);

  if (isLoading) {
    return (
      <div className="text-center vh-100 align-content-center">
        <div className='spinner-border'>
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
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={ <LandingPage boardGames={ boardGames } />} />
          <Route path="/about" element={ <AboutPage /> } />
          <Route path="/contact" element={ <ContactPage /> } />
          <Route path="/user" element={ <UserPage /> } />
          <Route path="/register" element={ <RegistrationPage apiPrefix={ apiPrefix } /> } />
          <Route path="/game" element={ <GamePage /> } />
          <Route path="/search" element={<SearchPage boardGames={boardGames} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
