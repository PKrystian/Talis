import PropTypes from 'prop-types';
import './TableItem.css';
import React from 'react';

const TableItem = ({ boardGame }) => {
  const onClick = (event, boardGame) => {
    if (event.button === 1) {
      window.open(`/game/${boardGame.id}`, '_blank');
    } else if (event.button === 0) {
      window.open(`/game/${boardGame.id}`, '_self');
    }
  };

  return (
    <div key={boardGame.id} className="card bg-dark text-white m-2">
      <div className="card-img-wrapper">
        <a href={`/game/${boardGame.id}`} target="_self">
          <img
            src={boardGame.image_url}
            className="card-img-top"
            alt={boardGame.name}
            onMouseDown={(event) => onClick(event, boardGame)}
          />
        </a>
        <h5 className="card-title">
          <a
            href={`/game/${boardGame.id}`}
            target="_self"
            onMouseDown={(event) => onClick(event, boardGame)}
          >
            {boardGame.name}
          </a>
        </h5>
      </div>
    </div>
  );
};

TableItem.propTypes = {
  boardGame: PropTypes.object.isRequired,
}.isRequired;

export default TableItem;
