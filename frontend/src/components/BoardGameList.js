import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BoardGameList = () => {
  const [boardGames, setBoardGames] = useState([]);

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
      <h2>Board Game List</h2>
      <ul>
        {boardGames && boardGames.map(boardGame => (
          <li key={boardGame.id}>{boardGame.name} - {boardGame.year_published} - {boardGame.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default BoardGameList;
