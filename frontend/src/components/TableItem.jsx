import { useNavigate } from "react-router-dom";
import './TableItem.css';

const TableItem = ({ boardGame }) => {
  const navigate = useNavigate();

  const onClick = (boardGame) => {
    const boardGameString = encodeURIComponent(JSON.stringify(boardGame));
    navigate(`/game?boardGame=${ boardGameString }`);
  };

  const renderRangeText = (label, value1, value2 = null, suffix = '') => {
    if (! value1 && ! value2) return null;
    const text = value1 === value2 ? value1 : `${ value1 } - ${ value2 }`;
    return (
      <p className="card-text">
        <span className="fw-bold">{ label }: </span> { text } { suffix }
      </p>
    );
  };

  const renderText = (label, value) => (
    value && <p className="card-text"><span className="fw-bold">{ label }: </span> { value }</p>
  );

  return (
    <div key={ boardGame.id } className="card bg-dark text-white m-2">
      <img
        src={ boardGame.image_url }
        className="card-img-top"
        alt={ boardGame.name }
        onClick={ () => onClick(boardGame) }
      />
      <div className="card-body">
        <h5 className="card-title" onClick={ () => onClick(boardGame) }>{ boardGame.name }</h5>
        { renderText("Producer", boardGame.publisher) }
        { renderText("Categories", boardGame.category) }
        { renderText("Year", boardGame.year_published ) }
        { renderRangeText("Players", boardGame.min_players, boardGame.max_players) }
        { renderRangeText("Playtime", boardGame.min_playtime, boardGame.max_playtime, "mins") }
        { boardGame.age !== undefined && (
          <p className="card-text">
            <span className="fw-bold">Age: </span> { boardGame.age === 0 ? "Everyone" : `${ boardGame.age }+` }
          </p>
        )}
      </div>
    </div>
  );
};

export default TableItem;
