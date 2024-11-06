import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './InviteItem.css';

const InviteItem = ({ apiPrefix, user, invite, fetchInvites }) => {
  console.log(invite);

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

  const onClickUserImage = () => {
    document.getElementById('closeNotifications').click();
  };

  const onClickEventImage = () => {
    document.getElementById('closeNotifications').click();
  };

  return (
    <div className="d-flex flex-row">
      <div className="flex-fill">
        <h4>{getInviteText()}</h4>
        <div className="event-image">
          <Link to={`/events/${invite.event.id}`}>
            <img
              src={invite.event.image_url}
              alt={`${invite.event.title} front game`}
              onClick={onClickEventImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/static/default-profile.png';
              }}
            />
          </Link>
        </div>
      </div>
      <div className="align-self-center">
        <div className="friend-tile">
          <Link to={`/user/${invite.friend.id}`}>
            <img
              src={invite.friend.profile_image_url}
              alt={`${invite.friend.first_name}'s avatar`}
              onClick={onClickUserImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/static/default-profile.png';
              }}
            />
          </Link>
        </div>
        <button
          className="btn btn-secondary my-1"
          onClick={() => handleInviteAction('rejected')}
        >
          Reject
        </button>
        <button
          className="btn btn-primary my-1"
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
