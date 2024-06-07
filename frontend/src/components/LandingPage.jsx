import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TableItem from './TableItem';

const iconMap = {
  "Based on your games": "star-of-life",
  "Wishlist": "list-check",
  "On top recently": "chart-line",
  "Best for a party": "users",
  "Best ice breaker": "hands-clapping",
};

const LandingPage = ({ boardGames }) => {
  return (
    <div className="container mt-4">
      {Object.keys(boardGames).map(category => (
        <div key={category} className="mb-5">
          <h3 className="text-light">
              <FontAwesomeIcon icon={iconMap[category]} className="mr-2 me-3" />
              {category}
          </h3>
          <div className="d-flex overflow-auto">
            {boardGames[category].map(boardGame => (
              <TableItem boardGame={boardGame} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandingPage;
