import React from 'react';
import LandingPage from './components/LandingPage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStarOfLife, faListCheck, faChartLine, faUsers, faHandsClapping } from '@fortawesome/free-solid-svg-icons';
import useFetch from './hooks/useFetch';
import Navbar from './components/Navbar';

library.add(faStarOfLife, faListCheck, faChartLine, faUsers, faHandsClapping);

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
      <div>
        <Navbar />
        <LandingPage boardGames={boardGames} />
      </div>
  );
}

export default App;
