import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Star,
  User,
  Users,
  Clock,
  Sparkle,
  Check,
  X,
  Plus,
} from '@phosphor-icons/react';
import {
  faStar,
  faPlus,
  faShare,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import './GamePage.css';
import LoginContainer from '../../utils/login/container/LoginContainer';
import FriendsModal from '../friendsWithGame/FriendsWithGame.jsx';
import TableItem from '../../utils/table/TableItem.jsx';

const GamePage = ({ apiPrefix, user }) => {
  const { id } = useParams();
  const [boardGame, setBoardGame] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [averageRating, setAverageRating] = useState(null);

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
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
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
      toast.error('Failed to fetch collection data', {
        theme: 'dark',
        position: 'top-center',
      });
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
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
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

  const fetchComments = useCallback(() => {
    axios
      .post(
        `${apiPrefix}get-comments/`,
        { board_game_id: boardGame.id },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((response) => setComments(response.data.comments))
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  }, [apiPrefix, boardGame]);

  useEffect(() => {
    if (boardGame) {
      fetchComments();
    }
  }, [boardGame, fetchComments]);

  const fetchAverageRating = useCallback(async () => {
    if (!boardGame) return;

    try {
      const response = await axios.post(
        `${apiPrefix}get-user-ratings/`,
        { board_game_id: boardGame.id },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      setAverageRating(response.data.average_rating);
    } catch (error) {
      toast.error('Failed to fetch average rating', {
        theme: 'dark',
        position: 'top-center',
      });
    }
  }, [apiPrefix, boardGame]);

  useEffect(() => {
    fetchAverageRating();
  }, [fetchAverageRating]);

  if (!boardGame) {
    return (
      <div className="text-center vh-100 align-content-center">
        <div className="spinner-border">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
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
        toast.error('Failed to share', {
          theme: 'dark',
          position: 'top-center',
        });
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
      ? 'remove-from-collection/'
      : 'add-to-collection/';
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
        switch (response.data.type) {
          case 'added':
            toast.success(response.data.detail, {
              theme: 'dark',
              bodyClassName: () => 'd-flex p-2 text-center',
              autoClose: 1500,
            });
            break;
          case 'removed':
            toast.info(response.data.detail, {
              theme: 'dark',
              bodyClassName: () => 'd-flex p-2 text-center',
              autoClose: 1500,
            });
            break;
          default:
            toast.error(response.data.detail, {
              theme: 'dark',
              bodyClassName: () => 'd-flex p-2 text-center',
              autoClose: 1500,
            });
            break;
        }
        setCollectionStatus((prevState) => ({
          ...prevState,
          [status]: !prevState[status],
        }));
      })
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
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

  const handleAddComment = () => {
    if (!user.user_id) {
      return;
    }

    if (newComment.trim() === '' && newRating.trim() === '') {
      toast.warn('Please fill in either the comment or the rating.');
      return;
    }

    axios
      .post(
        `${apiPrefix}add-comment/`,
        {
          user_id: user.user_id,
          board_game_id: boardGame.id,
          comment: newComment,
          rating: newRating === '' ? null : newRating,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(() => {
        fetchComments();
        fetchAverageRating();
        setNewComment('');
        setNewRating('');
      })
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  };

  const handleUpdateComment = () => {
    if (newComment.trim() === '' && newRating.trim() === '') {
      toast.warn('Please fill in either the comment or the rating.');
      return;
    }

    axios
      .post(
        `${apiPrefix}update-comment/`,
        {
          comment_id: editCommentId,
          comment: newComment,
          rating: newRating,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(() => {
        fetchComments();
        setIsEditing(false);
        setEditCommentId(null);
        setNewComment('');
        setNewRating('');
      })
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  };

  const handleEditComment = (commentId) => {
    const commentToEdit = comments.find(
      (comment) => comment.comment_id === commentId,
    );
    setIsEditing(true);
    setEditCommentId(commentId);

    setNewComment(commentToEdit.comment || '');
    setNewRating(commentToEdit.rating ? commentToEdit.rating.toString() : '');
  };

  const toggleFriendsModal = () => {
    setIsFriendsModalOpen((prev) => !prev);
  };

  const handleDeleteComment = (commentId) => {
    axios
      .post(
        `${apiPrefix}delete-comment/`,
        { comment_id: commentId },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(() => {
        fetchComments();
        setIsEditing(false);
        fetchAverageRating();
      })
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  };

  return (
    <div className="container game-page-container">
      <div className="row ml-0 mt-4">
        <div className="col-sm-auto text-center">
          <img
            src={
              boardGame.image_url ? boardGame.image_url : '/static/logo512.png'
            }
            className={`boardgame-img ${!boardGame.accepted_by_admin ? 'not-accepted' : ''}`}
            alt={boardGame.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/static/logo512.png';
            }}
          />
          {!boardGame.accepted_by_admin && (
            <p className="text-danger">Game not yet verified</p>
          )}
        </div>
        <div className="col-md-5">
          <div className="d-flex justify-content-md-between justify-content-center">
            <h1 className="game-title">{boardGame.name}</h1>
          </div>
          <div className="basic-game-info mb-3 mt-4 d-flex">
            <div className="basic-info-item px-3 d-flex flex-column align-items-center">
              <Users size={40} className="nav-icon basic-game-icon" />
              <div className="basic-info-text">
                {boardGame.min_players}-{boardGame.max_players} Players
              </div>
            </div>
            <div className="basic-info-item px-3 d-flex flex-column align-items-center">
              <Clock size={40} className="nav-icon basic-game-icon" />
              <div className="basic-info-text">{playtime} Min</div>
            </div>
            {boardGame.rating ? (
              <div className="basic-info-item px-3 d-flex flex-column align-items-center">
                <Star size={40} />
                <div className="basic-info-text">
                  {boardGame.rating.toFixed(2)}/10
                </div>
              </div>
            ) : null}
            {averageRating ? (
              <div className="basic-info-item px-3 d-flex flex-column">
                <div className="d-flex p-0 align-items-center">
                  <User size={40} className="nav-icon basic-game-icon" />
                  <Star />
                </div>
                <div className="basic-info-text">
                  {averageRating.toFixed(2)}/10
                </div>
              </div>
            ) : null}
            <div className="basic-info-item px-3 d-flex flex-column">
              <div className="age-circle">{boardGame.age}+</div>
            </div>
          </div>
          <div className="other-info">
            {boardGame.added_by ? (
              <p>
                <span className="bold-text">Added by user:</span>{' '}
                <Link
                  to={`/user/${boardGame.added_by}`}
                  className="expansion-link"
                >
                  {boardGame.added_by}
                </Link>
              </p>
            ) : null}
            {boardGame.publisher ? (
              <p>
                <span className="bold-text">Publisher:</span>{' '}
                <Link
                  to={`/search?query=&filters=publisher%7C${boardGame.publisher}`}
                  className="expansion-link text-white"
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
                  className="expansion-link text-white"
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
                      className="expansion-link text-white"
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
                      className="expansion-link text-white"
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
                  className="expansion-link text-white"
                >
                  {boardGame.main_game.name}
                </Link>
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-3 col">
          <div className="game-page-user-action text-md-end justify-content-md-end text-center justify-content-center row">
            {user && user.user_id ? (
              <>
                <div>
                  <button
                    className="btn game-page-user-button game-page-form-control mb-3"
                    onClick={() => handleToggleCollection('wishlist')}
                    onMouseEnter={() => handleMouseEnter('wishlist')}
                    onMouseLeave={() => handleMouseLeave('wishlist')}
                  >
                    <div
                      className="d-flex p-0 justify-content-center"
                      title={
                        collectionStatus.wishlist
                          ? hoverStatus.wishlist
                            ? 'Click to remove from wishlist'
                            : 'Game is in wishlist'
                          : 'Click to add to wishlist'
                      }
                    >
                      <div>
                        {collectionStatus.wishlist ? (
                          hoverStatus.wishlist ? (
                            <X color="#B3A7F0" size={16} />
                          ) : (
                            <Check color="#B3A7F0" size={16} />
                          )
                        ) : (
                          <Sparkle color="#9FC4F3" size={16} />
                        )}
                      </div>
                      <div className="ms-1">
                        {collectionStatus.wishlist
                          ? hoverStatus.wishlist
                            ? 'Remove from Wishlist'
                            : 'Game is in Wishlist'
                          : 'Add to Wishlist'}
                      </div>
                    </div>
                  </button>
                </div>
                <div>
                  <button
                    className="btn game-page-user-button game-page-form-control mb-3"
                    onClick={() => handleToggleCollection('library')}
                    onMouseEnter={() => handleMouseEnter('library')}
                    onMouseLeave={() => handleMouseLeave('library')}
                  >
                    <div
                      className="d-flex p-0 justify-content-center"
                      title={
                        collectionStatus.library
                          ? hoverStatus.library
                            ? 'Click to remove from library'
                            : 'Game is in library'
                          : 'Click to add to library'
                      }
                    >
                      <div>
                        {collectionStatus.library ? (
                          hoverStatus.library ? (
                            <X color="#B3A7F0" size={16} />
                          ) : (
                            <Check color="#B3A7F0" size={16} />
                          )
                        ) : (
                          <Plus color="#B3A7F0" size={16} />
                        )}
                      </div>
                      <div className="ms-1">
                        {collectionStatus.library
                          ? hoverStatus.library
                            ? 'Remove from Library'
                            : 'Game is in Library'
                          : 'Add to Library'}
                      </div>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className="justify-content-md-end justify-content-center d-flex py-0"
                  title="Login to add to Wishlist"
                >
                  <LoginContainer
                    ButtonTag={'a'}
                    buttonClass={
                      'btn game-page-user-button game-page-form-control mb-3 d-flex justify-content-center'
                    }
                  >
                    <div className="d-flex align-items-center p-0">
                      <Sparkle color="#9FC4F3" className="me-2" />
                    </div>
                    <div className="pointer-cursor">Add to Wishlist</div>
                  </LoginContainer>
                </div>
                <div
                  className="justify-content-md-end justify-content-center d-flex py-0"
                  title="Login to add to Library"
                >
                  <LoginContainer
                    ButtonTag={'a'}
                    buttonClass={
                      'btn game-page-user-button game-page-form-control mb-3 d-flex justify-content-center'
                    }
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faPlus}
                        color="#B3A7F0"
                        className="me-2"
                      />
                    </div>
                    <div className="pointer-cursor">Add to Library</div>
                  </LoginContainer>
                </div>
              </>
            )}
            <div className="game-page-user-action-item justify-content-end d-flex">
              <button
                className="btn game-page-user-button"
                onClick={handleShare}
              >
                <FontAwesomeIcon icon={faShare} /> Share
              </button>
            </div>
          </div>
          <div className="game-page-friends-info text-center text-md-end">
            {Array.isArray(friendsWithGame) &&
              friendsWithGame.filter(
                (friend) =>
                  friend.status === 'library' && friend.id !== user.user_id,
              ).length > 0 && (
                <>
                  <p>Friends that already have this game:</p>
                  <div className="game-page-friend-icons d-flex p-0 justify-content-center justify-content-md-end">
                    {friendsWithGame
                      .filter(
                        (friend) =>
                          friend.status === 'library' &&
                          friend.id !== user.user_id,
                      )
                      .slice(0, 5)
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
            {friendsWithGame.filter((f) => f.status === 'library').length >
            3 ? (
              <button
                className="btn game-page-user-button mb-3"
                onClick={toggleFriendsModal}
              >
                show all
              </button>
            ) : (
              <></>
            )}
            {isFriendsModalOpen && (
              <FriendsModal
                toggleFriendsModal={toggleFriendsModal}
                friendsWithGame={friendsWithGame.filter(
                  (f) => f.status === 'library',
                )}
              />
            )}

            {friendsWithGame.filter(
              (friend) =>
                friend.status === 'wishlist' && friend.id !== user.user_id,
            ).length > 0 && (
              <>
                <p>Friends that wishlisted this game:</p>
                <div className="game-page-friend-icons d-flex justify-content-center justify-content-md-end">
                  {friendsWithGame
                    .filter(
                      (friend) =>
                        friend.status === 'wishlist' &&
                        friend.id !== user.user_id,
                    )
                    .slice(0, 5)
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
            {friendsWithGame.filter((f) => f.status === 'library').length >
            5 ? (
              <button
                className="btn game-page-user-button mb-3"
                onClick={toggleFriendsModal}
              >
                show all
              </button>
            ) : (
              <></>
            )}
            {isFriendsModalOpen && (
              <FriendsModal
                toggleFriendsModal={toggleFriendsModal}
                friendsWithGame={friendsWithGame.filter(
                  (f) => f.status === 'library',
                )}
              />
            )}
          </div>
        </div>
      </div>
      <div className="description text-center text-md-start mt-4">
        <h2>Description:</h2>
        <div
          ref={descriptionRef}
          className={`text ${isExpanded ? 'expanded' : 'collapsed'}`}
          dangerouslySetInnerHTML={{ __html: boardGame.description }}
        />
        {isOverflowing && (
          <div className="d-flex justify-content-end">
            <button
              className="btn game-page-user-button mt-3 mb-3"
              onClick={toggleReadMore}
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          </div>
        )}
      </div>
      {boardGame.expansions.length > 0 && (
        <>
          <h2>Expansions</h2>
          <div className="game-page-expansions d-flex overflow-auto">
            {boardGame.expansions.map((expansion) => (
              <div
                key={expansion.expansion_id}
                className="d-flex justify-content-center"
              >
                <TableItem boardGame={expansion} />
              </div>
            ))}
          </div>
        </>
      )}
      <div className="comments-ratings-section mt-4 p-3 p-md-0">
        <h2>Comments and Ratings</h2>
        {user.user_id ? (
          <div className="add-comment">
            <h3>{isEditing ? 'Edit Comment' : 'Add Comment'}</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
            />
            <input
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              placeholder="Rating (0.01-10.00), e.g. 7.51"
              min="0.01"
              max="10.00"
              step="0.01"
              required
            />
            <button
              onClick={isEditing ? handleUpdateComment : handleAddComment}
              disabled={newComment.trim() === '' && newRating.trim() === ''}
            >
              {isEditing ? 'Update Comment' : 'Add Comment'}
            </button>
          </div>
        ) : (
          <LoginContainer
            ButtonTag={'a'}
            buttonClass={
              'btn game-page-user-button text-decoration-none text-reset pointer-cursor d-inline-flex align-items-center mb-2'
            }
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="nav-icon basic-game-icon pointer-cursor mr-2"
            />
            <p className="pointer-cursor mb-0">Add Comment</p>
          </LoginContainer>
        )}
        {comments
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((comment) => (
            <div
              key={comment.comment_id}
              className={`comment ${comment.rating !== null ? 'review' : ''} mb-3 row`}
            >
              <div className="col-1 align-items-center justify-content-center d-flex">
                <Link to={`/user/${comment.user_id}`}>
                  <div className="text-center">
                    <img
                      src={comment.profile_image_url}
                      alt={comment.user_name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/static/default-profile.png';
                      }}
                      className="comment-profile-img"
                    />
                  </div>
                  <div className="text-center">
                    <strong>{comment.user_name}</strong>
                  </div>
                </Link>
              </div>
              <div className="col-11 d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <span>
                    {comment.rating !== null && (
                      <>
                        <FontAwesomeIcon
                          icon={faStar}
                          color="#F3DE9F"
                          className="me-1"
                        />{' '}
                        {comment.rating}/10
                      </>
                    )}
                  </span>
                  <span className="comment-date">
                    {formatDistanceToNow(new Date(comment.created_at))} ago
                  </span>
                </div>
                <div className="comment-text d-inline-block p-3">
                  {comment.comment}
                </div>
                {comment.created_at !== comment.updated_at && <p>(Edited)</p>}
                {user.user_id === comment.user_id && (
                  <div>
                    <button
                      onClick={() => handleEditComment(comment.comment_id)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.comment_id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
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
            <p>
              <span className="bold-text">Accepted by admin:</span>{' '}
              {boardGame.accepted_by_admin ? 'true' : 'false'}
            </p>
            {boardGame.id ? (
              <p>
                <span className="bold-text">ID:</span> {boardGame.id}
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
