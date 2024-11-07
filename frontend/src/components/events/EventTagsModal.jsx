import React from 'react';
import PropTypes from 'prop-types';
import { CATEGORY_LIST } from '../../messages/search';

const EventTagsModal = ({ toggleTagsModal, gameTags, setGameTags }) => {
  const sortedCategories = CATEGORY_LIST.slice().sort();

  const handleCheckboxChange = (category) => {
    setGameTags((prevTags) => {
      if (prevTags.includes(category)) {
        return prevTags.filter((tag) => tag !== category);
      } else {
        return [...prevTags, category];
      }
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content bg-dark">
        <h2>Categories:</h2>
        <div className="d-flex flex-wrap">
          {sortedCategories.map((category) => (
            <div
              key={category}
              className="col-3 d-flex align-items-center form-check col-auto"
            >
              <input
                type="checkbox"
                id={category}
                name="category"
                value={category}
                checked={gameTags.includes(category)}
                onChange={() => handleCheckboxChange(category)}
                className="form-check-input me-1"
              />
              <label
                htmlFor={category}
                className="form-check-label text-truncate"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={toggleTagsModal}>
          Close
        </button>
      </div>
    </div>
  );
};

EventTagsModal.propTypes = {
  toggleTagsModal: PropTypes.func.isRequired,
  gameTags: PropTypes.array.isRequired,
  setGameTags: PropTypes.func.isRequired,
};

export default EventTagsModal;
