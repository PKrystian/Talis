import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarOfLife, faListCheck, faChartLine, faUsers, faHandsClapping } from '@fortawesome/free-solid-svg-icons';
import TableItem from './TableItem';

const iconMap = {
  "Based on your games": faStarOfLife,
  "Wishlist": faListCheck,
  "On top recently": faChartLine,
  "Best for a party": faUsers,
  "Best ice breaker": faHandsClapping,
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
              <TableItem key={boardGame.id} boardGame={boardGame} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandingPage;
