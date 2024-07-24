import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useFetch from './hooks/useFetch';
import LandingPage from './components/LandingPage';
import MeetingsPage from './components/MeetingsPage';
import MarketplacePage from './components/MarketplacePage';
import UserPage from './components/UserPage';
import Navbar from './components/Navbar';
import GamePage from './components/GamePage'
import RegistrationPage from './components/RegistrationPage';
import SearchPage from './components/SearchPage';
import CollectionPage from "./components/CollectionPage";
import Footer from "./components/Footer";
import PolicyPage from "./components/PolicyPage";

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
          <Route path="/collection" element={ <CollectionPage /> } />
          <Route path="/meetings" element={ <MeetingsPage /> } />
          <Route path="/marketplace" element={ <MarketplacePage /> } />
          <Route path="/user" element={ <UserPage /> } />
          <Route path="/register" element={ <RegistrationPage /> } />
          <Route path="/game" element={ <GamePage /> } />
          <Route path="/search" element={<SearchPage boardGames={boardGames} />} />
          <Route path="/policy" element={< PolicyPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
