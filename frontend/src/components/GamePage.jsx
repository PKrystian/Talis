import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClock, faStar } from '@fortawesome/free-solid-svg-icons';
import './GamePage.css';

const GamePage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const boardGameString = params.get('boardGame');
    const boardGame = boardGameString ? JSON.parse(decodeURIComponent(boardGameString)) : null;
    return (
    <div className="container">
        <div className="game-content">
            <div className="game-image">
                <img src={ boardGame.image_url } className="boardgame-img" alt={ boardGame.name }/>
            </div>
            <div className="game-info">
                <h1 className="game-title">{ boardGame.name }</h1>
                <div className="basic-game-info">
                    <div className="basic-info-item">
                        <FontAwesomeIcon icon={faUsers} className="nav-icon basic-game-icon" />
                        <div className="basic-info-text">{ boardGame.min_players }-{ boardGame.max_players } Players</div>
                    </div>
                    <div className="basic-info-item">
                        <FontAwesomeIcon icon={faClock} className="nav-icon basic-game-icon" />
                        <div className="basic-info-text">{ boardGame.min_playtime }-{ boardGame.max_playtime } Min</div>
                    </div>
                    <div className="basic-info-item">
                        <div className="circle">{ boardGame.age }+</div>
                    </div>
                </div>
                <div className="other-info">
                    <p className="game-description"><span className="bold-text">Publisher:</span> { boardGame.publisher }</p>
                </div>
            </div>
            <div className="additional-info">
                <div className="additional-info-item">
                    <p><FontAwesomeIcon icon={faStar} className="nav-icon basic-game-icon" /><span style={{ marginLeft: '5px', verticalAlign: '12px' }}>7.7/10</span></p>
                </div>
            </div>
        </div>
    </div>
    );
  }
  
  export default GamePage;
