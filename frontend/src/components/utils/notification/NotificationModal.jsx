import React from 'react';
import PropTypes from 'prop-types';
import './NotificationModal.css';
import InviteItem from '../../user/invite/InviteItem';

const NotificationModal = ({ apiPrefix, user, invites, fetchInvites }) => {
  return (
    <div
      className="modal fade"
      id="notifications"
      tabIndex="-1"
      aria-labelledby="notificationsLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content notifications text-center backplate-invite">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="notificationsLabel">
              Notifications
            </h1>
            <button
              id="closeNotifications"
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body d-flex flex-column">
            {invites.length === 0
              ? 'You have no notifications'
              : invites.map((invite) => (
                  <div key={invite.id}>
                    <InviteItem
                      apiPrefix={apiPrefix}
                      user={user}
                      invite={invite}
                      fetchInvites={fetchInvites}
                    />
                    <hr></hr>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

NotificationModal.propTypes = {
  invites: PropTypes.array.isRequired,
}.isRequired;

export default NotificationModal;
