import React from 'react';
import PropTypes from 'prop-types';
import './AgeModal.css';

const AgeModal = ({ toggleAgeModal, handleInputChange, filters }) => {
  return (
    <div className="modal-backdrop">
      <div className="age-modal-content overflow-y-auto">
        <h2>Age:</h2>
        <div className="d-flex flex-wrap">
          {[
            'up to 3 years',
            '3-4 years',
            '5-7 years',
            '8-11 years',
            '12-14 years',
            '15-17 years',
            '18+ years',
          ].map((age) => (
            <div key={age} className="form-check text-start col-4">
              <input
                type="checkbox"
                id={age}
                name="age"
                value={age}
                checked={filters.age.includes(age)}
                onChange={handleInputChange}
                className="form-check-input"
              />
              <label htmlFor={age} className="form-check-label">
                {age}
              </label>
            </div>
          ))}
        </div>
        <button
          className="btn search-modal-close-button mt-2"
          onClick={toggleAgeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

AgeModal.propTypes = {
  toggleAgeModal: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

export default AgeModal;
