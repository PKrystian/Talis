import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClock, faStar, faClipboardList, faPlus, faShare, faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';
import './GamePage.css';
import LoginButton from "./utils/LoginButton";

const GamePage = ({ apiPrefix, user }) => {
  const { id } = useParams();
  const [boardGame, setBoardGame] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);
  const [collectionStatus, setCollectionStatus] = useState({
    wishlist: user.wishlist || false,
    library: user.library || false,
  });

  const fetchCollectionData = async () => {
    const collectionUrl = apiPrefix + 'user-collection/';
    if (!user || !user.user_id) {
      setCollectionStatus({
        wishlist: false,
        library: false,
      });
    }

    try {
      const response = await axios.post(
        collectionUrl,
        { user_id: user.user_id },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      setCollectionStatus({
        wishlist: response.data.wishlist.find((wishlist) => wishlist.id === id),
        library: response.data.library.find((library) => library.id === id)
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const apiPrefix = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/' : '/api/';
    axios.get(apiPrefix + `board-games/${id}/`)
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

  useEffect(() => {
    fetchCollectionData().then(r => (r));
  }, [user]);

  if (!boardGame) {
    return <div>Loading...</div>;
  }

  const handleToggleCollection = (status) => {
    const apiAction = collectionStatus[status] ? 'remove_from_collection/' : 'add_to_collection/';
    const requestUrl = apiPrefix + apiAction;

    axios.post(requestUrl, {
      user_id: user.user_id,
      board_game_id: boardGame.id,
      status: status,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(response => {
      setCollectionStatus((prevState) => ({
        ...prevState,
        [status]: !prevState[status]
      }));
    })
    .catch(error => {
      console.error(`Error updating ${status}:`, error);
    });
  };

  const handleAdminRedirect = () => {
    window.location.href = `/admin/app/boardgame/${id}/change/`;
  };

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
          <div className="d-flex justify-content-between">
            <h1 className="game-title">{boardGame.name}</h1>
            {user.is_superuser && (
              <button className="btn btn-success btn-sm" onClick={handleAdminRedirect}>
                <FontAwesomeIcon icon={faEdit} /> Edit
              </button>
            )}
          </div>
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
            {user && user.user_id ? (
              <>
                <div
                  className="game-page-user-action-item text-center"
                  onClick={() => handleToggleCollection('wishlist')}
                  title={collectionStatus.wishlist ? 'Click to remove from wishlist' : 'Click to add to wishlist'}
                >
                  <p><FontAwesomeIcon icon={collectionStatus.wishlist ? faCheck : faClipboardList} className="nav-icon basic-game-icon pointer-cursor" /></p>
                  <p className="pointer-cursor">{collectionStatus.wishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</p>
                </div>
                <div
                  className="game-page-user-action-item text-center"
                  onClick={() => handleToggleCollection('library')}
                  title={collectionStatus.library ? 'Click to remove from library' : 'Click to add to library'}
                >
                  <p><FontAwesomeIcon icon={collectionStatus.library ? faCheck : faPlus} className="nav-icon basic-game-icon pointer-cursor" /></p>
                  <p className="pointer-cursor">{collectionStatus.library ? 'Remove from Library' : 'Add to Library'}</p>
                </div>
              </>
            ) : (
              <>
                <div className="game-page-user-action-item text-center" title="Login to add to Wishlist">
                  <p><FontAwesomeIcon icon={faClipboardList} className="nav-icon basic-game-icon pointer-cursor" /></p>
                  <LoginButton ButtonTag={"a"} buttonClass={"text-decoration-none text-reset pointer-cursor"} buttonText={"Add to Wishlist"} />
                </div>
                <div className="game-page-user-action-item text-center" title="Login to add to Library">
                  <p><FontAwesomeIcon icon={faPlus} className="nav-icon basic-game-icon pointer-cursor" /></p>
                  <LoginButton ButtonTag={"a"} buttonClass={"text-decoration-none text-reset pointer-cursor"} buttonText={"Add to Library"} />
                </div>
              </>
            )}
            <div className="game-page-user-action-item text-center">
              <p><FontAwesomeIcon icon={faShare} className="nav-icon basic-game-icon pointer-cursor" /></p>
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
