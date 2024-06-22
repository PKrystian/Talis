import { useLocation } from 'react-router-dom';
import TableItem from './TableItem';
import './SearchPage.css';

const SearchPage = ({boardGames}) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    var sgame = boardGames.Wishlist.filter(game => game.name.toLowerCase().includes(query.toLowerCase()));
    return (
      <div>
        <div className="container text-center">
          <h1>Search Page for: {query}</h1>
            <div className="d-flex">
                {sgame.map(game => (
                    <TableItem key={game.id} boardGame={game} />
                    ))}
            </div>
        </div>
      </div>
    );
  }
  
  export default SearchPage;
  