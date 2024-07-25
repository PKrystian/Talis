import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import { FaStarOfLife, FaListCheck, FaChartLine, FaUsers, FaHandsClapping } from 'react-icons/fa6';
import TableItem from './TableItem';

const iconMap = {
  "Based on your games": <FaStarOfLife />,
  "Wishlist": <FaListCheck />,
  "On top recently": <FaChartLine />,
  "Best for a party": <FaUsers />,
  "Best ice breaker": <FaHandsClapping />,
};

const LandingPage = ({ boardGames }) => {
  return (
    <div className="container mt-4">
      {Object.keys(boardGames).map(category => (
        <div key={category} className="mb-5">
          <h3 className="text-light">
            { iconMap[category] } <span className="me-3">{ category }</span>
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
