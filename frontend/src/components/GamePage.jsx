import {Link, useParams} from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClock, faStar, faClipboardList, faPlus, faShare } from '@fortawesome/free-solid-svg-icons';
import './GamePage.css';

const GamePage = () => {
  const { id } = useParams();
  const [boardGame, setBoardGame] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    axios.get(`/api/board-games/${id}/`)
      .then(response => {
        setBoardGame(response.data);
      })
      .catch(error => {
        console.error("Error fetching board game:", error);
      });
  }, [id]);

  useEffect(() => {
    if (descriptionRef.current) {
      const { clientHeight, scrollHeight } = descriptionRef.current;
      setIsOverflowing(scrollHeight > clientHeight);
    }
  }, [boardGame]);

  if (!boardGame) {
    return <div>Loading...</div>;
  }

  const { min_playtime, max_playtime } = boardGame;
  const playtime = min_playtime !== max_playtime ? `${min_playtime}-${max_playtime}` : min_playtime;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="container">
      <div className="row ml-0 mt-4">
        <div className="col-sm-auto text-center">
          <img src={boardGame.image_url} className="boardgame-img" alt={boardGame.name} />
        </div>
        <div className="col flex-grow">
          <h1 className="game-title">{boardGame.name}</h1>
          <div className="basic-game-info mb-3 mt-4 d-flex">
            <div className="basic-info-item px-3 d-flex flex-column">
              <FontAwesomeIcon icon={faUsers} className="nav-icon basic-game-icon" />
              <div className="basic-info-text">{boardGame.min_players}-{boardGame.max_players} Players</div>
            </div>
            <div className="basic-info-item px-3 d-flex flex-column">
              <FontAwesomeIcon icon={faClock} className="nav-icon basic-game-icon" />
              <div className="basic-info-text">{playtime} Min</div>
            </div>
            <div className="basic-info-item px-3 d-flex flex-column">
              <div className="circle">{boardGame.age}+</div>
            </div>
          </div>
          <div className="other-info">
            { boardGame.publisher ? ( <p><span className="bold-text">Publisher:</span> {boardGame.publisher}</p> ) : null }
            { boardGame.year_published ? ( <p><span className="bold-text">Year:</span> {boardGame.year_published}</p> ) : null }
            { boardGame.category ? ( <p><span className="bold-text">Category:</span> {boardGame.category}</p> ) : null }
            { Array.isArray(boardGame.expansions) && boardGame.expansions.length > 0 ? (
              <p>
                <span className="bold-text">Expansions: </span>
                {boardGame.expansions.map((expansion, index) => (
                  <React.Fragment key={expansion.expansion_id}>
                    <Link to={`/game/${expansion.expansion_id}`} className="expansion-link">
                      {expansion.expansion_name}
                    </Link>
                    {index < boardGame.expansions.length - 1 && ', '}
                  </React.Fragment>
                ))}
              </p>
            ) : null }
          </div>
        </div>
        <div className="mt-3 col">
          { boardGame.rating ? (
            <p>
              <FontAwesomeIcon icon={faStar} className="nav-icon basic-game-icon" />
              <span style={{ marginLeft: '5px', verticalAlign: '12px' }}> { boardGame.rating }/10</span>
            </p>
          ) : null }
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
              <div className="circle me-2"></div>
              <div className="circle me-2"></div>
            </div>
            <p>Friends that wishlisted this game:</p>
            <div className="game-page-friend-icons d-flex">
              <div className="circle me-2"></div>
              <div className="circle me-2"></div>
              <div className="circle me-2"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="description mt-4">
        <h2>Description:</h2>
        <div
          ref={descriptionRef}
          className={`text ${isExpanded ? 'expanded' : 'collapsed'}`}
          dangerouslySetInnerHTML={{__html: boardGame.description}}
        />
        {isOverflowing && (
          <button className="btn btn-primary mt-3 mb-3" onClick={toggleReadMore}>
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GamePage;
