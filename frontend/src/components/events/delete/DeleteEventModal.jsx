import React from 'react';
import PropTypes from 'prop-types';
import './DeleteEventModal.css';

const DeleteEventModal = ({ toggleDeleteEventModal, handleDeleteEvent }) => {
  return (
    <div className="modal-backdrop">
      <div className="delete-event-modal-content rounded-3">
        <h2 className="mb-4">Are you sure you want to delete this event?</h2>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-secondary m-2 fw-bold"
            onClick={toggleDeleteEventModal}
          >
            Go back
          </button>
          <button
            className="btn event-page-create-button m-2 fw-bold"
            onClick={handleDeleteEvent}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteEventModal.propTypes = {
  toggleDeleteEventModal: PropTypes.func.isRequired,
  handleDeleteEvent: PropTypes.func.isRequired,
};

export default DeleteEventModal;
