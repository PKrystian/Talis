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

const App = () => {
  const apiUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/board-games/' : '/api/board-games/';
  const { data: boardGames, isLoading, error } = useFetch(apiUrl);

  if (isLoading) {
    return <div>Loading...</div>;
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
          <Route path="/register" element={ <RegistrationPage /> } />
          <Route path="/game" element={ <GamePage /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
