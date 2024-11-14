import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faClock,
  faStar,
  faClipboardList,
  faPlus,
  faShare,
  faCheck,
  faEdit,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import './GamePage.css';
import LoginContainer from './utils/LoginContainer';
import MetaComponent from './meta/MetaComponent';

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
  const [friendsWithGame, setFriendsWithGame] = useState([]);
  const [hoverStatus, setHoverStatus] = useState({
    wishlist: false,
    library: false,
  });

  const handleMouseEnter = (status) => {
    setHoverStatus((prevState) => ({
      ...prevState,
      [status]: true,
    }));
  };

  const handleMouseLeave = (status) => {
    setHoverStatus((prevState) => ({
      ...prevState,
      [status]: false,
    }));
  };

  const fetchFriendsWithGame = useCallback(async () => {
    if (!user || !user.user_id) return;

    axios
      .post(
        `${apiPrefix}friends_with_game/`,
        {
          user_id: user.user_id,
          game_id: id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((response) => setFriendsWithGame(response.data))
      .catch((error) =>
        console.error('Error fetching friends with game:', error),
      );
  }, [user, apiPrefix, id]);

  useEffect(() => {
    fetchFriendsWithGame();
  }, [fetchFriendsWithGame]);

  const fetchCollectionData = useCallback(async () => {
    const collectionUrl = apiPrefix + 'user-collection/';
    if (!user || !user.user_id) {
      setCollectionStatus({
        wishlist: false,
        library: false,
      });
      return;
    }

    try {
      const response = await axios.post(
        collectionUrl,
        { user_id: user.user_id },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const isInWishlist = response.data.wishlist.some(
        (wishlist) => wishlist.id === parseInt(id),
      );
      const isInLibrary = response.data.library.some(
        (library) => library.id === parseInt(id),
      );

      setCollectionStatus({
        wishlist: isInWishlist,
        library: isInLibrary,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [apiPrefix, user, id]);

  useEffect(() => {
    const apiPrefix =
      process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:8000/api/'
        : '/api/';
    axios
      .get(apiPrefix + `board-games/${id}/`)
      .then((response) => {
        setBoardGame(response.data);
      })
      .catch((error) => {
        console.error('Error fetching board game:', error);
      });
  }, [id]);

  useEffect(() => {
    if (descriptionRef.current) {
      const { clientHeight, scrollHeight } = descriptionRef.current;
      setIsOverflowing(scrollHeight > clientHeight);
    }
  }, [boardGame]);

  useEffect(() => {
    fetchCollectionData().then((r) => r);
  }, [user, fetchCollectionData]);

  if (!boardGame) {
    return <div>Loading...</div>;
  }

  const handleShare = async () => {
    const shareUrl = `https://talis.live/game/${id}`;
    const shareText = `Check out this board game: ${boardGame.name}`;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    if (navigator.share) {
      try {
        await navigator.share({
          title: boardGame.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      const shareWindow = window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
        '_blank',
      );
      shareWindow.focus();
    }
  };

  const handleToggleCollection = (status) => {
    const apiAction = collectionStatus[status]
      ? 'remove_from_collection/'
      : 'add_to_collection/';
    const requestUrl = apiPrefix + apiAction;

    axios
      .post(
        requestUrl,
        {
          user_id: user.user_id,
          board_game_id: boardGame.id,
          status: status,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((response) => {
        setCollectionStatus((prevState) => ({
          ...prevState,
          [status]: !prevState[status],
        }));
      })
      .catch((error) => {
        console.error(`Error updating ${status}:`, error);
      });
  };

  const handleAdminRedirect = () => {
    window.location.href = `/admin/app/boardgame/${id}/change/`;
  };

  const { min_playtime, max_playtime } = boardGame;
  const playtime =
    min_playtime !== max_playtime
      ? `${min_playtime}-${max_playtime}`
      : min_playtime;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const getCleanBoardGameDescription = () => {
    return boardGame.description.replaceAll('<br/><br/>', ' ');
  };

  return (
    <div className="container">
      {boardGame && (
        <MetaComponent
          title={boardGame.name}
          description={`${boardGame.name} - ${getCleanBoardGameDescription()}`}
          canonical={`game/${boardGame.id}`}
        />
      )}
      <div className="row ml-0 mt-4">
        <div className="col-sm-auto text-center">
          <img
            src={
              boardGame.image_url ? boardGame.image_url : '/static/logo512.png'
            }
            className="boardgame-img"
            alt={boardGame.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/static/logo512.png';
            }}
          />
        </div>
        <div className="col flex-grow">
          <div className="d-flex justify-content-between">
            <h1 className="game-title">{boardGame.name}</h1>
          </div>
          <div className="basic-game-info mb-3 mt-4 d-flex">
            <div className="basic-info-item px-3 d-flex flex-column">
              <FontAwesomeIcon
                icon={faUsers}
                className="nav-icon basic-game-icon"
              />
              <div className="basic-info-text">
                {boardGame.min_players}-{boardGame.max_players} Players
              </div>
            </div>
            <div className="basic-info-item px-3 d-flex flex-column">
              <FontAwesomeIcon
                icon={faClock}
                className="nav-icon basic-game-icon"
              />
              <div className="basic-info-text">{playtime} Min</div>
            </div>
            {boardGame.rating ? (
              <div className="basic-info-item px-3 d-flex flex-column">
                <FontAwesomeIcon
                  icon={faStar}
                  className="nav-icon basic-game-icon"
                />
                <div className="basic-info-text">
                  {boardGame.rating.toFixed(2)}/10
                </div>
              </div>
            ) : null}
            <div className="basic-info-item px-3 d-flex flex-column">
              <div className="circle">{boardGame.age}+</div>
            </div>
          </div>
          <div className="other-info">
            {boardGame.publisher ? (
              <p>
                <span className="bold-text">Publisher:</span>{' '}
                <Link
                  to={`/search?query=&filters=publisher%7C${boardGame.publisher}`}
                  className="expansion-link"
                >
                  {boardGame.publisher}
                </Link>
              </p>
            ) : null}
            {boardGame.year_published ? (
              <p>
                <span className="bold-text">Year:</span>{' '}
                <Link
                  to={`/search?query=&filters=year%7C${boardGame.year_published}`}
                  className="expansion-link"
                >
                  {boardGame.year_published}
                </Link>
              </p>
            ) : null}
            {boardGame.category ? (
              <p>
                <span className="bold-text">Categories:</span>{' '}
                {boardGame.category.split(', ').map((category, index) => (
                  <React.Fragment key={category}>
                    <Link
                      to={`/search?query=&filters=category%7C${category}`}
                      className="expansion-link"
                    >
                      {category}
                    </Link>
                    {index < boardGame.category.split(', ').length - 1 && ', '}
                  </React.Fragment>
                ))}
              </p>
            ) : null}
            {boardGame.mechanic ? (
              <p>
                <span className="bold-text">Mechanics:</span>{' '}
                {boardGame.mechanic.split(', ').map((mechanic, index) => (
                  <React.Fragment key={mechanic}>
                    <Link
                      to={`/search?query=&filters=mechanic%7C${mechanic}`}
                      className="expansion-link"
                    >
                      {mechanic}
                    </Link>
                    {index < boardGame.mechanic.split(', ').length - 1 && ', '}
                  </React.Fragment>
                ))}
              </p>
            ) : null}
            {boardGame.main_game ? (
              <p>
                <span className="bold-text">Main Game: </span>
                <Link
                  to={`/game/${boardGame.main_game.id}`}
                  className="expansion-link"
                >
                  {boardGame.main_game.name}
                </Link>
              </p>
            ) : null}
            {Array.isArray(boardGame.expansions) &&
            boardGame.expansions.length > 0 ? (
              <p>
                <span className="bold-text">Expansions: </span>
                {boardGame.expansions.map((expansion, index) => (
                  <React.Fragment key={expansion.expansion_id}>
                    <Link
                      to={`/game/${expansion.expansion_id}`}
                      className="expansion-link"
                    >
                      {expansion.expansion_name}
                    </Link>
                    {index < boardGame.expansions.length - 1 && ', '}
                  </React.Fragment>
                ))}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-3 col">
          <div className="game-page-user-action d-flex">
            {user && user.user_id ? (
              <>
                <div
                  className="game-page-user-action-item text-center"
                  onClick={() => handleToggleCollection('wishlist')}
                  onMouseEnter={() => handleMouseEnter('wishlist')}
                  onMouseLeave={() => handleMouseLeave('wishlist')}
                  title={
                    collectionStatus.wishlist
                      ? hoverStatus.wishlist
                        ? 'Click to remove from wishlist'
                        : 'Game is in wishlist'
                      : 'Click to add to wishlist'
                  }
                >
                  <p>
                    <FontAwesomeIcon
                      icon={
                        collectionStatus.wishlist
                          ? hoverStatus.wishlist
                            ? faTimes
                            : faCheck
                          : faClipboardList
                      }
                      className="nav-icon basic-game-icon pointer-cursor"
                    />
                  </p>
                  <p className="pointer-cursor">
                    {collectionStatus.wishlist
                      ? hoverStatus.wishlist
                        ? 'Remove from Wishlist'
                        : 'Game is in Wishlist'
                      : 'Add to Wishlist'}
                  </p>
                </div>
                <div
                  className="game-page-user-action-item text-center"
                  onClick={() => handleToggleCollection('library')}
                  onMouseEnter={() => handleMouseEnter('library')}
                  onMouseLeave={() => handleMouseLeave('library')}
                  title={
                    collectionStatus.library
                      ? hoverStatus.library
                        ? 'Click to remove from library'
                        : 'Game is in library'
                      : 'Click to add to library'
                  }
                >
                  <p>
                    <FontAwesomeIcon
                      icon={
                        collectionStatus.library
                          ? hoverStatus.library
                            ? faTimes
                            : faCheck
                          : faPlus
                      }
                      className="nav-icon basic-game-icon pointer-cursor"
                    />
                  </p>
                  <p className="pointer-cursor">
                    {collectionStatus.library
                      ? hoverStatus.library
                        ? 'Remove from Library'
                        : 'Game is in Library'
                      : 'Add to Library'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div
                  className="game-page-user-action-item text-center"
                  title="Login to add to Wishlist"
                >
                  <LoginContainer
                    ButtonTag={'a'}
                    buttonClass={
                      'text-decoration-none text-reset pointer-cursor'
                    }
                  >
                    <p>
                      <FontAwesomeIcon
                        icon={faClipboardList}
                        className="nav-icon basic-game-icon pointer-cursor"
                      />
                    </p>
                    <p className="pointer-cursor">Add to Wishlist</p>
                  </LoginContainer>
                </div>
                <div
                  className="game-page-user-action-item text-center"
                  title="Login to add to Library"
                >
                  <LoginContainer
                    ButtonTag={'a'}
                    buttonClass={
                      'text-decoration-none text-reset pointer-cursor'
                    }
                  >
                    <p>
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="nav-icon basic-game-icon pointer-cursor"
                      />
                    </p>
                    <p className="pointer-cursor">Add to Library</p>
                  </LoginContainer>
                </div>
              </>
            )}
            <div className="game-page-user-action-item text-center">
              <button className="btn btn-info" onClick={handleShare}>
                <FontAwesomeIcon icon={faShare} /> Share
              </button>
            </div>
          </div>
          <div className="game-page-friends-info">
            {friendsWithGame.filter(
              (friend) =>
                friend.status === 'library' && friend.id !== user.user_id,
            ).length > 0 && (
              <>
                <p>Friends that already have this game:</p>
                <div className="game-page-friend-icons d-flex">
                  {friendsWithGame
                    .filter(
                      (friend) =>
                        friend.status === 'library' &&
                        friend.id !== user.user_id,
                    )
                    .map((friend) => (
                      <Link to={`/user/${friend.id}`} key={friend.id}>
                        <img
                          src={friend.profile_image_url}
                          alt={`${friend.first_name} ${friend.last_name}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/static/default-profile.png';
                          }}
                          title={`${friend.first_name} ${friend.last_name}`}
                          className="friend-profile-img"
                        />
                      </Link>
                    ))}
                </div>
              </>
            )}

            {friendsWithGame.filter(
              (friend) =>
                friend.status === 'wishlist' && friend.id !== user.user_id,
            ).length > 0 && (
              <>
                <p>Friends that wishlisted this game:</p>
                <div className="game-page-friend-icons d-flex">
                  {friendsWithGame
                    .filter(
                      (friend) =>
                        friend.status === 'wishlist' &&
                        friend.id !== user.user_id,
                    )
                    .map((friend) => (
                      <Link to={`/user/${friend.id}`} key={friend.id}>
                        <img
                          src={friend.profile_image_url}
                          alt={`${friend.first_name} ${friend.last_name}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/static/default-profile.png';
                          }}
                          title={`${friend.first_name} ${friend.last_name}`}
                          className="friend-profile-img"
                        />
                      </Link>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="description mt-4">
        <h2>Description:</h2>
        <div
          ref={descriptionRef}
          className={`text ${isExpanded ? 'expanded' : 'collapsed'}`}
          dangerouslySetInnerHTML={{ __html: boardGame.description }}
        />
        {isOverflowing && (
          <button
            className="btn btn-primary mt-3 mb-3"
            onClick={toggleReadMore}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
      {user.is_superuser && (
        <div className="mt-3">
          <h2>Admin actions:</h2>
          <div className="game-page-user-action d-flex">
            <button
              className="btn btn-success btn-sm"
              onClick={handleAdminRedirect}
            >
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
          </div>
          <h2>Admin only data:</h2>
          <div className="other-info">
            {boardGame.id ? (
              <p>
                <span className="bold-text">ID:</span> {boardGame.id}
              </p>
            ) : null}
            {boardGame.image_url ? (
              <p>
                <span className="bold-text">Image Url:</span>{' '}
                {boardGame.image_url}
              </p>
            ) : null}
            {boardGame.rating ? (
              <p>
                <span className="bold-text">Full rating:</span>{' '}
                {boardGame.rating}
              </p>
            ) : null}
            {boardGame.created_at ? (
              <p>
                <span className="bold-text">Created At:</span>{' '}
                {boardGame.created_at}
              </p>
            ) : null}
            {boardGame.updated_at ? (
              <p>
                <span className="bold-text">Updated At:</span>{' '}
                {boardGame.updated_at}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

GamePage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number,
    wishlist: PropTypes.array,
    library: PropTypes.array,
    is_superuser: PropTypes.bool,
  }).isRequired,
};

export default GamePage;
