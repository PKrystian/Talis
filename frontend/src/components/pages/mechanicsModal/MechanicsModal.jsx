import React from 'react';
import PropTypes from 'prop-types';
import { MECHANIC_LIST } from '../../../constValues/SearchConstants';
import './MechanicsModal.css';

const MechanicsModal = ({
  toggleMechanicsModal,
  handleInputChange,
  filters,
}) => {
  const sortedMechanics = MECHANIC_LIST.slice().sort();

  return (
    <div className="modal-backdrop">
      <div className="tags-modal-content overflow-y-auto">
        <h2>Mechanics:</h2>
        <div className="d-flex flex-wrap">
          {sortedMechanics.map((mechanic) => (
            <div
              key={mechanic}
              className="col-6 col-lg-3 d-flex align-items-center form-check col-auto"
            >
              <input
                type="checkbox"
                id={mechanic}
                name="mechanic"
                value={mechanic}
                className="form-check-input me-1"
                checked={filters.mechanic.includes(mechanic)}
                onChange={handleInputChange}
              />
              <label
                htmlFor={mechanic}
                className="form-check-label text-truncate"
              >
                {mechanic}
              </label>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={toggleMechanicsModal}>
          Close
        </button>
      </div>
    </div>
  );
};

MechanicsModal.propTypes = {
  toggleMechanicsModal: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

export default MechanicsModal;
