import { useLocation } from "react-router-dom";
import './GamePage.css';

const GamePage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const boardGameString = params.get('boardGame');
    const boardGame = boardGameString ? JSON.parse(decodeURIComponent(boardGameString)) : null;

    return (
      <div className="container game-page">
        <div className="game-image">
            <img src={ boardGame.image_url } className="boardgame-img" alt={ boardGame.name }/>
        </div>
        <div className="game-info">
            <h1 className="game-title">{ boardGame.name }</h1>
            <p className="game-descritpion">Here is space for description</p>
            <div className="basic-info">
                <div className="basic-info-item">
                    <p className="game-description"><span className="bold-text">No. of players: </span> { boardGame.min_players }-{ boardGame.max_players }</p>
                </div>
                <div className="basic-info-item">
                    <p className="game-description"><span className="bold-text">Playtime:</span> { boardGame.min_playtime }-{ boardGame.max_playtime }</p>
                </div>
                <div className="basic-info-item">
                    <p className="game-description"><span className="bold-text">Recommended age:</span> { boardGame.age }+</p>
                </div>
            </div>
            <div className="other-info">
                <p className="game-description"><span className="bold-text">Publisher:</span> { boardGame.publisher }</p>
            </div>
        </div>
      </div>
    )
  }
  
  export default GamePage;
