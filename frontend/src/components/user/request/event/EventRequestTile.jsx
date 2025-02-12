import React from 'react';
import PropTypes from 'prop-types';
import './EventRequestTile.css';
import { Link } from 'react-router-dom';
import InviteConstants from '../../../../constValues/InviteConstants';

const EventRequestTile = ({ invite, handleInviteAction }) => {
  const getInviteText = () => {
    switch (invite.type) {
      case InviteConstants.INVITE_TYPE_EVENT:
        return 'You have been invited to an event';
      case InviteConstants.INVITE_TYPE_EVENT_JOIN_REQUEST:
        return 'Event join request';
      default:
        return '';
    }
  };

  const onClickUserImage = () => {
    document.getElementById('closeNotifications').click();
  };

  const onClickEventImage = () => {
    document.getElementById('closeNotifications').click();
  };

  return (
    <div className="col align-items-center">
      <h4>{getInviteText()}</h4>
      <div className="mt-3 d-flex justify-content-center align-items-center">
        <Link to={`/events/${invite.event.id}`} className="mx-2">
          <img
            className="event-image"
            src={invite.event.image_url}
            alt={`${invite.event.title} front game`}
            onClick={onClickEventImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/static/default-profile.png';
            }}
          />
        </Link>
        <div>
          <div className="mb-3">
            {invite.friend.first_name} {invite.friend.last_name}
          </div>
          <Link to={`/user/${invite.friend.id}`} className="mx-2">
            <img
              className="friend-image"
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
      </div>
      <div className="d-flex mt-3">
        <button
          className="btn notification-secondary-button w-50 mx-2"
          onClick={() => handleInviteAction('rejected')}
        >
          Reject
        </button>
        <button
          className="btn notification-primary-button w-50 mx-2"
          onClick={() => handleInviteAction('accepted')}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

EventRequestTile.propTypes = {
  invite: PropTypes.object.isRequired,
  handleInviteAction: PropTypes.func.isRequired,
}.isRequired;

export default EventRequestTile;
