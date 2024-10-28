import PropTypes from 'prop-types';
import './NotificationModal.css';
import InviteItem from '../user/InviteItem';

const NotificationModal = ({ invites }) => {
  return (
    <div
      className="modal fade"
      id="notifications"
      tabIndex="-1"
      aria-labelledby="notificationsLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content backplate-invite">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="notificationsLabel">
              Invites
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body d-flex flex-column">
            {!invites
              ? 'You have no invites'
              : invites.map((invite) => (
                  <div key={invite.id}>
                    <InviteItem invite={invite} />
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
