import PropTypes from 'prop-types';
import './TableItem.css';
import React from 'react';
import { FaStar, FaPlus } from 'react-icons/fa';

const TableItem = ({ boardGame }) => {
  return (
    <div key={boardGame.id} className="card bg-dark text-white m-2">
      <div className="card-img-wrapper">
        <a href={`/game/${boardGame.id}`} target="_self">
          <img
            src={
              boardGame.image_url ? boardGame.image_url : '/static/logo512.png'
            }
            className="card-img-top"
            alt={boardGame.name}
          />
        </a>
        <a href={`/game/${boardGame.id}`} target="_self">
          <h5 className="card-title">{boardGame.name}</h5>
        </a>

        {boardGame.is_expansion && (
          <div className="expansion-icon" title="This game is an expansion">
            <FaPlus />
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
  );
};

TableItem.propTypes = {
  boardGame: PropTypes.object.isRequired,
};

export default TableItem;
