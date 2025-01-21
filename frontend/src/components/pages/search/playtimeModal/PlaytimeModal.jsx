import React from 'react';
import PropTypes from 'prop-types';
import './PlaytimeModal.css';

const PlaytimeModal = ({ togglePlaytimeModal, handleInputChange, filters }) => {
  return (
    <div className="modal-backdrop">
      <div className="age-modal-content overflow-y-auto">
        <h2>Playtime:</h2>
        <div className="d-flex flex-wrap">
          {['< 15 min', '< 30 min', '< 1h', '< 2h', '2h+'].map((playtime) => (
            <div key={playtime} className="form-check text-start col-4">
              <input
                type="checkbox"
                id={playtime}
                name="playtime"
                value={playtime}
                checked={filters.playtime.includes(playtime)}
                onChange={handleInputChange}
                className="form-check-input"
              />
              <label htmlFor={playtime} className="form-check-label">
                {playtime}
              </label>
            </div>
          ))}
        </div>
        <button
          className="btn btn-secondary mt-2"
          onClick={togglePlaytimeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

PlaytimeModal.propTypes = {
  togglePlaytimeModal: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

export default PlaytimeModal;
