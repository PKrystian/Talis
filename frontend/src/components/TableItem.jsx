import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './TableItem.css';
import React from 'react';
import { FaStar, FaPlus } from 'react-icons/fa';

const TableItem = ({ boardGame }) => {
  const navigate = useNavigate();

  const onClick = (boardGame) => {
    navigate(`/game/${boardGame.id}`);
  };

  return (
    <div key={boardGame.id} className="card bg-dark text-white m-2">
      <div className="card-img-wrapper">
        <img
          src={
            boardGame.image_url ? boardGame.image_url : '/static/logo512.png'
          }
          className="card-img-top"
          alt={boardGame.name}
          onClick={() => onClick(boardGame)}
        />
        <h5 className="card-title" onClick={() => onClick(boardGame)}>
          {boardGame.name}
        </h5>

        {boardGame.is_expansion && (
          <div className="expansion-icon" title="This game is an expansion">
            <FaPlus />
          </div>
        )}

        {boardGame.rating !== null && boardGame.rating !== 0 && (
          <div className="card-rating" onClick={() => onClick(boardGame)}>
            <FaStar /> {boardGame.rating.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
};

TableItem.propTypes = {
  boardGame: PropTypes.object.isRequired,
};

export default TableItem;
