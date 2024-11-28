import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './LandingPage.css';
import {
  Asterisk,
  ChartLineUp,
  Confetti,
  Sparkle,
} from '@phosphor-icons/react';
import TableItem from '../TableItem';
import axios from 'axios';
import LandingPagePlaceholder from './LandingPagePlaceholder';

const iconMap = {
  'Based on your games': <Asterisk size={24} color="#FF6584" />,
  Wishlist: <Sparkle size={24} color="#9FC4F3" />,
  'On top': <ChartLineUp size={24} color="#F3DE9F" />,
  'Best for a party': <Confetti size={24} color="#9FF3A9" />,
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
  }, [apiPrefix, user]);

  if (isLoading) {
    return <LandingPagePlaceholder />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container-fluid landing-page-container">
      {Object.keys(boardGames).map((category) => (
        <div key={category} className="mb-5">
          <h5 className="text-light d-flex align-items-center ms-5">
            {iconMap[category]} <span className="ms-1">{category}</span>
          </h5>
          <div className="lading-page-card-container g-2 px-5">
            {boardGames[category].map((boardGame) => (
              <div key={boardGame.id} className="d-flex justify-content-center">
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
