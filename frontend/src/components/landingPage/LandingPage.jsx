import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './LandingPage.css';
import {
  FaStarOfLife,
  FaListCheck,
  FaChartLine,
  FaUsers,
} from 'react-icons/fa6';
import TableItem from '../TableItem';
import axios from 'axios';

const iconMap = {
  'Based on your games': <FaStarOfLife />,
  Wishlist: <FaListCheck />,
  'On top': <FaChartLine />,
  'Best for a party': <FaUsers />,
};

const LandingPage = ({ apiPrefix, user }) => {
  const [boardGames, setBoardGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      axios
        .post(
          apiPrefix + 'board-games/',
          { user_id: user.user_id },
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        )
        .then((resp) => {
          setBoardGames(resp.data);
          setIsLoading(false);
        });
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }, [user]);

  console.log(boardGames);

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
    <div className="container mt-4">
      {Object.keys(boardGames).map((category) => (
        <div key={category} className="mb-5">
          <h3 className="text-light">
            {iconMap[category]} <span className="me-3">{category}</span>
          </h3>
          <div className="row g-2">
            {boardGames[category].map((boardGame) => (
              <div key={boardGame.id} className="col-12 col-sm-5 col-lg-2">
                <TableItem boardGame={boardGame} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

LandingPage.propTypes = {
  boardGames: PropTypes.object.isRequired,
}.isRequired;

export default LandingPage;
