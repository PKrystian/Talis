import { useLocation } from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClock, faStar, faClipboardList, faPlus, faShare } from '@fortawesome/free-solid-svg-icons';
import './GamePage.css';

const GamePage = () => {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const descriptionRef = useRef(null);
    const params = new URLSearchParams(location.search);
    const boardGameString = params.get('boardGame');
    const boardGame = boardGameString ? JSON.parse(decodeURIComponent(boardGameString)) : null;
    console.log(boardGame);
    const { min_playtime, max_playtime} = boardGame;
    const playtime = min_playtime !== max_playtime ? `${min_playtime}-${max_playtime}` : min_playtime;
    console.log(playtime);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (descriptionRef.current) {
          const { clientHeight, scrollHeight } = descriptionRef.current;
          setIsOverflowing(scrollHeight > clientHeight);
        }
      }, []);

    return (
    <div className="container">
        <div className="row ml-0">
            <div className="col-sm-auto text-center">
                <img src={ boardGame.image_url } className="boardgame-img" alt={ boardGame.name }/>
            </div>
            <div className="col flex-grow">
                <h1 className="game-title">{ boardGame.name }</h1>
                <div className="basic-game-info mb-3 mt-4 d-flex">
                    <div className="basic-info-item px-3 d-flex flex-column">
                        <FontAwesomeIcon icon={faUsers} className="nav-icon basic-game-icon" />
                        <div className="basic-info-text">{ boardGame.min_players }-{ boardGame.max_players } Players</div>
                    </div>
                    <div className="basic-info-item px-3 d-flex flex-column">
                        <FontAwesomeIcon icon={faClock} className="nav-icon basic-game-icon" />
                        <div className="basic-info-text">{ playtime } Min</div>
                    </div>
                    <div className="basic-info-item px-3 d-flex flex-column">
                        <div className="circle">{ boardGame.age }+</div>
                    </div>
                </div>
                <div className="other-info">
                    <p><span className="bold-text">Publisher:</span> { boardGame.publisher }</p>
                </div>
            </div>
            <div className="mt-3 col">
                <p><FontAwesomeIcon icon={faStar} className="nav-icon basic-game-icon" /><span style={{ marginLeft: '5px', verticalAlign: '12px' }}>7.7/10</span></p>
                <div className="game-page-user-action d-flex">
                    <div className="game-page-user-action-item text-center">
                        <p><FontAwesomeIcon icon={faClipboardList} className="nav-icon basic-game-icon" /></p>
                        <p>Add to Wishlist</p>
                    </div>
                    <div className="game-page-user-action-item text-center">
                        <p><FontAwesomeIcon icon={faPlus} className="nav-icon basic-game-icon" /></p>
                        <p>Add to Library</p>
                    </div>
                    <div className="game-page-user-action-item text-center">
                        <p><FontAwesomeIcon icon={faShare} className="nav-icon basic-game-icon" /></p>
                        <p>Share</p>
                    </div>
                </div>
                <div className="game-page-friends-info">
                    <p>Friends that already have this game:</p>
                    <div className="game-page-friend-icons d-flex">
                        <div className="circle"></div>
                        <div className="circle"></div>
                    </div>
                    <p>Friends that wishlisted this game:</p>
                    <div className="game-page-friend-icons d-flex">
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="circle"></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="description">
            <h1>Description:</h1>
            <p ref={descriptionRef} className={`text ${isExpanded ? 'expanded' : 'collapsed'}`}>{boardGame.description}</p>
            {isOverflowing && (
            <button className="" onClick={toggleReadMore}>
                {isExpanded ? 'Read less' : 'Read more'}
            </button>
      )}
        </div>
    </div>
    );
  }
  
  export default GamePage;
