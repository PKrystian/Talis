import React from 'react';
import PropTypes from 'prop-types';
import './ExcludedModal.css';

const ExcludedModal = ({
  toggleExcludedModal,
  handleInputChange,
  filters,
  EXCLUDED_LIST,
  EXCLUDED_DISPLAY_NAMES,
}) => {
  return (
    <div className="modal-backdrop">
      <div className="age-modal-content overflow-y-auto">
        <h2>Excluded:</h2>
        <div className="d-flex flex-wrap">
          {EXCLUDED_LIST.map((excluded) => (
            <div key={excluded} className="form-check text-start col-4">
              <input
                type="checkbox"
                id={excluded}
                name="excluded"
                value={excluded}
                checked={filters.excluded.includes(excluded)}
                onChange={handleInputChange}
                className="form-check-input"
              />
              <label htmlFor={excluded} className="form-check-label">
                {EXCLUDED_DISPLAY_NAMES[excluded]}
              </label>
            </div>
          ))}
        </div>
        <button
          className="btn btn-secondary mt-2"
          onClick={toggleExcludedModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

ExcludedModal.propTypes = {
  toggleExcludedModal: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  EXCLUDED_LIST: PropTypes.array.isRequired,
  EXCLUDED_DISPLAY_NAMES: PropTypes.object.isRequired,
};

export default ExcludedModal;
