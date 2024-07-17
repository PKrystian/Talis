import { useLocation } from 'react-router-dom';
import TableItem from './TableItem';

const SearchPage = ({boardGames}) => {
    const recommended_placeholder = "Wishlist";
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    console.log(boardGames);
    var sgame = boardGames.Wishlist.filter(game => game.name.toLowerCase().includes(query.toLowerCase()));
    return (
      <div>
        <div className="container text-left">
          <h1>Based on the search phrase: "{query}"</h1>
          <div className="d-flex flex-wrap">
              {sgame.map(game => (
                  <TableItem key={game.id} boardGame={game} />
                  ))}
          </div>
          <h1>Related to the search phrase</h1>
          <div className="d-flex flex-wrap">
            {boardGames[recommended_placeholder].map(boardGame => (
              <TableItem key={boardGame.id} boardGame={boardGame} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default SearchPage;
  