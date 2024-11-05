import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './InviteItem.css';

const InviteItem = ({ apiPrefix, user, invite, fetchInvites }) => {
  const getInviteText = () => {
    switch (invite.type) {
      case 'event':
        return 'You have been invited to an event';
      case 'event_join_request':
        return 'Event join request';
      default:
        return '';
    }
  };

  const handleInviteAction = (choice) => {
    axios
      .post(
        apiPrefix + 'invite/invite-accept-reject/',
        {
          user_id: user.user_id,
          invite_id: invite.id,
          choice: choice,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      .then(() => {
        fetchInvites();
      });
  };

  return (
    <div className="d-flex flex-row">
      <div className="flex-fill">
        <h4>{getInviteText()}</h4>
        <div className="friend-tile">
          <Link to={`/user/${invite.friend.id}`}>
            <img
              src={invite.friend.profile_image_url}
              alt={`${invite.friend.first_name}'s avatar`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/static/default-profile.png';
              }}
            />
          </Link>
        </div>
        <p>
          {invite.friend.first_name} {invite.friend.last_name}
        </p>
        <p>{invite.event.title}</p>
      </div>
      <div className="align-self-center">
        <button
          className="btn btn-secondary mx-1"
          onClick={() => handleInviteAction('rejected')}
        >
          Reject
        </button>
        <button
          className="btn btn-primary mx-1"
          onClick={() => handleInviteAction('accepted')}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

InviteItem.propTypes = {
  invite: PropTypes.object.isRequired,
}.isRequired;

export default InviteItem;
