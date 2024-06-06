import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStarOfLife, faListCheck, faChartLine, faUsers, faHandsClapping } from '@fortawesome/free-solid-svg-icons';

library.add(faStarOfLife, faListCheck, faChartLine, faUsers, faHandsClapping);

const App = () => {
  const [boardGames, setBoardGames] = useState({});

  useEffect(() => {
    const apiUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/board-games/' : '/api/board-games/';

    const fetchBoardGames = async () => {
      try {
        const response = await axios.get(apiUrl);
        setBoardGames(response.data);
      } catch (error) {
        console.error('Error fetching boardGames:', error);
      }
    };

    fetchBoardGames().then();
  }, []);

  return (
    <div>
      <LandingPage boardGames={boardGames} />
    </div>
  );
}

export default App;
