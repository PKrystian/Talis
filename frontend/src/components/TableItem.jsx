import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './TableItem.css';
import React from 'react';

const TableItem = ({ boardGame }) => {
  const navigate = useNavigate();

  const onClick = (boardGame) => {
    navigate(`/game/${boardGame.id}`);
  };

  return (
    <div key={boardGame.id} className="card bg-dark text-white m-2">
      <div className="card-img-wrapper">
        <img
          src={boardGame.image_url}
          className="card-img-top"
          alt={boardGame.name}
          onClick={() => onClick(boardGame)}
        />
        <h5 className="card-title" onClick={() => onClick(boardGame)}>
          {boardGame.name}
        </h5>
      </div>
    </div>
  );
};

TableItem.propTypes = {
  boardGame: PropTypes.object.isRequired,
}.isRequired;

export default TableItem;
