import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import PropTypes from 'prop-types';
import './LandingPage.css';
import {
  FaStarOfLife,
  FaListCheck,
  FaChartLine,
  FaUsers,
  FaHandsClapping,
} from 'react-icons/fa6';
import TableItem from '../TableItem';

const iconMap = {
  'Based on your games': <FaStarOfLife />,
  Wishlist: <FaListCheck />,
  'On top': <FaChartLine />,
  'Best for a party': <FaUsers />,
};

const LandingPage = ({ boardGames }) => {
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
