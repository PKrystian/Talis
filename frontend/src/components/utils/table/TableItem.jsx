import PropTypes from 'prop-types';
import './TableItem.css';
import React from 'react';
import {
  FaStar,
  FaPuzzlePiece,
  FaUser,
  FaExclamationCircle,
} from 'react-icons/fa';

const TableItem = ({ boardGame }) => {
  const imageUrl =
    boardGame.image_url || boardGame.expansion_img || '/static/logo512.png';
  const acceptedByAdmin =
    boardGame.accepted_by_admin || boardGame.expansion_accepted_by_admin;
  const cardClass = acceptedByAdmin
    ? 'card bg-dark text-white m-2'
    : 'card bg-dark text-white m-2 border-danger';
  const gameId = boardGame.id || boardGame.expansion_id;
  const rating = boardGame.rating || boardGame.expansion_rating;
  const gameName = boardGame.name || boardGame.expansion_name;
  return (
    <div className="table-item-container">
      <div className={cardClass}>
        <div className="card-img-wrapper">
          <a href={`/game/${gameId}`} target="_self">
            <picture>
              <source srcSet={`${imageUrl}?format=webp`} type="image/webp" />
              <source srcSet={`${imageUrl}?format=jpeg`} type="image/jpeg" />
              <source srcSet={`${imageUrl}?format=png`} type="image/png" />
              <source srcSet={`${imageUrl}?format=jpg`} type="image/jpg" />
              <img
                src={imageUrl}
                srcSet={`${imageUrl}?w=200 200w, ${imageUrl}?w=400 400w, ${imageUrl}?w=800 800w, ${imageUrl}?w=1200 1200w`}
                sizes="(max-width: 600px) 200px, (max-width: 1200px) 400px, 800px"
                className="card-img-top"
                alt={gameName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/static/logo512.png';
                }}
                loading="lazy"
                width="200"
                height="200"
              />
            </picture>
          </a>
          <a href={`/game/${gameId}`} target="_self">
            <h5 className="card-title">{gameName}</h5>
          </a>

          {boardGame.is_expansion && (
            <div className="expansion-icon" title="This game is an expansion">
              <FaPuzzlePiece />
            </div>
          )}

          {(rating || rating === 0) && (
            <a href={`/game/${boardGame.id}`} target="_self">
              <div className="card-rating">
                {rating > 0 ? (
                  <>
                    <FaStar /> {rating.toFixed(1)}
                  </>
                ) : (
                  <>
                    <FaStar /> {'-'}
                  </>
                )}
              </div>
            </a>
          )}

          {boardGame.added_by && (
            <div
              className="added-by-icon"
              title="This game has been added by user"
            >
              <FaUser />
            </div>
          )}

          {!acceptedByAdmin && (
            <div className="not-accepted-icon" title="Game not yet verified">
              <FaExclamationCircle />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TableItem.propTypes = {
  boardGame: PropTypes.object.isRequired,
};

export default TableItem;
