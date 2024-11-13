import React from 'react';
import PropTypes from 'prop-types';
import './DeleteEventModal.css';

const DeleteEventModal = ({ toggleDeleteEventModal, handleDeleteEvent }) => {
  return (
    <div className="modal-backdrop">
      <div className="delete-event-modal-content bg-dark">
        <h2>Are you sure you want to delete this event?</h2>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-primary m-2"
            onClick={toggleDeleteEventModal}
          >
            Go back
          </button>
          <button className="btn btn-danger m-2" onClick={handleDeleteEvent}>
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
  event_id: PropTypes.object.isRequired,
};

export default DeleteEventModal;
