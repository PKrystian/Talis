import PropTypes from 'prop-types';
import './TableItem.css';
import React from 'react';
import { FaStar, FaPuzzlePiece } from 'react-icons/fa';

const TableItem = ({ boardGame }) => {
  const imageUrl = boardGame.image_url || '/static/logo512.png';

  return (
    <div className="table-item-container">
      <div key={boardGame.id} className="card bg-dark text-white m-2">
        <div className="card-img-wrapper">
          <a href={`/game/${boardGame.id}`} target="_self">
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
                alt={boardGame.name}
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
          <a href={`/game/${boardGame.id}`} target="_self">
            <h5 className="card-title">{boardGame.name}</h5>
          </a>

          {boardGame.is_expansion && (
            <div className="expansion-icon" title="This game is an expansion">
              <FaPuzzlePiece />
            </div>
          )}

          {(boardGame.rating || boardGame.rating === 0) && (
            <a href={`/game/${boardGame.id}`} target="_self">
              <div className="card-rating">
                {boardGame.rating > 0 ? (
                  <>
                    <FaStar /> {boardGame.rating.toFixed(1)}
                  </>
                ) : (
                  <>
                    <FaStar /> {'-'}
                  </>
                )}
              </div>
            </a>
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
