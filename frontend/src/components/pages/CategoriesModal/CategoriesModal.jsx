import React from 'react';
import PropTypes from 'prop-types';
import { CATEGORY_LIST } from '../../../constValues/SearchConstants';
import './CategoriesModal.css';

const CategoriesModal = ({
  toggleCategoriesModal,
  handleInputChange,
  filters,
}) => {
  const sortedCategories = CATEGORY_LIST.slice().sort();

  return (
    <div className="modal-backdrop">
      <div className="tags-modal-content overflow-y-auto">
        <h2>Categories:</h2>
        <div className="d-flex flex-wrap">
          {sortedCategories.map((category) => (
            <div
              key={category}
              className="col-6 col-lg-3 d-flex align-items-center form-check col-auto"
            >
              <input
                type="checkbox"
                id={category}
                name="category"
                value={category}
                className="form-check-input me-1"
                checked={filters.category.includes(category)}
                onChange={handleInputChange}
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
        <button className="btn btn-secondary" onClick={toggleCategoriesModal}>
          Close
        </button>
      </div>
    </div>
  );
};

CategoriesModal.propTypes = {
  toggleCategoriesModal: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

export default CategoriesModal;
